# Specification

## Summary
**Goal:** Reverse the Callaway chart “Adjustment” header row so it is ordered 2, 1, 0, -1, -2 for both 18-hole and 9-hole charts, including defaults and any normalization/migration behavior.

**Planned changes:**
- Update shipped default Callaway chart configuration so the Adjustment header row (columnAdjustments) is exactly 2, 1, 0, -1, -2 (left-to-right) for both 18-hole and 9-hole grids.
- Adjust any existing normalization/migration logic so previously saved charts with columnAdjustments ordered -2, -1, 0, 1, 2 are normalized to 2, 1, 0, -1, -2.
- Ensure Callaway scoring calculations use the updated columnAdjustments ordering without changing any grossScore/worstHoles grid cell values.

**User-visible outcome:** In the Admin Callaway Chart Editor, the Adjustment row displays 2, 1, 0, -1, -2 for default charts, and older saved charts are auto-corrected to this order with scoring reflecting the updated adjustment values.
