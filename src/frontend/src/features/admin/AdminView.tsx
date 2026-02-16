import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, Settings as SettingsIcon } from 'lucide-react';
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

      <CallawayChartEditor />
    </div>
  );
}
