import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  ConnectWithChannelIdRequest,
  FacebookConnectPageRequest,
  InstagramConnectRequest,
  OAuthCallbackRequest,
} from "@/types/api";
import {
  connectFacebookOAuth,
  connectFacebookPage,
  connectInstagramAccount,
  connectInstagramOAuth,
  connectThreadsOAuth,
  connectYouTubeChannelById,
  connectYouTubeOAuth,
  deletePlatformAccount,
  getFacebookAuthUrl,
  getInstagramAuthUrl,
  getPlatformAccount,
  getThreadsAuthUrl,
  getYouTubeAuthUrl,
  listFacebookPages,
  listPlatformAccounts,
  syncPlatformAccount,
} from "@/modules/platforms/platforms.service";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const platformKeys = {
  all: ["platforms"] as const,
  list: (platform?: string) => [...platformKeys.all, "list", platform] as const,
  detail: (id: string) => [...platformKeys.all, "detail", id] as const,
  facebookPages: () => [...platformKeys.all, "facebook-pages"] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function usePlatformAccounts(platform?: string) {
  return useQuery({
    queryKey: platformKeys.list(platform),
    queryFn: () => listPlatformAccounts(platform),
  });
}

export function usePlatformAccount(accountId: string) {
  return useQuery({
    queryKey: platformKeys.detail(accountId),
    queryFn: () => getPlatformAccount(accountId),
    enabled: !!accountId,
  });
}

export function useDeletePlatformAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => deletePlatformAccount(accountId),
    onSuccess: () => {
      toast.success("Platform account disconnected.");
      void queryClient.invalidateQueries({ queryKey: platformKeys.all });
    },
    onError: () => {
      toast.error("Failed to disconnect account.");
    },
  });
}

export function useSyncPlatformAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, limit }: { accountId: string; limit?: number }) =>
      syncPlatformAccount(accountId, limit),
    onSuccess: (data) => {
      toast.success(`Synced ${data.posts_synced_count} posts for ${data.channel_name}`);
      void queryClient.invalidateQueries({ queryKey: platformKeys.all });
    },
    onError: () => {
      toast.error("Sync failed. Please try again.");
    },
  });
}

// ─── YouTube ─────────────────────────────────────────────────────────────────

export function useYouTubeAuthUrl(redirectUri?: string) {
  return useQuery({
    queryKey: [...platformKeys.all, "youtube-auth", redirectUri],
    queryFn: () => getYouTubeAuthUrl(redirectUri),
    enabled: false, // only fetch on demand
  });
}

export function useConnectYouTubeOAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OAuthCallbackRequest) => connectYouTubeOAuth(payload),
    onSuccess: () => {
      toast.success("YouTube channel connected!");
      void queryClient.invalidateQueries({ queryKey: platformKeys.all });
    },
  });
}

export function useConnectYouTubeChannelById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConnectWithChannelIdRequest) => connectYouTubeChannelById(payload),
    onSuccess: () => {
      toast.success("YouTube channel connected!");
      void queryClient.invalidateQueries({ queryKey: platformKeys.all });
    },
  });
}

// ─── Facebook ────────────────────────────────────────────────────────────────

export function useFacebookAuthUrl(redirectUri?: string) {
  return useQuery({
    queryKey: [...platformKeys.all, "facebook-auth", redirectUri],
    queryFn: () => getFacebookAuthUrl(redirectUri),
    enabled: false,
  });
}

export function useConnectFacebookOAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OAuthCallbackRequest) => connectFacebookOAuth(payload),
    onSuccess: () => {
      toast.success("Facebook page connected!");
      void queryClient.invalidateQueries({ queryKey: platformKeys.all });
    },
  });
}

export function useFacebookPages(accessToken?: string) {
  return useQuery({
    queryKey: platformKeys.facebookPages(),
    queryFn: () => listFacebookPages(accessToken),
    enabled: false,
  });
}

export function useConnectFacebookPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FacebookConnectPageRequest) => connectFacebookPage(payload),
    onSuccess: () => {
      toast.success("Facebook page connected!");
      void queryClient.invalidateQueries({ queryKey: platformKeys.all });
    },
  });
}

// ─── Instagram ───────────────────────────────────────────────────────────────

export function useInstagramAuthUrl(redirectUri?: string) {
  return useQuery({
    queryKey: [...platformKeys.all, "instagram-auth", redirectUri],
    queryFn: () => getInstagramAuthUrl(redirectUri),
    enabled: false,
  });
}

export function useConnectInstagramOAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OAuthCallbackRequest) => connectInstagramOAuth(payload),
    onSuccess: () => {
      toast.success("Instagram account connected!");
      void queryClient.invalidateQueries({ queryKey: platformKeys.all });
    },
  });
}

export function useConnectInstagramAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InstagramConnectRequest) => connectInstagramAccount(payload),
    onSuccess: () => {
      toast.success("Instagram account connected!");
      void queryClient.invalidateQueries({ queryKey: platformKeys.all });
    },
  });
}

// ─── Threads ─────────────────────────────────────────────────────────────────

export function useThreadsAuthUrl(redirectUri?: string) {
  return useQuery({
    queryKey: [...platformKeys.all, "threads-auth", redirectUri],
    queryFn: () => getThreadsAuthUrl(redirectUri),
    enabled: false,
  });
}

export function useConnectThreadsOAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OAuthCallbackRequest) => connectThreadsOAuth(payload),
    onSuccess: () => {
      toast.success("Threads account connected!");
      void queryClient.invalidateQueries({ queryKey: platformKeys.all });
    },
  });
}
