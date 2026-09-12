import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ─── Auth Store Types ────────────────────────────────────────────────────────

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User, token: string) => void;
  clearAuth: () => void;
}

// ─── Auth Store ──────────────────────────────────────────────────────────────

/**
 * Global authentication store using Zustand.
 *
 * Persists user session to localStorage (access_token + user profile).
 * Use the `devtools` middleware to inspect state in Redux DevTools.
 *
 * @example
 * const { user, isAuthenticated, clearAuth } = useAuthStore();
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,

        setUser: (user, accessToken) => {
          localStorage.setItem("access_token", accessToken);
          set({ user, accessToken, isAuthenticated: true }, false, "auth/setUser");
        },

        clearAuth: () => {
          localStorage.removeItem("access_token");
          set(
            { user: null, accessToken: null, isAuthenticated: false },
            false,
            "auth/clearAuth",
          );
        },
      }),
      {
        name: "auth-storage",
        // Only persist the user profile — not the token (handled via localStorage separately)
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      },
    ),
    { name: "AuthStore" },
  ),
);
