import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/stores/locale.store";
import { AppProviders } from "@/providers/app-providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://socialmetrics.io";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Social Metrics — Nền tảng phân tích số liệu mạng xã hội & AI Insights",
    template: "%s | Social Metrics",
  },
  description:
    "Hợp nhất phân tích số liệu từ YouTube, TikTok, Facebook, Instagram và Threads. Theo dõi tăng trưởng tương tác và tối ưu hóa nội dung bằng trí tuệ nhân tạo.",
  keywords: [
    "social metrics",
    "social media analytics",
    "tiktok analytics",
    "youtube metrics",
    "facebook insights",
    "ai social insights",
    "báo cáo mạng xã hội",
    "phân tích dữ liệu mạng xã hội",
  ],
  authors: [{ name: "Social Metrics Team" }],
  creator: "Social Metrics Inc.",
  publisher: "Social Metrics Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
    languages: {
      "vi-VN": "/vi",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    url: APP_URL,
    siteName: "Social Metrics",
    title: "Social Metrics — Unified Social Media Analytics & AI Insights",
    description:
      "Nền tảng phân tích dữ liệu mạng xã hội đa kênh kết hợp tư vấn chiến lược nội dung tự động bằng AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Social Metrics Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Metrics — Unified Social Media Analytics & AI Insights",
    description: "Theo dõi và phân tích đa kênh mạng xã hội tự động bằng AI.",
    images: ["/og-image.png"],
    creator: "@socialmetrics",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("locale")?.value;
  const locale: Locale = LOCALES.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : DEFAULT_LOCALE;

  return (
    <html
      lang={locale}
      className={`${roboto.variable} ${robotoMono.variable} h-full font-sans antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProviders>{children}</AppProviders>
          <Toaster position="top-right" closeButton duration={4000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
