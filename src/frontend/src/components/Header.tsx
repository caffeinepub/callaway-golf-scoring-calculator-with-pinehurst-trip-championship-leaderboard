import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Settings, ShieldCheck, RotateCcw } from 'lucide-react';
import { useAdminAccessEnabled } from '../hooks/useAdminAccessEnabled';

interface HeaderProps {
  title: string;
  currentStep: number;
  onStartOver: () => void;
}

export function Header({ title, currentStep, onStartOver }: HeaderProps) {
  const navigate = useNavigate();
  const showAdminAccess = useAdminAccessEnabled();

  const handleSettingsClick = () => {
    navigate({ to: '/settings' });
  };

  const handleAdminClick = () => {
    navigate({ to: '/admin' });
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-bold text-foreground">{title}</h1>
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onStartOver}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Start Over
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showAdminAccess && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdminClick}
                className="gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettingsClick}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
