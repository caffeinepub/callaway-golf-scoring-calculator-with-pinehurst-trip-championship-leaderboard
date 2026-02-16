import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings, ShieldCheck } from 'lucide-react';
import { isAdminAccessEnabled, setAdminAccessEnabled } from '../../state/adminAccess';

interface SettingsViewProps {
  onBack: () => void;
}

export function SettingsView({ onBack }: SettingsViewProps) {
  const [adminEnabled, setAdminEnabled] = useState(isAdminAccessEnabled());

  const handleAdminToggle = (checked: boolean) => {
    setAdminEnabled(checked);
    setAdminAccessEnabled(checked);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure application preferences</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Admin Access
          </CardTitle>
          <CardDescription>
            Enable or disable access to administrative features including the Callaway chart editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="admin-toggle" className="cursor-pointer">
              Enable Admin Access
            </Label>
            <Switch
              id="admin-toggle"
              checked={adminEnabled}
              onCheckedChange={handleAdminToggle}
            />
          </div>
          {adminEnabled && (
            <p className="text-sm text-muted-foreground mt-3">
              Admin features are now accessible. You can access the Admin screen from the header.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
