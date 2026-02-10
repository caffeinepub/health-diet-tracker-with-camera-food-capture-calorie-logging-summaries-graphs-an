import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function usePortionAdjusterGuidance() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['portionAdjusterGuidance'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getPortionAdjusterGuidance();
    },
    enabled: !!actor && !actorFetching,
  });
}
