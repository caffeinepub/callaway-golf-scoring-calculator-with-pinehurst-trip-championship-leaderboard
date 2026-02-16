import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CallawayResult } from '../../lib/callaway/callaway';

interface BreakdownPanelProps {
  golferName: string;
  holeScores: number[];
  callawayResult: CallawayResult;
  coursePar: number;
}

export function BreakdownPanel({ golferName, holeScores, callawayResult, coursePar }: BreakdownPanelProps) {
  const isAtOrBelowPar = callawayResult.gross <= coursePar;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{golferName}</span>
          <Badge variant="outline" className="text-sm">
            Chart Row: {callawayResult.chartRowLabel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Gross Score</p>
            <p className="text-2xl font-bold">{callawayResult.gross}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Deduction</p>
            <p className="text-2xl font-bold text-destructive">-{callawayResult.deduction}</p>
            <p className="text-xs text-muted-foreground">
              ({callawayResult.worstHolesUsed} worst {callawayResult.worstHolesUsed === 1 ? 'hole' : 'holes'})
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Adjustment</p>
            <p className="text-2xl font-bold">
              {isAtOrBelowPar ? '0' : callawayResult.adjustment >= 0 ? `+${callawayResult.adjustment}` : callawayResult.adjustment}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net Score</p>
            <p className="text-2xl font-bold text-primary">{callawayResult.net}</p>
          </div>
        </div>

        {isAtOrBelowPar && (
          <div className="rounded-lg border border-muted bg-muted/30 p-3 text-sm text-muted-foreground">
            <strong>Note:</strong> Gross score is at or below par ({coursePar}). Net score equals gross score
            (no deduction or adjustment applied).
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Hole-by-Hole Scores</p>
          <div className="grid grid-cols-9 gap-1 text-center text-sm">
            {holeScores.map((score, index) => (
              <div key={index} className="rounded border border-border bg-muted/50 p-2">
                <div className="text-xs text-muted-foreground">H{index + 1}</div>
                <div className="font-semibold">{score}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
