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
 * 
 * IMPORTANT: This calculation uses the active persisted chart data (edited or default).
 * Chart edits made via the Admin Chart Editor are immediately reflected in all calculations,
 * regardless of whether the scoring chart display is visible in the UI.
 * 
 * RULE: When gross score is equal to or less than course par, net score equals gross score.
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

  // Find the appropriate chart entry based on gross score
  // NOTE: findChartEntry retrieves the active chart (edited or default) from persistence
  const chartEntry = findChartEntry(gross, holeCount);

  // Sort scores descending to find worst holes (highest scores)
  const sortedScores = [...holeScores].sort((a, b) => b - a);

  // Calculate deduction: sum of the worst holes (supporting fractional holes)
  let deduction = 0;
  const worstHolesCount = chartEntry.worstHoles;
  const fullHoles = Math.floor(worstHolesCount);
  const fractionalPart = worstHolesCount - fullHoles;

  // Add full worst holes
  for (let i = 0; i < fullHoles && i < sortedScores.length; i++) {
    deduction += sortedScores[i];
  }

  // Add fractional hole if needed (e.g., 0.5 means half of the next worst hole)
  if (fractionalPart > 0 && fullHoles < sortedScores.length) {
    deduction += sortedScores[fullHoles] * fractionalPart;
  }

  // Apply adjustment from chart (note: adjustment is typically negative or zero)
  const adjustment = chartEntry.adjustment;

  // Calculate net score with special rule:
  // If gross <= par, net equals gross (no deduction or adjustment applied)
  // Otherwise, apply normal Callaway formula: gross - deduction + adjustment
  let net: number;
  if (gross <= coursePar) {
    net = gross;
  } else {
    net = Math.round((gross - deduction + adjustment) * 10) / 10;
  }

  return {
    gross,
    deduction: Math.round(deduction * 10) / 10,
    adjustment,
    net,
    chartRowLabel: formatChartRowLabel(chartEntry.lowerBound, chartEntry.upperBound),
    worstHolesUsed: worstHolesCount,
  };
}
