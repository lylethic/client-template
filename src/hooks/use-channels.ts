import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getChannelDetail,
  getChannelGrowth,
  getChannelSnapshots,
  listChannels,
  syncChannel,
} from "@/modules/channels/channels.service";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const channelKeys = {
  all: ["channels"] as const,
  list: (platform?: string) => [...channelKeys.all, "list", platform] as const,
  detail: (id: string) => [...channelKeys.all, "detail", id] as const,
  snapshots: (id: string, days: number) => [...channelKeys.all, "snapshots", id, days] as const,
  growth: (id: string) => [...channelKeys.all, "growth", id] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useChannels(platform?: string) {
  return useQuery({
    queryKey: channelKeys.list(platform),
    queryFn: () => listChannels(platform),
  });
}

export function useChannelDetail(accountId: string) {
  return useQuery({
    queryKey: channelKeys.detail(accountId),
    queryFn: () => getChannelDetail(accountId),
    enabled: !!accountId,
  });
}

export function useChannelSnapshots(accountId: string, days = 30) {
  return useQuery({
    queryKey: channelKeys.snapshots(accountId, days),
    queryFn: () => getChannelSnapshots(accountId, days),
    enabled: !!accountId,
  });
}

export function useChannelGrowth(accountId: string) {
  return useQuery({
    queryKey: channelKeys.growth(accountId),
    queryFn: () => getChannelGrowth(accountId),
    enabled: !!accountId,
  });
}

export function useSyncChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, limit }: { accountId: string; limit?: number }) =>
      syncChannel(accountId, limit),
    onSuccess: (data) => {
      toast.success(`Synced ${data.posts_synced_count} posts for ${data.channel_name}`);
      // Invalidate channel queries to refresh metrics
      void queryClient.invalidateQueries({ queryKey: channelKeys.all });
    },
    onError: () => {
      toast.error("Failed to sync channel. Please try again.");
    },
  });
}
