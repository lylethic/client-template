import { apiClient } from "@/lib/api-client";

import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";

/**
 * Authentication API service.
 *
 * All requests go through the shared `apiClient` (Axios instance) which
 * automatically injects the Bearer token and handles 4xx/5xx errors.
 */

/** POST /v1/login */
export async function login(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/v1/login", body);
  return data;
}

/** POST /v1/register */
export async function register(body: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/v1/register", body);
  return data;
}
