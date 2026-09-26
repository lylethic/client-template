# Social Metrics Client

A modern, high-performance web dashboard for multi-platform social media analytics and AI-powered strategic insights — built with **Next.js 16 (App Router & Turbopack)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## ✨ Overview & Core Features

**Social Metrics Client** provides content creators, marketers, and enterprises with a unified workspace to monitor engagement, analyze audience sentiment, and optimize publishing strategies across major social networks.

- **Unified Multi-Platform Analytics:**
  - Integrates and tracks performance across YouTube, TikTok, Facebook, Instagram, and Threads.
  - Centralized metrics for impressions, reach, follower growth, engagement rates, views, and interactions.
- **AI-Driven Strategy & Insights:**
  - Automated content recommendations, audience sentiment analysis, best posting times, and virality scoring.
  - Interactive AI consultation module for actionable growth guidance.
- **Content & Channel Management:**
  - Cross-platform post feeds, channel performance rankings, and deep-dive analytics.
  - Scheduled reporting and exportable performance summaries.
- **Secure Authentication & Onboarding:**
  - Robust Email/Password authentication with `react-hook-form` and `zod` validation.
  - One-click Google OAuth 2.0 Single Sign-On (SSO) integration.
  - Role-based route protection and automatic redirects (`ADMIN`, `STAFF`, `CUSTOMER`) powered by Next.js 16 proxy.
- **Creator & Social Pulse Design System:**
  - Modern, accessible UI built with `@base-ui/react` primitives and Tailwind CSS v4.
  - Signature Sunset Violet (`#7C3AED`) and Vivid Coral (`#FF5C67`) color palette.
  - Seamless Light and Dark mode theming with fluid glassmorphic visual cues.
- **Internationalization (i18n):**
  - Full localization support for English (`en`) and Vietnamese (`vi`) powered by `next-intl`.

---

## 🛠 Tech Stack

| Category                        | Technologies                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Framework & Runtime**         | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), TypeScript                    |
| **Styling & UI Primitives**     | [Tailwind CSS v4](https://tailwindcss.com/), [@base-ui/react](https://base-ui.com/), [Lucide React](https://lucide.dev/) |
| **Client State Management**     | [Zustand](https://zustand-demo.pmnd.rs/) (Auth & Locale stores)                                                          |
| **Server State & Networking**   | [TanStack React Query v5](https://tanstack.com/query), [Axios](https://axios-http.com/)                                  |
| **Realtime & WebSockets**       | [@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr)                                                   |
| **Forms & Validation**          | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                                                 |
| **Internationalization (i18n)** | [next-intl](https://next-intl.dev/)                                                                                      |
| **Theming & Feedback**          | [next-themes](https://github.com/pacocoursey/next-themes), [Sonner](https://sonner.emilkowal.ski/)                       |

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router routes & layouts
│   ├── (admin)/                # Administration & staff control panel (/admin)
│   ├── (auth)/                 # Authentication pages (/login, /register, /auth/callback)
│   ├── (dashboard)/            # Creator analytics workspace (/dashboard)
│   │   └── dashboard/
│   │       ├── ai/             # AI strategic insights & recommendations
│   │       ├── channels/       # Social channel breakdown & metrics
│   │       ├── insights/       # Deep-dive analytics & trends
│   │       ├── platforms/      # Connected platform management & auth links
│   │       ├── posts/          # Content post feed & performance list
│   │       └── reports/        # Exportable metric summaries & reports
│   ├── layout.tsx              # Root HTML & body layout
│   └── page.tsx                # Marketing landing page
├── components/
│   ├── auth/                   # Authentication forms & OAuth buttons
│   ├── common/                 # Global UI (Navbar, Locale Switcher, etc.)
│   ├── dashboard/              # Dashboard layouts, sidebar, widgets & stat cards
│   ├── feedback/               # Dialogs, confirmation alerts, toast helpers
│   └── ui/                     # Base UI wrappers (Button, Card, Input, DropdownMenu, etc.)
├── config/                     # Application configurations & metadata
├── constants/                  # App constants & platform configurations
├── hooks/                      # Custom React hooks (useAuth, usePlatforms, useAI, useMounted)
├── lib/
│   ├── api-client.ts           # Axios client configured with JWT interceptors
│   ├── env.ts                  # Type-safe environment validation via Zod
│   ├── query-client.ts         # TanStack Query client configuration
│   └── signalr-client.ts       # SignalR real-time client connection manager
├── modules/
│   └── auth/                   # Authentication domain services and contracts
├── providers/
│   └── app-providers.tsx       # Root provider composition (Query, i18n, Theme, Toast)
├── proxy.ts                    # Next.js 16 route proxy & role-based route guard
├── stores/                     # Zustand persistent stores (auth.store, locale.store)
└── types/                      # Shared TypeScript definitions
messages/                       # Localization dictionaries (en.json, vi.json)
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v10+ (Recommended: `npm i -g pnpm`)

### 2. Environment Configuration

Create a local environment file by copying `.env.example`:

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# Client URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API Endpoint (FastAPI / .NET Core / Node.js)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Installation & Development

```bash
# Install dependencies
pnpm install

# Start local development server with Turbopack
pnpm dev

# Type check TypeScript definitions
pnpm type-check

# Run ESLint validation
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 🌐 Localization (i18n)

Locale preferences are dynamically persisted to local storage and hydrated via `src/stores/locale.store.ts`.

To add a new language:

1. Create a dictionary file under `messages/<locale-code>.json` (e.g., `messages/ja.json`).
2. Add the locale identifier to `LOCALES` in [`src/stores/locale.store.ts`](file:///src/stores/locale.store.ts).
3. Import and map the dictionary in [`src/providers/app-providers.tsx`](file:///src/providers/app-providers.tsx).
