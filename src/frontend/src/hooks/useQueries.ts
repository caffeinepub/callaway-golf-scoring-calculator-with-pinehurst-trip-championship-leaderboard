import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SharedChartEntry } from '../backend';

// React Query hooks for backend interactions

/**
 * Fetch the latest event result from the backend
 */
export function useGetLatestResult() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['latestResult'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestResult();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Fetch the Callaway scoring chart from the backend
 * This is the source of truth for all scoring calculations
 */
export function useGetCallawayChart() {
  const { actor, isFetching } = useActor();

  return useQuery<SharedChartEntry[]>({
    queryKey: ['callawayChart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallawayChart();
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity, // Chart data rarely changes
  });
}
