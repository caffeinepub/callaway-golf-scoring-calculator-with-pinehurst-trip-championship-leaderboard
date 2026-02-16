# Specification

## Summary
**Goal:** Update the backend Callaway scoring chart to exactly match the provided 13×11 dataset so production scoring and exposed chart data are consistent and accurate.

**Planned changes:**
- Replace the hard-coded chart data returned by `getBackendChart()` in `backend/main.mo` with the provided 13-row dataset values (including 0.5 increments and placeholder cells with grossScore=0 / worstHoles=0).
- Update `getCallawayChart()` and its lookup/range semantics so the exposed chart entries align with the provided dataset (avoiding inaccurate fabricated ranges such as `lowerBound + 4` when they don’t match the chart).
- Align (or remove/adjust) `getGrossToDeductionTable()` so it cannot return stale or conflicting ranges/values versus the chart used by `calculateCallaway(...)`.

**User-visible outcome:** Callaway scoring results and any chart data returned by backend endpoints match the exact provided dataset (including half-hole deductions), with no inconsistencies between chart exposure and scoring.
