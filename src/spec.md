# Specification

## Summary
**Goal:** Update the shipped 18-hole Callaway grid defaults to the user-provided 13-row table, ensure localStorage behavior picks up the new shipped defaults appropriately, and align backend scoring logic with the updated chart behavior.

**Planned changes:**
- Replace `getDefault18GridChart()` defaults in `frontend/src/lib/callaway/callawayChartPersistence.ts` with the provided 13-row × 5-column (grossScore, worstHoles) pairs so fresh installs load the new grid.
- Update frontend localStorage migration/reset logic to clear previously cached *shipped-default* 18-hole data so the new shipped defaults load, while preserving user-edited (non-shipped-default) 18-hole charts.
- Align backend Callaway chart/scoring logic in `backend/main.mo` so calculations are consistent with the updated 18-hole chart behavior used by the frontend (including 0.5 worst-hole increments and any applicable adjustments).
- Ensure all user-facing UI strings touched by these changes (chart editing/validation/save/reset messaging) remain in English.

**User-visible outcome:** On a fresh install, the app shows the updated 18-hole Callaway grid by default; users with older cached shipped defaults are automatically moved to the new shipped defaults without losing any user-edited charts; scoring results match between frontend and backend for 18-hole submissions.
