import { type GolferData } from '../../state/eventTypes';

export function validateGolferData(golfer: GolferData, expectedHoleCount: number): string | null {
  // Check name
  if (!golfer.name.trim()) {
    return 'Player name is required';
  }

  // Check hole count
  if (golfer.holeScores.length !== expectedHoleCount) {
    return `Expected ${expectedHoleCount} hole scores`;
  }

  // Check all scores are filled
  for (let i = 0; i < golfer.holeScores.length; i++) {
    const score = golfer.holeScores[i];
    if (score === '' || score === null || score === undefined) {
      return `Hole ${i + 1} score is required`;
    }

    const numScore = parseInt(score, 10);
    if (isNaN(numScore) || numScore < 1) {
      return `Hole ${i + 1} score must be a positive number`;
    }

    if (numScore > 15) {
      return `Hole ${i + 1} score seems unusually high (max 15)`;
    }
  }

  return null;
}
