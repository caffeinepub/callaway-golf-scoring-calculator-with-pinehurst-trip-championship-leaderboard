/**
 * Persistence layer for edited Callaway charts using localStorage.
 * Provides safe load/save/reset operations with validation.
 * Supports both user-default charts (persisted defaults) and active/edited charts.
 */

import { type CallawayChartEntry, CALLAWAY_CHART_18, CALLAWAY_CHART_9, type GridChartData, type GridCell, findChartEntry as findChartEntryFromArray } from './callawayChart';

// Active/edited chart keys (current session edits)
const CHART_18_KEY = 'callaway-chart-18-edited';
const CHART_9_KEY = 'callaway-chart-9-edited';
const GRID_CHART_18_KEY = 'callaway-grid-chart-18';
const GRID_CHART_9_KEY = 'callaway-grid-chart-9';

// User-default chart keys (persisted defaults after save)
const USER_DEFAULT_GRID_CHART_18_KEY = 'callaway-grid-chart-18-user-default';
const USER_DEFAULT_GRID_CHART_9_KEY = 'callaway-grid-chart-9-user-default';

/**
 * Previous shipped 18-hole defaults (frozen for migration detection)
 * This represents the old default values that were shipped before the update
 */
const OLD_SHIPPED_18_GRID: GridChartData = {
  grid: [
    [{ grossScore: 70, worstHoles: 0 }, { grossScore: 71, worstHoles: 0 }, { grossScore: 73, worstHoles: 0.5 }, { grossScore: 76, worstHoles: 1 }, { grossScore: 81, worstHoles: 1.5 }],
    [{ grossScore: 72, worstHoles: 0 }, { grossScore: 74, worstHoles: 0.5 }, { grossScore: 77, worstHoles: 1 }, { grossScore: 82, worstHoles: 1.5 }, { grossScore: 86, worstHoles: 2 }],
    [{ grossScore: 75, worstHoles: 0.5 }, { grossScore: 78, worstHoles: 1 }, { grossScore: 83, worstHoles: 1.5 }, { grossScore: 87, worstHoles: 2 }, { grossScore: 91, worstHoles: 2.5 }],
    [{ grossScore: 79, worstHoles: 1 }, { grossScore: 84, worstHoles: 1.5 }, { grossScore: 88, worstHoles: 2 }, { grossScore: 92, worstHoles: 2.5 }, { grossScore: 96, worstHoles: 3 }],
    [{ grossScore: 80, worstHoles: 1 }, { grossScore: 85, worstHoles: 1.5 }, { grossScore: 89, worstHoles: 2 }, { grossScore: 93, worstHoles: 2.5 }, { grossScore: 97, worstHoles: 3 }],
    [{ grossScore: 90, worstHoles: 2 }, { grossScore: 94, worstHoles: 2.5 }, { grossScore: 98, worstHoles: 3 }, { grossScore: 101, worstHoles: 3.5 }, { grossScore: 106, worstHoles: 4 }],
    [{ grossScore: 95, worstHoles: 2.5 }, { grossScore: 99, worstHoles: 3 }, { grossScore: 102, worstHoles: 3.5 }, { grossScore: 107, worstHoles: 4 }, { grossScore: 111, worstHoles: 4.5 }],
    [{ grossScore: 100, worstHoles: 3 }, { grossScore: 103, worstHoles: 3.5 }, { grossScore: 108, worstHoles: 4 }, { grossScore: 112, worstHoles: 4.5 }, { grossScore: 116, worstHoles: 5 }],
    [{ grossScore: 104, worstHoles: 3.5 }, { grossScore: 109, worstHoles: 4 }, { grossScore: 113, worstHoles: 4.5 }, { grossScore: 117, worstHoles: 5 }, { grossScore: 121, worstHoles: 5.5 }],
    [{ grossScore: 105, worstHoles: 3.5 }, { grossScore: 110, worstHoles: 4 }, { grossScore: 114, worstHoles: 4.5 }, { grossScore: 118, worstHoles: 5 }, { grossScore: 122, worstHoles: 5.5 }],
    [{ grossScore: 115, worstHoles: 4.5 }, { grossScore: 119, worstHoles: 5 }, { grossScore: 123, worstHoles: 5.5 }, { grossScore: 126, worstHoles: 6 }, { grossScore: 131, worstHoles: 6.5 }],
    [{ grossScore: 120, worstHoles: 5 }, { grossScore: 124, worstHoles: 5.5 }, { grossScore: 127, worstHoles: 6 }, { grossScore: 132, worstHoles: 6.5 }, { grossScore: 136, worstHoles: 7 }],
    [{ grossScore: 125, worstHoles: 5.5 }, { grossScore: 128, worstHoles: 6 }, { grossScore: 133, worstHoles: 6.5 }, { grossScore: 137, worstHoles: 7 }, { grossScore: 141, worstHoles: 7.5 }],
  ],
  columnAdjustments: [-2, -1, 0, 1, 2],
};

