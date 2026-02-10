import type { FoodEntry, BodyGoalDetails, GoalType } from '../backend';

export interface WeeklySummary {
  totalCalories: number;
  avgCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  daysWithEntries: number;
  totalEntries: number;
  score: number;
  feedback: string;
  suggestions: string[];
}

function getGoalTypeLabel(goalType: GoalType): string {
  switch (goalType) {
    case 'loseWeight':
      return 'Lose Weight';
    case 'gainWeight':
      return 'Gain Weight';
    case 'gainMuscle':
      return 'Gain Muscle';
    case 'maintain':
      return 'Maintain Weight';
    default:
      return 'Unknown';
  }
}

export function calculateWeeklySummary(
  entries: FoodEntry[],
  bodyGoal?: BodyGoalDetails
): WeeklySummary {
  if (entries.length === 0) {
    return {
      totalCalories: 0,
      avgCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      avgProtein: 0,
      avgCarbs: 0,
      avgFat: 0,
      daysWithEntries: 0,
      totalEntries: 0,
      score: 0,
      feedback: 'Not enough data yet. Start logging your meals to get personalized feedback!',
      suggestions: ['Log at least 6 meals this week to receive a weekly summary'],
    };
  }

  // Calculate totals
  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories * entry.portionSize,
      protein: acc.protein + entry.macros.protein * entry.portionSize,
      carbs: acc.carbs + entry.macros.carbs * entry.portionSize,
      fat: acc.fat + entry.macros.fat * entry.portionSize,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Count unique days
  const uniqueDays = new Set(entries.map((e) => Number(e.day)));
  const daysWithEntries = uniqueDays.size;

  // Calculate averages
  const avgCalories = daysWithEntries > 0 ? totals.calories / daysWithEntries : 0;
  const avgProtein = daysWithEntries > 0 ? totals.protein / daysWithEntries : 0;
  const avgCarbs = daysWithEntries > 0 ? totals.carbs / daysWithEntries : 0;
  const avgFat = daysWithEntries > 0 ? totals.fat / daysWithEntries : 0;

  // Calculate macro percentages
  const totalMacroCalories = totals.protein * 4 + totals.carbs * 4 + totals.fat * 9;
  const proteinPercent = totalMacroCalories > 0 ? (totals.protein * 4 / totalMacroCalories) * 100 : 0;
  const carbsPercent = totalMacroCalories > 0 ? (totals.carbs * 4 / totalMacroCalories) * 100 : 0;
  const fatPercent = totalMacroCalories > 0 ? (totals.fat * 9 / totalMacroCalories) * 100 : 0;

  // Insufficient data check
  if (entries.length < 6) {
    return {
      totalCalories: totals.calories,
      avgCalories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
      avgProtein,
      avgCarbs,
      avgFat,
      daysWithEntries,
      totalEntries: entries.length,
      score: 3,
      feedback: 'Keep going! Log more meals to get a complete weekly analysis.',
      suggestions: [`You've logged ${entries.length} meals. Try to log at least 6 meals this week.`],
    };
  }

  // Calculate score and feedback
  let score = 5; // Base score
  const suggestions: string[] = [];

  // Calorie range scoring
  if (avgCalories >= 1600 && avgCalories <= 2400) {
    score += 3;
  } else if (avgCalories >= 1300 && avgCalories <= 1600) {
    score += 2;
    suggestions.push('Your calorie intake is slightly low. Consider adding nutrient-dense snacks.');
  } else if (avgCalories > 2400) {
    score += 1;
    suggestions.push('Your calorie intake is high. Consider portion control or lighter meal options.');
  } else {
    suggestions.push('Your calorie intake is very low. Ensure you\'re meeting your energy needs.');
  }

  // Protein scoring (aim for 15-30% of calories)
  if (proteinPercent >= 15 && proteinPercent <= 30) {
    score += 2;
  } else if (proteinPercent < 15) {
    score += 1;
    suggestions.push('Increase protein intake. Add lean meats, eggs, legumes, or dairy to your meals.');
  } else {
    suggestions.push('Your protein intake is very high. Balance with more carbs and healthy fats.');
  }

  // Macro balance scoring
  const isBalanced = proteinPercent >= 15 && proteinPercent <= 30 &&
                     carbsPercent >= 40 && carbsPercent <= 60 &&
                     fatPercent >= 20 && fatPercent <= 35;
  
  if (isBalanced) {
    score += 2;
  } else {
    if (carbsPercent > 60) {
      suggestions.push('Your carb intake is high. Try adding more protein and healthy fats.');
    }
    if (fatPercent < 20) {
      suggestions.push('Add healthy fats like nuts, avocado, or olive oil to your diet.');
    }
  }

  // Consistency bonus
  if (daysWithEntries >= 6) {
    score += 1;
  }

  // Cap score at 10
  score = Math.min(score, 10);

  // Generate feedback based on score and goal
  let feedback = '';
  const goalLabel = bodyGoal ? getGoalTypeLabel(bodyGoal.goalType) : '';

  if (score >= 8) {
    feedback = `🎉 Congratulations! You're doing an excellent job${goalLabel ? ` working towards your "${goalLabel}" goal` : ''}. Your nutrition is well-balanced and consistent. Keep up the great work!`;
  } else if (score >= 6) {
    feedback = `👍 Good progress${goalLabel ? ` on your "${goalLabel}" journey` : ''}! You're on the right track. A few adjustments will help you reach your goals faster.`;
  } else if (score >= 4) {
    feedback = `💪 You're making an effort${goalLabel ? ` towards "${goalLabel}"` : ''}, but there's room for improvement. Focus on the suggestions below to optimize your nutrition.`;
  } else {
    feedback = `📊 Your nutrition needs attention${goalLabel ? ` to support your "${goalLabel}" goal` : ''}. Review the suggestions below and try to log meals more consistently.`;
  }

  // Add goal-specific suggestions
  if (bodyGoal) {
    if (bodyGoal.goalType === 'loseWeight' && avgCalories > 2000) {
      suggestions.push('For weight loss, consider reducing your daily calorie intake gradually.');
    } else if (bodyGoal.goalType === 'gainMuscle' && proteinPercent < 20) {
      suggestions.push('For muscle gain, aim for higher protein intake (1.6-2.2g per kg body weight).');
    } else if (bodyGoal.goalType === 'gainWeight' && avgCalories < 2200) {
      suggestions.push('For weight gain, increase your calorie intake with nutrient-dense foods.');
    }
  }

  return {
    totalCalories: totals.calories,
    avgCalories,
    totalProtein: totals.protein,
    totalCarbs: totals.carbs,
    totalFat: totals.fat,
    avgProtein,
    avgCarbs,
    avgFat,
    daysWithEntries,
    totalEntries: entries.length,
    score,
    feedback,
    suggestions: suggestions.length > 0 ? suggestions : ['Keep logging your meals consistently!'],
  };
}
