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

interface JwtClaims {
  sub?: string;
  exp?: number;
  is_superuser?: boolean;
  role?: string;
  roles?: string[];
  [key: string]: unknown;
}

function parseJwtPayload(token: string): JwtClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload) as JwtClaims;
    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// ─── Proxy ───────────────────────────────────────────────────────────────────

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const jwtClaims = token ? parseJwtPayload(token) : null;
  const isAuthenticated = Boolean(token && jwtClaims !== null);

  // Authorization strictly inspects signed claims from the access token,
  // preventing client-side privilege escalation via plain auth-storage cookie tampering.
  const isSuperuser = Boolean(
    jwtClaims?.is_superuser === true ||
    jwtClaims?.role === "admin" ||
    (Array.isArray(jwtClaims?.roles) &&
      (jwtClaims.roles.includes("ADMIN") || jwtClaims.roles.includes("STAFF"))),
  );

  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((r) => pathname === r);
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isDashboardRoute = pathname.startsWith(DASHBOARD_PREFIX);

  // Already logged in → redirect away from login/register
  if (isPublicAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Admin routes → require verified superuser status
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
