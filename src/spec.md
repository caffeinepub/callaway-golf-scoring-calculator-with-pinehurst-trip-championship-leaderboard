# Specification

## Summary
**Goal:** Fix the 18-hole Callaway chart defaults, persistence/migration behavior, UI placeholder display, and backend deduction mapping so the app matches the provided 13×11 dataset and produces consistent net scores.

**Planned changes:**
- Update the shipped 18-hole Callaway chart default grid to exactly match the provided 13 rows × 5 (grossScore, holesToDeduct) pairs dataset, preserving the existing 13-row / 5-column model and supporting 0.5 deduction increments.
- Add a localStorage compatibility check: if stored active and/or user-default chart data exactly equals the previously shipped 18-hole defaults, clear those entries so the updated shipped defaults load; otherwise, preserve user-edited charts.
- Adjust chart table rendering so placeholder pairs (grossScore=0 and holesToDeduct=0) display as empty cells in all chart grid views/editors while still persisting underlying (0,0) values and keeping calculations unaffected by placeholders.
- Align backend Callaway chart logic with the updated 18-hole frontend mapping (including 0.5 deductions) so backend net score results match frontend results for the same inputs.

**User-visible outcome:** On fresh installs and for users still using the old shipped 18-hole defaults, the chart grid shows the corrected 13×11 values (with placeholders displayed as blank), and both frontend and backend compute matching net scores using the same gross-to-deduction rules.
