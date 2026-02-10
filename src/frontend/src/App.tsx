import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import AddEntryPage from './pages/AddEntryPage';
import CameraCapturePage from './pages/CameraCapturePage';
import HelperChatPage from './pages/HelperChatPage';
import LoginPage from './pages/LoginPage';
import InstallAppPage from './pages/InstallAppPage';
import HealthRecordsPage from './pages/HealthRecordsPage';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';

function RootLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const addEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-entry',
  component: AddEntryPage,
});

const cameraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/camera',
  component: CameraCapturePage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: HelperChatPage,
});

const installAppRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/install-app',
  component: InstallAppPage,
});

const healthRecordsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/health-records',
  component: HealthRecordsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  addEntryRoute,
  cameraRoute,
  chatRoute,
  installAppRoute,
  healthRecordsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  
  // Check if profile is complete (has name, bodyGoal, and all health metrics fields)
  const isProfileComplete = userProfile && 
    userProfile.name && 
    userProfile.heightCm !== undefined &&
    userProfile.age !== undefined &&
    userProfile.sex !== undefined &&
    userProfile.activityLevel !== undefined &&
    userProfile.bodyGoal &&
    userProfile.bodyGoal.goalType &&
    userProfile.bodyGoal.currentWeight > 0 &&
    userProfile.bodyGoal.targetWeight > 0 &&
    userProfile.bodyGoal.weeklyGoalSpeed > 0;
  
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && !isProfileComplete;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (showProfileSetup) {
    return <ProfileSetupDialog />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthGate>
      <RouterProvider router={router} />
    </AuthGate>
  );
}
