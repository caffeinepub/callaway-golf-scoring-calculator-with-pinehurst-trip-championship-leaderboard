import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getActiveGridChart, gridToLegacyChart } from '../../lib/callaway/callawayChartPersistence';

interface CallawayChartSectionProps {
  holeCount: 9 | 18;
}

export function CallawayChartSection({ holeCount }: CallawayChartSectionProps) {
  // Load the locally editable chart
  const gridChart = getActiveGridChart(holeCount);
  const chartEntries = gridToLegacyChart(gridChart);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Callaway Scoring Chart</CardTitle>
        <CardDescription>
          The chart used for calculating handicaps in this tournament ({holeCount} holes)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Gross Score</TableHead>
                <TableHead className="font-semibold">Worst Holes</TableHead>
                <TableHead className="font-semibold">Adjustment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{entry.grossRange}</TableCell>
                  <TableCell>{entry.worstHoles}</TableCell>
                  <TableCell>{entry.adjustment > 0 ? `+${entry.adjustment}` : entry.adjustment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
