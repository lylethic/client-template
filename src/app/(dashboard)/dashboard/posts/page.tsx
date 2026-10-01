import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query-client";
import { serverFetch } from "@/lib/server-fetch";
import { postKeys } from "@/hooks/use-posts";

import { PostsClient } from "./_components/posts-client";

export const metadata: Metadata = {
  title: "Danh sách bài viết & Tương tác | Posts",
  description:
    "Tổng hợp danh sách các bài đăng, video ngắn, reels và theo dõi chi tiết tương tác từng bài viết.",
  robots: {
    index: false,
    follow: false,
  },
};

interface PostsPageProps {
  searchParams: Promise<{
    platform?: string;
    post_type?: string;
    page?: string;
  }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { platform, post_type, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const activePlatform = !platform || platform === "all" ? undefined : platform;
  const activePostType = !post_type || post_type === "all" ? undefined : post_type;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: postKeys.list({
      platform: activePlatform,
      post_type: activePostType,
      page: currentPage,
      page_size: 15,
    }),
    queryFn: () =>
      serverFetch("/api/v1/posts", {
        params: {
          platform: activePlatform,
          post_type: activePostType,
          page: currentPage,
          page_size: 15,
        },
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsClient />
    </HydrationBoundary>
  );
}
