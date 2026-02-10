import type { FoodEntry } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface EntryDetailsDialogProps {
  entry: FoodEntry;
  open: boolean;
  onClose: () => void;
}

export default function EntryDetailsDialog({ entry, open, onClose }: EntryDetailsDialogProps) {
  const adjustedCalories = entry.calories * entry.portionSize;
  const adjustedProtein = entry.macros.protein * entry.portionSize;
  const adjustedCarbs = entry.macros.carbs * entry.portionSize;
  const adjustedFat = entry.macros.fat * entry.portionSize;
  const adjustedFiber = entry.micronutrients.fiber * entry.portionSize;
  const adjustedSodium = entry.micronutrients.sodium * entry.portionSize;
  const adjustedSugar = entry.micronutrients.sugar * entry.portionSize;

  const confidenceLabel =
    entry.confidenceLevel >= 0.8 ? 'High' : entry.confidenceLevel >= 0.5 ? 'Medium' : 'Low';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{entry.foodLabel}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="outline">Portion: {entry.portionSize}x</Badge>
            <Badge
              variant={
                entry.confidenceLevel >= 0.8
                  ? 'default'
                  : entry.confidenceLevel >= 0.5
                  ? 'secondary'
                  : 'outline'
              }
            >
              Confidence: {confidenceLabel}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold mb-2">Calories</h4>
              <p className="text-2xl font-bold">{Math.round(adjustedCalories)} kcal</p>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold mb-2">Macronutrients</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Protein</p>
                  <p className="font-semibold">{adjustedProtein.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Carbs</p>
                  <p className="font-semibold">{adjustedCarbs.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fat</p>
                  <p className="font-semibold">{adjustedFat.toFixed(1)}g</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold mb-2">Micronutrients</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Fiber</p>
                  <p className="font-semibold">{adjustedFiber.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sodium</p>
                  <p className="font-semibold">{adjustedSodium.toFixed(0)}mg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sugar</p>
                  <p className="font-semibold">{adjustedSugar.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
