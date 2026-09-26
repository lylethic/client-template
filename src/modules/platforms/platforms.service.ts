import type {
  ConnectWithChannelIdRequest,
  FacebookConnectPageRequest,
  FacebookPageItem,
  InstagramConnectRequest,
  OAuthAuthorizeUrlResponse,
  OAuthCallbackRequest,
  PlatformAccountResponse,
  PlatformSyncResponse,
} from "@/types/api";
import { apiClient } from "@/lib/api-client";

/**
 * Platforms API service.
 * Backend prefix: /api/v1/platforms
 */

// ─── Generic Platform Account CRUD ───────────────────────────────────────────

/** GET /api/v1/platforms – list all connected platform accounts */
export async function listPlatformAccounts(platform?: string): Promise<PlatformAccountResponse[]> {
  const { data } = await apiClient.get<PlatformAccountResponse[]>("/api/v1/platforms", {
    params: platform ? { platform } : undefined,
  });
  return data;
}

/** GET /api/v1/platforms/:id */
export async function getPlatformAccount(accountId: string): Promise<PlatformAccountResponse> {
  const { data } = await apiClient.get<PlatformAccountResponse>(`/api/v1/platforms/${accountId}`);
  return data;
}

/** DELETE /api/v1/platforms/:id */
export async function deletePlatformAccount(accountId: string): Promise<void> {
  await apiClient.delete(`/api/v1/platforms/${accountId}`);
}

/** POST /api/v1/platforms/:id/sync */
export async function syncPlatformAccount(
  accountId: string,
  limit = 20,
): Promise<PlatformSyncResponse> {
  const { data } = await apiClient.post<PlatformSyncResponse>(
    `/api/v1/platforms/${accountId}/sync`,
    null,
    { params: { limit } },
  );
  return data;
}

// ─── YouTube ─────────────────────────────────────────────────────────────────

/** GET /api/v1/platforms/youtube/authorize */
export async function getYouTubeAuthUrl(redirectUri?: string): Promise<OAuthAuthorizeUrlResponse> {
  const { data } = await apiClient.get<OAuthAuthorizeUrlResponse>(
    "/api/v1/platforms/youtube/authorize",
    { params: redirectUri ? { redirect_uri: redirectUri } : undefined },
  );
  return data;
}

/** POST /api/v1/platforms/youtube/callback */
export async function connectYouTubeOAuth(
  payload: OAuthCallbackRequest,
): Promise<PlatformAccountResponse> {
  const { data } = await apiClient.post<PlatformAccountResponse>(
    "/api/v1/platforms/youtube/callback",
    payload,
  );
  return data;
}

/** POST /api/v1/platforms/youtube/connect-channel */
export async function connectYouTubeChannelById(
  payload: ConnectWithChannelIdRequest,
): Promise<PlatformAccountResponse> {
  const { data } = await apiClient.post<PlatformAccountResponse>(
    "/api/v1/platforms/youtube/connect-channel",
    payload,
  );
  return data;
}

// ─── Facebook ────────────────────────────────────────────────────────────────

/** GET /api/v1/platforms/facebook/authorize */
export async function getFacebookAuthUrl(redirectUri?: string): Promise<OAuthAuthorizeUrlResponse> {
  const { data } = await apiClient.get<OAuthAuthorizeUrlResponse>(
    "/api/v1/platforms/facebook/authorize",
    { params: redirectUri ? { redirect_uri: redirectUri } : undefined },
  );
  return data;
}

/** POST /api/v1/platforms/facebook/callback */
export async function connectFacebookOAuth(
  payload: OAuthCallbackRequest,
): Promise<PlatformAccountResponse> {
  const { data } = await apiClient.post<PlatformAccountResponse>(
    "/api/v1/platforms/facebook/callback",
    payload,
  );
  return data;
}

/** GET /api/v1/platforms/facebook/pages */
export async function listFacebookPages(accessToken?: string): Promise<FacebookPageItem[]> {
  const { data } = await apiClient.get<FacebookPageItem[]>("/api/v1/platforms/facebook/pages", {
    params: accessToken ? { access_token: accessToken } : undefined,
  });
  return data;
}

/** POST /api/v1/platforms/facebook/connect-page */
export async function connectFacebookPage(
  payload: FacebookConnectPageRequest,
): Promise<PlatformAccountResponse> {
  const { data } = await apiClient.post<PlatformAccountResponse>(
    "/api/v1/platforms/facebook/connect-page",
    payload,
  );
  return data;
}

// ─── Instagram ───────────────────────────────────────────────────────────────

/** GET /api/v1/platforms/instagram/authorize */
export async function getInstagramAuthUrl(
  redirectUri?: string,
): Promise<OAuthAuthorizeUrlResponse> {
  const { data } = await apiClient.get<OAuthAuthorizeUrlResponse>(
    "/api/v1/platforms/instagram/authorize",
    { params: redirectUri ? { redirect_uri: redirectUri } : undefined },
  );
  return data;
}

/** POST /api/v1/platforms/instagram/callback */
export async function connectInstagramOAuth(
  payload: OAuthCallbackRequest,
): Promise<PlatformAccountResponse> {
  const { data } = await apiClient.post<PlatformAccountResponse>(
    "/api/v1/platforms/instagram/callback",
    payload,
  );
  return data;
}

/** POST /api/v1/platforms/instagram/connect-account */
export async function connectInstagramAccount(
  payload: InstagramConnectRequest,
): Promise<PlatformAccountResponse> {
  const { data } = await apiClient.post<PlatformAccountResponse>(
    "/api/v1/platforms/instagram/connect-account",
    payload,
  );
  return data;
}

// ─── Threads ─────────────────────────────────────────────────────────────────

/** GET /api/v1/platforms/threads/authorize */
export async function getThreadsAuthUrl(redirectUri?: string): Promise<OAuthAuthorizeUrlResponse> {
  const { data } = await apiClient.get<OAuthAuthorizeUrlResponse>(
    "/api/v1/platforms/threads/authorize",
    { params: redirectUri ? { redirect_uri: redirectUri } : undefined },
  );
  return data;
}

/** POST /api/v1/platforms/threads/callback */
export async function connectThreadsOAuth(
  payload: OAuthCallbackRequest,
): Promise<PlatformAccountResponse> {
  const { data } = await apiClient.post<PlatformAccountResponse>(
    "/api/v1/platforms/threads/callback",
    payload,
  );
  return data;
}

// ─── TikTok ──────────────────────────────────────────────────────────────────

/** GET /api/v1/platforms/tiktok/authorize */
export async function getTikTokAuthUrl(redirectUri?: string): Promise<OAuthAuthorizeUrlResponse> {
  const { data } = await apiClient.get<OAuthAuthorizeUrlResponse>(
    "/api/v1/platforms/tiktok/authorize",
    { params: redirectUri ? { redirect_uri: redirectUri } : undefined },
  );
  return data;
}

/** POST /api/v1/platforms/tiktok/callback */
export async function connectTikTokOAuth(
  payload: OAuthCallbackRequest,
): Promise<PlatformAccountResponse> {
  const { data } = await apiClient.post<PlatformAccountResponse>(
    "/api/v1/platforms/tiktok/callback",
    payload,
  );
  return data;
}
