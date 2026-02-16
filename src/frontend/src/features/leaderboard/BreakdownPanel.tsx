import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type CallawayResultData } from '../../state/eventTypes';
import { User } from 'lucide-react';

interface BreakdownPanelProps {
  result: CallawayResultData;
}

export function BreakdownPanel({ result }: BreakdownPanelProps) {
  const formatNumber = (num: number) => {
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  const formatWorstHoles = (num: number) => {
    if (num % 1 === 0) return num.toString();
    return num.toFixed(1);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            {result.name}
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            Chart Row: {result.chartRowLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Gross Total</p>
            <p className="text-2xl font-bold">{result.gross}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Worst Holes</p>
            <p className="text-2xl font-bold text-primary">{formatWorstHoles(result.worstHolesUsed)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Deduction</p>
            <p className="text-2xl font-bold text-primary">-{formatNumber(result.deduction)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Adjustment</p>
            <p className="text-2xl font-bold text-primary">
              {result.adjustment === 0 ? '0' : result.adjustment}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Net Score</p>
            <p className="text-2xl font-bold text-foreground">{formatNumber(result.net)}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Calculation: {result.gross} (gross) - {formatNumber(result.deduction)} (deduction from {formatWorstHoles(result.worstHolesUsed)} worst holes) {result.adjustment !== 0 ? `+ ${result.adjustment} (adjustment)` : ''} = <span className="font-semibold text-foreground">{formatNumber(result.net)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
