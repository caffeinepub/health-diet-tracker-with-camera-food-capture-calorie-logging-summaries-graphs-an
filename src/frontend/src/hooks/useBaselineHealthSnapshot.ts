import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BaselineSnapshot } from '../backend';

export function useGetBaselineHealthSnapshot() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BaselineSnapshot[]>({
    queryKey: ['baselineHealth'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getLabVitalsBaseline();
      } catch (error) {
        console.error('Error fetching baseline health:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
