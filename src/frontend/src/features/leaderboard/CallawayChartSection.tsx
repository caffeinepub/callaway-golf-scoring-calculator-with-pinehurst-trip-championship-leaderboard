import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SharedChartEntry } from '../../backend';

interface CallawayChartSectionProps {
  backendChart: SharedChartEntry[];
}

export function CallawayChartSection({ backendChart }: CallawayChartSectionProps) {
  // Group entries by deduction and adjustment for display
  const displayRows = backendChart.map((entry) => {
    const from = Number(entry.grossScoreFrom);
    const to = Number(entry.grossScoreTo);
    const deduction = entry.deduction;
    const adjustment = Number(entry.adjustment);

    let rangeLabel: string;
    if (from === to) {
      rangeLabel = `${from}`;
    } else {
      rangeLabel = `${from}-${to}`;
    }

    return {
      range: rangeLabel,
      deduction,
      adjustment,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Callaway Scoring Chart</CardTitle>
        <CardDescription>
          This chart determines how many worst holes are deducted based on your gross score.
          The system automatically selects your worst-scoring holes and subtracts them to calculate your net score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Gross Score Range</TableHead>
                <TableHead className="text-center">Worst Holes Deducted</TableHead>
                <TableHead className="text-center">Adjustment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center font-medium">{row.range}</TableCell>
                  <TableCell className="text-center">{row.deduction}</TableCell>
                  <TableCell className="text-center">
                    {row.adjustment >= 0 ? '+' : ''}{row.adjustment}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>How it works:</strong> Find your gross score in the table. The corresponding "Worst Holes Deducted" value shows
            how many of your worst holes will be subtracted from your score. The adjustment is then applied to
            calculate your final net score.
          </p>
          <p>
            <strong>Example:</strong> If you shoot 95 with a par of 72, the chart shows you deduct 2.5 worst holes
            with an adjustment. Your worst 2 full holes plus half of your 3rd worst hole are subtracted, then
            the adjustment is applied to get your net score.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
