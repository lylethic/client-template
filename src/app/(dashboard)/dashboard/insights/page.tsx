"use client";

import { useState } from "react";
import { Minus, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";

import {
  useGrowthAnalytics,
  useInsightsSummary,
  useTimeseries,
  useTopContent,
} from "@/hooks/use-insights";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const PLATFORM_OPTIONS = [
  { value: "all", label: "All Platforms" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "threads", label: "Threads" },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function GrowthBadge({ rate }: { rate: number }) {
  if (rate > 0) {
    return (
      <Badge variant="default" className="bg-green-600 text-xs">
        <TrendingUp className="mr-1 size-3" />+{rate.toFixed(1)}%
      </Badge>
    );
  }
  if (rate < 0) {
    return (
      <Badge variant="destructive" className="text-xs">
        <TrendingDown className="mr-1 size-3" />
        {rate.toFixed(1)}%
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-xs">
      <Minus className="mr-1 size-3" />
      0%
    </Badge>
  );
}

export default function InsightsPage() {
  const [platform, setPlatform] = useState<string | undefined>(undefined);
  const [days, setDays] = useState(30);
  const [fresh, setFresh] = useState(false);

  const { isLoading: summaryLoading, refetch: refetchSummary } = useInsightsSummary({
    platform,
    fresh,
  });
  const { data: growth, isLoading: growthLoading } = useGrowthAnalytics(platform);
  const { data: topContent } = useTopContent({ platform, limit: 5, days });
  const { data: timeseries } = useTimeseries({ platform, days });

  const handleRefresh = () => {
    setFresh(true);
    void refetchSummary().finally(() => setFresh(false));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground text-sm">Unified analytics and growth trends</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
            <Select
              value={platform ?? "all"}
              onValueChange={(v) => setPlatform(!v || v === "all" ? undefined : v)}
            >
              <SelectTrigger className="w-full text-xs sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="text-xs">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
              <SelectTrigger className="w-full text-xs sm:w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7" className="text-xs">
                  7 days
                </SelectItem>
                <SelectItem value="30" className="text-xs">
                  30 days
                </SelectItem>
                <SelectItem value="90" className="text-xs">
                  90 days
                </SelectItem>
                <SelectItem value="365" className="text-xs">
                  365 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={summaryLoading}
            className="h-9 w-full justify-center text-xs sm:w-auto"
          >
            <RefreshCw className={`mr-2 size-3.5 ${summaryLoading ? "animate-spin" : ""}`} />
            Live Data
          </Button>
        </div>
      </div>

      {/* Growth Overview */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Followers WoW Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {growthLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : growth ? (
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold">{formatNumber(growth.followers_wow.current)}</p>
                <GrowthBadge rate={growth.followers_wow.growth_rate} />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Followers MoM Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {growthLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : growth ? (
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold">{formatNumber(growth.followers_mom.current)}</p>
                <GrowthBadge rate={growth.followers_mom.growth_rate} />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Channel Growth Breakdown */}
      {growth && growth.channels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Channel Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {growth.channels.map((ch) => (
                <div key={ch.channel_id} className="flex items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{ch.channel_name}</p>
                    <p className="text-muted-foreground text-xs capitalize">{ch.platform}</p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">WoW</p>
                      <GrowthBadge rate={ch.followers_wow.growth_rate} />
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">MoM</p>
                      <GrowthBadge rate={ch.followers_mom.growth_rate} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Content */}
      {topContent && topContent.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topContent.items.map((post, idx) => (
                <div key={post.id} className="flex items-center gap-4">
                  <span className="text-muted-foreground w-5 shrink-0 text-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  {post.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnail_url}
                      alt={post.title ?? ""}
                      className="size-12 shrink-0 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">
                      {post.title ?? post.content?.slice(0, 60) ?? "Untitled"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {post.channel_name} · {post.engagement_rate.toFixed(2)}% ER ·{" "}
                      {formatNumber(post.views_count)} views
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs capitalize">
                    {post.platform}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Series (text summary) */}
      {timeseries && timeseries.points.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Metrics ({days}d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-xs">
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-right">Views</th>
                    <th className="py-2 text-right">Followers</th>
                    <th className="py-2 text-right">Likes</th>
                    <th className="py-2 text-right">ER%</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {timeseries.points
                    .slice(-14)
                    .reverse()
                    .map((pt) => (
                      <tr key={pt.date}>
                        <td className="py-1.5">{pt.date}</td>
                        <td className="py-1.5 text-right">{formatNumber(pt.views_count)}</td>
                        <td className="py-1.5 text-right">{formatNumber(pt.followers_count)}</td>
                        <td className="py-1.5 text-right">{formatNumber(pt.likes_count)}</td>
                        <td className="py-1.5 text-right">{pt.engagement_rate.toFixed(2)}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
