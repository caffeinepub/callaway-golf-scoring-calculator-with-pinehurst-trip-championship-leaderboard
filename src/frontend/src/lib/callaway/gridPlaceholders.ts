/**
 * Helper utilities for handling placeholder cells in Callaway chart grids.
 * Placeholder cells have both grossScore=0 and worstHoles=0.
 */

import { type GridCell } from './callawayChart';

/**
 * Check if a cell is a placeholder (both grossScore and worstHoles are 0)
 */
export function isPlaceholderCell(cell: GridCell): boolean {
  return cell.grossScore === 0 && cell.worstHoles === 0;
}

/**
 * Get display value for a cell field (returns empty string for placeholder cells)
 */
export function displayValueForCell(value: number, isPlaceholder: boolean): string {
  if (isPlaceholder) {
    return '';
  }
  return value.toString();
}

/**
 * Parse input value for a cell field (converts empty string to 0)
 */
export function parseInputValue(value: string): number {
  const trimmed = value.trim();
  if (trimmed === '') {
    return 0;
  }
  const parsed = parseFloat(trimmed);
  return isNaN(parsed) ? 0 : parsed;
}
