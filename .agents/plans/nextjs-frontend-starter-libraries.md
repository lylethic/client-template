# List of Libraries & Technologies for a Next.js Frontend Base Starter

This document compiles a catalog of standard, highly modular libraries and tools for building a **Frontend Base Template (Boilerplate)** with **Next.js (App Router)**. The architecture is designed for high reusability across different projects, making it easy to plug in, remove, or extend new technologies without affecting the core structure.

---

## 1. Core Framework & Language

- **Next.js (App Router)**: The main framework, optimized for performance, hybrid rendering (RSC + Client Components), routing, and SEO.
- **React 19 / 18 & React DOM**: The core UI library.
- **TypeScript**: Mandatory for strict typing (strict mode), ensuring type safety throughout the API, DTO, and UI component layers.

---

## 2. Backend Communication & Server State Management

A set of libraries for connecting to diverse backend architectures (RESTful, GraphQL, SignalR, Push Notifications):

### a. RESTful API Client & Data Fetching

- **`@tanstack/react-query`**: Manages server state, caching, synchronization, optimistic updates, pagination, and auto-refetching. The industry standard for enterprise applications.
- **`axios`** or **`ky`**: A powerful HTTP client that supports interceptors for automatic token refresh, injecting the Authorization header, standardizing error codes (401, 403, 500), and triggering global error toast notifications.

### b. GraphQL Client

- **`@apollo/client`** (or **`urql`** for a lighter footprint):
  - Supports GraphQL queries, mutations, subscriptions, and normalized caching.
  - Separated into its own `graphql-provider` module so projects that don't use GraphQL can easily disable it.
- **`graphql`**: The core library for parsing and compiling schemas/queries.
- _(Build-time tooling)_ **`@graphql-codegen/cli`**: Automatically generates TypeScript types from the backend GraphQL schema.

### c. Real-time Communication (SignalR)

- **`@microsoft/signalr`**: Microsoft's official client SDK for SignalR, supporting WebSocket, Server-Sent Events (SSE), and Long Polling fallback for real-time connections to a .NET backend (making it easy to trigger a toast message when a real-time event is received).

### d. Push Notifications

- **`react-onesignal`** (or the OneSignal Web SDK): Integrates cross-platform Web Push Notifications, manages subscription tokens, segments users, and receives background push notifications.

---

## 3. Client State Management (Local & Global State)

- **`zustand`**: Minimal, extremely high-performance state management with no boilerplate, easy to split into multiple slices (auth store, theme store, layout store, notification store), and integrates smoothly with persist/devtools middleware.
- **`nuqs`** _(Next.js URL Query State)_: Syncs state directly to URL search params (ideal for filters, search, tabs, and pagination while keeping the state bookmarkable).

---

## 4. UI Design System, Tailwind CSS & Toast Message System (Pre-configured Defaults)

A standard set of headless UI component tools, pre-configured with a Design System and Toast Notification system:

### a. Tailwind CSS Engine & Helpers

- **`tailwindcss`** (v3 / v4) & **`postcss`**, **`autoprefixer`**: Utility-first CSS framework.
- **`tailwind-merge`** & **`clsx`**: Merge and resolve Tailwind class conflicts for flexible style customization (the `cn()` utility).
- **`class-variance-authority` (cva)**: Builds components with multiple variants (variants: primary, outline, ghost; sizes: sm, md, lg) following design standards.
- **`tailwindcss-animate`**: A plugin library for smooth animations on dropdowns, modals, dialogs, and toasts.

### b. Shadcn UI Primitives

- **`shadcn/ui`** (built on **`@radix-ui/*`** primitives: `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`, etc.): Headless, accessible components with full code customization directly in the repo.
- **`lucide-react`**: A consistent, modern SVG icon set, optimized for tree-shaking.
- **`framer-motion`** (or **`motion`**): Smooth animations for transitions and micro-interactions.

### c. Pre-installed Toast Message System

- **`sonner`** (the latest recommended Toast library from Shadcn UI):
  - Supports a `Toaster` component with built-in Light/Dark/System theme integration.
  - Notifications can be triggered via `toast.success()`, `toast.error()`, `toast.promise()` from anywhere (UI components, Zustand stores, Axios interceptors, SignalR hub listeners).
- _(Traditional fallback)_ **`@radix-ui/react-toast`**: A primitive Toast component if you want to build a classic-style Shadcn notification drawer.

---

## 5. Form Handling & Data Validation (Forms & Schema Validation)

