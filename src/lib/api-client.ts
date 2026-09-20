import axios from "axios";
import { toast } from "sonner";

import { env } from "@/lib/env";

/**
 * Pre-configured Axios instance with:
 * - Base URL from validated env vars (NEXT_PUBLIC_API_BASE_URL)
 * - JSON content type defaults
 * - Request interceptor: injects Authorization header from localStorage
 * - Response interceptor: handles 401 token refresh, 403/5xx with toast notifications
 *
 * Usage: import { apiClient } from "@/lib/api-client"
 * Then: apiClient.get("/api/v1/..."), apiClient.post("/api/v1/...", data)
 */
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Inject Bearer token if available
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message =
      error.response?.data?.detail ??
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred";

    // ── 401: Try token refresh ──────────────────────────────────────────────
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const newAccessToken: string = data.access_token;
          localStorage.setItem("access_token", newAccessToken);
          if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
          }
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Refresh failed — clear auth and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          toast.error("Session expired. Please sign in again.");
          if (typeof window !== "undefined") {
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        isRefreshing = false;
        toast.error("Session expired. Please sign in again.");
        if (typeof window !== "undefined") {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login";
        }
      }
    }

    // ── Other Error Handling ────────────────────────────────────────────────
    switch (status) {
      case 403:
        toast.error("You don't have permission to perform this action.");
        break;
      case 422:
        // Validation errors — let individual handlers deal with field-level errors
        break;
      case 429:
        toast.error("Too many requests. Please slow down.");
        break;
      case 500:
      case 502:
      case 503:
        toast.error(`Server error (${status}): ${message}`);
        break;
      default:
        if (status && status >= 400 && status !== 401) {
          toast.error(message);
        }
    }

    return Promise.reject(error);
  },
);
