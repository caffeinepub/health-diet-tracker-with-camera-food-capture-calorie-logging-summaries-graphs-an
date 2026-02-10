import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { usePortionAdjusterGuidance } from '../../hooks/usePortionAdjusterGuidance';
import { Info } from 'lucide-react';

interface PortionConfidenceAdjusterProps {
  portionSize: number;
  confidenceLevel: number;
  onPortionChange: (value: number) => void;
  onConfidenceChange: (value: number) => void;
}

export default function PortionConfidenceAdjuster({
  portionSize,
  confidenceLevel,
  onPortionChange,
  onConfidenceChange,
}: PortionConfidenceAdjusterProps) {
  const { data: guidance } = usePortionAdjusterGuidance();

  const confidenceLabel =
    confidenceLevel >= 0.8 ? 'High' : confidenceLevel >= 0.5 ? 'Medium' : 'Low';

  return (
    <div className="space-y-6">
      {guidance && (
        <div className="flex gap-2 p-3 bg-accent/20 rounded-lg text-sm">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground">{guidance}</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Portion Size</Label>
          <span className="text-sm font-semibold">{portionSize.toFixed(1)}x</span>
        </div>
        <Slider
          value={[portionSize]}
          onValueChange={([value]) => onPortionChange(value)}
          min={0.25}
          max={3.0}
          step={0.25}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0.25x</span>
          <span>1.5x</span>
          <span>3.0x</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Confidence Level</Label>
          <span className="text-sm font-semibold">{confidenceLabel}</span>
        </div>
        <Slider
          value={[confidenceLevel]}
          onValueChange={([value]) => onConfidenceChange(value)}
          min={0.1}
          max={1.0}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
