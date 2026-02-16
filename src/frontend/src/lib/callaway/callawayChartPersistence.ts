/**
 * Persistence layer for edited Callaway charts using localStorage.
 * Provides safe load/save/reset operations with validation.
 * Supports both user-default charts (persisted defaults) and active/edited charts.
 */

import { type CallawayChartEntry, CALLAWAY_CHART_18, CALLAWAY_CHART_9, type GridChartData, type GridCell } from './callawayChart';

// Active/edited chart keys (current session edits)
const CHART_18_KEY = 'callaway-chart-18-edited';
const CHART_9_KEY = 'callaway-chart-9-edited';
const GRID_CHART_18_KEY = 'callaway-grid-chart-18';
const GRID_CHART_9_KEY = 'callaway-grid-chart-9';

// User-default chart keys (persisted defaults after save)
const USER_DEFAULT_GRID_CHART_18_KEY = 'callaway-grid-chart-18-user-default';
const USER_DEFAULT_GRID_CHART_9_KEY = 'callaway-grid-chart-9-user-default';

/**
 * Default grid chart data for 18-hole (13 rows x 5 columns)
 */
export function getDefault18GridChart(): GridChartData {
  return {
    grid: [
      [{ grossScore: 70, worstHoles: 0 }, { grossScore: 71, worstHoles: 0 }, { grossScore: 76, worstHoles: 1 }, { grossScore: 81, worstHoles: 2 }, { grossScore: 86, worstHoles: 2 }],
      [{ grossScore: 72, worstHoles: 0 }, { grossScore: 73, worstHoles: 0 }, { grossScore: 77, worstHoles: 1 }, { grossScore: 82, worstHoles: 2 }, { grossScore: 87, worstHoles: 2 }],
      [{ grossScore: 74, worstHoles: 0 }, { grossScore: 75, worstHoles: 0 }, { grossScore: 78, worstHoles: 1 }, { grossScore: 83, worstHoles: 2 }, { grossScore: 88, worstHoles: 2 }],
      [{ grossScore: 91, worstHoles: 3 }, { grossScore: 96, worstHoles: 3 }, { grossScore: 79, worstHoles: 1 }, { grossScore: 84, worstHoles: 2 }, { grossScore: 89, worstHoles: 2 }],
      [{ grossScore: 92, worstHoles: 3 }, { grossScore: 97, worstHoles: 3 }, { grossScore: 80, worstHoles: 1 }, { grossScore: 85, worstHoles: 2 }, { grossScore: 90, worstHoles: 2 }],
      [{ grossScore: 93, worstHoles: 3 }, { grossScore: 98, worstHoles: 3 }, { grossScore: 101, worstHoles: 4 }, { grossScore: 106, worstHoles: 4 }, { grossScore: 111, worstHoles: 5 }],
      [{ grossScore: 94, worstHoles: 3 }, { grossScore: 99, worstHoles: 3 }, { grossScore: 102, worstHoles: 4 }, { grossScore: 107, worstHoles: 4 }, { grossScore: 112, worstHoles: 5 }],
      [{ grossScore: 95, worstHoles: 3 }, { grossScore: 100, worstHoles: 3 }, { grossScore: 103, worstHoles: 4 }, { grossScore: 108, worstHoles: 4 }, { grossScore: 113, worstHoles: 5 }],
      [{ grossScore: 116, worstHoles: 5 }, { grossScore: 121, worstHoles: 6 }, { grossScore: 104, worstHoles: 4 }, { grossScore: 109, worstHoles: 4 }, { grossScore: 114, worstHoles: 5 }],
      [{ grossScore: 117, worstHoles: 5 }, { grossScore: 122, worstHoles: 6 }, { grossScore: 105, worstHoles: 4 }, { grossScore: 110, worstHoles: 4 }, { grossScore: 115, worstHoles: 5 }],
      [{ grossScore: 118, worstHoles: 5 }, { grossScore: 123, worstHoles: 6 }, { grossScore: 126, worstHoles: 6 }, { grossScore: 131, worstHoles: 7 }, { grossScore: 136, worstHoles: 8 }],
      [{ grossScore: 119, worstHoles: 5 }, { grossScore: 124, worstHoles: 6 }, { grossScore: 127, worstHoles: 6 }, { grossScore: 132, worstHoles: 7 }, { grossScore: 137, worstHoles: 8 }],
      [{ grossScore: 120, worstHoles: 5 }, { grossScore: 125, worstHoles: 6 }, { grossScore: 128, worstHoles: 6 }, { grossScore: 133, worstHoles: 7 }, { grossScore: 138, worstHoles: 8 }],
    ],
    columnAdjustments: [0, 0, 0, -2, -2],
  };
}

