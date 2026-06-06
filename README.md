<div align="center">
  <img src="assets/icon_manzil.png" width="120" alt="Stride logo" />

  # Stride

  **A local-first goal & habit tracker for Android, built to give you long-term visibility over the goals that matter.**

  Package: `com.stride.stride` · Built with Expo + React Native · Offline-first (no account, no cloud)
</div>

---

## What is Stride?

Stride is a personal goal-planning app designed around the idea that *most goals fail because they're poorly defined, not because of a lack of discipline*. It turns vague intentions into structured, measurable plans you can actually track over weeks, months, and years.

Everything lives on your device. There's no login, no server, and no telemetry — your data is stored locally in SQLite and is yours to export and back up whenever you like.

## Features

- **Hierarchical goals** — Outcome and Target goals with unlimited nesting (parent goals → sub-goals → sub-sub-goals), shown as a depth-limited tree.
- **KPIs with bidirectional progress** — Track a metric from a start value to a target, whether the target is higher *or* lower (e.g. lose weight 85 kg → 75 kg, or grow followers 380 → 5,000). Includes milestones and target-change history.
- **Habit tracking** — Interval-based frequency ("every X hours / days / weeks"), streaks, and habit-to-goal linking with importance levels (critical / important / supporting).
- **Measured habits** — Log partial progress (e.g. 1.5 of 2 hrs); fractional progress counts toward daily completion and streaks.
- **Analytics** — Value-over-time KPI charts and stats for both goals and habits.
- **Calendar views** — Day, Week, Month, and Year, each with active-goal columns and tag filters so you can see what's in play over any horizon.
- **Goals tab** — Search, tag filters, the full goal tree, and a complete habit list in one place.
- **Local notifications** — Reminders auto-scheduled when you create/edit/delete habits & goals and on app start, plus a test-notification button.
- **Backup & restore** — Export/import your entire dataset as JSON.
- **SMART goal guide** — A built-in walkthrough for setting Specific, Measurable, Achievable, Relevant, Time-bound goals.
- **Dark / light theming.**

## Installation (for users)

Stride is distributed as a sideloadable APK (no Play Store). Pre-built APKs live in [`releases/`](releases/).

1. On your Android phone, enable **Developer Options** and **USB Debugging**
   (Settings → About Phone → tap *Build Number* 7 times, then Settings → Developer Options → USB Debugging).
2. Connect the phone via USB and confirm it's detected:

   ```bash
   adb devices
   ```

3. Install the latest APK:

   ```bash
   adb install releases/v1.0.0/Stride-v1.0.0.apk
   ```

   Upgrading and hit a signature/downgrade error? Uninstall first (this wipes app data — export a backup beforehand):

   ```bash
   adb uninstall com.stride.stride
   adb install releases/v1.0.0/Stride-v1.0.0.apk
   ```

4. Open **Stride** from your app drawer.

> Requires **Android 7.0 (API 24)** or newer. Your data lives in SQLite at
> `/data/data/com.stride.stride/databases/` — use **Settings → Export Backup** before reinstalling.

## How to use

1. **Create a goal** from the Goals tab (`+` → Goal). Add at least one KPI with a start and target value, and a few milestones.
2. **Link habits** to the goal (`+` → Habit) and set a frequency and importance.
3. **Log daily** from the Day tab — tick binary habits or enter a value for measured ones.
4. **Track progress** in the calendar views and via KPI analytics.
5. New to goal-setting? Open the **Guide** (button next to Settings) for the SMART framework.

---

## Developer guide

Stride is an **Expo bare/prebuild** project (React Native `0.85`, Expo SDK `56`). The native `android/` and `ios/` folders are **gitignored and regenerated** from `app.config.ts` via `expo prebuild` — never edit them by hand; change config or a plugin instead.

### Prerequisites

- Node 20+
- JDK 17
- Android SDK + `adb` (Android Studio recommended)
- A physical Android device with USB debugging (the workflow targets devices, not emulators)

### Getting started

```bash
npm install            # also runs patch-package (postinstall)
adb devices            # confirm your device is connected
npm run android        # prebuild + native build + install dev client on device
```

After the dev client is installed, day-to-day JS work just needs Metro:

```bash
npm run start          # expo start --dev-client
```

Rebuild with `npm run android` only after changing native dependencies, config plugins, permissions, or the Expo SDK.

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run start` | Start Metro for the dev client (JS/hot-reload work) |
| `npm run android` | Prebuild + build + install on a connected device |
| `npm run prebuild:android` | Regenerate the native `android/` project |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run release` | Manual release pipeline (see below) |

### Project structure

```
src/
├── app/            # navigation + app shell
├── database/       # WatermelonDB schema & models
├── features/       # analytics, calendar, goals, guide, habits, settings
└── shared/         # components, hooks, types, utils (design system, store)
plugins/            # Expo config plugins (Notifee maven, release signing)
scripts/release.sh  # manual release pipeline
releases/           # versioned APKs + release notes
```

### Tech stack

- **Expo SDK 56** / **React Native 0.85** (new architecture, Hermes)
- **WatermelonDB + SQLite** for offline-first persistence
- **Zustand** for app state
- **React Navigation v7** (native stack + bottom tabs)
- **Notifee** for local notifications
- **react-native-reanimated / worklets**, **victory-native** for charts
- **TypeScript**, **patch-package** (patches a read-only-property bug in RN's `Event.js`)

### Config plugins

Because native folders are regenerated, native fixes are encoded as Expo config plugins in `plugins/` and registered in `app.config.ts`:

- `withNotifeeMaven.js` — adds the Notifee local Maven repo to the project Gradle.
- `withReleaseSigning.js` — adds a `release` signing config that uses a real keystore when `MYAPP_RELEASE_*` Gradle props are set, otherwise falls back to the debug keystore.

### Versioning

`version` in `package.json` is the **single source of truth**. `app.config.ts` derives both the user-facing version name and the Android `versionCode`:

```
versionCode = major * 10000 + minor * 100 + patch   # 1.0.0 → 10000
```

Bump only `package.json` (the release script does this for you).

### Releasing

**Manual pipeline** — builds the APK and stores it under `releases/vX.Y.Z/`:

```bash
npm run release                 # release current package.json version
npm run release -- --bump patch # 1.0.0 -> 1.0.1, then build
npm run release -- --bump minor # new feature
npm run release -- --version 1.2.3
```

Then commit, tag, and push:

```bash
git add releases/ CHANGELOG.md package.json
git commit -m "Release v1.0.1"
git tag -a v1.0.1 -m "Stride v1.0.1"
git push origin HEAD --tags
```

**CI pipeline** — pushing a `v*` tag triggers `.github/workflows/release.yml`, which builds the APK on GitHub runners, uploads it as an artifact, and attaches it to a GitHub Release. Optional release-keystore signing is supported via the repo secrets `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD`.

See [`releases/README.md`](releases/README.md) for full details and [`CHANGELOG.md`](CHANGELOG.md) for history.

### Notes

- Release APKs are **universal** (arm64-v8a, armeabi-v7a, x86, x86_64), hence ~100 MB. For smaller device-specific builds, enable ABI splits or set `reactNativeArchitectures=arm64-v8a`.
- v1.0.0 is signed with the debug keystore (fine for personal sideloading). Switch to a dedicated release keystore before wider distribution — and never change the keystore or `com.stride.stride` package name afterward, or users can't upgrade in place.
