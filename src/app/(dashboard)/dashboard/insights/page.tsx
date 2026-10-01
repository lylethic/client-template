import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query-client";
import { serverFetch } from "@/lib/server-fetch";
import { insightKeys } from "@/hooks/use-insights";

import { InsightsClient } from "./_components/insights-client";

export const metadata: Metadata = {
  title: "Phân tích chuyên sâu | Detailed Insights",
  description:
    "Báo cáo phân tích chuyên sâu các chỉ số tăng trưởng, chuỗi thời gian và nội dung hàng đầu.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InsightsPage() {
  const queryClient = getQueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: insightKeys.summary(),
      queryFn: () => serverFetch("/api/v1/insights/summary"),
    }),
    queryClient.prefetchQuery({
      queryKey: insightKeys.growth(),
      queryFn: () => serverFetch("/api/v1/insights/growth"),
    }),
    queryClient.prefetchQuery({
      queryKey: insightKeys.topContent({ limit: 5 }),
      queryFn: () => serverFetch("/api/v1/insights/top-content", { params: { limit: 5 } }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InsightsClient />
    </HydrationBoundary>
  );
}
