"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { queryClient } from "@/lib/query-client";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Root application provider tree.
 *
 * Wraps the entire app with:
 * - QueryClientProvider: React Query server state management
 * - ThemeProvider: Light/Dark/System theme (synced with next-themes + Tailwind)
 * - Toaster: Sonner toast notifications — auto-adapts to current theme
 * - ReactQueryDevtools: Dev-only query inspector (stripped in production build)
 *
 * Mount this once inside the Root Layout — do not nest multiple instances.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}

        {/* Sonner toast container — theme-aware via next-themes */}
        <Toaster
          richColors
          position="top-right"
          closeButton
          duration={4000}
        />
      </ThemeProvider>

      {/* React Query devtools — only rendered in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
