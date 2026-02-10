import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Plus, Camera, MessageCircle, Smartphone, Activity } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import { APP_DISPLAY_NAME } from '../../config/appBranding';

export default function AppHeader() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/generated/app-logo-s.dim_512x512.png" 
                  alt={`${APP_DISPLAY_NAME} Logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">{APP_DISPLAY_NAME}</span>
            </button>

            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/' })}
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/add-entry' })}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/camera' })}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                Scan Food
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/chat' })}
                className="gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Helper
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/health-records' })}
                className="gap-2"
              >
                <Activity className="w-4 h-4" />
                Health Records
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/install-app' })}
                className="gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Install App
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {userProfile && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {userProfile.name}
              </span>
            )}
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}
