import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Lock } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAccessEnabled } from '../../hooks/useAdminAccessEnabled';
import { CallawayChartEditor } from './CallawayChartEditor';

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

  return <CallawayChartEditor />;
}
