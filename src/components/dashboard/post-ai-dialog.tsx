"use client";

import * as React from "react";
import { AlertTriangle, MessageSquare, RefreshCw, Sparkles, ThumbsUp } from "lucide-react";

import type { PostAIInsightResponse } from "@/types/api";
import { useAnalyzePost } from "@/hooks/use-ai";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface PostAiDialogProps {
  postId: string;
  postTitle?: string | null;
  trigger?: React.ReactNode;
}

export function PostAiDialog({ postId, postTitle, trigger }: PostAiDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [analysisData, setAnalysisData] = React.useState<PostAIInsightResponse | null>(null);

  const analyzeMutation = useAnalyzePost();

  const handleTriggerAnalysis = React.useCallback(async () => {
    try {
      const data = await analyzeMutation.mutateAsync(postId);
      setAnalysisData(data);
    } catch {
      // Error handled in hook via toast
    }
  }, [analyzeMutation, postId]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && !analysisData && !analyzeMutation.isPending) {
      void handleTriggerAnalysis();
    }
  };

  const sentiment = analysisData?.sentiment_breakdown;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ? (
            React.isValidElement(trigger) ? (
              trigger
            ) : (
              <button type="button">{trigger}</button>
            )
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-amber-600 dark:text-amber-400"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              AI Insights
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Phân Tích Độc Giả (AI)</DialogTitle>
              <DialogDescription className="line-clamp-1 text-xs">
                {postTitle ?? "Chi tiết cảm xúc & chủ đề quan tâm"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {analyzeMutation.isPending ? (
          <div className="space-y-4 py-4">
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <RefreshCw className="text-primary size-3.5 animate-spin" />
              Đang phân tích sắc thái bình luận và trích xuất chủ đề...
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : analysisData ? (
          <div className="space-y-4 py-2 text-xs">
            {/* 1. Thanh phân bổ cảm xúc */}
            <div className="border-border/70 bg-card space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground flex items-center gap-1.5 font-semibold">
                  <MessageSquare className="text-muted-foreground size-3.5" />
                  Đã phân tích {analysisData.total_comments_analyzed} bình luận
                </span>
                <Badge
                  variant={
                    sentiment?.dominant_sentiment === "positive"
                      ? "default"
                      : sentiment?.dominant_sentiment === "negative"
                        ? "destructive"
                        : "secondary"
                  }
                  className={`text-[11px] capitalize ${
                    sentiment?.dominant_sentiment === "positive" ? "bg-emerald-600" : ""
                  }`}
                >
                  {sentiment?.dominant_sentiment ?? "Tích cực"}
                </Badge>
              </div>

              {/* Progress bar đa màu */}
              {sentiment && (
                <div className="space-y-1.5 pt-1">
                  <div className="bg-muted flex h-2.5 w-full overflow-hidden rounded-full">
                    <div
                      style={{ width: `${sentiment.positive_percentage}%` }}
                      className="bg-emerald-500 transition-all"
                      title={`Tích cực: ${sentiment.positive_percentage.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${sentiment.neutral_percentage}%` }}
                      className="bg-slate-400 transition-all"
                      title={`Trung tính: ${sentiment.neutral_percentage.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${sentiment.negative_percentage}%` }}
                      className="bg-rose-500 transition-all"
                      title={`Tiêu cực: ${sentiment.negative_percentage.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${sentiment.toxic_or_spam_percentage}%` }}
                      className="bg-amber-600 transition-all"
                      title={`Spam/Toxic: ${sentiment.toxic_or_spam_percentage.toFixed(1)}%`}
                    />
                  </div>

                  <div className="text-muted-foreground flex justify-between pt-0.5 text-[11px]">
                    <span className="font-medium text-emerald-600">
                      Tích cực: {sentiment.positive_percentage.toFixed(0)}%
                    </span>
                    <span>Trung tính: {sentiment.neutral_percentage.toFixed(0)}%</span>
                    <span className="text-rose-600">
                      Tiêu cực: {sentiment.negative_percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Chủ đề độc giả quan tâm nhất */}
            {analysisData.top_topics && analysisData.top_topics.length > 0 && (
              <div className="space-y-2">
                <p className="text-foreground font-semibold">Chủ đề thảo luận nổi bật:</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysisData.top_topics.map((t, i) => (
                    <span
                      key={i}
                      className="border-border bg-muted/40 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px]"
                    >
                      <span className="text-foreground font-medium">{t.topic}</span>
                      <span className="text-muted-foreground">({t.mentions_count})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Tóm tắt phản hồi & Đề xuất hành động */}
            {analysisData.audience_feedback_summary && (
              <div className="bg-muted/30 space-y-1 rounded-lg p-3">
                <div className="text-foreground flex items-center gap-1.5 font-semibold">
                  <ThumbsUp className="size-3.5 text-blue-600" />
                  Tổng quan phản hồi khán giả:
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {analysisData.audience_feedback_summary}
                </p>
              </div>
            )}

            {analysisData.actionable_takeaway && (
              <div className="space-y-1 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="size-3.5" />
                  Đề xuất tối ưu cho video tiếp theo:
                </div>
                <p className="text-foreground leading-relaxed">
                  {analysisData.actionable_takeaway}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground py-6 text-center text-xs">
            Chưa có dữ liệu phân tích. Bấm thử lại để kích hoạt.
            <div className="mt-3">
              <Button size="sm" onClick={handleTriggerAnalysis}>
                Phân tích ngay
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
