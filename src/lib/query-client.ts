import { cache } from "react";
import { QueryClient } from "@tanstack/react-query";

/**
 * Factory function creating a new QueryClient with production defaults:
 * - staleTime: 60s (data remains fresh for 1 min before background revalidation)
 * - gcTime: 5min (unused query cache is garbage collected after 5 min)
 * - retry: 1 (retries once on failure before rendering error UI)
 * - refetchOnWindowFocus: false (avoids sudden layout changes when switching windows)
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Universal QueryClient accessor:
 * - On the server: Uses React cache() to instantiate a new QueryClient per request,
 *   preventing cross-user cache and state leaks during SSR / Server Component prefetching.
 * - In the browser: Maintains a singleton instance across all client-side renders.
 */
export const getQueryClient = cache((): QueryClient => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
});

/**
 * Default client-side QueryClient instance for direct usage in client components / stores.
 */
export const queryClient =
  typeof window !== "undefined" ? getQueryClient() : (null as unknown as QueryClient);
