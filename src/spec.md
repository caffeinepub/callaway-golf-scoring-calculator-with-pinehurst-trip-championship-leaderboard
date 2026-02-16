# Specification

## Summary
**Goal:** Persist Callaway Chart Editor “Save Changes” as the new localStorage defaults for 9-hole and 18-hole grid charts, so reloads and “Reset to Defaults” use the latest saved values.

**Planned changes:**
- Add separate localStorage keys for user-default grid charts (9 and 18 holes), distinct from the existing active/edited chart storage.
- Update “Save Changes” in the Callaway Chart Editor to write the saved chart to the user-default localStorage key (for the relevant hole count).
- Update chart-loading logic so `getActiveGridChart(9|18)` resolves in order: active/edited chart → user-default chart → hard-coded defaults.
- On first run (no user-defaults in localStorage), initialize user-default keys from the current hard-coded defaults.
- Preserve existing validation behavior: if stored chart JSON is invalid, ignore it and clear it.

**User-visible outcome:** After saving a 9-hole or 18-hole chart, reloading the page shows the saved chart automatically, and “Reset to Defaults” resets to the latest saved defaults stored in localStorage (not the original hard-coded defaults).
