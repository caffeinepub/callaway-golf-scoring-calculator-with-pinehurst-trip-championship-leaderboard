# Specification

## Summary
**Goal:** Restructure the Admin Callaway chart editor to a fixed 13x5 gross-score grid with per-column adjustments, support 0.5 “worst holes” increments, and keep persistence compatible with previously saved charts.

**Planned changes:**
- Replace the current variable-length row-based gross-score chart table with a fixed 13 (rows) x 5 (columns) grid editor in the Admin Panel’s Callaway Chart Editor for both 18-hole and 9-hole tabs.
- Add one “Adjustment” input per gross-score column (5 total) that applies to all gross-score cells in that column, and save/load these per-column adjustments with the chart data (including reset-to-defaults behavior).
- Update chart inputs/validation and Callaway deduction calculation to allow and correctly compute “worst holes” values in 0.5 increments (including updating backend calculation logic to match, if backend results are used).
- Update persistence/loading to be backward compatible with legacy row-based chart data in localStorage by migrating it to the new format or safely falling back to defaults without crashing.

**User-visible outcome:** Admins can edit Callaway charts using a consistent 13x5 gross-score grid with per-column adjustments, enter worst-holes values in 0.5 steps, and existing saved charts won’t break the app after the format change.
