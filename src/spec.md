# Specification

## Summary
**Goal:** Revert and fix the Version 21 Callaway backend changes so deductions, chart lookups, and net score calculations match the previously correct behavior (including fractional 0.5-hole deductions).

**Planned changes:**
- Update `backend/main.mo` to compute Callaway deductions from the worst (highest) hole scores, including consistent handling of fractional (0.5) deduction holes using the same sorted ordering.
- Revert the hard-coded Callaway `chart` in `backend/main.mo` to the last known-correct production version, removing placeholder rows/ranges and ensuring `getCallawayChart()` matches the chart used for backend lookup.
- Add small deterministic backend-level verification logic/checks covering both integer and fractional deduction scenarios to confirm worst-hole selection and net calculation behavior.

**User-visible outcome:** Callaway scoring calculations (deduction, adjustment lookup, and net score) produce correct, consistent results again for both standard and fractional deduction cases.
