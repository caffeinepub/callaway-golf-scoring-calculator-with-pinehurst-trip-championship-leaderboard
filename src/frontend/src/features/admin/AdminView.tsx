import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Lock } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAccessEnabled } from '../../hooks/useAdminAccessEnabled';

export function AdminView() {
  const navigate = useNavigate();
  const isAdminEnabled = useAdminAccessEnabled();

  if (!isAdminEnabled) {
    return (
      <div className="container mx-auto max-w-2xl space-y-6 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-muted-foreground" />
              <CardTitle>Admin Access Disabled</CardTitle>
            </div>
            <CardDescription>
              Admin features are currently disabled. Enable admin access in Settings to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/settings' })} className="gap-2">
              <Settings className="h-4 w-4" />
              Go to Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>
            The Callaway scoring chart is now managed by the backend system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-muted bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Chart editing has been moved to the backend. The scoring chart is now
              centrally managed and automatically applied to all calculations. Contact your system administrator
              to request chart modifications.
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/' })} variant="outline">
            Return to Main App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
