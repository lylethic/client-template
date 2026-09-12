import axios from "axios";
import { toast } from "sonner";

import { env } from "@/lib/env";

/**
 * Pre-configured Axios instance with:
 * - Base URL from validated env vars
 * - JSON content type defaults
 * - Request interceptor: injects Authorization header from localStorage
 * - Response interceptor: handles 401/403/5xx with toast notifications
 *
 * Usage: import { apiClient } from "@/lib/api-client"
 * Then: apiClient.get("/users"), apiClient.post("/auth/login", data)
 */
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Inject Bearer token if available
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ?? error.message ?? "An unexpected error occurred";

    switch (status) {
      case 401:
        toast.error("Session expired. Please sign in again.");
        // TODO: Trigger token refresh or redirect to /login
        break;
      case 403:
        toast.error("You don't have permission to perform this action.");
        break;
      case 422:
        // Validation errors — let individual handlers deal with field-level errors
        break;
      case 500:
      case 502:
      case 503:
        toast.error(`Server error (${status}): ${message}`);
        break;
      default:
        if (status && status >= 400) {
          toast.error(message);
        }
    }

    return Promise.reject(error);
  },
);
