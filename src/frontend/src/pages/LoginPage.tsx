import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <img 
              src="/assets/generated/app-logo-s.dim_512x512.png" 
              alt="Calorieshivam Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Calorieshivam</h1>
          <p className="text-lg text-muted-foreground">
            Track your nutrition with smart food scanning
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Scan food with your camera, track calories and macros, and get personalized insights
          </p>
          
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full"
          >
            {isLoggingIn ? 'Connecting...' : 'Sign In to Get Started'}
          </Button>
        </div>

        <div className="pt-8 text-xs text-muted-foreground">
          <p>Secure authentication powered by Internet Identity</p>
        </div>
      </div>
    </div>
  );
}