/**
 * Default grid chart data for 18-hole (13 rows x 5 columns)
 * Updated defaults matching the provided 13-row table
 */
export function getDefault18GridChart(): GridChartData {
  return {
    grid: [
      [{ grossScore: 0, worstHoles: 0 }, { grossScore: 0, worstHoles: 0 }, { grossScore: 72, worstHoles: 0 }, { grossScore: 0, worstHoles: 0 }, { grossScore: 0, worstHoles: 0 }],
      [{ grossScore: 73, worstHoles: 0.5 }, { grossScore: 74, worstHoles: 0.5 }, { grossScore: 75, worstHoles: 0.5 }, { grossScore: 0, worstHoles: 0 }, { grossScore: 0, worstHoles: 0 }],
      [{ grossScore: 76, worstHoles: 1 }, { grossScore: 77, worstHoles: 1 }, { grossScore: 78, worstHoles: 1 }, { grossScore: 79, worstHoles: 1 }, { grossScore: 80, worstHoles: 1 }],
      [{ grossScore: 81, worstHoles: 1.5 }, { grossScore: 82, worstHoles: 1.5 }, { grossScore: 83, worstHoles: 1.5 }, { grossScore: 84, worstHoles: 1.5 }, { grossScore: 85, worstHoles: 1.5 }],
      [{ grossScore: 86, worstHoles: 2 }, { grossScore: 87, worstHoles: 2 }, { grossScore: 88, worstHoles: 2 }, { grossScore: 89, worstHoles: 2 }, { grossScore: 90, worstHoles: 2 }],
      [{ grossScore: 91, worstHoles: 3 }, { grossScore: 92, worstHoles: 2.5 }, { grossScore: 93, worstHoles: 2.5 }, { grossScore: 94, worstHoles: 2.5 }, { grossScore: 95, worstHoles: 2.5 }],
      [{ grossScore: 96, worstHoles: 3.5 }, { grossScore: 97, worstHoles: 3 }, { grossScore: 98, worstHoles: 3.5 }, { grossScore: 99, worstHoles: 3 }, { grossScore: 100, worstHoles: 3 }],
      [{ grossScore: 101, worstHoles: 4 }, { grossScore: 102, worstHoles: 3.5 }, { grossScore: 103, worstHoles: 3.5 }, { grossScore: 104, worstHoles: 3.5 }, { grossScore: 105, worstHoles: 3.5 }],
      [{ grossScore: 106, worstHoles: 4.5 }, { grossScore: 107, worstHoles: 4 }, { grossScore: 108, worstHoles: 4 }, { grossScore: 109, worstHoles: 4 }, { grossScore: 110, worstHoles: 4 }],
      [{ grossScore: 111, worstHoles: 5 }, { grossScore: 112, worstHoles: 4.5 }, { grossScore: 113, worstHoles: 4.5 }, { grossScore: 114, worstHoles: 4.5 }, { grossScore: 115, worstHoles: 4.5 }],
      [{ grossScore: 116, worstHoles: 5.5 }, { grossScore: 117, worstHoles: 5 }, { grossScore: 118, worstHoles: 5 }, { grossScore: 119, worstHoles: 5 }, { grossScore: 120, worstHoles: 5 }],
      [{ grossScore: 121, worstHoles: 6 }, { grossScore: 122, worstHoles: 5.5 }, { grossScore: 123, worstHoles: 5.5 }, { grossScore: 124, worstHoles: 5.5 }, { grossScore: 125, worstHoles: 5.5 }],
      [{ grossScore: 126, worstHoles: 5.5 }, { grossScore: 127, worstHoles: 6 }, { grossScore: 128, worstHoles: 6 }, { grossScore: 129, worstHoles: 6 }, { grossScore: 130, worstHoles: 6 }],
    ],
    columnAdjustments: [-2, -1, 0, 1, 2],
  };
}

