# Editing Callaway Chart Default Values in Code

This document explains how to modify the default Callaway scoring chart values directly in the codebase and how to verify those changes appear in the running application.

## Overview

The Callaway scoring system uses a chart that maps gross scores to "worst holes" deductions and adjustments. The app stores these charts in two formats:

1. **Code-based defaults** - Hard-coded values that ship with the application
2. **localStorage-persisted edits** - User modifications made through the Admin Panel

**Important:** The app always uses the localStorage-persisted chart when present. Code changes to defaults will NOT appear until the persisted chart is cleared.

## Where to Edit Code-Based Defaults

### 18-Hole and 9-Hole Grid Charts

The primary default charts are defined as grid data structures (13 rows × 5 columns):

**File:** `frontend/src/lib/callaway/callawayChartPersistence.ts`

- **18-hole defaults:** `getDefault18GridChart()` function (lines 16-35)
- **9-hole defaults:** `getDefault9GridChart()` function (lines 40-59)

Each grid cell contains:
- `grossScore`: The gross score value
- `worstHoles`: Number of worst holes to deduct (supports 0.5 increments)

Each grid also has `columnAdjustments`: An array of 5 adjustment values (one per column) applied to net scores.

**Example structure:**
