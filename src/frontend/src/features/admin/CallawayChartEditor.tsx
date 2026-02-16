import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit3, Save, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  getActiveGridChart,
  saveGridChartAsDefault,
  resetGridChartToUserDefaults,
} from '../../lib/callaway/callawayChartPersistence';
import { type GridChartData } from '../../lib/callaway/callawayChart';

type HoleCount = 9 | 18;

export function CallawayChartEditor() {
  const [activeTab, setActiveTab] = useState<'18' | '9'>('18');
  const [chart18, setChart18] = useState<GridChartData>(getActiveGridChart(18));
  const [chart9, setChart9] = useState<GridChartData>(getActiveGridChart(9));
  const [validationError, setValidationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const currentChart = activeTab === '18' ? chart18 : chart9;
  const setCurrentChart = activeTab === '18' ? setChart18 : setChart9;
  const holeCount: HoleCount = activeTab === '18' ? 18 : 9;

  const handleCellChange = (row: number, col: number, field: 'grossScore' | 'worstHoles', value: string) => {
    const newChart = { ...currentChart };
    newChart.grid = newChart.grid.map((r, i) => (i === row ? [...r] : r));

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (field === 'worstHoles') {
        // Validate 0.5 increments
        if ((numValue * 2) % 1 === 0 && numValue >= 0) {
          newChart.grid[row][col] = { ...newChart.grid[row][col], [field]: numValue };
        }
      } else {
        newChart.grid[row][col] = { ...newChart.grid[row][col], [field]: Math.round(numValue) };
      }
    }

    setCurrentChart(newChart);
    setValidationError('');
    setSuccessMessage('');
  };

  const handleAdjustmentChange = (col: number, value: string) => {
    const newChart = { ...currentChart };
    newChart.columnAdjustments = [...newChart.columnAdjustments];

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      newChart.columnAdjustments[col] = numValue;
    }

    setCurrentChart(newChart);
    setValidationError('');
    setSuccessMessage('');
  };

  const validateCurrentChart = (): string | null => {
    if (!currentChart.grid || currentChart.grid.length !== 13) {
      return 'Chart must have exactly 13 rows';
    }

    for (let row = 0; row < 13; row++) {
      if (currentChart.grid[row].length !== 5) {
        return `Row ${row + 1} must have exactly 5 columns`;
      }

      for (let col = 0; col < 5; col++) {
        const cell = currentChart.grid[row][col];

        if (typeof cell.grossScore !== 'number' || cell.grossScore < 0) {
          return `Row ${row + 1}, Column ${col + 1}: Gross score must be a non-negative number`;
        }

        if (typeof cell.worstHoles !== 'number' || cell.worstHoles < 0) {
          return `Row ${row + 1}, Column ${col + 1}: Worst holes must be a non-negative number`;
        }

        // Validate 0.5 increments
        if ((cell.worstHoles * 2) % 1 !== 0) {
          return `Row ${row + 1}, Column ${col + 1}: Worst holes must be in 0.5 increments (e.g., 0, 0.5, 1, 1.5, 2, ...)`;
        }
      }
    }

    if (currentChart.columnAdjustments.length !== 5) {
      return 'Must have exactly 5 column adjustments';
    }

    for (let col = 0; col < 5; col++) {
      if (typeof currentChart.columnAdjustments[col] !== 'number') {
        return `Column ${col + 1} adjustment must be a number`;
      }
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

    const success = saveGridChartAsDefault(holeCount, currentChart);
    if (success) {
      setSuccessMessage(`${holeCount}-hole chart saved successfully! These values are now your defaults.`);
      setValidationError('');
    } else {
      setValidationError('Failed to save chart. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleReset = () => {
    if (confirm(`Reset ${holeCount}-hole chart to your saved defaults?`)) {
      const userDefaultChart = resetGridChartToUserDefaults(holeCount);
      setCurrentChart(userDefaultChart);
      setSuccessMessage(`${holeCount}-hole chart reset to your saved defaults`);
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
          Edit the Callaway scoring charts for 9-hole and 18-hole rounds. The grid shows gross scores with their corresponding worst holes to deduct. Each column has an adjustment that applies to all scores in that column.
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
            <ChartGrid
              chart={chart18}
              onCellChange={(row, col, field, value) => handleCellChange(row, col, field, value)}
              onAdjustmentChange={(col, value) => handleAdjustmentChange(col, value)}
            />
          </TabsContent>

          <TabsContent value="9" className="space-y-4">
            <ChartGrid
              chart={chart9}
              onCellChange={(row, col, field, value) => handleCellChange(row, col, field, value)}
              onAdjustmentChange={(col, value) => handleAdjustmentChange(col, value)}
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
            <li>Each cell contains a gross score and the number of worst holes to deduct</li>
            <li>Worst holes can be entered in 0.5 increments (e.g., 0, 0.5, 1, 1.5, 2, 2.5, etc.)</li>
            <li>Each column has an adjustment value that applies to all scores in that column</li>
            <li>Adjustments are typically 0 or negative (e.g., -1, -2)</li>
            <li>The grid is 13 rows by 5 columns for both 9-hole and 18-hole charts</li>
            <li><strong>Saving changes</strong> will make these values your new defaults</li>
            <li><strong>Reset to Defaults</strong> will restore your last saved defaults</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChartGridProps {
  chart: GridChartData;
  onCellChange: (row: number, col: number, field: 'grossScore' | 'worstHoles', value: string) => void;
  onAdjustmentChange: (col: number, value: string) => void;
}

function ChartGrid({ chart, onCellChange, onAdjustmentChange }: ChartGridProps) {
  return (
    <div className="space-y-4">
      {/* Column Adjustments */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-sm font-semibold mb-3 block">Column Adjustments</Label>
        <div className="grid grid-cols-5 gap-3">
          {chart.columnAdjustments.map((adj, col) => (
            <div key={col} className="space-y-1">
              <Label className="text-xs text-muted-foreground">Col {col + 1}</Label>
              <Input
                type="number"
                value={adj}
                onChange={(e) => onAdjustmentChange(col, e.target.value)}
                className="text-center font-medium"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border p-2 text-xs font-semibold text-muted-foreground w-16">Row</th>
                {[1, 2, 3, 4, 5].map((col) => (
                  <th key={col} className="border p-2 text-xs font-semibold text-center" colSpan={2}>
                    Column {col}
                  </th>
                ))}
              </tr>
              <tr className="bg-muted/30">
                <th className="border p-1"></th>
                {[1, 2, 3, 4, 5].map((col) => (
                  <>
                    <th key={`${col}-gross`} className="border p-1 text-xs text-muted-foreground">
                      Gross
                    </th>
                    <th key={`${col}-worst`} className="border p-1 text-xs text-muted-foreground">
                      Worst
                    </th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border p-2 text-center font-medium text-sm bg-muted/20">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, colIndex) => (
                    <>
                      <td key={`${rowIndex}-${colIndex}-gross`} className="border p-1">
                        <Input
                          type="number"
                          value={cell.grossScore}
                          onChange={(e) => onCellChange(rowIndex, colIndex, 'grossScore', e.target.value)}
                          className="w-16 h-8 text-center text-sm"
                          min="0"
                        />
                      </td>
                      <td key={`${rowIndex}-${colIndex}-worst`} className="border p-1">
                        <Input
                          type="number"
                          value={cell.worstHoles}
                          onChange={(e) => onCellChange(rowIndex, colIndex, 'worstHoles', e.target.value)}
                          className="w-16 h-8 text-center text-sm"
                          min="0"
                          step="0.5"
                        />
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
