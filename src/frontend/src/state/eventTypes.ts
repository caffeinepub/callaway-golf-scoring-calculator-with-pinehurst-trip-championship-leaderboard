export interface EventSetup {
  title: string;
  golferCount: number;
  holeCount: 9 | 18;
  coursePar: number;
}

export interface GolferData {
  id: string;
  name: string;
  holeScores: string[]; // String array for form input
}

export interface CallawayResultData {
  id: string;
  name: string;
  gross: number;
  deduction: number;
  adjustment: number;
  net: number;
  chartRowLabel: string;
  worstHolesUsed: number;
}