- **`react-hook-form`**: Manages form state based on uncontrolled components, optimized for high-performance rendering.
- **`zod`**: The most powerful schema validation library today, automatically inferring TypeScript types from the schema (`z.infer<typeof schema>`). Used consistently for:
  - Validating user input in forms.
  - Validating response data from REST APIs / SignalR payloads.
  - Validating system environment variables (.env).
- **`@hookform/resolvers`**: A bridge that integrates Zod directly into React Hook Form.

---

## 6. Extended Utilities & Infrastructure (Utilities & Pluggability)

- **`@t3-oss/env-nextjs`**: Validates environment variables (.env) at build/runtime using Zod, completely preventing errors from missing secret configs or incorrect backend URLs.
- **`next-themes`**: Manages Light / Dark / System themes, perfectly synced with Tailwind CSS and the Sonner Toaster.
- **`date-fns`** or **`dayjs`**: Lightweight date handling, formatting, and calculations with multi-locale support.
- **`next-intl`**: Internationalization configuration (i18n — multiple languages: Vietnamese, English, etc.) optimized specifically for the Next.js App Router (RSC-friendly).
- **`lodash-es`** or **`radashi`**: A tree-shaking-optimized utility function library (debounce, throttle, cloneDeep, groupBy).
- **`nprogress`** & **`@types/nprogress`**: Displays a page-loading progress bar at the top of the screen during route transitions.

---

## 7. Code Standards, Quality Control & Git Hooks (DevOps & DX)

- **`prettier`** & **`prettier-plugin-tailwindcss`**: Automatic code formatting, automatically sorting Tailwind classes according to the recommended standard.
- **`@ianvs/prettier-plugin-sort-imports`**: Automatically groups and orders `import` statements (external libraries, `@/components` alias, `@/lib`, `@/services`, CSS).
- **`eslint`** & **`eslint-config-next`**: Catches syntax errors, enforces React hook rules, and controls code quality.
- **`husky`** & **`lint-staged`**: Automatically runs the linter and type-check on staged files before every git commit, ensuring dirty code never makes it into the repository.

---

## 8. Standard Folder Structure with Toast & Shadcn UI Pre-integrated

```text
src/
├── app/                        # Next.js App Router pages & layouts
│   ├── layout.tsx              # Root Layout wrapping AppProviders and <Toaster />
│   └── page.tsx
├── components/
│   ├── ui/                     # Primitives from shadcn/ui (button.tsx, dialog.tsx, sonner.tsx, input.tsx,...)
│   ├── common/                 # Shared components (Header, Sidebar, Footer, Data Table)
│   └── feedback/               # Error boundary, Loading spinner, Empty state
├── config/                     # Site config, navigation, routes, icons
├── constants/                  # Constants, error codes, regex, storage keys
├── hooks/                      # Reusable custom hooks
├── lib/                        # Library initialization instances
│   ├── utils.ts                # cn() function combining clsx + tailwind-merge
│   ├── api-client.ts           # Axios instance with interceptor that auto-triggers sonner toast on error
│   ├── query-client.ts         # React Query Client default configuration
│   ├── signalr-client.ts       # SignalR Hub connection builder
│   └── env.ts                  # Zod schema for validating .env
├── modules/                    # (Feature-based) or organized by domain: auth, user, billing,...
│   ├── [feature]/
│   │   ├── components/         # Feature-specific UI
│   │   ├── hooks/               # Feature's API/state hooks
│   │   ├── services/            # Adapters for REST / GraphQL / SignalR calls
│   │   ├── types/                # DTOs, TypeScript models
│   │   └── schemas/              # Zod validation schemas
├── providers/                  # Groups all providers (ThemeProvider, QueryProvider, ToastProvider)
│   └── app-providers.tsx       # Wraps QueryClientProvider, ThemeProvider, Toaster
├── stores/                     # Zustand slices (auth, settings, notifications)
└── types/                      # Global type definitions
```

### Quick Toast & UI Integration Principles:

1. **Ready at the Layout level**: The `<Toaster />` component (from `src/components/ui/sonner.tsx`) is pre-mounted at the Root Layout or inside `AppProviders.tsx`, automatically switching color scheme according to `next-themes`.
2. **Triggered from Interceptors / Realtime Hubs**: You can call `toast.error(message)` directly inside the Axios interceptor's error handler (for 401, 403, 500 errors) or in a SignalR event callback, without needing to pass a hook into every React component.
