# Specification

## Summary
**Goal:** Restore the locally editable Callaway scoring chart experience so admins can edit the chart in the UI and those edits are used for scoring and chart display.

**Planned changes:**
- Re-enable the Admin Callaway chart editor UI on `/admin` when Admin Access is enabled (18-hole/9-hole tabs, editable grid, Save Changes, Reset to Defaults).
- Ensure scoring calculations and leaderboard chart display use the localStorage-backed, locally editable Callaway chart so saved edits affect results.
- Remove any UI messaging that presents the chart as backend-locked/centrally managed or implies edits require contacting an administrator, while keeping Admin Access descriptions accurate and all `/admin` text in English.

**User-visible outcome:** When Admin Access is enabled, admins can edit and save the Callaway chart on `/admin`, and the leaderboard both calculates results and displays the Callaway chart using those saved edits without showing backend-managed/locked messaging.