/**
 * Default grid chart data for 9-hole (13 rows x 5 columns)
 * Corrected defaults matching official Callaway chart for 9 holes
 */
export function getDefault9GridChart(): GridChartData {
  return {
    grid: [
      [{ grossScore: 35, worstHoles: 0 }, { grossScore: 36, worstHoles: 0 }, { grossScore: 37, worstHoles: 0.5 }, { grossScore: 40, worstHoles: 1 }, { grossScore: 45, worstHoles: 1.5 }],
      [{ grossScore: 38, worstHoles: 0.5 }, { grossScore: 41, worstHoles: 1 }, { grossScore: 46, worstHoles: 1.5 }, { grossScore: 50, worstHoles: 2 }, { grossScore: 55, worstHoles: 2.5 }],
      [{ grossScore: 39, worstHoles: 0.5 }, { grossScore: 42, worstHoles: 1 }, { grossScore: 47, worstHoles: 1.5 }, { grossScore: 51, worstHoles: 2 }, { grossScore: 56, worstHoles: 2.5 }],
      [{ grossScore: 43, worstHoles: 1 }, { grossScore: 48, worstHoles: 1.5 }, { grossScore: 52, worstHoles: 2 }, { grossScore: 57, worstHoles: 2.5 }, { grossScore: 60, worstHoles: 3 }],
      [{ grossScore: 44, worstHoles: 1 }, { grossScore: 49, worstHoles: 1.5 }, { grossScore: 53, worstHoles: 2 }, { grossScore: 58, worstHoles: 2.5 }, { grossScore: 61, worstHoles: 3 }],
      [{ grossScore: 54, worstHoles: 2 }, { grossScore: 59, worstHoles: 2.5 }, { grossScore: 62, worstHoles: 3 }, { grossScore: 65, worstHoles: 3.5 }, { grossScore: 69, worstHoles: 4 }],
      [{ grossScore: 63, worstHoles: 3 }, { grossScore: 66, worstHoles: 3.5 }, { grossScore: 70, worstHoles: 4 }, { grossScore: 73, worstHoles: 4 }, { grossScore: 76, worstHoles: 4 }],
      [{ grossScore: 64, worstHoles: 3 }, { grossScore: 67, worstHoles: 3.5 }, { grossScore: 71, worstHoles: 4 }, { grossScore: 74, worstHoles: 4 }, { grossScore: 77, worstHoles: 4 }],
      [{ grossScore: 68, worstHoles: 3.5 }, { grossScore: 72, worstHoles: 4 }, { grossScore: 75, worstHoles: 4 }, { grossScore: 78, worstHoles: 4 }, { grossScore: 81, worstHoles: 4 }],
      [{ grossScore: 79, worstHoles: 4 }, { grossScore: 82, worstHoles: 4 }, { grossScore: 85, worstHoles: 4 }, { grossScore: 88, worstHoles: 4 }, { grossScore: 91, worstHoles: 4 }],
      [{ grossScore: 80, worstHoles: 4 }, { grossScore: 83, worstHoles: 4 }, { grossScore: 86, worstHoles: 4 }, { grossScore: 89, worstHoles: 4 }, { grossScore: 92, worstHoles: 4 }],
      [{ grossScore: 84, worstHoles: 4 }, { grossScore: 87, worstHoles: 4 }, { grossScore: 90, worstHoles: 4 }, { grossScore: 93, worstHoles: 4 }, { grossScore: 96, worstHoles: 4 }],
      [{ grossScore: 94, worstHoles: 4 }, { grossScore: 97, worstHoles: 4 }, { grossScore: 100, worstHoles: 4 }, { grossScore: 103, worstHoles: 4 }, { grossScore: 106, worstHoles: 4 }],
    ],
    columnAdjustments: [-2, -1, 0, 1, 2],
  };
}

/**
 * Validate grid chart data
 */
