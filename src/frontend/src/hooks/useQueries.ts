import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

// This file is reserved for React Query hooks that interact with the backend.
// Currently, the app operates entirely in the frontend without backend persistence.
// Future enhancements could add backend storage for events and results.

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
