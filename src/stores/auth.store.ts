import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { User, UserRole } from "@/modules/auth/types";

// ─── Auth Store Types ─────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User, token: string) => void;
  clearAuth: () => void;

  // Helpers
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  isCustomer: () => boolean;
}

// ─── Auth Store ───────────────────────────────────────────────────────────────

/**
 * Global authentication store using Zustand.
 *
 * Persists user session to localStorage (user profile + isAuthenticated flag).
 * The raw access token is stored separately in localStorage via `api-client.ts`.
 * Use the `devtools` middleware to inspect state in Redux DevTools.
 *
 * @example
 * const { user, isAuthenticated, clearAuth, isAdmin } = useAuthStore();
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,

        setUser: (user, accessToken) => {
          localStorage.setItem("access_token", accessToken);
          set({ user, accessToken, isAuthenticated: true }, false, "auth/setUser");
        },

        clearAuth: () => {
          localStorage.removeItem("access_token");
          set({ user: null, accessToken: null, isAuthenticated: false }, false, "auth/clearAuth");
        },

        hasRole: (role) => get().user?.roles.includes(role) ?? false,
        isAdmin: () => get().hasRole("ADMIN"),
        isStaff: () => get().hasRole("STAFF"),
        isCustomer: () => get().hasRole("CUSTOMER"),
      }),
      {
        name: "auth-storage",
        // Only persist the user profile — token is managed separately
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: "AuthStore" },
  ),
);