function validateGridChart(data: GridChartData): boolean {
  if (!data || !Array.isArray(data.grid) || !Array.isArray(data.columnAdjustments)) {
    return false;
  }

  if (data.grid.length !== 13) return false;
  if (data.columnAdjustments.length !== 5) return false;

  for (const row of data.grid) {
    if (!Array.isArray(row) || row.length !== 5) return false;
    for (const cell of row) {
      if (typeof cell.grossScore !== 'number' || typeof cell.worstHoles !== 'number') {
        return false;
      }
      if (cell.worstHoles < 0) return false;
      // Allow 0.5 increments
      if ((cell.worstHoles * 2) % 1 !== 0) return false;
    }
  }

  for (const adj of data.columnAdjustments) {
    if (typeof adj !== 'number') return false;
  }

  return true;
}

/**
 * Check if a persisted chart matches the old shipped defaults (for migration)
 */
function isOldShippedDefault18(data: GridChartData): boolean {
  return JSON.stringify(data) === JSON.stringify(OLD_SHIPPED_18_GRID);
}

/**
 * Migrate old shipped defaults: remove them from localStorage so corrected defaults are used
 */
function migrateOldShippedDefaults(holeCount: 9 | 18): void {
  // Only migrate 18-hole charts (9-hole defaults haven't changed)
  if (holeCount !== 18) return;

  const activeKey = GRID_CHART_18_KEY;
  const userDefaultKey = USER_DEFAULT_GRID_CHART_18_KEY;

  try {
    // Check active chart
    const activeData = localStorage.getItem(activeKey);
    if (activeData) {
      const parsed = JSON.parse(activeData);
      if (validateGridChart(parsed) && isOldShippedDefault18(parsed)) {
        // This is an old shipped default, remove it
        localStorage.removeItem(activeKey);
      }
    }

    // Check user-default chart
    const userDefaultData = localStorage.getItem(userDefaultKey);
    if (userDefaultData) {
      const parsed = JSON.parse(userDefaultData);
      if (validateGridChart(parsed) && isOldShippedDefault18(parsed)) {
        // This is an old shipped default, remove it
        localStorage.removeItem(userDefaultKey);
      }
    }
  } catch (e) {
    console.error('Error during migration:', e);
  }
}

/**
 * Format chart row label (e.g., "70-75", "136+")
 */
export function formatChartRowLabel(lowerBound: number, upperBound: number | null): string {
  if (upperBound === null) {
    return `${lowerBound}+`;
  }
  if (lowerBound === upperBound) {
    return `${lowerBound}`;
  }
  return `${lowerBound}-${upperBound}`;
}

/**
 * Convert grid chart to legacy chart entries for display/calculation
 */
export function gridToLegacyChart(gridData: GridChartData): CallawayChartEntry[] {
  const entries: CallawayChartEntry[] = [];
  const scoreMap = new Map<number, { worstHoles: number; adjustment: number }>();

  // Build a map of gross score -> (worstHoles, adjustment)
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 13; row++) {
      const cell = gridData.grid[row][col];
      const adjustment = gridData.columnAdjustments[col];
      // Skip zero gross scores (placeholders)
      if (cell.grossScore > 0) {
        scoreMap.set(cell.grossScore, { worstHoles: cell.worstHoles, adjustment });
      }
    }
  }

  // Sort by gross score
  const sortedScores = Array.from(scoreMap.keys()).sort((a, b) => a - b);

  // Group consecutive scores with same worstHoles and adjustment
  let currentEntry: CallawayChartEntry | null = null;

  for (const score of sortedScores) {
    const data = scoreMap.get(score)!;

    if (!currentEntry) {
      currentEntry = {
        grossRange: '',
        lowerBound: score,
        upperBound: score,
        worstHoles: data.worstHoles,
        adjustment: data.adjustment,
      };
    } else if (
      currentEntry.worstHoles === data.worstHoles &&
      currentEntry.adjustment === data.adjustment &&
      currentEntry.upperBound !== null &&
      score === currentEntry.upperBound + 1
    ) {
      // Extend current entry
      currentEntry.upperBound = score;
    } else {
      // Finalize current entry
      currentEntry.grossRange = formatChartRowLabel(currentEntry.lowerBound, currentEntry.upperBound);
      entries.push(currentEntry);

      // Start new entry
      currentEntry = {
        grossRange: '',
        lowerBound: score,
        upperBound: score,
        worstHoles: data.worstHoles,
        adjustment: data.adjustment,
      };
    }
  }

  // Finalize last entry
  if (currentEntry) {
    currentEntry.upperBound = null; // Make last entry open-ended
    currentEntry.grossRange = formatChartRowLabel(currentEntry.lowerBound, currentEntry.upperBound);
    entries.push(currentEntry);
  }

  return entries;
}