/**
 * Default grid chart data for 9-hole (13 rows x 5 columns)
 */
export function getDefault9GridChart(): GridChartData {
  return {
    grid: [
      [{ grossScore: 35, worstHoles: 0 }, { grossScore: 36, worstHoles: 0 }, { grossScore: 39, worstHoles: 1 }, { grossScore: 41, worstHoles: 1 }, { grossScore: 44, worstHoles: 2 }],
      [{ grossScore: 37, worstHoles: 0 }, { grossScore: 38, worstHoles: 0 }, { grossScore: 40, worstHoles: 1 }, { grossScore: 42, worstHoles: 1 }, { grossScore: 45, worstHoles: 2 }],
      [{ grossScore: 46, worstHoles: 2 }, { grossScore: 49, worstHoles: 2 }, { grossScore: 51, worstHoles: 2 }, { grossScore: 43, worstHoles: 1 }, { grossScore: 54, worstHoles: 2 }],
      [{ grossScore: 47, worstHoles: 2 }, { grossScore: 50, worstHoles: 2 }, { grossScore: 52, worstHoles: 2 }, { grossScore: 56, worstHoles: 3 }, { grossScore: 55, worstHoles: 2 }],
      [{ grossScore: 48, worstHoles: 2 }, { grossScore: 53, worstHoles: 2 }, { grossScore: 57, worstHoles: 3 }, { grossScore: 59, worstHoles: 3 }, { grossScore: 61, worstHoles: 3 }],
      [{ grossScore: 58, worstHoles: 3 }, { grossScore: 60, worstHoles: 3 }, { grossScore: 62, worstHoles: 3 }, { grossScore: 64, worstHoles: 3 }, { grossScore: 66, worstHoles: 4 }],
      [{ grossScore: 63, worstHoles: 3 }, { grossScore: 65, worstHoles: 3 }, { grossScore: 67, worstHoles: 4 }, { grossScore: 69, worstHoles: 4 }, { grossScore: 71, worstHoles: 4 }],
      [{ grossScore: 68, worstHoles: 4 }, { grossScore: 70, worstHoles: 4 }, { grossScore: 72, worstHoles: 4 }, { grossScore: 74, worstHoles: 4 }, { grossScore: 76, worstHoles: 4 }],
      [{ grossScore: 73, worstHoles: 4 }, { grossScore: 75, worstHoles: 4 }, { grossScore: 77, worstHoles: 4 }, { grossScore: 79, worstHoles: 4 }, { grossScore: 81, worstHoles: 4 }],
      [{ grossScore: 78, worstHoles: 4 }, { grossScore: 80, worstHoles: 4 }, { grossScore: 82, worstHoles: 4 }, { grossScore: 84, worstHoles: 4 }, { grossScore: 86, worstHoles: 4 }],
      [{ grossScore: 83, worstHoles: 4 }, { grossScore: 85, worstHoles: 4 }, { grossScore: 87, worstHoles: 4 }, { grossScore: 89, worstHoles: 4 }, { grossScore: 91, worstHoles: 4 }],
      [{ grossScore: 88, worstHoles: 4 }, { grossScore: 90, worstHoles: 4 }, { grossScore: 92, worstHoles: 4 }, { grossScore: 94, worstHoles: 4 }, { grossScore: 96, worstHoles: 4 }],
      [{ grossScore: 93, worstHoles: 4 }, { grossScore: 95, worstHoles: 4 }, { grossScore: 97, worstHoles: 4 }, { grossScore: 99, worstHoles: 4 }, { grossScore: 101, worstHoles: 4 }],
    ],
    columnAdjustments: [0, 0, -1, -1, -1],
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
      scoreMap.set(cell.grossScore, { worstHoles: cell.worstHoles, adjustment });
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
 * Initialize user-default charts from hard-coded defaults if they don't exist
 */
function ensureUserDefaultsInitialized(): void {
  // Initialize 18-hole user defaults if missing
  const userDefault18Key = USER_DEFAULT_GRID_CHART_18_KEY;
  try {
    const stored18 = localStorage.getItem(userDefault18Key);
    if (!stored18) {
      const defaultChart = getDefault18GridChart();
      localStorage.setItem(userDefault18Key, JSON.stringify(defaultChart));
    }
  } catch (error) {
    console.error('Failed to initialize 18-hole user defaults:', error);
  }

  // Initialize 9-hole user defaults if missing
  const userDefault9Key = USER_DEFAULT_GRID_CHART_9_KEY;
  try {
    const stored9 = localStorage.getItem(userDefault9Key);
    if (!stored9) {
      const defaultChart = getDefault9GridChart();
      localStorage.setItem(userDefault9Key, JSON.stringify(defaultChart));
    }
  } catch (error) {
    console.error('Failed to initialize 9-hole user defaults:', error);
  }
}

/**
 * Load user-default grid chart from localStorage
 */
export function loadUserDefaultGridChart(holeCount: 9 | 18): GridChartData | null {
  ensureUserDefaultsInitialized();
  
  const key = holeCount === 18 ? USER_DEFAULT_GRID_CHART_18_KEY : USER_DEFAULT_GRID_CHART_9_KEY;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (validateGridChart(parsed)) {
      return parsed;
    }

    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

/**
 * Save user-default grid chart to localStorage
 */
export function saveUserDefaultGridChart(holeCount: 9 | 18, data: GridChartData): boolean {
  if (!validateGridChart(data)) {
    return false;
  }

  const key = holeCount === 18 ? USER_DEFAULT_GRID_CHART_18_KEY : USER_DEFAULT_GRID_CHART_9_KEY;

  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save user-default grid chart:', error);
    return false;
  }
}

/**
 * Load active/edited grid chart from localStorage
 */
export function loadGridChart(holeCount: 9 | 18): GridChartData | null {
  const key = holeCount === 18 ? GRID_CHART_18_KEY : GRID_CHART_9_KEY;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (validateGridChart(parsed)) {
      return parsed;
    }

    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

/**
 * Save active/edited grid chart to localStorage
 */
export function saveGridChart(holeCount: 9 | 18, data: GridChartData): boolean {
  if (!validateGridChart(data)) {
    return false;
  }

  const key = holeCount === 18 ? GRID_CHART_18_KEY : GRID_CHART_9_KEY;

  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save grid chart:', error);
    return false;
  }
}

/**
 * Save chart as both active and user-default (called on "Save Changes")
 */
export function saveGridChartAsDefault(holeCount: 9 | 18, data: GridChartData): boolean {
  if (!validateGridChart(data)) {
    return false;
  }

  // Save as active/edited chart
  const activeSuccess = saveGridChart(holeCount, data);
  
  // Save as user-default chart
  const defaultSuccess = saveUserDefaultGridChart(holeCount, data);

  return activeSuccess && defaultSuccess;
}

/**
 * Reset grid chart to user-defaults (called on "Reset to Defaults")
 */
export function resetGridChartToUserDefaults(holeCount: 9 | 18): GridChartData {
  // Clear active/edited chart
  const activeKey = holeCount === 18 ? GRID_CHART_18_KEY : GRID_CHART_9_KEY;
  try {
    localStorage.removeItem(activeKey);
  } catch (error) {
    console.error('Failed to clear active grid chart:', error);
  }

  // Load user-default chart (will initialize from hard-coded defaults if missing)
  const userDefault = loadUserDefaultGridChart(holeCount);
  if (userDefault) {
    return userDefault;
  }

  // Fallback to hard-coded defaults
  return holeCount === 18 ? getDefault18GridChart() : getDefault9GridChart();
}

/**
 * Reset grid chart to defaults (legacy - clears active chart)
 */
export function resetGridChartToDefaults(holeCount: 9 | 18): void {
  const key = holeCount === 18 ? GRID_CHART_18_KEY : GRID_CHART_9_KEY;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to reset grid chart:', error);
  }
}

/**
 * Get active grid chart (edited or user-default or hard-coded default)
 * Resolution order: active/edited → user-default → hard-coded default
 */
export function getActiveGridChart(holeCount: 9 | 18): GridChartData {
  // Try active/edited chart first
  const edited = loadGridChart(holeCount);
  if (edited) return edited;

  // Try user-default chart
  const userDefault = loadUserDefaultGridChart(holeCount);
  if (userDefault) return userDefault;

  // Fall back to hard-coded defaults
  return holeCount === 18 ? getDefault18GridChart() : getDefault9GridChart();
}

/**
 * Validate chart integrity (legacy)
 */
function validateChart(chart: CallawayChartEntry[]): boolean {
  if (!Array.isArray(chart) || chart.length === 0) return false;

  for (let i = 0; i < chart.length; i++) {
    const entry = chart[i];
    
    // Check required fields
    if (
      typeof entry.lowerBound !== 'number' ||
      typeof entry.worstHoles !== 'number' ||
      typeof entry.adjustment !== 'number'
    ) {
      return false;
    }

    // Check upperBound is valid
    if (entry.upperBound !== null && typeof entry.upperBound !== 'number') {
      return false;
    }

    // Check lowerBound <= upperBound when upperBound exists
    if (entry.upperBound !== null && entry.lowerBound > entry.upperBound) {
      return false;
    }

    // Check ordering (each row should start after or at previous row)
    if (i > 0 && entry.lowerBound < chart[i - 1].lowerBound) {
      return false;
    }
  }

  return true;
}

/**
 * Load edited chart from localStorage, with fallback to defaults (legacy)
 */
export function loadEditedChart(holeCount: 9 | 18): CallawayChartEntry[] | null {
  const key = holeCount === 18 ? CHART_18_KEY : CHART_9_KEY;
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (validateChart(parsed)) {
      return parsed;
    }
    
    // Invalid chart, clear it
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

/**
 * Save edited chart to localStorage (legacy)
 */
export function saveEditedChart(holeCount: 9 | 18, chart: CallawayChartEntry[]): boolean {
  if (!validateChart(chart)) {
    return false;
  }

  const key = holeCount === 18 ? CHART_18_KEY : CHART_9_KEY;
  
  try {
    localStorage.setItem(key, JSON.stringify(chart));
    return true;
  } catch (error) {
    console.error('Failed to save chart:', error);
    return false;
  }
}

/**
 * Reset chart to defaults (clear edited version) (legacy)
 */
export function resetChartToDefaults(holeCount: 9 | 18): void {
  const key = holeCount === 18 ? CHART_18_KEY : CHART_9_KEY;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to reset chart:', error);
  }
}

/**
 * Get the active chart (edited or default)
 * Now uses grid chart if available, otherwise falls back to legacy
 */
export function getActiveChart(holeCount: 9 | 18): CallawayChartEntry[] {
  // Try grid chart first
  const gridChart = loadGridChart(holeCount);
  if (gridChart) {
    return gridToLegacyChart(gridChart);
  }

  // Fall back to legacy chart
  const edited = loadEditedChart(holeCount);
  if (edited) return edited;
  
  return holeCount === 18 ? CALLAWAY_CHART_18 : CALLAWAY_CHART_9;
}

/**
 * Get default chart
 */
export function getDefaultChart(holeCount: 9 | 18): CallawayChartEntry[] {
  return holeCount === 18 ? [...CALLAWAY_CHART_18] : [...CALLAWAY_CHART_9];
}

/**
 * Format a chart row label from bounds
 */
export function formatChartRowLabel(lowerBound: number, upperBound: number | null): string {
  if (upperBound === null) {
    return `${lowerBound}+`;
  }
  return `${lowerBound}-${upperBound}`;
}
