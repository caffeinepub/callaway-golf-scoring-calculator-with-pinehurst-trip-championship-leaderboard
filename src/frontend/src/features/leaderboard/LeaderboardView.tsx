import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trophy } from 'lucide-react';
import { LeaderboardTable } from './LeaderboardTable';
import { BreakdownPanel } from './BreakdownPanel';
import { CallawayChartSection } from './CallawayChartSection';
import { exportStandingsToPdf } from './exportStandingsPdf';
import { calculateCallawayFromLocalChart } from '../../lib/callaway/callaway';
import type { EventSetup, GolferData, CallawayResultData } from '../../state/eventTypes';
import { getActiveGridChart } from '../../lib/callaway/callawayChartPersistence';

interface LeaderboardViewProps {
  eventSetup: EventSetup;
  golfers: GolferData[];
}

export function LeaderboardView({ eventSetup, golfers }: LeaderboardViewProps) {
  const results = useMemo(() => {
    // Load the locally editable chart for the event's hole count
    const localChart = getActiveGridChart(eventSetup.holeCount);

    const calculatedResults: CallawayResultData[] = golfers.map((golfer) => {
      const holeScores = golfer.holeScores.map((score) => parseInt(score, 10));
      const callawayResult = calculateCallawayFromLocalChart(
        holeScores,
        eventSetup.coursePar,
        localChart
      );
      
      return {
        id: golfer.id,
        name: golfer.name,
        gross: callawayResult.gross,
        deduction: callawayResult.deduction,
        adjustment: callawayResult.adjustment,
        net: callawayResult.net,
        chartRowLabel: callawayResult.chartRowLabel,
        worstHolesUsed: callawayResult.worstHolesUsed,
      };
    });

    return calculatedResults.sort((a, b) => a.net - b.net);
  }, [golfers, eventSetup.coursePar, eventSetup.holeCount]);

  const handleExportPdf = () => {
    exportStandingsToPdf({
      eventTitle: eventSetup.title,
      courseName: eventSetup.courseName,
      results,
      coursePar: eventSetup.coursePar,
    });
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      {eventSetup.title && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">{eventSetup.title}</CardTitle>
            {eventSetup.courseName && (
              <p className="text-sm text-muted-foreground">{eventSetup.courseName}</p>
            )}
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tournament Standings</CardTitle>
          <Button onClick={handleExportPdf} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </CardHeader>
        <CardContent>
          <LeaderboardTable results={results} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Detailed Score Breakdown</h2>
        {results.map((result) => {
          const golfer = golfers.find(g => g.id === result.id);
          if (!golfer) return null;
          
          const holeScores = golfer.holeScores.map((score) => parseInt(score, 10));
          
          return (
            <BreakdownPanel
              key={result.id}
              golferName={result.name}
              holeScores={holeScores}
              callawayResult={{
                gross: result.gross,
                deduction: result.deduction,
                adjustment: result.adjustment,
                net: result.net,
                chartRowLabel: result.chartRowLabel,
                worstHolesUsed: result.worstHolesUsed,
              }}
              coursePar={eventSetup.coursePar}
            />
          );
        })}
      </div>

      <CallawayChartSection holeCount={eventSetup.holeCount} />
    </div>
  );
}
