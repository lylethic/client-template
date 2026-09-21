"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, Bot, CheckCircle2, Clock, Flame, Lightbulb, Sparkles } from "lucide-react";

import { useContentRecommendations, useExecutiveSummary } from "@/hooks/use-ai";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIInsightsPage() {
  const t = useTranslations("ai");
  const tCommon = useTranslations("common");

  const [platform, setPlatform] = React.useState<string | undefined>(undefined);
  const [timeframe, setTimeframe] = React.useState(30);

  const platformOptions = [
    { value: "all", label: tCommon("allPlatforms") },
    { value: "youtube", label: "YouTube" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "threads", label: "Threads" },
  ];

  const { data: recommendations, isLoading: recLoading } = useContentRecommendations(platform);
  const { data: summary, isLoading: summaryLoading } = useExecutiveSummary(timeframe);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="border-border/80 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
            <Sparkles className="size-6 text-amber-500" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("description")}</p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
          <Select
            value={platform ?? "all"}
            onValueChange={(v) => setPlatform(!v || v === "all" ? undefined : v)}
          >
            <SelectTrigger className="w-full text-xs sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platformOptions.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(timeframe)} onValueChange={(v) => setTimeframe(Number(v))}>
            <SelectTrigger className="w-full text-xs sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7" className="text-xs">
                {tCommon("time7d")}
              </SelectItem>
              <SelectItem value="30" className="text-xs">
                {tCommon("time30d")}
              </SelectItem>
              <SelectItem value="90" className="text-xs">
                {tCommon("time90d")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── 1. Executive Summary ────────────────────────────────────────────── */}
      <Card className="border-border/70 overflow-hidden shadow-xs">
        <CardHeader className="border-border/60 bg-muted/20 border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Bot className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">{t("execSummaryTitle")}</CardTitle>
              <CardDescription className="text-xs">
                {t("execSummaryDesc", { timeframe })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          {summaryLoading ? (
            <div className="space-y-2 py-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : summary ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-foreground text-base font-bold">{summary.summary_headline}</h2>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed whitespace-pre-line">
                  {summary.summary_markdown}
                </p>
              </div>

              {/* Highlights & Concerns */}
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                {summary.top_highlights && summary.top_highlights.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="size-4" />
                      {t("growthHighlights")}
                    </p>
                    <ul className="text-foreground space-y-1.5 text-xs">
                      {summary.top_highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="font-bold text-emerald-500">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.key_concerns_or_risks && summary.key_concerns_or_risks.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="size-4" />
                      {t("concernsRisks")}
                    </p>
                    <ul className="text-foreground space-y-1.5 text-xs">
                      {summary.key_concerns_or_risks.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="font-bold text-amber-500">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-4 text-xs">{t("noSummaryData")}</p>
          )}
        </CardContent>
      </Card>

      {/* ── 2. Content Recommendations Grid ─────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Best Posting Times */}
        <Card className="border-border/70 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="size-4 text-blue-600 dark:text-blue-400" />
              {t("bestTimesTitle")}
            </CardTitle>
            <CardDescription className="text-xs">{t("bestTimesDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : recommendations?.best_times_to_post &&
              recommendations.best_times_to_post.length > 0 ? (
              recommendations.best_times_to_post.map((item, idx) => (
                <div
                  key={idx}
                  className="border-border/60 bg-muted/20 flex items-start justify-between rounded-lg border p-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold">{item.day_of_week}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.time_window}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">{item.reasoning}</p>
                  </div>
                  {item.average_engagement_multiplier > 1 && (
                    <Badge className="shrink-0 bg-emerald-600 text-[10px] text-white">
                      +{((item.average_engagement_multiplier - 1) * 100).toFixed(0)}% ER
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground py-4 text-xs">{t("noBestTimes")}</p>
            )}
          </CardContent>
        </Card>

        {/* Trending Topics */}
        <Card className="border-border/70 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Flame className="size-4 text-orange-500" />
              {t("trendingTitle")}
            </CardTitle>
            <CardDescription className="text-xs">{t("trendingDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : recommendations?.trending_topics && recommendations.trending_topics.length > 0 ? (
              recommendations.trending_topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="border-border/60 bg-muted/20 space-y-1 rounded-lg border p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">{topic.topic}</span>
                    <Badge variant="secondary" className="text-[10px] capitalize">
                      {topic.engagement_potential}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">{topic.recommendation}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground py-4 text-xs">{t("noTrending")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Actionable Recommendations ───────────────────────────────────── */}
      {recommendations?.actionable_recommendations &&
        recommendations.actionable_recommendations.length > 0 && (
          <Card className="border-border/70 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="size-4 text-amber-500" />
                {t("actionableTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {recommendations.actionable_recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="border-border/60 bg-muted/20 flex items-start gap-2.5 rounded-lg border p-3 text-xs"
                  >
                    <span className="bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                      {i + 1}
                    </span>
                    <p className="text-foreground leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
