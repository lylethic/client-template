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
 *  - /admin/**                → ADMIN or STAFF roles only
 *  - /dashboard/**            → authenticated CUSTOMER
 *  - everything else          → pass through
 */

// ─── Route Maps ──────────────────────────────────────────────────────────────

const PUBLIC_AUTH_ROUTES = ["/login", "/register"];
const ADMIN_PREFIX = "/admin";
const DASHBOARD_PREFIX = "/dashboard";

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface PersistedAuthState {
  user: { roles: string[] } | null;
  isAuthenticated: boolean;
}

function parseAuthCookie(req: NextRequest): PersistedAuthState | null {
  try {
    const raw = req.cookies.get("auth-storage")?.value;
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw)) as {
      state: PersistedAuthState;
    };
    return parsed.state ?? null;
  } catch {
    return null;
  }
}

// ─── Proxy ───────────────────────────────────────────────────────────────────

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const auth = parseAuthCookie(req);
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const roles: string[] = auth?.user?.roles ?? [];

  const isAdminOrStaff = roles.includes("ADMIN") || roles.includes("STAFF");
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((r) => pathname === r);
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isDashboardRoute = pathname.startsWith(DASHBOARD_PREFIX);

  // 1. Already logged in → redirect away from login/register
  if (isPublicAuthRoute && isAuthenticated) {
    const dest = isAdminOrStaff ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, req.nextUrl));
  }

  // 2. Admin routes → require ADMIN or STAFF role
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (!isAdminOrStaff) {
      // Authenticated customer trying to reach admin → send to their area
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
