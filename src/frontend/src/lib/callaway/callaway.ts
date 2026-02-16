import { findChartEntry } from './callawayChart';
import { formatChartRowLabel } from './callawayChartPersistence';

export interface CallawayResult {
  gross: number;
  deduction: number;
  adjustment: number;
  net: number;
  chartRowLabel: string;
  worstHolesUsed: number;
}

/**
 * Calculate Callaway handicap and net score based on gross scores.
 * 
 * The Callaway System uses an official chart based on gross score ranges
 * to determine how many worst holes to deduct and any adjustment.
 * Uses the active chart (edited or default).
 */
export function calculateCallaway(
  holeScores: number[],
  coursePar: number,
  holeCount: 9 | 18
): CallawayResult {
  if (holeCount !== 9 && holeCount !== 18) {
    throw new Error('Callaway scoring only supports 9 or 18 hole rounds');
  }

  if (holeScores.length !== holeCount) {
    throw new Error(`Expected ${holeCount} hole scores, got ${holeScores.length}`);
  }

  // Calculate gross total
  const gross = holeScores.reduce((sum, score) => sum + score, 0);

  // Find the appropriate chart entry based on gross score (uses active chart)
  const chartEntry = findChartEntry(gross, holeCount);

  // Sort scores descending to find worst holes (highest scores)
  const sortedScores = [...holeScores].sort((a, b) => b - a);

  // Calculate deduction: sum of the worst holes
  let deduction = 0;
  for (let i = 0; i < chartEntry.worstHoles && i < sortedScores.length; i++) {
    deduction += sortedScores[i];
  }

  // Apply adjustment from chart (note: adjustment is typically negative or zero)
  const adjustment = chartEntry.adjustment;

  // Calculate net score: gross - deduction + adjustment
  // (adjustment is negative, so adding it reduces the score further)
  const net = gross - deduction + adjustment;

  return {
    gross,
    deduction,
    adjustment,
    net,
    chartRowLabel: formatChartRowLabel(chartEntry.lowerBound, chartEntry.upperBound),
    worstHolesUsed: chartEntry.worstHoles,
  };
}
