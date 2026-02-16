/**
 * Callaway chart data structures and legacy chart constants
 */

export interface CallawayChartEntry {
  grossRange: string;
  lowerBound: number;
  upperBound: number | null;
  worstHoles: number;
  adjustment: number;
}

export interface GridCell {
  grossScore: number;
  worstHoles: number;
}

export interface GridChartData {
  grid: GridCell[][];
  columnAdjustments: number[];
}

/**
 * Legacy 18-hole Callaway chart (pre-Version-14 defaults)
 */
export const CALLAWAY_CHART_18: CallawayChartEntry[] = [
  { grossRange: '70-75', lowerBound: 70, upperBound: 75, worstHoles: 0, adjustment: 0 },
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
 * Legacy 9-hole Callaway chart (pre-Version-14 defaults)
 */
export const CALLAWAY_CHART_9: CallawayChartEntry[] = [
  { grossRange: '35-39', lowerBound: 35, upperBound: 39, worstHoles: 0, adjustment: 0 },
  { grossRange: '40-43', lowerBound: 40, upperBound: 43, worstHoles: 1, adjustment: 0 },
  { grossRange: '44-47', lowerBound: 44, upperBound: 47, worstHoles: 2, adjustment: 0 },
  { grossRange: '48-54', lowerBound: 48, upperBound: 54, worstHoles: 2, adjustment: -1 },
  { grossRange: '55-59', lowerBound: 55, upperBound: 59, worstHoles: 3, adjustment: -1 },
  { grossRange: '60+', lowerBound: 60, upperBound: null, worstHoles: 4, adjustment: -1 },
];

/**
 * Find the chart entry for a given gross score
 */
export function findChartEntry(gross: number, chart: CallawayChartEntry[]): CallawayChartEntry {
  for (const entry of chart) {
    if (gross >= entry.lowerBound) {
      if (entry.upperBound === null || gross <= entry.upperBound) {
        return entry;
      }
    }
  }
  // Default fallback (should not happen with proper chart)
  return chart[0];
}
