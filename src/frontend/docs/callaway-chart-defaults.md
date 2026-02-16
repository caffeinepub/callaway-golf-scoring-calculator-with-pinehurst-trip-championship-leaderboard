# Callaway Chart Defaults - Developer Guide

This document explains how to modify the default Callaway scoring chart values in code and how the app's persistence layer affects what users see.

## Where Chart Defaults Are Defined

### 1. Grid Chart Defaults (Primary Source)
**File:** `frontend/src/lib/callaway/callawayChartPersistence.ts`

**Functions:**
- `getDefault18GridChart()` - Returns the default 13x5 grid for 18-hole rounds
- `getDefault9GridChart()` - Returns the default 13x5 grid for 9-hole rounds

These functions define the shipped defaults in a grid format (13 rows × 5 columns) where:
- Each cell contains a `grossScore` and `worstHoles` value
- Each column has an associated `adjustment` value in the `columnAdjustments` array

**Example structure:**
