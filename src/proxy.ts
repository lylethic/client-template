import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Proxy — Role-based route protection.
 * (Next.js 16 convention replacing middleware)
 *
 * Strategy: optimistic check using `auth-storage` cookie (Zustand persist).
 * The proxy reads the persisted auth state from the cookie to decide
 * redirect direction without hitting the DB. Fine-grained server-side
 * authorization should still happen inside Server Components / Route Handlers.
 *
 * Route groups:
 *  - /login, /register        → public (redirect to home if already authenticated)
 *  - /admin/**                → superuser only (is_superuser = true)
 *  - /dashboard/**            → authenticated users
 *  - everything else          → pass through
 */

// ─── Route Maps ──────────────────────────────────────────────────────────────

const PUBLIC_AUTH_ROUTES = ["/login", "/register"];
const ADMIN_PREFIX = "/admin";
const DASHBOARD_PREFIX = "/dashboard";

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface PersistedUser {
  is_superuser?: boolean;
  role?: string;
  /** Legacy fields kept for backwards compat */
  roles?: string[];
}

interface PersistedAuthState {
  user: PersistedUser | null;
  isAuthenticated: boolean;
}

function parseAuthCookie(req: NextRequest): PersistedAuthState | null {
  try {
    const raw = req.cookies.get("auth-storage")?.value;
    if (raw) {
      const parsed = JSON.parse(decodeURIComponent(raw)) as {
        state: PersistedAuthState;
      };
      if (parsed.state) return parsed.state;
    }
    const token = req.cookies.get("access_token")?.value;
    if (token) {
      return { user: null, isAuthenticated: true };
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Proxy ───────────────────────────────────────────────────────────────────

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const auth = parseAuthCookie(req);
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const user = auth?.user;

  // Support both new (is_superuser / role) and legacy (roles) schemas
  const isSuperuser =
    user?.is_superuser === true ||
    user?.role === "admin" ||
    (Array.isArray(user?.roles) &&
      (user?.roles.includes("ADMIN") || user?.roles.includes("STAFF")));

  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((r) => pathname === r);
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isDashboardRoute = pathname.startsWith(DASHBOARD_PREFIX);

  // 1. Already logged in → redirect away from login/register
  if (isPublicAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 2. Admin routes → require superuser
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (!isSuperuser) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  // 3. Dashboard routes → require authentication
  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export default proxy;

// ─── Matcher ─────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Run on all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
