"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  HeartHandshake,
  Radio,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { useContentRecommendations, useExecutiveSummary } from "@/hooks/use-ai";
import { useChannels, useSyncChannel } from "@/hooks/use-channels";
import { useInsightsSummary, useTopContent } from "@/hooks/use-insights";
import { ConnectPlatformDialog } from "@/components/dashboard/connect-platform-dialog";
import { PostAiDialog } from "@/components/dashboard/post-ai-dialog";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadBlob, exportReport } from "@/modules/reports/reports.service";
import type { ReportTimeframe } from "@/modules/reports/reports.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(n?: number): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

const PLATFORM_DOT: Record<string, string> = {
  youtube: "bg-red-500",
  tiktok: "bg-black dark:bg-zinc-200",
  facebook: "bg-blue-600",
  instagram: "bg-pink-500",
  threads: "bg-neutral-800 dark:bg-neutral-200",
};

type FilterPlatform = "all" | "youtube" | "tiktok" | "facebook" | "instagram" | "threads";

export default function DashboardOverviewPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

  const [selectedPlatform, setSelectedPlatform] = useState<FilterPlatform>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<ReportTimeframe>("30d");
  const [isExporting, setIsExporting] = useState(false);
  const [isFreshSyncing, setIsFreshSyncing] = useState(false);

  // 1. Data hooks
  const platformParam = selectedPlatform === "all" ? undefined : selectedPlatform;
  const daysParam = selectedTimeframe === "7d" ? 7 : selectedTimeframe === "30d" ? 30 : 90;

  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isFetching: isSummaryFetching,
  } = useInsightsSummary({
    platform: platformParam,
    fresh: isFreshSyncing,
  });

  const { data: channels, isLoading: isChannelsLoading } = useChannels(platformParam);
  const syncChannelMutation = useSyncChannel();

  const { data: topContent, isLoading: isTopLoading } = useTopContent({
    platform: platformParam,
    limit: 6,
    sort_by: "engagement_rate",
    days: daysParam,
  });

  const { data: execSummary, isLoading: isExecLoading } = useExecutiveSummary(daysParam);
  const { data: recs } = useContentRecommendations(platformParam);

  // 2. Refresh / Sync handler
  const handleTriggerFreshSync = async () => {
    setIsFreshSyncing(true);
    try {
      await refetchSummary();
      toast.success(tCommon("syncSuccess"));
    } catch {
      toast.error(tCommon("exportFailed"));
    } finally {
      setIsFreshSyncing(false);
    }
  };

  // 3. Export Report handler
  const handleExportQuickReport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportReport({
        format: "excel",
        timeframe: selectedTimeframe,
        platform: platformParam,
      });
      const filename = `social_insight_report_${selectedTimeframe}.xlsx`;
      downloadBlob(blob, filename);
      toast.success(tCommon("exportSuccess"));
    } catch {
      toast.error(tCommon("exportFailed"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* ── 1. Top Control Bar ──────────────────────────────────────────────── */}
      <div className="border-border/80 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {t("title")}
            </h1>
            {summary?.cached && (
              <span className="bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                {tCommon("cachedData")}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">{t("description")}</p>
        </div>

        {/* Quick action buttons: responsive full-width on mobile */}
        <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-2.5">
          <Button
            variant="outline"
            size="default"
            onClick={handleTriggerFreshSync}
            disabled={isSummaryFetching || isFreshSyncing}
            className="h-9 flex-1 justify-center px-3 text-xs shadow-xs sm:flex-initial sm:px-3.5 sm:text-sm"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 sm:mr-2 sm:size-4 ${
                isSummaryFetching || isFreshSyncing ? "text-primary animate-spin" : ""
              }`}
              aria-hidden="true"
            />
            {isSummaryFetching || isFreshSyncing ? tCommon("syncing") : tCommon("syncNow")}
          </Button>

          <Button
            size="default"
            onClick={handleExportQuickReport}
            disabled={isExporting}
            className="h-9 flex-1 justify-center gap-1.5 px-3 text-xs shadow-xs sm:flex-initial sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Download className="size-3.5 sm:size-4" aria-hidden="true" />
            {isExporting ? tCommon("exporting") : tCommon("exportExcel")}
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Bar (Platform Tabs & Timeframe Chips) ────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Platforms: Smooth horizontal scrolling on mobile */}
        <div
          className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1 sm:gap-2 sm:pb-0"
          role="tablist"
          aria-label="Channels filter"
        >
          {(["all", "youtube", "tiktok", "facebook", "instagram", "threads"] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={selectedPlatform === p}
              onClick={() => setSelectedPlatform(p)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap capitalize transition-all sm:text-sm ${
                selectedPlatform === p
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {p === "all" ? tCommon("allPlatforms") : p}
            </button>
          ))}
        </div>

        {/* Timeframe selector */}
        <div className="border-border/70 bg-muted/40 flex w-full justify-between rounded-lg border p-1 sm:inline-flex sm:w-auto">
          {(["7d", "30d", "90d"] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setSelectedTimeframe(tf)}
              className={`flex-1 rounded-md px-3 py-1 text-center text-xs font-medium transition-all sm:flex-initial sm:text-sm ${
                selectedTimeframe === tf
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf === "7d"
                ? tCommon("time7d")
                : tf === "30d"
                  ? tCommon("time30d")
                  : tCommon("time90d")}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. KPI Grid (4 Key Metrics) ────────────────────────────────────── */}
      <section aria-label="KPI Metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t("totalFollowers")}
            value={formatNumber(summary?.total_followers)}
            growthRate={summary?.growth?.followers_wow?.growth_rate}
            timeframe="WoW"
            icon={Users}
            loading={isSummaryLoading}
          />
          <StatCard
            title={t("totalViews")}
            value={formatNumber(summary?.total_views)}
            growthRate={summary?.growth?.followers_mom?.growth_rate}
            timeframe="MoM"
            icon={Eye}
            loading={isSummaryLoading}
          />
          <StatCard
            title={t("totalInteractions")}
            value={formatNumber(summary?.total_interactions)}
            note="Likes, Shares, Comments"
            icon={HeartHandshake}
            loading={isSummaryLoading}
          />
          <StatCard
            title={t("avgEngagementRate")}
            value={summary ? `${summary.average_engagement_rate.toFixed(2)}%` : undefined}
            note={
              summary && summary.average_engagement_rate >= 5
                ? t("veryPositiveEr")
                : t("standardEr")
            }
            isPositive={summary ? summary.average_engagement_rate >= 5 : undefined}
            icon={TrendingUp}
            loading={isSummaryLoading}
          />
        </div>
      </section>

      {/* ── 4. AI Strategic Insights & Connected Channels Hub ─────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* AI Strategic Insights Hub */}
        <Card className="border-border/70 shadow-xs lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Sparkles className="size-4.5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">{t("aiStrategyTitle")}</CardTitle>
                <p className="text-muted-foreground text-sm">{t("aiStrategyDesc")}</p>
              </div>
            </div>
            <Link
              href="/dashboard/ai"
              className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
            >
              {t("viewDetails")} <ArrowUpRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {isExecLoading ? (
              <div className="space-y-2 py-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-14 w-full rounded-md" />
              </div>
            ) : execSummary ? (
              <>
                <div className="bg-muted/40 text-foreground rounded-lg p-4 text-sm leading-relaxed">
                  <span className="text-foreground font-bold">
                    {execSummary.summary_headline}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {execSummary.summary_markdown.slice(0, 220)}
                    {execSummary.summary_markdown.length > 220 ? "..." : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {execSummary.top_highlights?.[0] && (
                    <div className="border-border/60 flex items-start gap-2.5 rounded-lg border p-3.5">
                      <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div className="text-sm">
                        <div className="text-foreground font-semibold">{t("highlights")}</div>
                        <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                          {execSummary.top_highlights[0]}
                        </p>
                      </div>
                    </div>
                  )}

                  {recs?.best_times_to_post?.[0] ? (
                    <div className="border-border/60 flex items-start gap-2.5 rounded-lg border p-3.5">
                      <Clock className="mt-0.5 size-4.5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <div className="text-sm">
                        <div className="text-foreground font-semibold">{t("bestPostingTimes")}</div>
                        <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                          {recs.best_times_to_post[0].day_of_week} (
                          {recs.best_times_to_post[0].time_window})
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-border/60 flex items-start gap-2.5 rounded-lg border p-3.5">
                      <AlertCircle className="mt-0.5 size-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <div className="text-sm">
                        <div className="text-foreground font-semibold">{t("strategicNotes")}</div>
                        <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                          {t("strategicNotesDesc")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground py-4 text-sm">{t("noAiDataPeriod")}</p>
            )}
          </CardContent>
        </Card>

        {/* Connected Channels Hub */}
        <Card className="border-border/70 flex flex-col justify-between shadow-xs">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">{t("connectedChannelsTitle")}</CardTitle>
                <p className="text-muted-foreground text-sm">{t("connectedChannelsDesc")}</p>
              </div>
              <Badge variant="outline" className="text-xs font-semibold">
                {t("channelsCount", { count: channels?.length ?? 0 })}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {isChannelsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))
              ) : channels && channels.length > 0 ? (
                channels.slice(0, 4).map((ch) => (
                  <div
                    key={ch.id}
                    className="border-border/60 bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <span
                        className={`size-2.5 shrink-0 rounded-full ${
                          PLATFORM_DOT[ch.platform] ?? "bg-gray-400"
                        }`}
                      />
                      <div className="truncate">
                        <p className="text-foreground truncate text-sm font-semibold">
                          {ch.account_name}
                        </p>
                        <p className="text-muted-foreground text-xs capitalize">{ch.platform}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-foreground text-right text-sm font-bold">
                        {formatNumber(ch.latest_snapshot?.followers_count ?? 0)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground size-7"
                        title={t("syncThisChannel")}
                        onClick={() => syncChannelMutation.mutate({ accountId: ch.id })}
                        disabled={syncChannelMutation.isPending}
                      >
                        <RefreshCw className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-border text-muted-foreground rounded-lg border border-dashed p-5 text-center text-sm">
                  {t("noChannelsConnected")}
                </div>
              )}
            </CardContent>
          </div>

          <div className="p-4 pt-0">
            <ConnectPlatformDialog
              trigger={
                <Button variant="outline" className="h-9 w-full text-sm font-medium shadow-2xs">
                  <Radio className="mr-2 size-4" />
                  {t("addChannelBtn")}
                </Button>
              }
            />
          </div>
        </Card>
      </div>

      {/* ── 5. Top Content Performance Table ──────────────────────────────── */}
      <Card className="border-border/70 overflow-hidden shadow-xs">
        <CardHeader className="border-border/70 flex flex-row items-center justify-between border-b pb-3.5">
          <div>
            <CardTitle className="text-base font-bold">{t("topPostsTitle")}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {t("topPostsDesc", {
                timeframe:
                  selectedTimeframe === "7d"
                    ? tCommon("time7d")
                    : selectedTimeframe === "30d"
                      ? tCommon("time30d")
                      : tCommon("time90d"),
              })}
            </p>
          </div>
          <Link
            href="/dashboard/posts"
            className="text-primary text-sm font-medium hover:underline"
          >
            {t("viewAllPosts")}
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-border/60 bg-muted/40 text-muted-foreground border-b text-xs font-semibold tracking-wider uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    {t("thPost")}
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    {t("thPlatform")}
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    {t("thFormat")}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right">
                    {t("thViews")}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right">
                    {t("thInteractions")}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right">
                    {t("thEr")}
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    {t("thActions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {isTopLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-5 py-4">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : topContent?.items && topContent.items.length > 0 ? (
                  topContent.items.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                      <td className="text-foreground max-w-sm truncate px-5 py-3.5 text-sm font-medium">
                        {post.title ?? post.content?.slice(0, 60) ?? t("untitledPost")}
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold capitalize">
                          {post.platform}
                        </span>
                      </td>
                      <td className="text-muted-foreground px-3 py-3.5 text-xs font-medium capitalize">
                        {post.post_type}
                      </td>
                      <td className="text-foreground px-3 py-3.5 text-right text-sm font-semibold">
                        {formatNumber(post.views_count)}
                      </td>
                      <td className="text-muted-foreground px-3 py-3.5 text-right text-sm">
                        {formatNumber(post.likes_count + post.comments_count + post.shares_count)}
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {post.engagement_rate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <PostAiDialog postId={post.id} postTitle={post.title} />

                          {post.url && (
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1"
                              title={tCommon("viewOriginal")}
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-muted-foreground px-5 py-8 text-center text-sm">
                      {t("noPostsPeriod")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
