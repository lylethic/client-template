// ─── Auth Types ──────────────────────────────────────────────────────────────

/** Backend UserResponse schema */
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// ─── Response Shapes ──────────────────────────────────────────────────────────

/** Backend Token schema */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Legacy alias kept for proxy.ts compatibility
export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export interface AuthResponse {
  accessToken: string;
  user: User;
}
