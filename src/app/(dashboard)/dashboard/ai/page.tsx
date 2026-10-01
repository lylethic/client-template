import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query-client";
import { serverFetch } from "@/lib/server-fetch";
import { aiKeys } from "@/hooks/use-ai";

import { AIInsightsClient } from "./_components/ai-insights-client";

export const metadata: Metadata = {
  title: "Chiến lược nội dung AI | AI Strategy",
  description: "Phân tích xu hướng và nhận đề xuất chiến lược phát triển nội dung tự động bằng AI.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AIInsightsPage() {
  const queryClient = getQueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: aiKeys.recommendations(),
      queryFn: () => serverFetch("/api/v1/ai/recommendations"),
    }),
    queryClient.prefetchQuery({
      queryKey: aiKeys.executiveSummary(30),
      queryFn: () => serverFetch("/api/v1/ai/executive-summary", { params: { days: 30 } }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AIInsightsClient />
    </HydrationBoundary>
  );
}
