import { useQuery } from "@tanstack/react-query";

import {
  getGrowthAnalytics,
  getInsightsSummary,
  getTimeseries,
  getTopContent,
} from "@/modules/insights/insights.service";
import type {
  InsightsSummaryParams,
  TimeSeriesParams,
  TopContentParams,
} from "@/modules/insights/insights.service";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const insightKeys = {
  all: ["insights"] as const,
  summary: (params?: InsightsSummaryParams) => [...insightKeys.all, "summary", params] as const,
  growth: (platform?: string) => [...insightKeys.all, "growth", platform] as const,
  topContent: (params?: TopContentParams) => [...insightKeys.all, "top-content", params] as const,
  timeseries: (params?: TimeSeriesParams) => [...insightKeys.all, "timeseries", params] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useInsightsSummary(params?: InsightsSummaryParams) {
  return useQuery({
    queryKey: insightKeys.summary(params),
    queryFn: () => getInsightsSummary(params),
    staleTime: 15 * 60 * 1000, // 15 min — matches backend Redis TTL
  });
}

export function useGrowthAnalytics(platform?: string) {
  return useQuery({
    queryKey: insightKeys.growth(platform),
    queryFn: () => getGrowthAnalytics(platform),
  });
}

export function useTopContent(params?: TopContentParams) {
  return useQuery({
    queryKey: insightKeys.topContent(params),
    queryFn: () => getTopContent(params),
  });
}

export function useTimeseries(params?: TimeSeriesParams) {
  return useQuery({
    queryKey: insightKeys.timeseries(params),
    queryFn: () => getTimeseries(params),
  });
}
