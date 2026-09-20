import type {
  MetricSnapshotResponse,
  PostListResponse,
  PostWithMetricsResponse,
  TopContentResponse,
} from "@/types/api";
import { apiClient } from "@/lib/api-client";

/**
 * Posts API service.
 * Backend prefix: /api/v1/posts
 */

export interface ListPostsParams {
  platform?: string;
  account_id?: string;
  post_type?: string;
  page?: number;
  page_size?: number;
}

/** GET /api/v1/posts – paginated list of posts */
export async function listPosts(params?: ListPostsParams): Promise<PostListResponse> {
  const { data } = await apiClient.get<PostListResponse>("/api/v1/posts", { params });
  return data;
}

export interface TopPostsParams {
  platform?: string;
  account_id?: string;
  post_type?: string;
  limit?: number;
  sort_by?: string;
  days?: number;
}

/** GET /api/v1/posts/top – ranked posts by metric */
export async function getTopPosts(params?: TopPostsParams): Promise<TopContentResponse> {
  const { data } = await apiClient.get<TopContentResponse>("/api/v1/posts/top", { params });
  return data;
}

/** GET /api/v1/posts/:id – post detail with latest metrics */
export async function getPostDetail(postId: string): Promise<PostWithMetricsResponse> {
  const { data } = await apiClient.get<PostWithMetricsResponse>(`/api/v1/posts/${postId}`);
  return data;
}

/** GET /api/v1/posts/:id/snapshots */
export async function getPostSnapshots(
  postId: string,
  days = 30,
): Promise<MetricSnapshotResponse[]> {
  const { data } = await apiClient.get<MetricSnapshotResponse[]>(
    `/api/v1/posts/${postId}/snapshots`,
    { params: { days } },
  );
  return data;
}
