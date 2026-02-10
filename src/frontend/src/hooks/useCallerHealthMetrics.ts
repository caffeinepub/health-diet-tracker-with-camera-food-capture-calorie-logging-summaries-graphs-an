import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { HealthMetrics } from '@/backend';

export function useGetCallerHealthMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HealthMetrics | null>({
    queryKey: ['callerHealthMetrics'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerHealthMetrics();
      } catch (error) {
        // If profile is incomplete, backend will trap - return null
        console.error('Failed to fetch health metrics:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
