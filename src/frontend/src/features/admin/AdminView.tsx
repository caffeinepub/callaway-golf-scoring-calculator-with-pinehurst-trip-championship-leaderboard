import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, Settings as SettingsIcon, Info, Code2 } from 'lucide-react';
import { isAdminAccessEnabled } from '../../state/adminAccess';
import { CallawayChartEditor } from './CallawayChartEditor';

interface AdminViewProps {
  onBack: () => void;
  onOpenSettings: () => void;
}

export function AdminView({ onBack, onOpenSettings }: AdminViewProps) {
  const [hasAccess, setHasAccess] = useState(isAdminAccessEnabled());

  useEffect(() => {
    // Check access on mount and when returning to this view
    setHasAccess(isAdminAccessEnabled());
  }, []);

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Admin access is disabled in Settings. Please enable Admin Access to use this feature.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              This area contains administrative features that are currently disabled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To access the Admin screen and chart editor, you need to enable Admin Access in Settings.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button onClick={onOpenSettings} className="gap-2">
                <SettingsIcon className="h-4 w-4" />
                Open Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage Callaway scoring charts and system configuration
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Chart edits made here affect all score calculations immediately, even though the scoring chart display is hidden from the leaderboard view.
        </AlertDescription>
      </Alert>

      <Alert className="border-primary/50 bg-primary/5">
        <Code2 className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">Developer Note: Editing Chart Defaults in Code</p>
            <p className="text-sm">
              Default chart values are defined in:
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>
                <code className="text-xs bg-muted px-1 py-0.5 rounded">frontend/src/lib/callaway/callawayChartPersistence.ts</code>
                <br />
                <span className="text-muted-foreground">Functions: <code className="text-xs">getDefault18GridChart()</code> and <code className="text-xs">getDefault9GridChart()</code></span>
              </li>
              <li>
                <code className="text-xs bg-muted px-1 py-0.5 rounded">frontend/src/lib/callaway/callawayChart.ts</code>
                <br />
                <span className="text-muted-foreground">Constants: <code className="text-xs">CALLAWAY_CHART_18</code> and <code className="text-xs">CALLAWAY_CHART_9</code> (legacy format)</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Important:</strong> The app uses the persisted chart from localStorage (<code className="text-xs">callaway-grid-chart-18</code> and <code className="text-xs">callaway-grid-chart-9</code>) when present. 
              Code changes to defaults will not appear until you click <strong>"Reset to Defaults"</strong> below or clear localStorage.
            </p>
            <p className="text-sm text-muted-foreground">
              See <code className="text-xs">frontend/docs/callaway-chart-defaults.md</code> for detailed instructions.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <CallawayChartEditor />
    </div>
  );
}
