import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { FoodNutrition } from '../../utils/localFoodDataset';

interface SimilarFoodFallbackProps {
  similarFoods: FoodNutrition[];
  selectedFood: FoodNutrition | null;
  onSelectFood: (food: FoodNutrition) => void;
}

export default function SimilarFoodFallback({
  similarFoods,
  selectedFood,
  onSelectFood,
}: SimilarFoodFallbackProps) {
  if (similarFoods.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground">
        Not sure? Select a similar food:
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {similarFoods.map((food) => {
          const isSelected = selectedFood?.name === food.name;
          return (
            <Card
              key={food.name}
              className={`cursor-pointer transition-all hover:border-primary ${
                isSelected ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onSelectFood(food)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{food.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {Math.round(food.per100g.calories)} cal • {Math.round(food.per100g.protein)}g protein
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
