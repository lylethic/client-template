"use client";

import { ElementType } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "cn";
import {
  BarChart3,
  Bot,
  Check,
  FileDown,
  Globe,
  Laptop,
  LayoutDashboard,
  LogOut,
  Moon,
  Plug,
  Radio,
  ScrollText,
  Sun,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useMounted } from "@/hooks/use-mounted";
import { useAuthStore } from "@/stores/auth.store";
import {
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  LOCALES,
  useLocaleStore,
  type Locale,
} from "@/stores/locale.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

// ─── Navigation keys config ──────────────────────────────────────────────────

interface NavItemConfig {
  href: string;
  key: "dashboard" | "channels" | "posts" | "platforms" | "insights" | "ai" | "reports";
  icon: ElementType;
}

const NAV_CONFIG: NavItemConfig[] = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/dashboard/channels", key: "channels", icon: Radio },
  { href: "/dashboard/posts", key: "posts", icon: ScrollText },
  { href: "/dashboard/platforms", key: "platforms", icon: Plug },
  { href: "/dashboard/insights", key: "insights", icon: BarChart3 },
  { href: "/dashboard/ai", key: "ai", icon: Bot },
  { href: "/dashboard/reports", key: "reports", icon: FileDown },
];

// ─── Sidebar Component ────────────────────────────────────────────────────────

export interface DashboardSidebarProps {
  className?: string;
  onNavigate?: () => void;
  onClose?: () => void;
}

export function DashboardSidebar({ className, onNavigate, onClose }: DashboardSidebarProps = {}) {
  const mounted = useMounted();

  const tNav = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const tLang = useTranslations("language");

  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocaleStore();

  const currentTheme = mounted ? theme : undefined;
  const currentLocale = mounted ? locale : DEFAULT_LOCALE;

  const handleLogout = () => {
    clearAuth();
    toast.success(tNav("logout"));
    router.replace("/login");
  };

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
    <aside className={cn("bg-card flex h-full w-64 flex-col border-r shadow-2xs", className)}>
      {/* Logo & optional close button */}
      <div className="border-border/60 flex h-16 items-center justify-between border-b px-5">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-black select-none">
            SM
          </span>
          <div className="flex flex-col">
            <span className="text-foreground text-base leading-none font-bold tracking-tight">
              Social Metrics
            </span>
            <span className="text-muted-foreground mt-0.5 text-[10px] font-semibold tracking-wider uppercase">
              Insight Analytics
            </span>
          </div>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground size-8 lg:hidden"
            aria-label={tNav("closeMenu")}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {NAV_CONFIG.map(({ href, key, icon: Icon }) => {
          const isActive =
            href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Icon className="size-4.5 shrink-0" aria-hidden="true" />
              {tNav(key)}
            </Link>
          );
        })}

        {user?.is_superuser && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className={cn(
              "border-border/80 mt-4 flex items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <User className="size-4.5 shrink-0" aria-hidden="true" />
            {tNav("adminPanel")}
          </Link>
        )}
      </nav>

      <Separator />

      {/* Quick Settings Bar (Theme Mode & Language Quick Switch) */}
      <div className="bg-muted/20 border-border/60 flex items-center justify-between border-t px-4 py-2.5 text-xs">
        {/* Theme mode quick toggle */}
        <div className="flex items-center gap-1">
          <Button
            variant={currentTheme === "light" ? "secondary" : "ghost"}
            size="icon"
            className="size-7 rounded-md"
            title={tTheme("light")}
            onClick={() => setTheme("light")}
          >
            <Sun className="size-3.5" />
          </Button>
          <Button
            variant={currentTheme === "dark" ? "secondary" : "ghost"}
            size="icon"
            className="size-7 rounded-md"
            title={tTheme("dark")}
            onClick={() => setTheme("dark")}
          >
            <Moon className="size-3.5" />
          </Button>
          <Button
            variant={currentTheme === "system" ? "secondary" : "ghost"}
            size="icon"
            className="size-7 rounded-md"
            title={tTheme("system")}
            onClick={() => setTheme("system")}
          >
            <Laptop className="size-3.5" />
          </Button>
        </div>

        {/* Language quick toggle */}
        <div className="bg-muted/60 flex items-center gap-1 rounded-md p-0.5">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocale(loc as Locale)}
              className={cn(
                "rounded px-2 py-0.5 text-[11px] font-bold uppercase transition-all",
                currentLocale === loc
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* User Profile Menu with Theme Mode & Language Switcher */}
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="hover:bg-muted/70 focus:ring-primary flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors focus:ring-2 focus:outline-none"
              />
            }
          >
            <Avatar className="border-border size-9 border">
              <AvatarFallback className="text-xs font-bold" suppressHydrationWarning>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p
                className="text-foreground truncate text-sm leading-tight font-semibold"
                suppressHydrationWarning
              >
                {mounted ? (user?.full_name ?? user?.email) : ""}
              </p>
              <p className="text-muted-foreground mt-0.5 truncate text-xs" suppressHydrationWarning>
                {mounted ? user?.email : ""}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" side="top" className="w-56 space-y-1 p-1.5">
            <div className="px-2.5 py-2">
              <p
                className="text-foreground truncate text-xs font-semibold"
                suppressHydrationWarning
              >
                {mounted ? (user?.full_name ?? "Người dùng") : "Người dùng"}
              </p>
              <p className="text-muted-foreground truncate text-[11px]" suppressHydrationWarning>
                {mounted ? user?.email : ""}
              </p>
            </div>

            <DropdownMenuSeparator />

            {/* Theme Mode Option Group */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground px-2.5 text-[11px] font-bold tracking-wider uppercase">
                {tTheme("theme")}
              </DropdownMenuLabel>
              <div className="grid grid-cols-3 gap-1 px-1 py-1">
                <Button
                  variant={currentTheme === "light" ? "default" : "outline"}
                  size="sm"
                  className="h-7 gap-1 px-1 text-xs"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="size-3" />
                  {tTheme("light")}
                </Button>
                <Button
                  variant={currentTheme === "dark" ? "default" : "outline"}
                  size="sm"
                  className="h-7 gap-1 px-1 text-xs"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="size-3.5" />
                  {tTheme("dark")}
                </Button>
                <Button
                  variant={currentTheme === "system" ? "default" : "outline"}
                  size="sm"
                  className="h-7 gap-1 px-1 text-xs"
                  onClick={() => setTheme("system")}
                >
                  <Laptop className="size-3" />
                  Auto
                </Button>
              </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Language Option Group */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground px-2.5 text-[11px] font-bold tracking-wider uppercase">
                {tLang("language")}
              </DropdownMenuLabel>
              {LOCALES.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => setLocale(loc as Locale)}
                  className="flex cursor-pointer items-center justify-between px-2.5 py-1.5 text-xs"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="text-muted-foreground size-3.5" />
                    {LOCALE_LABELS[loc as Locale]}
                  </span>
                  {locale === loc && <Check className="text-primary size-3.5" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer gap-2 px-2.5 py-1.5 text-xs text-rose-600 focus:text-rose-600"
            >
              <LogOut className="size-3.5" />
              {tNav("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
