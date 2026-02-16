import { useState, useEffect } from 'react';
import { EventSetupForm } from './features/eventSetup/EventSetupForm';
import { GolferScoreEntryList } from './features/scoreEntry/GolferScoreEntryList';
import { LeaderboardView } from './features/leaderboard/LeaderboardView';
import { SettingsView } from './features/settings/SettingsView';
import { AdminView } from './features/admin/AdminView';
import { type EventSetup, type GolferData, type CallawayResultData } from './state/eventTypes';
import { calculateCallaway } from './lib/callaway/callaway';
import { validateGolferData } from './features/scoreEntry/validation';
import { isAdminAccessEnabled } from './state/adminAccess';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Trophy, Settings, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type AppStep = 'setup' | 'entry' | 'leaderboard' | 'settings' | 'admin';

function App() {
  const [step, setStep] = useState<AppStep>('setup');
  const [eventSetup, setEventSetup] = useState<EventSetup | null>(null);
  const [golfers, setGolfers] = useState<GolferData[]>([]);
  const [results, setResults] = useState<CallawayResultData[]>([]);
  const [calculationError, setCalculationError] = useState<string>('');
  const [adminAccessEnabled, setAdminAccessEnabled] = useState(isAdminAccessEnabled());

  // Check admin access state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAdminAccessEnabled(isAdminAccessEnabled());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSetupComplete = (setup: EventSetup) => {
    setEventSetup(setup);
    // Initialize golfer data
    const initialGolfers: GolferData[] = Array.from({ length: setup.golferCount }, (_, i) => ({
      id: `golfer-${i + 1}`,
      name: '',
      holeScores: Array(setup.holeCount).fill(''),
    }));
    setGolfers(initialGolfers);
    setStep('entry');
  };

  const handleGolfersUpdate = (updatedGolfers: GolferData[]) => {
    setGolfers(updatedGolfers);
  };

  const handleCalculate = () => {
    if (!eventSetup) return;

    setCalculationError('');

    // Validate all golfers
    const validationErrors: string[] = [];
    golfers.forEach((golfer, index) => {
      const error = validateGolferData(golfer, eventSetup.holeCount);
      if (error) {
        validationErrors.push(`Golfer ${index + 1}: ${error}`);
      }
    });

    if (validationErrors.length > 0) {
      setCalculationError(validationErrors.join('\n'));
      return;
    }

    // Calculate Callaway scores
    try {
      const calculatedResults = golfers.map((golfer) => {
        const scores = golfer.holeScores.map((s) => parseInt(s, 10));
        const result = calculateCallaway(scores, eventSetup.coursePar, eventSetup.holeCount);
        return {
          id: golfer.id,
          name: golfer.name,
          gross: result.gross,
          deduction: result.deduction,
          adjustment: result.adjustment,
          net: result.net,
          chartRowLabel: result.chartRowLabel,
          worstHolesUsed: result.worstHolesUsed,
        };
      });

      setResults(calculatedResults);
      setStep('leaderboard');
    } catch (error) {
      setCalculationError(
        error instanceof Error ? error.message : 'An error occurred during calculation'
      );
    }
  };

  const handleStartOver = () => {
    setStep('setup');
    setEventSetup(null);
    setGolfers([]);
    setResults([]);
    setCalculationError('');
  };

  const handleOpenSettings = () => {
    setStep('settings');
  };

  const handleOpenAdmin = () => {
    setStep('admin');
  };

  const handleBackFromSettings = () => {
    setStep(eventSetup ? 'leaderboard' : 'setup');
  };

  const handleBackFromAdmin = () => {
    setStep(eventSetup ? 'leaderboard' : 'setup');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">
                  {eventSetup?.title || 'Callaway Golf Scoring'}
                </h1>
                <p className="text-sm text-muted-foreground">Professional Tournament Scoring System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {adminAccessEnabled && step !== 'admin' && (
                <Button variant="outline" onClick={handleOpenAdmin} className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Button>
              )}
              {step !== 'settings' && (
                <Button variant="outline" onClick={handleOpenSettings} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              )}
              {step !== 'setup' && step !== 'settings' && step !== 'admin' && (
                <Button variant="outline" onClick={handleStartOver} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Start Over
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {step === 'setup' && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-6">
              <EventSetupForm onComplete={handleSetupComplete} />
            </Card>
          </div>
        )}

        {step === 'entry' && eventSetup && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Enter Scores</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Record gross scores for each hole ({eventSetup.holeCount} holes, Par {eventSetup.coursePar})
                </p>
              </div>
            </div>

            {calculationError && (
              <Alert variant="destructive">
                <AlertDescription className="whitespace-pre-line">{calculationError}</AlertDescription>
              </Alert>
            )}

            <GolferScoreEntryList
              golfers={golfers}
              holeCount={eventSetup.holeCount}
              onUpdate={handleGolfersUpdate}
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep('setup')}>
                Back to Setup
              </Button>
              <Button onClick={handleCalculate} size="lg" className="gap-2">
                <Trophy className="h-4 w-4" />
                Calculate Results
              </Button>
            </div>
          </div>
        )}

        {step === 'leaderboard' && eventSetup && (
          <LeaderboardView
            title={eventSetup.title}
            results={results}
            coursePar={eventSetup.coursePar}
            holeCount={eventSetup.holeCount}
          />
        )}

        {step === 'settings' && (
          <SettingsView onBack={handleBackFromSettings} />
        )}

        {step === 'admin' && (
          <AdminView onBack={handleBackFromAdmin} onOpenSettings={handleOpenSettings} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'callaway-golf-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
