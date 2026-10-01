import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Supported Locales ────────────────────────────────────────────────────────

/** Supported locale codes. Add new entries here when expanding. */
export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export const DEFAULT_LOCALE: Locale = "vi";

// ─── Store ────────────────────────────────────────────────────────────────────

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/**
 * Global locale store persisted to localStorage.
 * Drives the `NextIntlClientProvider` in the app provider tree.
 */
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        if (typeof document !== "undefined") {
          document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
          document.documentElement.lang = locale;
        }
        set({ locale });
      },
    }),
    { name: "locale-storage" },
  ),
);
