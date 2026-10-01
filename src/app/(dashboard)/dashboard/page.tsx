import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query-client";
import { serverFetch } from "@/lib/server-fetch";
import { aiKeys } from "@/hooks/use-ai";
import { channelKeys } from "@/hooks/use-channels";
import { insightKeys } from "@/hooks/use-insights";

import { DashboardOverviewClient } from "./_components/dashboard-overview-client";

export const metadata: Metadata = {
  title: "Tổng quan hiệu suất | Overview",
  description:
    "Báo cáo tổng quan hiệu suất mạng xã hội đa kênh, xu hướng tăng trưởng và chiến lược nội dung AI.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardOverviewPage() {
  const queryClient = getQueryClient();

  // Prefetch critical dashboard datasets concurrently on the server
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: insightKeys.summary(),
      queryFn: () => serverFetch("/api/v1/insights/summary"),
    }),
    queryClient.prefetchQuery({
      queryKey: channelKeys.list(),
      queryFn: () => serverFetch("/api/v1/channels"),
    }),
    queryClient.prefetchQuery({
      queryKey: insightKeys.topContent({
        limit: 6,
        sort_by: "engagement_rate",
        days: 30,
      }),
      queryFn: () =>
        serverFetch("/api/v1/insights/top-content", {
          params: { limit: 6, sort_by: "engagement_rate", days: 30 },
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: aiKeys.executiveSummary(30),
      queryFn: () => serverFetch("/api/v1/ai/executive-summary", { params: { days: 30 } }),
    }),
    queryClient.prefetchQuery({
      queryKey: aiKeys.recommendations(),
      queryFn: () => serverFetch("/api/v1/ai/recommendations"),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardOverviewClient />
    </HydrationBoundary>
  );
}
