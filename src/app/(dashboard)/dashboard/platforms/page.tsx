import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query-client";
import { serverFetch } from "@/lib/server-fetch";
import { platformKeys } from "@/hooks/use-platforms";

import { PlatformsClient } from "./_components/platforms-client";

export const metadata: Metadata = {
  title: "Quản lý nền tảng liên kết | Connected Platforms",
  description:
    "Kết nối và quản lý ủy quyền OAuth tài khoản các mạng xã hội YouTube, TikTok, Facebook, Instagram và Threads.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PlatformsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: platformKeys.list(),
    queryFn: () => serverFetch("/api/v1/platforms"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlatformsClient />
    </HydrationBoundary>
  );
}
