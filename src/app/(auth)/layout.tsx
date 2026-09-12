import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Authentication",
    template: "%s | Social Metrics",
  },
};

/**
 * Auth layout — centered, minimal wrapper for login and register pages.
 * No app shell (no sidebar, no topbar) — just the form centered on screen.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
