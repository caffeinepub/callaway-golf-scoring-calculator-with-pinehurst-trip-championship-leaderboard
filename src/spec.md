# Specification

## Summary
**Goal:** Improve event setup and score entry UX by adding per-golfer gross totals, allowing manual golfer count entry (1–64), and supporting blank tournament titles without awkward rendering.

**Planned changes:**
- In score entry, compute and display a per-golfer gross total once all hole scores for that golfer are filled with valid numbers; update the total immediately on score changes and avoid showing an incorrect total when scores are missing.
- Replace the event setup “Number of Golfers” dropdown with a numeric input constrained to an integer from 1 to 64, blocking invalid or empty submissions and initializing the correct number of golfer score cards.
- Default Tournament Title to blank and preserve blank titles on submission (no auto-filled fallback), while keeping a reasonable fallback label in the app header when title is empty.
- When the title is blank, avoid rendering an empty title heading on the leaderboard and ensure PDF export does not output an empty/awkward title line.

**User-visible outcome:** Users can manually enter 1–64 golfers, see a live gross total per golfer once their hole scores are complete, and leave the tournament title blank without empty headings appearing on the leaderboard or PDF export.
