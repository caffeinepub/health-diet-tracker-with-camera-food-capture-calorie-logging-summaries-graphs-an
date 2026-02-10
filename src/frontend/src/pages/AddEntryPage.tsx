import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAddFoodEntry } from '../hooks/useFoodEntries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import PortionConfidenceAdjuster from '../components/entries/PortionConfidenceAdjuster';
import { toast } from 'sonner';

function getTodayDayNumber(): number {
  const now = new Date();
  return Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
}

export default function AddEntryPage() {
  const navigate = useNavigate();
  const addEntry = useAddFoodEntry();

  const [foodLabel, setFoodLabel] = useState('');
  const [baseCalories, setBaseCalories] = useState('');
  const [baseProtein, setBaseProtein] = useState('');
  const [baseCarbs, setBaseCarbs] = useState('');
  const [baseFat, setBaseFat] = useState('');
  const [baseFiber, setBaseFiber] = useState('');
  const [baseSodium, setBaseSodium] = useState('');
  const [baseSugar, setBaseSugar] = useState('');
  const [portionSize, setPortionSize] = useState(1.0);
  const [confidenceLevel, setConfidenceLevel] = useState(0.8);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodLabel.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    const calories = parseFloat(baseCalories) || 0;
    const protein = parseFloat(baseProtein) || 0;
    const carbs = parseFloat(baseCarbs) || 0;
    const fat = parseFloat(baseFat) || 0;
    const fiber = parseFloat(baseFiber) || 0;
    const sodium = parseFloat(baseSodium) || 0;
    const sugar = parseFloat(baseSugar) || 0;

    try {
      await addEntry.mutateAsync({
        day: BigInt(getTodayDayNumber()),
        foodLabel: foodLabel.trim(),
        description: '',
        calories,
        macros: { protein, carbs, fat },
        micronutrients: { fiber, sodium, sugar },
        portionSize,
        confidenceLevel,
      });

      toast.success('Food entry added successfully!');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to add entry. Please try again.');
      console.error('Add entry error:', error);
    }
  };

  const adjustedCalories = (parseFloat(baseCalories) || 0) * portionSize;
  const adjustedProtein = (parseFloat(baseProtein) || 0) * portionSize;
  const adjustedCarbs = (parseFloat(baseCarbs) || 0) * portionSize;
  const adjustedFat = (parseFloat(baseFat) || 0) * portionSize;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Food Entry</h1>
          <p className="text-muted-foreground">Manually log your meal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Food Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="foodLabel">Food Name *</Label>
              <Input
                id="foodLabel"
                value={foodLabel}
                onChange={(e) => setFoodLabel(e.target.value)}
                placeholder="e.g., Grilled Chicken Breast"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories (kcal) *</Label>
                <Input
                  id="calories"
                  type="number"
                  step="0.1"
                  value={baseCalories}
                  onChange={(e) => setBaseCalories(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g) *</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  value={baseProtein}
                  onChange={(e) => setBaseProtein(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g) *</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  value={baseCarbs}
                  onChange={(e) => setBaseCarbs(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g) *</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  value={baseFat}
                  onChange={(e) => setBaseFat(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  step="0.1"
                  value={baseFiber}
                  onChange={(e) => setBaseFiber(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sodium">Sodium (mg)</Label>
                <Input
                  id="sodium"
                  type="number"
                  step="0.1"
                  value={baseSodium}
                  onChange={(e) => setBaseSodium(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugar">Sugar (g)</Label>
                <Input
                  id="sugar"
                  type="number"
                  step="0.1"
                  value={baseSugar}
                  onChange={(e) => setBaseSugar(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portion & Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <PortionConfidenceAdjuster
              portionSize={portionSize}
              confidenceLevel={confidenceLevel}
              onPortionChange={setPortionSize}
              onConfidenceChange={setConfidenceLevel}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adjusted Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Calories:</span>
                <span className="ml-2 font-medium">{Math.round(adjustedCalories)} kcal</span>
              </div>
              <div>
                <span className="text-muted-foreground">Protein:</span>
                <span className="ml-2 font-medium">{Math.round(adjustedProtein)}g</span>
              </div>
              <div>
                <span className="text-muted-foreground">Carbs:</span>
                <span className="ml-2 font-medium">{Math.round(adjustedCarbs)}g</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fat:</span>
                <span className="ml-2 font-medium">{Math.round(adjustedFat)}g</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/' })} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={addEntry.isPending} className="flex-1">
            {addEntry.isPending ? 'Adding...' : 'Add Entry'}
          </Button>
        </div>
      </form>
    </div>
  );
}
