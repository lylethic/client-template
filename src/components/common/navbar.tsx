"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "cn";
import { Menu, User, X } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth.store";
import { LOCALE_LABELS, LOCALES, useLocaleStore, type Locale } from "@/stores/locale.store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Nav Links Config ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { key: "home" as const, href: "/" },
  { key: "about" as const, href: "/about" },
  { key: "services" as const, href: "/services" },
  { key: "careers" as const, href: "/careers" },
] satisfies Array<{ key: "home" | "about" | "services" | "careers"; href: string }>;

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-lg font-bold tracking-tight"
      aria-label="Social Metrics — Trang chủ"
    >
      {/* Replace with your actual logo image if available */}
      <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-black select-none">
        SM
      </span>
      <span className="hidden sm:inline">Social Metrics</span>
    </Link>
  );
}

// ─── Language Switcher ────────────────────────────────────────────────────────

function LanguageSwitcher() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const t = useTranslations("nav");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("switchLanguage")}
            className="h-8 px-2 text-xs font-semibold tracking-wide uppercase"
          />
        }
      >
        {locale.toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc as Locale)}
            className={cn("cursor-pointer", locale === loc && "text-foreground font-semibold")}
          >
            {LOCALE_LABELS[loc as Locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── User Menu ────────────────────────────────────────────────────────────────

function UserMenu() {
  const t = useTranslations("nav");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = () => {
    clearAuth();
    toast.success("Đã đăng xuất");
    router.replace("/login");
  };

  if (!user) {
    return (
      <Link href="/login">
        <Button size="sm" variant="outline">
          {t("profile")}
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t("profile")} className="rounded-full" />
        }
      >
        <User className="size-5" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <div className="px-2 py-1.5 text-sm">
          <p className="truncate leading-tight font-medium">{user.fullname ?? user.username}</p>
          <p className="text-muted-foreground truncate text-xs">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" className="cursor-pointer" />}>
          <User className="mr-2 size-4" aria-hidden />
          {t("profile")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

/**
 * Responsive site Navbar.
 *
 * Layout:
 *  - Left:   Logo
 *  - Center: Nav links (Home, About, Services, Careers)
 *  - Right:  Language switcher + User menu
 *
 * Mobile: hamburger menu collapses the nav links into a full-width drawer.
 * Desktop (md+): horizontal link row centered.
 *
 * i18n: uses next-intl `useTranslations` with the "nav" namespace.
 * To add a language, add a new locale to `messages/<locale>.json` and
 * register it in `src/stores/locale.store.ts`.
 */
export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change without effect cascading renders
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Trap focus: close on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [mobileOpen]);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8"
      >
        {/* ── Left: Logo ── */}
        <div className="flex flex-1 items-center">
          <Logo />
        </div>

        {/* ── Center: Desktop nav links ── */}
        <ul
          role="list"
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map(({ key, href }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {t(key)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Right: Language + User ── */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <LanguageSwitcher />
          <UserMenu />

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </Button>
        </div>
      </nav>

      {/* ── Mobile menu drawer ── */}
      <div
        id="mobile-nav"
        ref={mobileMenuRef}
        role="region"
        aria-label="Mobile navigation"
        hidden={!mobileOpen}
        className={cn(
          "overflow-hidden border-t transition-all duration-200 md:hidden",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul
          role="list"
          className="flex flex-col gap-1 px-4 py-3"
          aria-label="Mobile primary navigation"
        >
          {NAV_LINKS.map(({ key, href }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {t(key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
