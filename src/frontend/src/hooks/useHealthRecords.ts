import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { HealthTrackRecord, LabVitalsMetrics } from '../backend';

export function useGetHealthRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HealthTrackRecord[]>({
    queryKey: ['healthRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFullLabVitalsHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddHealthRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshot: LabVitalsMetrics) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLabVitalsSnapshot(snapshot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
      queryClient.invalidateQueries({ queryKey: ['baselineHealth'] });
    },
  });
}
