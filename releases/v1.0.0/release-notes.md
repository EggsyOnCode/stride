# Stride v1.0.0

**Release Date:** June 6, 2026
**Package:** `com.stride.stride`
**Min Android:** 7.0 (API 24)

## What's New

- Initial release of Stride.
- Hierarchical goals (Outcome & Target) with unlimited sub-goals.
- KPI tracking with bidirectional progress, milestones, and target-change history.
- Habit tracking: interval frequency ("every X hours/days/weeks"), streaks,
  goal linking with importance, and measured habits with fractional progress.
- KPI analytics for goals and habits (value-over-time charts + stats).
- Day / Week / Month / Year calendar views with active-goal columns and tag filters.
- Goals tab: search, tag filters, depth-limited goal tree, and full habit list.
- In-app SMART goal-setting guide.
- Local notifications with automatic scheduling + test-notification button.
- Local JSON backup & restore.
- Cascading deletes and dark/light theming.

## Installation

1. Enable **USB Debugging** on your Android phone.
2. Connect the phone via USB.
3. Run:

   ```bash
   adb install releases/v1.0.0/Stride-v1.0.0.apk
   ```

4. Open **Stride** from your app drawer.

## Known Issues

- None.

## Notes

- This build is signed with the Android debug keystore (suitable for personal
  sideloading). To distribute more widely, switch to a dedicated release keystore
  (see `.github/workflows/release.yml` and `releases/README.md`).
