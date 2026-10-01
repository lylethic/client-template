"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "@/lib/query-client";
import { useLocaleStore } from "@/stores/locale.store";

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
 */
export function AppProviders({ children }: AppProvidersProps) {
  const [clientQueryClient] = useState(() => getQueryClient());
  const locale = useLocaleStore((s) => s.locale);
  const currentMessages = messagesMap[locale] ?? viMessages;

  return (
    <QueryClientProvider client={clientQueryClient}>
      <NextIntlClientProvider
        locale={locale}
        messages={currentMessages}
        timeZone="Asia/Ho_Chi_Minh"
      >
        {children}
      </NextIntlClientProvider>

      {/* React Query devtools — only rendered in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
