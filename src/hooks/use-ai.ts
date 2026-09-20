import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  analyzePost,
  getContentRecommendations,
  getExecutiveSummary,
} from "@/modules/ai/ai.service";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const aiKeys = {
  all: ["ai"] as const,
  postInsight: (postId: string) => [...aiKeys.all, "post-insight", postId] as const,
  recommendations: (platform?: string) => [...aiKeys.all, "recommendations", platform] as const,
  executiveSummary: (timeframe: number) => [...aiKeys.all, "executive-summary", timeframe] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Trigger AI analysis on demand via mutation */
export function useAnalyzePost() {
  return useMutation({
    mutationFn: (postId: string) => analyzePost(postId),
    onSuccess: () => {
      toast.success("AI analysis complete!");
    },
    onError: () => {
      toast.error("AI analysis failed. Please try again.");
    },
  });
}

export function useContentRecommendations(platform?: string) {
  return useQuery({
    queryKey: aiKeys.recommendations(platform),
    queryFn: () => getContentRecommendations(platform),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useExecutiveSummary(timeframe = 30) {
  return useQuery({
    queryKey: aiKeys.executiveSummary(timeframe),
    queryFn: () => getExecutiveSummary(timeframe),
    staleTime: 30 * 60 * 1000,
  });
}