/**
 * Load active grid chart (with edits) or fall back to user defaults or shipped defaults
 */
export function getActiveGridChart(holeCount: 9 | 18): GridChartData {
  // Run migration first
  migrateOldShippedDefaults(holeCount);

  const activeKey = holeCount === 18 ? GRID_CHART_18_KEY : GRID_CHART_9_KEY;
  const userDefaultKey = holeCount === 18 ? USER_DEFAULT_GRID_CHART_18_KEY : USER_DEFAULT_GRID_CHART_9_KEY;
  const shippedDefault = holeCount === 18 ? getDefault18GridChart() : getDefault9GridChart();

  try {
    // Try active/edited chart first
    const activeData = localStorage.getItem(activeKey);
    if (activeData) {
      const parsed = JSON.parse(activeData);
      if (validateGridChart(parsed)) {
        return parsed;
      }
    }

    // Fall back to user-default chart
    const userDefaultData = localStorage.getItem(userDefaultKey);
    if (userDefaultData) {
      const parsed = JSON.parse(userDefaultData);
      if (validateGridChart(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading chart from localStorage:', e);
  }

  // Fall back to shipped default
  return shippedDefault;
}

/**
 * Save grid chart as both active and user-default
 */
export function saveGridChartAsDefault(holeCount: 9 | 18, chart: GridChartData): boolean {
  if (!validateGridChart(chart)) {
    return false;
  }

  const activeKey = holeCount === 18 ? GRID_CHART_18_KEY : GRID_CHART_9_KEY;
  const userDefaultKey = holeCount === 18 ? USER_DEFAULT_GRID_CHART_18_KEY : USER_DEFAULT_GRID_CHART_9_KEY;

  try {
    const serialized = JSON.stringify(chart);
    localStorage.setItem(activeKey, serialized);
    localStorage.setItem(userDefaultKey, serialized);
    return true;
  } catch (e) {
    console.error('Error saving chart to localStorage:', e);
    return false;
  }
}

/**
 * Reset grid chart to user-saved defaults (or shipped defaults if no user defaults exist)
 */
export function resetGridChartToUserDefaults(holeCount: 9 | 18): GridChartData {
  const activeKey = holeCount === 18 ? GRID_CHART_18_KEY : GRID_CHART_9_KEY;
  const userDefaultKey = holeCount === 18 ? USER_DEFAULT_GRID_CHART_18_KEY : USER_DEFAULT_GRID_CHART_9_KEY;
  const shippedDefault = holeCount === 18 ? getDefault18GridChart() : getDefault9GridChart();

  try {
    // Try to load user-default chart
    const userDefaultData = localStorage.getItem(userDefaultKey);
    if (userDefaultData) {
      const parsed = JSON.parse(userDefaultData);
      if (validateGridChart(parsed)) {
        // Save as active chart
        localStorage.setItem(activeKey, userDefaultData);
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading user default chart:', e);
  }

  // Fall back to shipped default
  try {
    localStorage.setItem(activeKey, JSON.stringify(shippedDefault));
  } catch (e) {
    console.error('Error saving shipped default to active:', e);
  }

  return shippedDefault;
}

/**
 * Get the chart for display/calculation (converts grid to legacy format)
 */
export function getChart(holeCount: 9 | 18): CallawayChartEntry[] {
  const gridChart = getActiveGridChart(holeCount);
  return gridToLegacyChart(gridChart);
}

/**
 * Find the chart entry for a given gross score and hole count
 */
export function findChartEntry(gross: number, holeCount: 9 | 18): CallawayChartEntry {
  const chart = getChart(holeCount);
  return findChartEntryFromArray(gross, chart);
}
