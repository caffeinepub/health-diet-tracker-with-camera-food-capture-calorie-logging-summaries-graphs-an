import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import AddEntryPage from './pages/AddEntryPage';
import CameraCapturePage from './pages/CameraCapturePage';
import HelperChatPage from './pages/HelperChatPage';
import LoginPage from './pages/LoginPage';
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

const routeTree = rootRoute.addChildren([indexRoute, addEntryRoute, cameraRoute, chatRoute]);

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
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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

  return (
    <>
      {children}
      {showProfileSetup && <ProfileSetupDialog />}
    </>
  );
}

export default function App() {
  return (
    <AuthGate>
      <RouterProvider router={router} />
    </AuthGate>
  );
}
