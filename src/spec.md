# Specification

## Summary
**Goal:** Enable editing of individual hole scores with automatic recalculation of totals and leaderboard standings.

**Planned changes:**
- Make all hole score input fields remain editable after initial entry in the GolferScoreEntryList component
- Implement real-time recalculation of front nine, back nine, and gross totals when any hole score is modified
- Ensure LeaderboardView automatically recalculates Callaway results when returning from score entry with updated scores

**User-visible outcome:** Users can edit any individual hole score at any time during score entry, with front nine, back nine, and gross totals updating immediately. The leaderboard automatically reflects all changes without requiring score re-entry from scratch.
