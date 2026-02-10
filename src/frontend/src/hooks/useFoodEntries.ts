import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FoodEntry } from '../backend';

export function useGetFoodEntries(startDay: number, endDay: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FoodEntry[]>({
    queryKey: ['foodEntries', startDay, endDay],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFoodEntriesForCaller(BigInt(startDay), BigInt(endDay));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddFoodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      day: bigint;
      foodLabel: string;
      description?: string;
      calories: number;
      macros: { protein: number; carbs: number; fat: number };
      micronutrients: { fiber: number; sodium: number; sugar: number };
      portionSize: number;
      confidenceLevel: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFoodEntry(
        params.day,
        params.foodLabel,
        params.description || '',
        params.calories,
        params.macros,
        params.micronutrients,
        params.portionSize,
        params.confidenceLevel
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodEntries'] });
    },
  });
}
