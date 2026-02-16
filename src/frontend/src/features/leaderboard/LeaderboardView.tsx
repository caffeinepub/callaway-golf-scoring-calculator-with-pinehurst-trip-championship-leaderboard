import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeaderboardTable } from './LeaderboardTable';
import { BreakdownPanel } from './BreakdownPanel';
import { type CallawayResultData } from '../../state/eventTypes';
import { exportStandingsToPdf } from './exportStandingsPdf';
import { Trophy, Award, Download } from 'lucide-react';

interface LeaderboardViewProps {
  title: string;
  courseName?: string;
  results: CallawayResultData[];
  coursePar: number;
  holeCount: 9 | 18;
}

export function LeaderboardView({ title, courseName, results, coursePar, holeCount }: LeaderboardViewProps) {
  // Sort results by net score (ascending)
  const sortedResults = [...results].sort((a, b) => {
    if (a.net !== b.net) return a.net - b.net;
    if (a.gross !== b.gross) return a.gross - b.gross;
    return a.name.localeCompare(b.name);
  });

  const handleDownloadPdf = () => {
    exportStandingsToPdf({
      eventTitle: title,
      courseName,
      results: sortedResults,
      coursePar,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title Section - Only show if title is not empty */}
      {title.trim() && (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-serif font-bold text-foreground">{title}</h1>
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          {courseName && (
            <p className="text-lg text-muted-foreground font-medium">{courseName}</p>
          )}
          <p className="text-sm text-muted-foreground">Callaway Scoring System Results</p>
        </div>
      )}

      {/* If title is empty, show course name and subtitle without large title */}
      {!title.trim() && (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          {courseName && (
            <p className="text-xl text-muted-foreground font-medium">{courseName}</p>
          )}
          <p className="text-sm text-muted-foreground">Callaway Scoring System Results</p>
        </div>
      )}

      {/* Final Standings Card */}
      <Card>
        <CardHeader className="bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Final Standings</CardTitle>
            </div>
            <Button onClick={handleDownloadPdf} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <LeaderboardTable results={sortedResults} />
        </CardContent>
      </Card>

      {/* Detailed Breakdown Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-foreground">Detailed Score Breakdown</h2>
        <div className="grid gap-4">
          {sortedResults.map((result) => (
            <BreakdownPanel
              key={result.id}
              result={result}
              coursePar={coursePar}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
