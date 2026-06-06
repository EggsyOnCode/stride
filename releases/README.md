# Stride — Releases

This folder is the complete, versioned release history for **Stride**. Each release
lives in its own `vX.Y.Z/` folder containing the installable APK and its release notes.

```
releases/
├── v1.0.0/
│   ├── Stride-v1.0.0.apk
│   └── release-notes.md
└── ...
```

- **Package name:** `com.stride.stride` (never change this — Android upgrades break otherwise)
- **Versioning:** [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`
- The user-facing `version` and the Android `versionCode` are both derived from
  `version` in `package.json` (see `app.config.ts`), so you only bump one place.
  `versionCode = major*10000 + minor*100 + patch`.

## Cutting a release (manual pipeline)

From the repo root:

```bash
# Build, package into releases/<version>/, and update CHANGELOG reminders.
npm run release            # uses the current package.json version
# or bump + release in one go:
npm run release -- --bump patch    # 1.0.0 -> 1.0.1
npm run release -- --bump minor    # 1.0.0 -> 1.1.0
npm run release -- --bump major    # 1.0.0 -> 2.0.0
npm run release -- --version 1.2.3 # set an explicit version
```

The script (`scripts/release.sh`):

1. Optionally bumps the version in `package.json`.
2. Runs `expo prebuild` (the `android/` folder is gitignored and regenerated).
3. Builds the release APK with Gradle (`assembleRelease`).
4. Copies it to `releases/vX.Y.Z/Stride-vX.Y.Z.apk`.
5. Generates a `release-notes.md` template if one doesn't exist.

Then commit, tag, and (optionally) push:

```bash
git add releases/ CHANGELOG.md package.json
git commit -m "Release v1.2.3"
git tag -a v1.2.3 -m "Stride v1.2.3"
git push origin main --tags   # triggers the GitHub Actions release build
```

## Cutting a release (CI pipeline)

Pushing a `v*` tag triggers `.github/workflows/release.yml`, which builds the APK
on GitHub's runners and attaches it to a GitHub Release automatically. See that
workflow file for optional release-keystore signing via repository secrets.

## Installing an APK

```bash
adb install releases/v1.0.0/Stride-v1.0.0.apk
# Upgrading and hit a signature/downgrade error? Uninstall first:
adb uninstall com.stride.stride
adb install releases/v1.0.0/Stride-v1.0.0.apk
```

> Your data lives in SQLite at `/data/data/com.stride.stride/databases/`. Use the
> in-app **Settings → Export Backup** before reinstalling to be safe.
