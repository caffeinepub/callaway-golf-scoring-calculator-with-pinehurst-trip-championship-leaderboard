import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getChart } from '../../lib/callaway/callawayChart';
import { BookOpen } from 'lucide-react';

interface CallawayChartSectionProps {
  holeCount: 9 | 18;
}

export function CallawayChartSection({ holeCount }: CallawayChartSectionProps) {
  const chart = getChart(holeCount);

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Callaway Scoring Chart ({holeCount} Holes)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gross Score Range</TableHead>
                <TableHead className="text-center">Worst Holes Deducted</TableHead>
                <TableHead className="text-center">Adjustment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chart.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{entry.grossRange}</TableCell>
                  <TableCell className="text-center">{entry.worstHoles}</TableCell>
                  <TableCell className="text-center">
                    {entry.adjustment === 0 ? '0' : entry.adjustment}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 bg-muted/30 text-sm text-muted-foreground">
          <p className="font-medium mb-2">How Callaway Scoring Works:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Your gross score determines which chart row applies</li>
            <li>The worst holes (highest scores) are summed for the deduction</li>
            <li>The chart adjustment is applied (typically 0 or -2)</li>
            <li>Net Score = Gross - Deduction + Adjustment</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
