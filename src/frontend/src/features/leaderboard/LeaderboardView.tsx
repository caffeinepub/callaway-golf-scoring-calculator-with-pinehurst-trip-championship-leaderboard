import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardTable } from './LeaderboardTable';
import { BreakdownPanel } from './BreakdownPanel';
import { CallawayChartSection } from './CallawayChartSection';
import { type CallawayResultData } from '../../state/eventTypes';
import { Trophy, Award } from 'lucide-react';

interface LeaderboardViewProps {
  title: string;
  results: CallawayResultData[];
  coursePar: number;
  holeCount: 9 | 18;
}

export function LeaderboardView({ title, results, coursePar, holeCount }: LeaderboardViewProps) {
  // Sort results by net score (ascending)
  const sortedResults = [...results].sort((a, b) => {
    if (a.net !== b.net) return a.net - b.net;
    if (a.gross !== b.gross) return a.gross - b.gross;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title Section */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-serif font-bold text-foreground">{title}</h1>
          <Trophy className="h-12 w-12 text-primary" />
        </div>
        <p className="text-muted-foreground">
          {holeCount} Holes • Par {coursePar} • Callaway Scoring System
        </p>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Final Standings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <LeaderboardTable results={sortedResults} />
        </CardContent>
      </Card>

      {/* Callaway Chart */}
      <CallawayChartSection holeCount={holeCount} />

      {/* Detailed Breakdown */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-foreground">Score Breakdown</h2>
        <p className="text-sm text-muted-foreground">
          Detailed Callaway calculation for each player. Ties are broken by gross score, then alphabetically by name.
        </p>
        <div className="grid gap-4">
          {sortedResults.map((result) => (
            <BreakdownPanel key={result.id} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
}
