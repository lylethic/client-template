import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query-client";
import { serverFetch } from "@/lib/server-fetch";
import { channelKeys } from "@/hooks/use-channels";

import { ChannelsClient } from "./_components/channels-client";

export const metadata: Metadata = {
  title: "Quản lý kênh & Snapshot | Channels",
  description:
    "Quản lý danh sách các kênh mạng xã hội đã liên kết và theo dõi các chỉ số snapshot mới nhất.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ChannelsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: channelKeys.list(),
    queryFn: () => serverFetch("/api/v1/channels"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChannelsClient />
    </HydrationBoundary>
  );
}
