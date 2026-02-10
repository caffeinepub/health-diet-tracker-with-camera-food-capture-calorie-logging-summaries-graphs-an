import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Smartphone, Download, Settings, CheckCircle } from 'lucide-react';
import { APP_DISPLAY_NAME } from '../config/appBranding';

export default function InstallAppPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/' })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Install {APP_DISPLAY_NAME} App</h1>
          <p className="text-muted-foreground">Get the Android app for a native experience</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            About the Android App
          </CardTitle>
          <CardDescription>
            The {APP_DISPLAY_NAME} Android app is a packaged version of this web application that runs in a native WebView container.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Features:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Full access to all web app features including camera scanning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Native Android integration with proper permissions handling</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Secure Internet Identity authentication support</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Offline error handling and back button navigation</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            How to Install (Android)
          </CardTitle>
          <CardDescription>
            Follow these steps to install the app on your Android device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Get the APK File</h4>
                <p className="text-sm text-muted-foreground">
                  The APK file is provided by the app owner or can be built from the repository. Contact the app administrator to obtain the latest APK file.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Enable Installation from Unknown Sources</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  On your Android device, go to:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm space-y-1">
                  <p><strong>Settings</strong> → <strong>Security</strong> (or <strong>Apps</strong>)</p>
                  <p>→ Enable <strong>"Install unknown apps"</strong> or <strong>"Unknown sources"</strong></p>
                  <p>→ Allow installation from your file manager or browser</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Install the APK</h4>
                <p className="text-sm text-muted-foreground">
                  Locate the downloaded APK file in your device's Downloads folder or file manager. Tap the file and follow the on-screen prompts to install the app.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Open and Use</h4>
                <p className="text-sm text-muted-foreground">
                  Once installed, find {APP_DISPLAY_NAME} in your app drawer and tap to open. Sign in with Internet Identity to start tracking your nutrition.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold mb-1">Installation blocked?</p>
            <p className="text-muted-foreground">
              Make sure you've enabled "Install unknown apps" for the app you're using to install (e.g., Chrome, Files, Downloads).
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">Camera not working?</p>
            <p className="text-muted-foreground">
              Grant camera permission when prompted. You can also check app permissions in Settings → Apps → {APP_DISPLAY_NAME} → Permissions.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">App won't open?</p>
            <p className="text-muted-foreground">
              Ensure you have a stable internet connection. The app requires internet access to load the web application and authenticate.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Note: This app is distributed outside the Google Play Store. Only install APK files from trusted sources.
        </p>
      </div>
    </div>
  );
}
