import { cookies } from "next/headers";

import { env } from "@/lib/env";

export interface ServerFetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
}

/**
 * Universal Server-Side API Fetcher for Next.js Server Components.
 *
 * Automatically:
 * - Prepends NEXT_PUBLIC_API_BASE_URL.
 * - Extracts `access_token` from request cookies (via `next/headers`).
 * - Attaches `Authorization: Bearer <token>` and JSON headers.
 * - Parses query parameters safely into the request URL.
 * - Throws structured errors with response status on HTTP errors.
 *
 * @example
 * // Inside an async Server Component:
 * const summary = await serverFetch<InsightsSummaryResponse>("/api/v1/insights/summary", {
 *   params: { platform: "youtube" },
 * });
 */
export async function serverFetch<T = unknown>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const { params, token: explicitToken, headers: customHeaders, ...fetchOptions } = options;

  let token = explicitToken;
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("access_token")?.value;
    } catch {
      // In static prerendering or contexts outside of incoming request
      token = undefined;
    }
  }

  const baseUrl = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  let url = `${baseUrl}${cleanEndpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers = new Headers(customHeaders);
  headers.set("Content-Type", "application/json");
  if (process.env.NODE_ENV === "development") {
    headers.set("ngrok-skip-browser-warning", "true");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Server API Error (${response.status}): ${response.statusText}`;
    try {
      const errorJson = (await response.json()) as { detail?: string; message?: string };
      errorDetail = errorJson.detail || errorJson.message || errorDetail;
    } catch {
      // Response body wasn't JSON
    }
    const err = new Error(errorDetail);
    (err as Error & { status: number }).status = response.status;
    throw err;
  }

  return response.json() as Promise<T>;
}
