/**
 * Persistence layer for edited Callaway charts using localStorage.
 * Provides safe load/save/reset operations with validation.
 */

import { type CallawayChartEntry, CALLAWAY_CHART_18, CALLAWAY_CHART_9 } from './callawayChart';

const CHART_18_KEY = 'callaway-chart-18-edited';
const CHART_9_KEY = 'callaway-chart-9-edited';

/**
 * Validate chart integrity
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
 * Load edited chart from localStorage, with fallback to defaults
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
 * Save edited chart to localStorage
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
 * Reset chart to defaults (clear edited version)
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
 */
export function getActiveChart(holeCount: 9 | 18): CallawayChartEntry[] {
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
