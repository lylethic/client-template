"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Menu, Moon, Sun, X } from "lucide-react";

import { useMounted } from "@/hooks/use-mounted";
import { useAuthStore } from "@/stores/auth.store";
import { LOCALES, useLocaleStore, type Locale } from "@/stores/locale.store";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const mounted = useMounted();

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocaleStore();
  const user = useAuthStore((s) => s.user);
  const tNav = useTranslations("nav");
  const tTheme = useTranslations("theme");

  const currentLocale = mounted ? locale : "vi";

  // Close mobile drawer on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Handle escape key to close drawer
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Prevent background scroll when mobile drawer is active
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const initials =
    mounted && user?.full_name
      ? user.full_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : (mounted && user?.email?.[0]?.toUpperCase()) || "U";

  return (
    <div className="bg-background flex h-screen w-full overflow-hidden">
      {/* ── Desktop Permanent Sidebar (>= 1024px) ── */}
      <div className="hidden lg:flex lg:shrink-0">
        <DashboardSidebar className="w-64" />
      </div>

      {/* ── Mobile Drawer Backdrop (< 1024px) ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Slide-over Drawer (< 1024px) ── */}
      <div
        className={cn(
          "bg-card fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        <DashboardSidebar
          className="w-full border-r-0"
          onNavigate={() => setMobileOpen(false)}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* ── Main Viewport Area (Header + Scrollable Main Content) ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ── Responsive Mobile Top Navigation Bar (< 1024px) ── */}
        <header className="border-border/70 bg-card/95 sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b px-3 backdrop-blur sm:px-4 lg:hidden">
          {/* Left: Hamburger button & Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground -ml-1 size-9"
              aria-label={mobileOpen ? tNav("closeMenu") : tNav("openMenu")}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>

            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-xs font-black select-none">
                SM
              </span>
              <span className="text-foreground max-w-[130px] truncate text-sm font-bold tracking-tight sm:max-w-none">
                Social Metrics
              </span>
            </Link>
          </div>

          {/* Right: Quick Theme, Language Switcher & Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground size-8"
              aria-label={tTheme("theme")}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </Button>

            {/* Quick Language Switcher */}
            <div className="bg-muted/60 flex items-center rounded-md p-0.5 text-[11px] font-bold">
              {LOCALES.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocale(loc as Locale)}
                  className={cn(
                    "rounded px-1.5 py-0.5 uppercase transition-colors",
                    currentLocale === loc
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground",
                  )}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Profile Avatar (touching opens drawer) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="ml-1 flex items-center rounded-full focus:outline-none"
              aria-label="User profile"
            >
              <Avatar className="border-border size-7 border">
                <AvatarFallback className="text-[10px] font-bold" suppressHydrationWarning>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </header>

        {/* ── Scrollable Body Content ── */}
        <main className="bg-background min-w-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
