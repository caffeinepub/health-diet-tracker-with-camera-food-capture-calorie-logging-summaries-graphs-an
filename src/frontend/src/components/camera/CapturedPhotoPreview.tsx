import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, ArrowRight } from 'lucide-react';

interface CapturedPhotoPreviewProps {
  photo: File;
  onRetake: () => void;
  onProceed: () => void;
}

export default function CapturedPhotoPreview({ photo, onRetake, onProceed }: CapturedPhotoPreviewProps) {
  const photoUrl = URL.createObjectURL(photo);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Photo</h1>
        <p className="text-muted-foreground">Make sure the food is clearly visible</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Captured Image</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={photoUrl}
            alt="Captured food"
            className="w-full h-auto rounded-lg"
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onRetake} className="flex-1 gap-2">
          <RotateCw className="w-4 h-4" />
          Retake Photo
        </Button>
        <Button onClick={onProceed} className="flex-1 gap-2">
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
