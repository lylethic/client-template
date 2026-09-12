"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/query-client";
import { useLocaleStore } from "@/stores/locale.store";
import { Toaster } from "@/components/ui/sonner";

import enMessages from "../../messages/en.json";
import viMessages from "../../messages/vi.json";

const messagesMap: Record<string, typeof viMessages> = {
  vi: viMessages,
  en: enMessages,
};

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Root application provider tree.
 *
 * Wraps the entire app with:
 * - QueryClientProvider: React Query server state management
 * - NextIntlClientProvider: i18n translations (locale from Zustand persist store)
 * - ThemeProvider: Light/Dark/System theme (synced with next-themes + Tailwind)
 * - Toaster: Sonner toast notifications (shadcn variant) — auto-adapts to current theme
 * - ReactQueryDevtools: Dev-only query inspector (stripped in production build)
 *
 * Mount this once inside the Root Layout — do not nest multiple instances.
 *
 * To add a new language:
 *  1. Create `messages/<locale>.json`
 *  2. Add the locale to `LOCALES` in `src/stores/locale.store.ts`
 *  3. Register in `messagesMap` above
 */
export function AppProviders({ children }: AppProvidersProps) {
  const locale = useLocaleStore((s) => s.locale);
  const currentMessages = messagesMap[locale] ?? viMessages;

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider
        locale={locale}
        messages={currentMessages}
        timeZone="Asia/Ho_Chi_Minh"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          {/* Shadcn Sonner Toaster — theme-aware via next-themes */}
          <Toaster position="top-right" closeButton duration={4000} />
        </ThemeProvider>
      </NextIntlClientProvider>

      {/* React Query devtools — only rendered in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
