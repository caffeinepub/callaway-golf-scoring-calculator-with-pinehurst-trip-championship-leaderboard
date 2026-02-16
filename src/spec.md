# Specification

## Summary
**Goal:** Add a hidden Admin area (enabled via Settings) that lets users edit the Callaway scoring charts and have the app use the persisted chart for calculations and display.

**Planned changes:**
- Add a Settings entry point in the main UI with a persisted toggle that enables/disables Admin access.
- Add an Admin screen that is only reachable/visible when the Settings toggle is enabled, with safe handling if Admin is disabled while viewing it.
- Implement a Callaway chart editor in Admin for both 9-hole and 18-hole charts, including row editing (bounds, worst holes deducted, adjustment), validation, and Save / Reset to Defaults actions.
- Update Callaway calculation logic and leaderboard chart display to use the persisted edited chart, falling back to built-in defaults if no valid saved chart exists.

**User-visible outcome:** Users can enable Admin access from Settings, open an Admin screen to edit and save the 9-hole and 18-hole Callaway charts, and see calculations and leaderboard chart display update to reflect the saved chart across reloads (with reliable fallback to defaults).
