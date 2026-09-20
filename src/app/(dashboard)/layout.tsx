import { DashboardShell } from "@/components/dashboard/dashboard-shell";

/**
 * Dashboard route group layout.
 *
 * Only reachable by authenticated users (enforced in proxy middleware).
 * Provides the fully responsive app shell:
 * - Desktop (>= 1024px): permanent fixed sidebar + scrollable main content.
 * - Mobile / Tablet (< 1024px): sticky topbar with hamburger toggle, logo, quick theme/locale switch, and slide-out navigation drawer with focus management.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
