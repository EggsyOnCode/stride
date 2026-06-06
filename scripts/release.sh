#!/usr/bin/env bash
#
# Stride — manual release pipeline.
#
# Builds a release APK and stores it under releases/vX.Y.Z/. The version in
# package.json is the single source of truth (app.config.ts derives both the
# version name and the Android versionCode from it).
#
# Usage:
#   scripts/release.sh                     # release the current package.json version
#   scripts/release.sh --bump patch        # 1.0.0 -> 1.0.1, then release
#   scripts/release.sh --bump minor        # 1.0.0 -> 1.1.0, then release
#   scripts/release.sh --bump major        # 1.0.0 -> 2.0.0, then release
#   scripts/release.sh --version 1.2.3     # set explicit version, then release
#   scripts/release.sh --no-build          # only bump + scaffold notes (skip APK build)
#
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"

BUMP=""
EXPLICIT_VERSION=""
DO_BUILD=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bump) BUMP="${2:?--bump needs patch|minor|major}"; shift 2 ;;
    --version) EXPLICIT_VERSION="${2:?--version needs X.Y.Z}"; shift 2 ;;
    --no-build) DO_BUILD=0; shift ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

# --- Resolve / write the version -------------------------------------------
if [[ -n "$EXPLICIT_VERSION" ]]; then
  node -e "const fs=require('fs');const p=require('./package.json');p.version='${EXPLICIT_VERSION}';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n')"
elif [[ -n "$BUMP" ]]; then
  npm version "$BUMP" --no-git-tag-version >/dev/null
fi

VERSION="$(node -p "require('./package.json').version")"
TAG="v${VERSION}"
OUT_DIR="releases/${TAG}"
APK_DEST="${OUT_DIR}/Stride-${TAG}.apk"

echo "==> Stride release ${TAG}"
mkdir -p "$OUT_DIR"

# --- Scaffold release notes -------------------------------------------------
if [[ ! -f "${OUT_DIR}/release-notes.md" ]]; then
  cat > "${OUT_DIR}/release-notes.md" <<EOF
# Stride ${TAG}

**Release Date:** $(date +%Y-%m-%d)
**Package:** \`com.stride.stride\`
**Min Android:** 7.0 (API 24)

## What's New

- _Describe the changes in this release._

## Installation

\`\`\`bash
adb install ${APK_DEST}
\`\`\`

## Known Issues

- None.
EOF
  echo "==> Wrote ${OUT_DIR}/release-notes.md (edit before publishing)"
fi

if [[ "$DO_BUILD" -eq 0 ]]; then
  echo "==> --no-build set; skipping APK build."
  echo "==> Done. Remember to update CHANGELOG.md, commit, tag ${TAG}, and push."
  exit 0
fi

# --- Build ------------------------------------------------------------------
# android/ is gitignored and regenerated from app.config.ts.
echo "==> Generating native project (expo prebuild)..."
npx expo prebuild --platform android --clean

echo "==> Building release APK (gradle assembleRelease)..."
( cd android && ./gradlew assembleRelease )

APK_SRC="android/app/build/outputs/apk/release/app-release.apk"
if [[ ! -f "$APK_SRC" ]]; then
  echo "ERROR: expected APK not found at $APK_SRC" >&2
  exit 1
fi

cp "$APK_SRC" "$APK_DEST"
SIZE="$(du -h "$APK_DEST" | cut -f1)"
echo "==> APK copied to ${APK_DEST} (${SIZE})"

echo ""
echo "==> Release ${TAG} ready. Next steps:"
echo "    1. Edit ${OUT_DIR}/release-notes.md and update CHANGELOG.md"
echo "    2. git add releases/ CHANGELOG.md package.json"
echo "    3. git commit -m \"Release ${TAG}\""
echo "    4. git tag -a ${TAG} -m \"Stride ${TAG}\" && git push origin HEAD --tags"
