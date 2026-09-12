# Social Metrics Client

The frontend client for the **Social Metrics** platform — built on **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## 📌 Branch: `feature/componentProvider`

This branch focuses on establishing the application's **Component Providers**, foundational UI components, and integrating **REST & Realtime APIs** for the Social Metrics ecosystem.

### Key Objectives & Deliverables on this Branch:

- [x] **Root App Providers Setup:**
  - `QueryClientProvider` (@tanstack/react-query): Server-state management, caching, and background synchronization.
  - `NextIntlClientProvider` (next-intl): Internationalization framework (currently supporting English `en` and Vietnamese `vi`, extensible to additional locales).
  - `ThemeProvider` (next-themes): Dark/Light/System theme synchronization with Tailwind CSS.
  - `Toaster` (sonner): Global accessible toast notification system.
- [x] **Core Layout & Navigation:**
  - Responsive **Navbar** featuring a mobile navigation drawer, desktop centered menu links, brand logo, locale switcher, and authenticated user dropdown (Profile, Logout).
- [x] **Authentication APIs Integration (REST):**
  - `POST /v1/login`: User login (Payload: `email`, `password`).
  - `POST /v1/register`: Account creation (Payload: `fullname`, `username`, `email`, `password`, `address`, `dayOfBirth`).
  - Robust form validation with `react-hook-form` and `zod`.
  - Global authentication state persisted via Zustand (`useAuthStore`).
- [x] **Role-Based Route Protection:**
  - Implemented using **Next.js 16 Proxy** (`src/proxy.ts`).
  - Role redirects: `ADMIN` and `STAFF` are routed to the Admin panel (`/admin`), while `CUSTOMER` is routed to the customer dashboard (`/dashboard`).
  - Authenticated sessions are prevented from accessing public auth pages (`/login`, `/register`).
- [ ] **Upcoming Roadmap on this Branch:**
  - Social metrics analytics and reporting API integration.
  - Real-time event streaming and notifications via SignalR (`src/lib/signalr-client.ts`).
  - Detailed Admin and Customer dashboard views.

---

## 🛠 Tech Stack

| Domain                          | Technology / Library                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Framework**                   | [Next.js 16](https://nextjs.org/) (Turbopack, App Router)                                                                |
| **UI Components**               | [React 19](https://react.dev/), [@base-ui/react](https://base-ui.com/), [Tailwind CSS v4](https://tailwindcss.com/)      |
| **Icons**                       | [Lucide React](https://lucide.dev/)                                                                                      |
| **State Management**            | [Zustand](https://zustand-demo.pmnd.rs/) (Auth Store, Locale Store)                                                      |
| **Server State & Networking**   | [TanStack React Query v5](https://tanstack.com/query), [Axios](https://axios-http.com/)                                  |
| **Realtime & GraphQL**          | [@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr), [@apollo/client](https://www.apollographql.com/) |
| **Form Handling**               | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                                                 |
| **Internationalization (i18n)** | [next-intl](https://next-intl.dev/)                                                                                      |
| **Notifications**               | [Sonner](https://sonner.emilkowal.ski/)                                                                                  |

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router routes
│   ├── (admin)/              # Admin & Staff area (/admin)
│   ├── (auth)/               # Authentication pages (/login, /register)
│   ├── (dashboard)/          # Customer dashboard (/dashboard)
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing homepage
├── components/
│   ├── common/               # Shared cross-cutting components (Navbar, etc.)
│   ├── feedback/             # Feedback components (Dialogs, Toasts, etc.)
│   └── ui/                   # Base UI primitives (Button, Card, Input, etc.)
├── config/                   # Configuration files
├── constants/                # App-wide constants
├── hooks/                    # Reusable React hooks
├── lib/
│   ├── api-client.ts         # Axios instance with interceptors and base configuration
│   ├── env.ts                # Type-safe environment validation via Zod
│   ├── query-client.ts       # TanStack Query client instance
│   └── signalr-client.ts     # SignalR connection manager
├── modules/
│   └── auth/                 # Authentication services, models, and DTOs
├── providers/
│   └── app-providers.tsx     # Consolidated Root Providers tree
├── proxy.ts                  # Route protection and proxy rules (Next.js 16)
├── stores/                   # Zustand stores (auth, locale)
└── types/                    # Shared TypeScript declarations
messages/                     # i18n translation dictionaries (en.json, vi.json)
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18 or newer
- **pnpm**: v12.4.1 (Recommended: activate via `corepack enable` or `npm i -g pnpm@12.4.1`)

### 2. Environment Setup

Create a `.env.local` file by copying [`.env.example`](file:///.env.example):

```bash
cp .env.example .env.local
```

Required environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 3. Installation & Scripts

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run TypeScript type check
pnpm type-check

# Run ESLint
pnpm lint

# Build for production
pnpm run build
```

---

## 🌐 Internationalization (i18n)

User locale preferences are persisted to local storage via `src/stores/locale.store.ts`.

To add a new language:

1. Create a message dictionary file: `messages/<locale-code>.json` (e.g., `messages/ja.json`).
2. Register the locale in [`src/stores/locale.store.ts`](file:///src/stores/locale.store.ts):
   ```ts
   export const LOCALES = ["vi", "en", "ja"] as const;
   export const LOCALE_LABELS = {
     vi: "Tiếng Việt",
     en: "English",
     ja: "日本語",
   };
   ```
3. Register the dictionary in [`src/providers/app-providers.tsx`](file:///src/providers/app-providers.tsx).
