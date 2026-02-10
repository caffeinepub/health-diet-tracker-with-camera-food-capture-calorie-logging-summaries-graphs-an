import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { Button } from '@/components/ui/button';
import { Leaf, LayoutDashboard, Plus, Camera, MessageCircle } from 'lucide-react';
import LoginButton from '../auth/LoginButton';

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
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">NutriScan</span>
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
