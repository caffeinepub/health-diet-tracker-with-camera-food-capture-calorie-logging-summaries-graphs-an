import { FOOD_DATABASE, GENERIC_FOOD, type FoodNutrition } from './localFoodDataset';

export interface EstimationResult {
  food: FoodNutrition;
  confidence: number; // 0-1
  similarFoods: FoodNutrition[]; // Top 5 alternatives
}

/**
 * Simple local estimation based on keyword matching
 * In a real app, this could use image analysis, but we keep it simple and local
 */
export function estimateFoodFromImage(_imageFile: File): EstimationResult {
  // Since we can't do real image analysis locally, we'll return a random selection
  // with low confidence to trigger the similar-food fallback UI
  const randomIndex = Math.floor(Math.random() * FOOD_DATABASE.length);
  const selectedFood = FOOD_DATABASE[randomIndex];
  
  // Get similar foods from the same category
  const similarFoods = FOOD_DATABASE
    .filter(f => f.category === selectedFood.category && f.name !== selectedFood.name)
    .slice(0, 5);
  
  // Add some variety if not enough similar foods
  if (similarFoods.length < 5) {
    const additional = FOOD_DATABASE
      .filter(f => f.name !== selectedFood.name && !similarFoods.includes(f))
      .slice(0, 5 - similarFoods.length);
    similarFoods.push(...additional);
  }
  
  return {
    food: selectedFood,
    confidence: 0.4, // Low confidence to show similar foods UI
    similarFoods: similarFoods.slice(0, 5)
  };
}

/**
 * Search for food by name/keywords
 */
export function searchFoodByName(query: string): FoodNutrition[] {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) return FOOD_DATABASE.slice(0, 10);
  
  const matches = FOOD_DATABASE.filter(food => {
    const nameMatch = food.name.toLowerCase().includes(lowerQuery);
    const keywordMatch = food.keywords.some(kw => kw.includes(lowerQuery));
    return nameMatch || keywordMatch;
  });
  
  return matches.length > 0 ? matches : [GENERIC_FOOD];
}

/**
 * Get food by exact name
 */
export function getFoodByName(name: string): FoodNutrition | null {
  return FOOD_DATABASE.find(f => f.name === name) || null;
}

/**
 * Calculate nutrition for a given weight
 */
export function calculateNutritionForWeight(
  food: FoodNutrition,
  weightInGrams: number
): FoodNutrition['per100g'] {
  const multiplier = weightInGrams / 100;
  
  return {
    calories: food.per100g.calories * multiplier,
    protein: food.per100g.protein * multiplier,
    carbs: food.per100g.carbs * multiplier,
    fat: food.per100g.fat * multiplier,
    fiber: food.per100g.fiber * multiplier,
    sodium: food.per100g.sodium * multiplier,
    sugar: food.per100g.sugar * multiplier,
  };
}
