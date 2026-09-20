import { useQuery } from "@tanstack/react-query";

import {
  getPostDetail,
  getPostSnapshots,
  getTopPosts,
  listPosts,
} from "@/modules/posts/posts.service";
import type { ListPostsParams, TopPostsParams } from "@/modules/posts/posts.service";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const postKeys = {
  all: ["posts"] as const,
  list: (params?: ListPostsParams) => [...postKeys.all, "list", params] as const,
  top: (params?: TopPostsParams) => [...postKeys.all, "top", params] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
  snapshots: (id: string, days: number) => [...postKeys.all, "snapshots", id, days] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function usePosts(params?: ListPostsParams) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => listPosts(params),
  });
}

export function useTopPosts(params?: TopPostsParams) {
  return useQuery({
    queryKey: postKeys.top(params),
    queryFn: () => getTopPosts(params),
  });
}

export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostDetail(postId),
    enabled: !!postId,
  });
}

export function usePostSnapshots(postId: string, days = 30) {
  return useQuery({
    queryKey: postKeys.snapshots(postId, days),
    queryFn: () => getPostSnapshots(postId, days),
    enabled: !!postId,
  });
}
