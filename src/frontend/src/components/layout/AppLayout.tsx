import { ReactNode, useEffect } from 'react';
import AppHeader from './AppHeader';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { APP_DISPLAY_NAME } from '../../config/appBranding';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  useEffect(() => {
    document.title = APP_DISPLAY_NAME;
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {APP_DISPLAY_NAME}. Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'calorieshivam-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
