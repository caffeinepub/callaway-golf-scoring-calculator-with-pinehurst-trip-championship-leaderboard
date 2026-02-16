import { useState } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventSetupForm } from './features/eventSetup/EventSetupForm';
import { GolferScoreEntryList } from './features/scoreEntry/GolferScoreEntryList';
import { LeaderboardView } from './features/leaderboard/LeaderboardView';
import { SettingsView } from './features/settings/SettingsView';
import { AdminView } from './features/admin/AdminView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { validateGolferData } from './features/scoreEntry/validation';
import { calculateCallaway } from './lib/callaway/callaway';
import type { EventSetup, GolferData, CallawayResultData } from './state/eventTypes';

const queryClient = new QueryClient();

// Scoring flow context
interface ScoringFlowContextType {
  currentStep: number;
  eventSetup: EventSetup;
  golfers: GolferData[];
  results: CallawayResultData[];
  handleEventSetup: (setup: EventSetup) => void;
  handleScoresComplete: () => void;
  handleStartOver: () => void;
  setGolfers: (golfers: GolferData[]) => void;
}

// Root layout with Header and Footer
function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Outlet />
      <Footer />
    </div>
  );
}

// Main scoring flow component
function ScoringFlow() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [eventSetup, setEventSetup] = useState<EventSetup>({
    title: '',
    courseName: '',
    golferCount: 4,
    holeCount: 18,
    coursePar: 72,
  });
  const [golfers, setGolfers] = useState<GolferData[]>([]);
  const [results, setResults] = useState<CallawayResultData[]>([]);

  const handleEventSetup = (setup: EventSetup) => {
    setEventSetup(setup);
    const initialGolfers: GolferData[] = Array.from({ length: setup.golferCount }, (_, i) => ({
      id: `golfer-${i + 1}`,
      name: '',
      holeScores: Array(setup.holeCount).fill(''),
    }));
    setGolfers(initialGolfers);
    setCurrentStep(2);
  };

  const handleScoresComplete = () => {
    // Validate all golfers
    for (const golfer of golfers) {
      const error = validateGolferData(golfer, eventSetup.holeCount);
      if (error) {
        alert(error);
        return;
      }
    }

    // Calculate results for each golfer
    const calculatedResults: CallawayResultData[] = golfers.map((golfer) => {
      const holeScores = golfer.holeScores.map((score) => parseInt(score, 10));
      const callawayResult = calculateCallaway(holeScores, eventSetup.coursePar, eventSetup.holeCount);
      
      return {
        id: golfer.id,
        name: golfer.name,
        gross: callawayResult.gross,
        deduction: callawayResult.deduction,
        adjustment: callawayResult.adjustment,
        net: callawayResult.net,
        chartRowLabel: callawayResult.chartRowLabel,
        worstHolesUsed: callawayResult.worstHolesUsed,
      };
    });

    setResults(calculatedResults);
    setCurrentStep(3);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setEventSetup({
      title: '',
      courseName: '',
      golferCount: 4,
      holeCount: 18,
      coursePar: 72,
    });
    setGolfers([]);
    setResults([]);
  };

  const displayTitle = eventSetup.title.trim() || 'Callaway Scoring System';

  return (
    <>
      <Header title={displayTitle} currentStep={currentStep} onStartOver={handleStartOver} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {currentStep === 1 && <EventSetupForm onComplete={handleEventSetup} />}
        {currentStep === 2 && (
          <GolferScoreEntryList
            golfers={golfers}
            holeCount={eventSetup.holeCount}
            onUpdate={setGolfers}
          />
        )}
        {currentStep === 2 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleScoresComplete}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Calculate Results
            </button>
          </div>
        )}
        {currentStep === 3 && (
          <LeaderboardView
            title={eventSetup.title}
            courseName={eventSetup.courseName}
            results={results}
            coursePar={eventSetup.coursePar}
            holeCount={eventSetup.holeCount}
          />
        )}
      </main>
    </>
  );
}

// Settings route wrapper
function SettingsRoute() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate({ to: '/' });
  };

  return (
    <>
      <Header title="Callaway Scoring System" currentStep={0} onStartOver={() => {}} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <SettingsView onBack={handleBack} />
      </main>
    </>
  );
}

// Admin route wrapper
function AdminRoute() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate({ to: '/' });
  };

  const handleOpenSettings = () => {
    navigate({ to: '/settings' });
  };

  return (
    <>
      <Header title="Callaway Scoring System" currentStep={0} onStartOver={() => {}} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <AdminView onBack={handleBack} onOpenSettings={handleOpenSettings} />
      </main>
    </>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Index route (main scoring flow)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ScoringFlow,
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsRoute,
});

// Admin route
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminRoute,
});

const routeTree = rootRoute.addChildren([indexRoute, settingsRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
