import type { SharedChartEntry } from '../../backend';
import type { GridChartData } from './callawayChart';

export interface CallawayResult {
  gross: number;
  deduction: number;
  adjustment: number;
  net: number;
  chartRowLabel: string;
  worstHolesUsed: number;
}

/**
 * Find the appropriate chart entry for a given gross score
 */
function findChartEntryFromBackend(gross: number, chart: SharedChartEntry[]): SharedChartEntry | null {
  for (const entry of chart) {
    const from = Number(entry.grossScoreFrom);
    const to = Number(entry.grossScoreTo);
    if (gross >= from && gross <= to) {
      return entry;
    }
  }
  return null;
}

/**
 * Find the appropriate chart entry from local grid chart
 */
function findChartEntryFromGrid(gross: number, gridChart: GridChartData): { worstHoles: number; adjustment: number; grossRange: string } | null {
  // Build a map of gross score -> (worstHoles, adjustment)
  const scoreMap = new Map<number, { worstHoles: number; adjustment: number }>();
  
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 13; row++) {
      const cell = gridChart.grid[row][col];
      const adjustment = gridChart.columnAdjustments[col];
      // Skip zero gross scores (placeholders)
      if (cell.grossScore > 0) {
        scoreMap.set(cell.grossScore, { worstHoles: cell.worstHoles, adjustment });
      }
    }
  }

  // Find exact match or closest lower bound
  let bestMatch: { score: number; worstHoles: number; adjustment: number } | null = null;
  
  for (const [score, data] of scoreMap.entries()) {
    if (score === gross) {
      return { ...data, grossRange: `${score}` };
    }
    if (score < gross && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { score, ...data };
    }
  }

  // If we found a lower bound, use it (open-ended range)
  if (bestMatch) {
    return { 
      worstHoles: bestMatch.worstHoles, 
      adjustment: bestMatch.adjustment,
      grossRange: `${bestMatch.score}+`
    };
  }

  return null;
}

/**
 * Format chart row label (e.g., "70-75", "136+")
 */
function formatChartRowLabel(from: bigint, to: bigint): string {
  const fromNum = Number(from);
  const toNum = Number(to);
  
  if (fromNum === toNum) {
    return `${fromNum}`;
  }
  return `${fromNum}-${toNum}`;
}

/**
 * Calculate Callaway handicap and net score based on gross scores.
 * 
 * The Callaway System uses the backend chart to determine how many 
 * worst holes to deduct and any adjustment.
 * 
 * RULE: When gross score is equal to or less than course par, net score equals gross score.
 */
export function calculateCallaway(
  holeScores: number[],
  coursePar: number,
  backendChart: SharedChartEntry[]
): CallawayResult {
  if (holeScores.length !== 18 && holeScores.length !== 9) {
    throw new Error('Callaway scoring only supports 9 or 18 hole rounds');
  }

  // Calculate gross total
  const gross = holeScores.reduce((sum, score) => sum + score, 0);

  // Find the appropriate chart entry based on gross score
  const chartEntry = findChartEntryFromBackend(gross, backendChart);

  // If no chart entry found, return gross score as net
  if (!chartEntry) {
    return {
      gross,
      deduction: 0,
      adjustment: 0,
      net: gross,
      chartRowLabel: 'N/A',
      worstHolesUsed: 0,
    };
  }

  // Sort scores descending to find worst holes (highest scores)
  const sortedScores = [...holeScores].sort((a, b) => b - a);

  // Calculate deduction: sum of the worst holes (supporting fractional holes)
  let deduction = 0;
  const worstHolesCount = chartEntry.deduction;
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
  const adjustment = Number(chartEntry.adjustment);

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
    chartRowLabel: formatChartRowLabel(chartEntry.grossScoreFrom, chartEntry.grossScoreTo),
    worstHolesUsed: worstHolesCount,
  };
}

/**
 * Calculate Callaway handicap and net score using local grid chart.
 * 
 * RULE: When gross score is equal to or less than course par, net score equals gross score.
 */
export function calculateCallawayFromLocalChart(
  holeScores: number[],
  coursePar: number,
  gridChart: GridChartData
): CallawayResult {
  if (holeScores.length !== 18 && holeScores.length !== 9) {
    throw new Error('Callaway scoring only supports 9 or 18 hole rounds');
  }

  // Calculate gross total
  const gross = holeScores.reduce((sum, score) => sum + score, 0);

  // Find the appropriate chart entry based on gross score
  const chartEntry = findChartEntryFromGrid(gross, gridChart);

  // If no chart entry found, return gross score as net
  if (!chartEntry) {
    return {
      gross,
      deduction: 0,
      adjustment: 0,
      net: gross,
      chartRowLabel: 'N/A',
      worstHolesUsed: 0,
    };
  }

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
    chartRowLabel: chartEntry.grossRange,
    worstHolesUsed: worstHolesCount,
  };
}
