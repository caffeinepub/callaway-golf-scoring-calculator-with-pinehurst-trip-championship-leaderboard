# Specification

## Summary
**Goal:** Restore functional navigation to Settings and Admin screens and correct the app’s default Callaway chart values for accurate display and scoring.

**Planned changes:**
- Fix TanStack Router navigation so the header “Settings” button routes to `/settings` and the Settings “Back” button returns to `/` without a full page refresh.
- Fix TanStack Router navigation so the header “Admin” button (when enabled) routes to `/admin`, with working “Back” (to `/`) and “Open Settings” (to `/settings`) behaviors, including the access-disabled `/admin` state linking to Settings.
- Update shipped/default Callaway chart values for both 9-hole and 18-hole rounds to match the documented/legacy defaults, and ensure net score calculations use the same corrected values.
- Ensure previously persisted invalid/old shipped defaults in localStorage do not keep forcing incorrect chart values after the fix, while preserving intentional custom edits made via the Admin chart editor.

**User-visible outcome:** Users can reliably navigate between the main scoring flow, Settings, and Admin (when enabled), and the displayed Callaway chart and net score calculations match the correct default values for 9-hole and 18-hole rounds.
