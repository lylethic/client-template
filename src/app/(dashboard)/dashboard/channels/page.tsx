"use client";

import { useState } from "react";
import { Eye, FileText, RefreshCw, TrendingUp, Users } from "lucide-react";

import { useChannels, useSyncChannel } from "@/hooks/use-channels";
import { ConnectPlatformDialog } from "@/components/dashboard/connect-platform-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const PLATFORM_OPTIONS = [
  { value: "all", label: "All Platforms" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "threads", label: "Threads" },
];

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "bg-red-500",
  facebook: "bg-blue-600",
  instagram: "bg-pink-500",
  threads: "bg-neutral-800",
};

export default function ChannelsPage() {
  const [platform, setPlatform] = useState<string | undefined>(undefined);
  const { data: channels, isLoading } = useChannels(platform);
  const syncMutation = useSyncChannel();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="border-border/80 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Quản Lý Kênh & Snapshot</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Danh sách tất cả các kênh mạng xã hội kèm số liệu snapshot mới nhất
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Select
            value={platform ?? "all"}
            onValueChange={(v) => setPlatform(!v || v === "all" ? undefined : v)}
          >
            <SelectTrigger className="w-full text-xs sm:w-40">
              <SelectValue placeholder="Lọc nền tảng" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ConnectPlatformDialog />
        </div>
      </div>

      {/* Channels Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : channels?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No channels found.{" "}
              <a href="/dashboard/platforms" className="underline">
                Connect a platform
              </a>{" "}
              to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {channels?.map((ch) => (
            <Card key={ch.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {ch.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ch.avatar_url}
                      alt={ch.account_name}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex size-10 items-center justify-center rounded-full text-xs font-bold text-white ${PLATFORM_COLORS[ch.platform] ?? "bg-gray-400"}`}
                    >
                      {ch.platform.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{ch.account_name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {ch.account_handle ?? ch.platform_account_id}
                    </p>
                  </div>
                  <Badge
                    variant={ch.is_active ? "default" : "secondary"}
                    className="shrink-0 capitalize"
                  >
                    {ch.platform}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="text-muted-foreground size-3.5" />
                    <span>{formatNumber(ch.latest_snapshot?.followers_count ?? 0)} followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="text-muted-foreground size-3.5" />
                    <span>{formatNumber(ch.latest_snapshot?.views_count ?? 0)} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-muted-foreground size-3.5" />
                    <span>{(ch.latest_snapshot?.engagement_rate ?? 0).toFixed(2)}% ER</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground size-3.5" />
                    <span>{ch.posts_count} posts</span>
                  </div>
                </div>

                {/* Sync Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={syncMutation.isPending}
                  onClick={() => syncMutation.mutate({ accountId: ch.id })}
                >
                  <RefreshCw
                    className={`mr-2 size-3.5 ${syncMutation.isPending ? "animate-spin" : ""}`}
                    aria-hidden
                  />
                  Sync Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
