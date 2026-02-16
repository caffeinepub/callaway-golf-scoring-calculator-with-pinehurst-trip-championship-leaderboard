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
import { isPlaceholderCell, displayValueForCell, parseInputValue } from '../../lib/callaway/gridPlaceholders';

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

  const handleCellChange = (rowIndex: number, colIndex: number, field: 'grossScore' | 'worstHoles', value: string) => {
    setValidationError('');
    setSuccessMessage('');

    const parsedValue = parseInputValue(value);

    // Validate worstHoles (must be 0 or 0.5 increments)
    if (field === 'worstHoles' && parsedValue > 0) {
      if ((parsedValue * 2) % 1 !== 0) {
        setValidationError('Worst holes must be in 0.5 increments (e.g., 0.5, 1, 1.5, 2, etc.)');
        return;
      }
    }

    const newChart = { ...currentChart };
    newChart.grid = newChart.grid.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) =>
            cIdx === colIndex ? { ...cell, [field]: parsedValue } : cell
          )
        : row
    );
    setCurrentChart(newChart);
  };

  const handleAdjustmentChange = (colIndex: number, value: string) => {
    setValidationError('');
    setSuccessMessage('');

    const parsedValue = parseInputValue(value);

    const newChart = { ...currentChart };
    newChart.columnAdjustments = newChart.columnAdjustments.map((adj, idx) =>
      idx === colIndex ? parsedValue : adj
    );
    setCurrentChart(newChart);
  };

  const handleSave = () => {
    setValidationError('');
    setSuccessMessage('');

    const success = saveGridChartAsDefault(holeCount, currentChart);
    if (success) {
      setSuccessMessage('Chart saved successfully! Changes are now active and set as your default.');
    } else {
      setValidationError('Failed to save chart. Please check your data and try again.');
    }
  };

  const handleReset = () => {
    setValidationError('');
    setSuccessMessage('');

    const resetChart = resetGridChartToUserDefaults(holeCount);
    setCurrentChart(resetChart);
    setSuccessMessage('Chart reset to your saved defaults.');
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-primary" />
            <CardTitle>Callaway Chart Editor</CardTitle>
          </div>
          <CardDescription>
            Customize the Callaway scoring chart for your tournament. Changes are saved as both active and default settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="border-green-600 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as '18' | '9')}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="18">18-Hole Chart</TabsTrigger>
              <TabsTrigger value="9">9-Hole Chart</TabsTrigger>
            </TabsList>

            <TabsContent value="18" className="space-y-4">
              <ChartGridEditor
                chart={chart18}
                onCellChange={(row, col, field, value) => {
                  setActiveTab('18');
                  handleCellChange(row, col, field, value);
                }}
                onAdjustmentChange={(col, value) => {
                  setActiveTab('18');
                  handleAdjustmentChange(col, value);
                }}
              />
            </TabsContent>

            <TabsContent value="9" className="space-y-4">
              <ChartGridEditor
                chart={chart9}
                onCellChange={(row, col, field, value) => {
                  setActiveTab('9');
                  handleCellChange(row, col, field, value);
                }}
                onAdjustmentChange={(col, value) => {
                  setActiveTab('9');
                  handleAdjustmentChange(col, value);
                }}
              />
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>

          <div className="rounded-lg border border-muted bg-muted/30 p-4 text-sm text-muted-foreground">
            <p className="font-medium">Instructions:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Each cell contains a gross score and the number of worst holes to deduct</li>
              <li>Worst holes must be in 0.5 increments (0, 0.5, 1, 1.5, 2, etc.)</li>
              <li>Column adjustments are applied to the final net score calculation</li>
              <li>Empty cells (0, 0) are treated as placeholders and ignored in scoring</li>
              <li>Click "Save Changes" to persist your edits as both active and default settings</li>
              <li>Click "Reset to Defaults" to restore your last saved defaults</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ChartGridEditorProps {
  chart: GridChartData;
  onCellChange: (rowIndex: number, colIndex: number, field: 'grossScore' | 'worstHoles', value: string) => void;
  onAdjustmentChange: (colIndex: number, value: string) => void;
}

function ChartGridEditor({ chart, onCellChange, onAdjustmentChange }: ChartGridEditorProps) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-border bg-muted p-2 text-sm font-semibold">Row</th>
              {[1, 2, 3, 4, 5].map((col) => (
                <th key={col} className="border border-border bg-muted p-2 text-sm font-semibold" colSpan={2}>
                  Column {col}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border border-border bg-muted/50 p-2 text-xs">Adjustment</th>
              {chart.columnAdjustments.map((adj, idx) => (
                <th key={idx} className="border border-border bg-muted/50 p-2" colSpan={2}>
                  <Input
                    type="number"
                    value={adj}
                    onChange={(e) => onAdjustmentChange(idx, e.target.value)}
                    className="h-8 w-20 text-center text-xs"
                    step="1"
                  />
                </th>
              ))}
            </tr>
            <tr>
              <th className="border border-border bg-muted/50 p-2 text-xs">#</th>
              {[1, 2, 3, 4, 5].map((col) => (
                <>
                  <th key={`${col}-gross`} className="border border-border bg-muted/50 p-2 text-xs">
                    Gross
                  </th>
                  <th key={`${col}-worst`} className="border border-border bg-muted/50 p-2 text-xs">
                    Deduct
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-border bg-muted/30 p-2 text-center text-sm font-medium">
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => {
                  const isPlaceholder = isPlaceholderCell(cell);
                  return (
                    <>
                      <td key={`${rowIndex}-${colIndex}-gross`} className="border border-border p-1">
                        <Input
                          type="number"
                          value={displayValueForCell(cell.grossScore, isPlaceholder)}
                          onChange={(e) => onCellChange(rowIndex, colIndex, 'grossScore', e.target.value)}
                          className="h-9 w-20 text-center"
                          placeholder="0"
                          step="1"
                          min="0"
                        />
                      </td>
                      <td key={`${rowIndex}-${colIndex}-worst`} className="border border-border p-1">
                        <Input
                          type="number"
                          value={displayValueForCell(cell.worstHoles, isPlaceholder)}
                          onChange={(e) => onCellChange(rowIndex, colIndex, 'worstHoles', e.target.value)}
                          className="h-9 w-20 text-center"
                          placeholder="0"
                          step="0.5"
                          min="0"
                        />
                      </td>
                    </>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
