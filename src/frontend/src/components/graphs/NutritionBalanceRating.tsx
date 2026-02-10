import { useMemo } from 'react';
import type { FoodEntry } from '../../backend';
import { Progress } from '@/components/ui/progress';
import { Info } from 'lucide-react';

interface NutritionBalanceRatingProps {
  entries: FoodEntry[];
}

export default function NutritionBalanceRating({ entries }: NutritionBalanceRatingProps) {
  const rating = useMemo(() => {
    if (entries.length === 0) {
      return { score: 0, grade: 'N/A', message: 'No data to rate' };
    }

    const totals = entries.reduce(
      (acc, entry) => ({
        protein: acc.protein + entry.macros.protein * entry.portionSize,
        carbs: acc.carbs + entry.macros.carbs * entry.portionSize,
        fat: acc.fat + entry.macros.fat * entry.portionSize,
        calories: acc.calories + entry.calories * entry.portionSize,
      }),
      { protein: 0, carbs: 0, fat: 0, calories: 0 }
    );

    const totalMacros = totals.protein + totals.carbs + totals.fat;
    if (totalMacros === 0) {
      return { score: 0, grade: 'N/A', message: 'No macro data available' };
    }

    const proteinPct = (totals.protein / totalMacros) * 100;
    const carbsPct = (totals.carbs / totalMacros) * 100;
    const fatPct = (totals.fat / totalMacros) * 100;

    let score = 100;

    if (proteinPct < 15 || proteinPct > 40) score -= 20;
    if (carbsPct < 30 || carbsPct > 60) score -= 20;
    if (fatPct < 15 || fatPct > 35) score -= 20;

    const avgConfidence = entries.reduce((sum, e) => sum + e.confidenceLevel, 0) / entries.length;
    if (avgConfidence < 0.5) score -= 15;

    score = Math.max(0, Math.min(100, score));

    let grade = 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';

    return {
      score,
      grade,
      message: `Based on macro balance (P: ${proteinPct.toFixed(0)}%, C: ${carbsPct.toFixed(0)}%, F: ${fatPct.toFixed(0)}%) and entry confidence`,
    };
  }, [entries]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
          <span className="text-4xl font-bold text-primary">{rating.grade}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Nutrition Balance Score</h3>
        <p className="text-3xl font-bold text-primary">{rating.score}/100</p>
      </div>

      <Progress value={rating.score} className="h-2" />

      <div className="flex gap-2 p-4 bg-accent/20 rounded-lg text-sm">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-muted-foreground">{rating.message}</p>
          <p className="text-xs text-muted-foreground">
            <strong>How it's calculated:</strong> This rating considers macro distribution balance
            (ideal ranges: 15-40% protein, 30-60% carbs, 15-35% fat) and your confidence levels
            when logging entries. It's a general guide, not medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
