import type {
  ContentRecommendationsResponse,
  ExecutiveSummaryResponse,
  PostAIInsightResponse,
} from "@/types/api";
import { apiClient } from "@/lib/api-client";

/**
 * AI Insights API service.
 * Backend prefix: /api/v1/ai
 */

/** POST /api/v1/ai/analyze-post/:postId – sentiment + topic analysis */
export async function analyzePost(postId: string): Promise<PostAIInsightResponse> {
  const { data } = await apiClient.post<PostAIInsightResponse>(`/api/v1/ai/analyze-post/${postId}`);
  return data;
}

/** GET /api/v1/ai/recommendations – content recommendations */
export async function getContentRecommendations(
  platform?: string,
): Promise<ContentRecommendationsResponse> {
  const { data } = await apiClient.get<ContentRecommendationsResponse>(
    "/api/v1/ai/recommendations",
    { params: platform ? { platform } : undefined },
  );
  return data;
}

/** GET /api/v1/ai/executive-summary */
export async function getExecutiveSummary(timeframe = 30): Promise<ExecutiveSummaryResponse> {
  const { data } = await apiClient.get<ExecutiveSummaryResponse>("/api/v1/ai/executive-summary", {
    params: { timeframe },
  });
  return data;
}
