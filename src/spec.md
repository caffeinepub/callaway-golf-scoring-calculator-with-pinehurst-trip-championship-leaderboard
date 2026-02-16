# Specification

## Summary
**Goal:** Promote the edited draft Callaway Chart Editor values into the code-based shipped default 9-hole and 18-hole grid charts, and update documentation accordingly.

**Planned changes:**
- Update `getDefault18GridChart()` and `getDefault9GridChart()` in `frontend/src/lib/callaway/callawayChartPersistence.ts` so their `grid` and `columnAdjustments` exactly match the draft Callaway Chart Editor’s edited values.
- Update `frontend/docs/callaway-chart-defaults.md` to reflect the new shipped defaults and note that existing localStorage user-default keys can mask code-default changes until cleared.

**User-visible outcome:** On a fresh profile (or after clearing the relevant localStorage keys / using “Reset to Defaults”), the app initializes and uses the updated default Callaway grid chart values for both 9-hole and 18-hole charts.
