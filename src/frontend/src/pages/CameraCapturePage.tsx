import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCamera } from '../camera/useCamera';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, RotateCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CapturedPhotoPreview from '../components/camera/CapturedPhotoPreview';
import EstimationConfirmationStep from '../components/entries/EstimationConfirmationStep';

export default function CameraCapturePage() {
  const navigate = useNavigate();
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
  const [showEstimation, setShowEstimation] = useState(false);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    width: 1920,
    height: 1080,
    quality: 0.9,
  });

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    return () => {
      if (isActive) {
        stopCamera();
      }
    };
  }, [isActive, stopCamera]);

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      setCapturedPhoto(photo);
      await stopCamera();
    }
  };

  const handleRetake = async () => {
    setCapturedPhoto(null);
    setShowEstimation(false);
    await startCamera();
  };

  const handleProceedToEstimation = () => {
    setShowEstimation(true);
  };

  const handleEstimationComplete = () => {
    navigate({ to: '/' });
  };

  if (isSupported === false) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Camera Not Supported</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your browser or device does not support camera access. Please try using a different browser or device.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showEstimation && capturedPhoto) {
    return (
      <EstimationConfirmationStep
        capturedPhoto={capturedPhoto}
        onComplete={handleEstimationComplete}
        onCancel={handleRetake}
      />
    );
  }

  if (capturedPhoto) {
    return (
      <CapturedPhotoPreview
        photo={capturedPhoto}
        onRetake={handleRetake}
        onProceed={handleProceedToEstimation}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan Food</h1>
          <p className="text-muted-foreground">Capture a photo to estimate nutrition</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {error.message}
              {error.type === 'permission' && ' Please allow camera access in your browser settings.'}
            </span>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="relative w-full aspect-[9/16] max-h-[70vh] min-h-[400px] bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {isActive && (
              <img
                src="/assets/generated/scan-frame-overlay.dim_1080x1920.png"
                alt="Scan frame"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
            )}

            {!isActive && !isLoading && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white space-y-4">
                  <Camera className="w-16 h-16 mx-auto opacity-50" />
                  <p>Initializing camera...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-4 justify-center">
            {error && (
              <Button onClick={retry} disabled={isLoading} size="lg">
                <RotateCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            )}

            {isActive && (
              <>
                <Button onClick={handleCapture} disabled={isLoading} size="lg" className="flex-1 max-w-xs">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
                
                {currentFacingMode === 'environment' && (
                  <Button
                    onClick={() => switchCamera('user')}
                    disabled={isLoading}
                    variant="outline"
                    size="lg"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Switch
                  </Button>
                )}
              </>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Position your food in the frame and capture a clear photo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
