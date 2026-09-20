import type {
  ChannelDetailResponse,
  ChannelGrowthResponse,
  MetricSnapshotResponse,
  PlatformSyncResponse,
} from "@/types/api";
import { apiClient } from "@/lib/api-client";

/**
 * Channels API service.
 * Backend prefix: /api/v1/channels
 */

/** GET /api/v1/channels – list all channels with latest metrics */
export async function listChannels(platform?: string): Promise<ChannelDetailResponse[]> {
  const { data } = await apiClient.get<ChannelDetailResponse[]>("/api/v1/channels", {
    params: platform ? { platform } : undefined,
  });
  return data;
}

/** GET /api/v1/channels/:id – get channel detail */
export async function getChannelDetail(accountId: string): Promise<ChannelDetailResponse> {
  const { data } = await apiClient.get<ChannelDetailResponse>(`/api/v1/channels/${accountId}`);
  return data;
}

/** GET /api/v1/channels/:id/snapshots – historical metric snapshots */
export async function getChannelSnapshots(
  accountId: string,
  days = 30,
): Promise<MetricSnapshotResponse[]> {
  const { data } = await apiClient.get<MetricSnapshotResponse[]>(
    `/api/v1/channels/${accountId}/snapshots`,
    { params: { days } },
  );
  return data;
}

/** GET /api/v1/channels/:id/growth – WoW & MoM growth rates */
export async function getChannelGrowth(accountId: string): Promise<ChannelGrowthResponse> {
  const { data } = await apiClient.get<ChannelGrowthResponse>(
    `/api/v1/channels/${accountId}/growth`,
  );
  return data;
}

/** POST /api/v1/channels/:id/sync – trigger manual on-demand sync */
export async function syncChannel(accountId: string, limit = 20): Promise<PlatformSyncResponse> {
  const { data } = await apiClient.post<PlatformSyncResponse>(
    `/api/v1/channels/${accountId}/sync`,
    null,
    { params: { limit } },
  );
  return data;
}
