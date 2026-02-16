/**
 * Official Callaway Scoring Chart for 18-hole rounds.
 * Based on gross score ranges, determines worst holes to deduct and adjustment.
 */

import { getActiveChart as getActiveChartFromPersistence } from './callawayChartPersistence';

export interface CallawayChartEntry {
  grossRange: string;
  lowerBound: number;
  upperBound: number | null; // null means no upper limit
  worstHoles: number;
  adjustment: number;
}

/**
 * Official Callaway Chart for 18-hole rounds (default/built-in)
 */
export const CALLAWAY_CHART_18: CallawayChartEntry[] = [
  { grossRange: '0-70', lowerBound: 0, upperBound: 70, worstHoles: 0, adjustment: 0 },
  { grossRange: '71-75', lowerBound: 71, upperBound: 75, worstHoles: 0, adjustment: 0 },
  { grossRange: '76-80', lowerBound: 76, upperBound: 80, worstHoles: 1, adjustment: 0 },
  { grossRange: '81-85', lowerBound: 81, upperBound: 85, worstHoles: 2, adjustment: 0 },
  { grossRange: '86-90', lowerBound: 86, upperBound: 90, worstHoles: 2, adjustment: 0 },
  { grossRange: '91-95', lowerBound: 91, upperBound: 95, worstHoles: 3, adjustment: 0 },
  { grossRange: '96-100', lowerBound: 96, upperBound: 100, worstHoles: 3, adjustment: 0 },
  { grossRange: '101-105', lowerBound: 101, upperBound: 105, worstHoles: 4, adjustment: 0 },
  { grossRange: '106-110', lowerBound: 106, upperBound: 110, worstHoles: 4, adjustment: -2 },
  { grossRange: '111-115', lowerBound: 111, upperBound: 115, worstHoles: 5, adjustment: -2 },
  { grossRange: '116-120', lowerBound: 116, upperBound: 120, worstHoles: 5, adjustment: -2 },
  { grossRange: '121-125', lowerBound: 121, upperBound: 125, worstHoles: 6, adjustment: -2 },
  { grossRange: '126-130', lowerBound: 126, upperBound: 130, worstHoles: 6, adjustment: -2 },
  { grossRange: '131-135', lowerBound: 131, upperBound: 135, worstHoles: 7, adjustment: -2 },
  { grossRange: '136+', lowerBound: 136, upperBound: null, worstHoles: 8, adjustment: -2 },
];

/**
 * Simplified Callaway Chart for 9-hole rounds (default/built-in)
 */
export const CALLAWAY_CHART_9: CallawayChartEntry[] = [
  { grossRange: '0-35', lowerBound: 0, upperBound: 35, worstHoles: 0, adjustment: 0 },
  { grossRange: '36-38', lowerBound: 36, upperBound: 38, worstHoles: 0, adjustment: 0 },
  { grossRange: '39-40', lowerBound: 39, upperBound: 40, worstHoles: 1, adjustment: 0 },
  { grossRange: '41-43', lowerBound: 41, upperBound: 43, worstHoles: 1, adjustment: 0 },
  { grossRange: '44-45', lowerBound: 44, upperBound: 45, worstHoles: 2, adjustment: 0 },
  { grossRange: '46-48', lowerBound: 46, upperBound: 48, worstHoles: 2, adjustment: 0 },
  { grossRange: '49-50', lowerBound: 49, upperBound: 50, worstHoles: 2, adjustment: 0 },
  { grossRange: '51-53', lowerBound: 51, upperBound: 53, worstHoles: 2, adjustment: -1 },
  { grossRange: '54-55', lowerBound: 54, upperBound: 55, worstHoles: 2, adjustment: -1 },
  { grossRange: '56-58', lowerBound: 56, upperBound: 58, worstHoles: 3, adjustment: -1 },
  { grossRange: '59-60', lowerBound: 59, upperBound: 60, worstHoles: 3, adjustment: -1 },
  { grossRange: '61-63', lowerBound: 61, upperBound: 63, worstHoles: 3, adjustment: -1 },
  { grossRange: '64-65', lowerBound: 64, upperBound: 65, worstHoles: 3, adjustment: -1 },
  { grossRange: '66-68', lowerBound: 66, upperBound: 68, worstHoles: 4, adjustment: -1 },
  { grossRange: '69+', lowerBound: 69, upperBound: null, worstHoles: 4, adjustment: -1 },
];

/**
 * Find the appropriate chart entry for a given gross score.
 * Uses the active chart (edited or default).
 */
export function findChartEntry(gross: number, holeCount: 9 | 18): CallawayChartEntry {
  const chart = getActiveChartFromPersistence(holeCount);
  
  for (const entry of chart) {
    if (gross >= entry.lowerBound && (entry.upperBound === null || gross <= entry.upperBound)) {
      return entry;
    }
  }
  
  // Fallback to first entry (should not happen with proper chart)
  return chart[0];
}

/**
 * Get the full chart for display purposes.
 * Uses the active chart (edited or default).
 */
export function getChart(holeCount: 9 | 18): CallawayChartEntry[] {
  return getActiveChartFromPersistence(holeCount);
}
