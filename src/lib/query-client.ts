import { QueryClient } from "@tanstack/react-query";

/**
 * Singleton React Query client with production-ready defaults:
 * - staleTime: 60s — data stays "fresh" for 1 minute before background refetch
 * - gcTime: 5min — unused query cache is garbage-collected after 5 minutes
 * - retry: 1 — failed queries retry once before showing error state
 * - refetchOnWindowFocus: false — avoid surprise refetches when switching tabs
 *
 * Import this instance in QueryClientProvider and use queryClient.invalidateQueries()
 * directly from stores or server actions.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
