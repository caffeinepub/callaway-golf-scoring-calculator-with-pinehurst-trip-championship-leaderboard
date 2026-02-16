import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getChart } from '../../lib/callaway/callawayChartPersistence';
import { isPlaceholderCell, displayValueForCell } from '../../lib/callaway/gridPlaceholders';
import { getActiveGridChart } from '../../lib/callaway/callawayChartPersistence';

interface CallawayChartSectionProps {
  holeCount: 9 | 18;
}

export function CallawayChartSection({ holeCount }: CallawayChartSectionProps) {
  const gridChart = getActiveGridChart(holeCount);
  const chart = getChart(holeCount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Callaway Scoring Chart ({holeCount} Holes)</CardTitle>
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
                <TableHead className="text-center">Row</TableHead>
                {[1, 2, 3, 4, 5].map((col) => (
                  <TableHead key={col} className="text-center" colSpan={2}>
                    Col {col} (Adj: {gridChart.columnAdjustments[col - 1] >= 0 ? '+' : ''}{gridChart.columnAdjustments[col - 1]})
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableHead className="text-center">#</TableHead>
                {[1, 2, 3, 4, 5].map((col) => (
                  <>
                    <TableHead key={`${col}-gross`} className="text-center text-xs">
                      Gross
                    </TableHead>
                    <TableHead key={`${col}-deduct`} className="text-center text-xs">
                      Deduct
                    </TableHead>
                  </>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {gridChart.grid.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="text-center font-medium">{rowIndex + 1}</TableCell>
                  {row.map((cell, colIndex) => {
                    const isPlaceholder = isPlaceholderCell(cell);
                    return (
                      <>
                        <TableCell key={`${rowIndex}-${colIndex}-gross`} className="text-center">
                          {displayValueForCell(cell.grossScore, isPlaceholder)}
                        </TableCell>
                        <TableCell key={`${rowIndex}-${colIndex}-deduct`} className="text-center">
                          {displayValueForCell(cell.worstHoles, isPlaceholder)}
                        </TableCell>
                      </>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>How it works:</strong> Find your gross score in the table. The corresponding "Deduct" value shows
            how many of your worst holes will be subtracted from your score. The column adjustment is then applied to
            calculate your final net score.
          </p>
          <p>
            <strong>Example:</strong> If you shoot 95 with a par of 72, the chart shows you deduct 2.5 worst holes
            with a column adjustment. Your worst 2 full holes plus half of your 3rd worst hole are subtracted, then
            the adjustment is applied to get your net score.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
