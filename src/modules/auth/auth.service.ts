import { apiClient } from "@/lib/api-client";

import type {
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "./types";

/**
 * Authentication API service.
 *
 * All requests go through the shared `apiClient` (Axios instance) which
 * automatically injects the Bearer token and handles 4xx/5xx errors.
 *
 * Backend base path: /api/v1/auth
 */

/** POST /api/v1/auth/login – returns JWT token pair */
export async function login(body: LoginRequest): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/api/v1/auth/login", body);
  return data;
}

/** POST /api/v1/auth/register – creates account, returns UserResponse */
export async function register(body: RegisterRequest): Promise<User> {
  const { data } = await apiClient.post<User>("/api/v1/auth/register", body);
  return data;
}

/** POST /api/v1/auth/refresh – exchange refresh token for new token pair */
export async function refreshToken(body: RefreshTokenRequest): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/api/v1/auth/refresh", body);
  return data;
}

/** GET /api/v1/auth/me – get current user profile */
export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/api/v1/auth/me");
  return data;
}

/** GET /api/v1/auth/google/url – get Google OAuth consent URL */
export async function getGoogleAuthUrl(): Promise<{ url: string }> {
  const { data } = await apiClient.get<{ url: string }>("/api/v1/auth/google/url");
  return data;
}

/** POST /api/v1/auth/google – authenticate with Google code or ID token */
export async function googleLogin(body: {
  code?: string;
  id_token?: string;
  redirect_uri?: string;
}): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/api/v1/auth/google", body);
  return data;
}
