import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { User } from "@/modules/auth/types";

// ─── Auth Store Types ─────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User, accessToken: string) => void;
  clearAuth: () => void;

  // Helpers
  isAdmin: () => boolean;
}

// ─── Auth Store ───────────────────────────────────────────────────────────────

/**
 * Global authentication store using Zustand.
 *
 * Persists user session and isAuthenticated flag to localStorage.
 * Raw access/refresh tokens are stored separately in localStorage via this store.
 *
 * @example
 * const { user, isAuthenticated, clearAuth } = useAuthStore();
 */
export function setAuthCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax${secure}`;
}

export function removeAuthCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,

        setTokens: (accessToken, refreshToken) => {
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
          setAuthCookie("access_token", accessToken);
          set({ accessToken, refreshToken, isAuthenticated: true }, false, "auth/setTokens");
        },

        setUser: (user, accessToken) => {
          localStorage.setItem("access_token", accessToken);
          setAuthCookie("access_token", accessToken);
          setAuthCookie(
            "auth-storage",
            JSON.stringify({
              state: {
                user,
                isAuthenticated: true,
              },
            }),
          );
          set({ user, accessToken, isAuthenticated: true }, false, "auth/setUser");
        },

        clearAuth: () => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          removeAuthCookie("access_token");
          removeAuthCookie("refresh_token");
          removeAuthCookie("auth-storage");
          set(
            { user: null, accessToken: null, refreshToken: null, isAuthenticated: false },
            false,
            "auth/clearAuth",
          );
        },

        isAdmin: () => get().user?.is_superuser ?? false,
      }),
      {
        name: "auth-storage",
        // Only persist the user profile and auth status — tokens managed separately
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: "AuthStore" },
  ),
);
