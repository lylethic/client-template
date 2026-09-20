import type {
  GrowthOverviewResponse,
  InsightsSummaryResponse,
  TimeSeriesResponse,
  TopContentResponse,
} from "@/types/api";
import { apiClient } from "@/lib/api-client";

/**
 * Insights API service.
 * Backend prefix: /api/v1/insights
 */

export interface InsightsSummaryParams {
  platform?: string;
  fresh?: boolean;
}

/** GET /api/v1/insights/summary – unified overview */
export async function getInsightsSummary(
  params?: InsightsSummaryParams,
): Promise<InsightsSummaryResponse> {
  const { data } = await apiClient.get<InsightsSummaryResponse>("/api/v1/insights/summary", {
    params,
  });
  return data;
}

/** GET /api/v1/insights/growth */
export async function getGrowthAnalytics(platform?: string): Promise<GrowthOverviewResponse> {
  const { data } = await apiClient.get<GrowthOverviewResponse>("/api/v1/insights/growth", {
    params: platform ? { platform } : undefined,
  });
  return data;
}

export interface TopContentParams {
  platform?: string;
  account_id?: string;
  post_type?: string;
  limit?: number;
  sort_by?: string;
  days?: number;
}

/** GET /api/v1/insights/top-content */
export async function getTopContent(params?: TopContentParams): Promise<TopContentResponse> {
  const { data } = await apiClient.get<TopContentResponse>("/api/v1/insights/top-content", {
    params,
  });
  return data;
}

export interface TimeSeriesParams {
  platform?: string;
  account_id?: string;
  days?: number;
}

/** GET /api/v1/insights/timeseries */
export async function getTimeseries(params?: TimeSeriesParams): Promise<TimeSeriesResponse> {
  const { data } = await apiClient.get<TimeSeriesResponse>("/api/v1/insights/timeseries", {
    params,
  });
  return data;
}
