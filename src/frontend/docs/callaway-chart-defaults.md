# Callaway Chart Defaults - Developer Documentation

This document explains how to update the default Callaway scoring charts shipped with the application.

## Overview

The application ships with two default Callaway charts:
- **18-hole chart**: 13 rows × 5 columns grid with column adjustments
- **9-hole chart**: 13 rows × 5 columns grid with column adjustments

These defaults are defined in `frontend/src/lib/callaway/callawayChartPersistence.ts`.

## Chart Data Structure

Each chart is a `GridChartData` object with:
- `grid`: 13×5 array of cells, each containing:
  - `grossScore`: The gross score value (0 for placeholder cells)
  - `worstHoles`: Number of worst holes to deduct (supports 0.5 increments)
- `columnAdjustments`: Array of 5 adjustment values applied to each column (currently: `[2, 1, 0, -1, -2]`)

### Placeholder Cells

Cells with `grossScore=0` and `worstHoles=0` are treated as placeholders:
- They render as empty in the UI
- They are ignored in scoring calculations
- They are preserved when saving/loading charts

## Current Column Adjustments

The shipped defaults use the following column adjustment order (left to right):
