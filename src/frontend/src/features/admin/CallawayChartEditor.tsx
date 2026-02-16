import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit3, Save, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  getActiveChart,
  getDefaultChart,
  saveEditedChart,
  resetChartToDefaults,
  formatChartRowLabel,
} from '../../lib/callaway/callawayChartPersistence';
import { type CallawayChartEntry } from '../../lib/callaway/callawayChart';

type HoleCount = 9 | 18;

export function CallawayChartEditor() {
  const [activeTab, setActiveTab] = useState<'18' | '9'>('18');
  const [chart18, setChart18] = useState<CallawayChartEntry[]>(getActiveChart(18));
  const [chart9, setChart9] = useState<CallawayChartEntry[]>(getActiveChart(9));
  const [validationError, setValidationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const currentChart = activeTab === '18' ? chart18 : chart9;
  const setCurrentChart = activeTab === '18' ? setChart18 : setChart9;
  const holeCount: HoleCount = activeTab === '18' ? 18 : 9;

  const handleFieldChange = (index: number, field: keyof CallawayChartEntry, value: string) => {
    const newChart = [...currentChart];
    const entry = { ...newChart[index] };

    if (field === 'lowerBound' || field === 'worstHoles' || field === 'adjustment') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        entry[field] = numValue;
      }
    } else if (field === 'upperBound') {
      if (value === '' || value === 'null') {
        entry.upperBound = null;
      } else {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          entry.upperBound = numValue;
        }
      }
    }

    // Update grossRange label
    entry.grossRange = formatChartRowLabel(entry.lowerBound, entry.upperBound);

    newChart[index] = entry;
    setCurrentChart(newChart);
    setValidationError('');
    setSuccessMessage('');
  };

  const validateCurrentChart = (): string | null => {
    if (currentChart.length === 0) {
      return 'Chart cannot be empty';
    }

    for (let i = 0; i < currentChart.length; i++) {
      const entry = currentChart[i];

      // Check numeric validity
      if (typeof entry.lowerBound !== 'number' || entry.lowerBound < 0) {
        return `Row ${i + 1}: Lower bound must be a non-negative number`;
      }

      if (typeof entry.worstHoles !== 'number' || entry.worstHoles < 0) {
        return `Row ${i + 1}: Worst holes must be a non-negative number`;
      }

      if (typeof entry.adjustment !== 'number') {
        return `Row ${i + 1}: Adjustment must be a number`;
      }

      // Check upperBound validity
      if (entry.upperBound !== null) {
        if (typeof entry.upperBound !== 'number' || entry.upperBound < 0) {
          return `Row ${i + 1}: Upper bound must be a non-negative number or empty for open-ended`;
        }

        if (entry.lowerBound > entry.upperBound) {
          return `Row ${i + 1}: Lower bound cannot be greater than upper bound`;
        }
      }

      // Check ordering
      if (i > 0 && entry.lowerBound < currentChart[i - 1].lowerBound) {
        return `Row ${i + 1}: Rows must be ordered by increasing lower bound`;
      }

      // Check for gaps or overlaps
      if (i > 0) {
        const prevEntry = currentChart[i - 1];
        if (prevEntry.upperBound !== null && entry.lowerBound <= prevEntry.upperBound) {
          return `Row ${i + 1}: Overlaps with previous row`;
        }
      }
    }

    // Last row should have null upperBound
    if (currentChart[currentChart.length - 1].upperBound !== null) {
      return 'Last row should have no upper limit (leave upper bound empty)';
    }

    return null;
  };

  const handleSave = () => {
    const error = validateCurrentChart();
    if (error) {
      setValidationError(error);
      setSuccessMessage('');
      return;
    }

    const success = saveEditedChart(holeCount, currentChart);
    if (success) {
      setSuccessMessage(`${holeCount}-hole chart saved successfully!`);
      setValidationError('');
    } else {
      setValidationError('Failed to save chart. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleReset = () => {
    if (confirm(`Reset ${holeCount}-hole chart to default values?`)) {
      resetChartToDefaults(holeCount);
      const defaultChart = getDefaultChart(holeCount);
      setCurrentChart(defaultChart);
      setSuccessMessage(`${holeCount}-hole chart reset to defaults`);
      setValidationError('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Callaway Chart Editor
        </CardTitle>
        <CardDescription>
          Edit the Callaway scoring charts for 9-hole and 18-hole rounds. Changes will be applied to all future calculations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as '18' | '9')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="18">18-Hole Chart</TabsTrigger>
            <TabsTrigger value="9">9-Hole Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="18" className="space-y-4">
            <ChartTable
              chart={chart18}
              onFieldChange={(index, field, value) => handleFieldChange(index, field, value)}
            />
          </TabsContent>

          <TabsContent value="9" className="space-y-4">
            <ChartTable
              chart={chart9}
              onFieldChange={(index, field, value) => handleFieldChange(index, field, value)}
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-1 pt-2">
          <p className="font-medium">Editing Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Lower bound: Starting gross score for this range</li>
            <li>Upper bound: Ending gross score (leave empty for last row to make it open-ended)</li>
            <li>Worst holes: Number of highest-scoring holes to deduct</li>
            <li>Adjustment: Additional score adjustment (typically 0 or negative)</li>
            <li>Rows must be ordered by increasing lower bound with no overlaps</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChartTableProps {
  chart: CallawayChartEntry[];
  onFieldChange: (index: number, field: keyof CallawayChartEntry, value: string) => void;
}

function ChartTable({ chart, onFieldChange }: ChartTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Row</TableHead>
            <TableHead>Lower Bound</TableHead>
            <TableHead>Upper Bound</TableHead>
            <TableHead>Worst Holes</TableHead>
            <TableHead>Adjustment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chart.map((entry, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={entry.lowerBound}
                  onChange={(e) => onFieldChange(index, 'lowerBound', e.target.value)}
                  className="w-24"
                  min="0"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={entry.upperBound === null ? '' : entry.upperBound}
                  onChange={(e) => onFieldChange(index, 'upperBound', e.target.value)}
                  placeholder="(none)"
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={entry.worstHoles}
                  onChange={(e) => onFieldChange(index, 'worstHoles', e.target.value)}
                  className="w-24"
                  min="0"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={entry.adjustment}
                  onChange={(e) => onFieldChange(index, 'adjustment', e.target.value)}
                  className="w-24"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
