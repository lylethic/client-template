// ─── Auth Types ──────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  address?: string;
  dayOfBirth?: string;
  roles: UserRole[];
  avatarUrl?: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullname: string;
  username: string;
  email: string;
  password: string;
  address: string;
  dayOfBirth: string; // ISO date string e.g. "1999-12-31"
}

// ─── Response Shapes ──────────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
  user: User;
}
