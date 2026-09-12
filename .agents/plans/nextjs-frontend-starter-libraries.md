# Danh Sách Thư Viện & Công Nghệ Cho Next.js Frontend Base Starter

Tài liệu này tổng hợp danh mục các thư viện và công cụ tiêu chuẩn, module hoá cao để xây dựng một **Frontend Base Template (Boilerplate)** bằng **Next.js (App Router)**. Kiến trúc hướng đến tính tái sử dụng cao cho nhiều dự án khác nhau, dễ dàng cắm rút hoặc mở rộng công nghệ mới mà không ảnh hưởng cấu trúc lõi.

---

## 1. Nền Tảng Cốt Lõi (Core Framework & Language)

*   **Next.js (App Router)**: Framework chính tối ưu hóa hiệu năng, hybrid rendering (RSC + Client Components), routing và tối ưu hóa SEO.
*   **React 19 / 18 & React DOM**: Lõi giao diện người dùng.
*   **TypeScript**: Bắt buộc để định kiểu chặt chẽ (strict mode), đảm bảo an toàn kiểu dữ liệu xuyên suốt giữa các tầng API, DTO và UI component.

---

## 2. Giao Tiếp Backend & Server State Management

Bộ thư viện phục vụ kết nối đa dạng kiến trúc backend (RESTful, GraphQL, SignalR, Push Notification):

### a. RESTful API Client & Data Fetching
*   **`@tanstack/react-query`**: Quản lý server state, caching, synchronization, optimistic updates, pagination và auto-refetching. Chuẩn công nghiệp cho ứng dụng enterprise.
*   **`axios`** hoặc **`ky`**: HTTP Client mạnh mẽ, hỗ trợ Interceptors để xử lý Refresh Token tự động, inject Authorization Header, chuẩn hóa mã lỗi (401, 403, 500) và gọi Toast thông báo lỗi toàn cục.

### b. GraphQL Client
*   **`@apollo/client`** (hoặc **`urql`** nếu muốn dung lượng nhẹ hơn):
    *   Hỗ trợ GraphQL queries, mutations, subscriptions và normalized caching.
    *   Tách riêng thành module `graphql-provider` độc lập để dự án nào không dùng GraphQL có thể tắt dễ dàng.
*   **`graphql`**: Gói thư viện nền tảng để phân tích và biên dịch schema / queries.
*   *(Tooling build-time)* **`@graphql-codegen/cli`**: Tự động sinh TypeScript types từ GraphQL schema backend.

### c. Real-time Communication (SignalR)
*   **`@microsoft/signalr`**: Client SDK chính thức từ Microsoft cho SignalR, hỗ trợ WebSocket, Server-Sent Events (SSE) và Long Polling fallback để kết nối thời gian thực với backend .NET (dễ dàng trigger Toast message khi nhận sự kiện real-time).

### d. Push Notifications
*   **`react-onesignal`** (hoặc OneSignal Web SDK): Tích hợp Web Push Notifications đa nền tảng, quản lý subscription token, phân nhóm người dùng và nhận thông báo đẩy nền.

---

## 3. Client State Management (Quản Lý State Cục Bộ & Toàn Cục)

*   **`zustand`**: State management tối giản, hiệu năng cực cao, không boilerplate, dễ chia nhỏ thành nhiều slice (auth store, theme store, layout store, notification store) và tích hợp middleware persist/devtools mượt mà.
*   **`nuqs`** *(Next.js URL Query State)*: Đồng bộ state trực tiếp vào URL Search Params (rất phù hợp cho filters, search, tabs, pagination mà vẫn giữ được tính bookmarkable).

---

## 4. UI Design System, Tailwind CSS & Hệ Thống Toast Message (Cấu Hình Mặc Định Sẵn)

Bộ công cụ giao diện chuẩn headless component, được cấu hình sẵn hệ thống Design System và Toast Notification:

### a. Tailwind CSS Engine & Helpers
*   **`tailwindcss`** (v3 / v4) & **`postcss`**, **`autoprefixer`**: Utility-first CSS framework.
*   **`tailwind-merge`** & **`clsx`**: Hợp nhất và giải quyết xung đột class Tailwind khi tùy biến style linh hoạt (tiện ích `cn()`).
*   **`class-variance-authority` (cva)**: Xây dựng các component có nhiều biến thể (variants: primary, outline, ghost, sizes: sm, md, lg) theo chuẩn thiết kế.
*   **`tailwindcss-animate`**: Thư viện plugin tạo animation mượt mà cho dropdown, modal, dialog và toast.

### b. Shadcn UI Primitives
*   **`shadcn/ui`** (dựa trên **`@radix-ui/*`** primitives: `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`,...): Headless Accessible Components, toàn quyền tùy biến code trong repo.
*   **`lucide-react`**: Bộ icon SVG đồng nhất, hiện đại, tối ưu tree-shaking.
*   **`framer-motion`** (hoặc **`motion`**): Animation mượt mà cho transition và micro-interactions.

### c. Hệ Thống Toast Message Cài Đặt Sẵn
*   **`sonner`** (Thư viện Toast chuẩn khuyến nghị mới nhất của Shadcn UI):
    *   Hỗ trợ `Toaster` component tích hợp sẵn theme Light/Dark/System.
    *   Có thể gọi thông báo `toast.success()`, `toast.error()`, `toast.promise()` từ bất kỳ đâu (UI component, Zustand store, Axios interceptor, SignalR hub listener).
*   *(Dự phòng truyền thống)* **`@radix-ui/react-toast`**: Primitive component cho Toast nếu muốn dựng notification drawer kiểu cổ điển của Shadcn.

---

## 5. Xử Lý Form & Xác Thực Dữ Liệu (Forms & Schema Validation)

*   **`react-hook-form`**: Quản lý form state dựa trên Uncontrolled Component, tối ưu render hiệu năng cao.
*   **`zod`**: Schema validation mạnh mẽ nhất hiện nay, tự động suy luận TypeScript type từ schema (`z.infer<typeof schema>`). Dùng đồng nhất cho:
    *   Validate form đầu vào từ người dùng.
    *   Validate Response Data từ REST API / SignalR payloads.
    *   Validate biến môi trường hệ thống (.env).
*   **`@hookform/resolvers`**: Cầu nối tích hợp Zod trực tiếp vào React Hook Form.

---

## 6. Tiện Ích Mở Rộng & Cơ Sở Hạ Tầng (Utilities & Pluggability)

*   **`@t3-oss/env-nextjs`**: Validate các biến môi trường (.env) ngay lúc build/runtime bằng Zod, ngăn chặn hoàn toàn lỗi thiếu config bí mật hoặc sai URL backend.
*   **`next-themes`**: Quản lý theme Light / Dark / System đồng bộ hoàn hảo với Tailwind CSS và Sonner Toaster.
*   **`date-fns`** hoặc **`dayjs`**: Xử lý, format và tính toán thời gian gọn nhẹ, hỗ trợ đa ngôn ngữ.
*   **`next-intl`**: Cấu hình quốc tế hóa (i18n - Đa ngôn ngữ: Tiếng Việt, Tiếng Anh,...) tối ưu riêng cho Next.js App Router (RSC-friendly).
*   **`lodash-es`** hoặc **`radashi`**: Bộ hàm tiện ích tối ưu hóa tree-shaking (debounce, throttle, cloneDeep, groupBy).
*   **`nprogress`** & **`@types/nprogress`**: Hiển thị thanh tiến trình tải trang trên đầu màn hình khi chuyển route.

---

## 7. Tiêu Chuẩn Mã Nguồn, Kiểm Soát Chất Lượng & Git Hooks (DevOps & DX)

*   **`prettier`** & **`prettier-plugin-tailwindcss`**: Định dạng code tự động, tự sắp xếp các class Tailwind theo chuẩn khuyến nghị.
*   **`@ianvs/prettier-plugin-sort-imports`**: Tự động nhóm và sắp xếp thứ tự các dòng `import` (thư viện ngoài, alias `@/components`, `@/lib`, `@/services`, CSS).
*   **`eslint`** & **`eslint-config-next`**: Bắt lỗi cú pháp, quy chuẩn React hook, kiểm soát chất lượng code.
*   **`husky`** & **`lint-staged`**: Tự động chạy linter và type-check trên các file được staged trước mỗi lượt git commit, đảm bảo code bẩn không lọt vào repository.

---

## 8. Cấu Trúc Thư Mục Chuẩn Tích Hợp Sẵn Toast & Shadcn UI

```text
src/
├── app/                        # Next.js App Router pages & layouts
│   ├── layout.tsx              # Root Layout bọc AppProviders và <Toaster />
│   └── page.tsx
├── components/
│   ├── ui/                     # Primitives từ shadcn/ui (button.tsx, dialog.tsx, sonner.tsx, input.tsx,...)
│   ├── common/                 # Các component dùng chung (Header, Sidebar, Footer, Data Table)
│   └── feedback/               # Error boundary, Loading spinner, Empty state
├── config/                     # Cấu hình site, navigation, routes, icons
├── constants/                  # Hằng số, mã lỗi, regex, storage keys
├── hooks/                      # Custom hooks tái sử dụng
├── lib/                        # Instance khởi tạo thư viện
│   ├── utils.ts                # Hàm cn() kết hợp clsx + tailwind-merge
│   ├── api-client.ts           # Axios instance kèm Interceptor tích hợp sonner toast tự động khi lỗi
│   ├── query-client.ts         # React Query Client cấu hình mặc định
│   ├── signalr-client.ts       # SignalR Hub connection builder
│   └── env.ts                  # Zod schema validate .env
├── modules/                    # (Feature-based) Hoặc chia theo nghiệp vụ: auth, user, billing,...
│   ├── [feature]/
│   │   ├── components/         # Giao diện riêng của feature
│   │   ├── hooks/              # Hook gọi API/State của feature
│   │   ├── services/           # Adapter gọi REST / GraphQL / SignalR
│   │   ├── types/              # DTO, model TypeScript
│   │   └── schemas/            # Zod validation schema
├── providers/                  # Gom toàn bộ Provider (ThemeProvider, QueryProvider, ToastProvider)
│   └── app-providers.tsx       # Bọc QueryClientProvider, ThemeProvider, Toaster
├── stores/                     # Zustand slices (auth, settings, notifications)
└── types/                      # Type definitions toàn cục
```

### Nguyên Tắc Tích Hợp Toast & UI Nhanh:
1. **Sẵn sàng ở tầng Layout**: Component `<Toaster />` (từ `src/components/ui/sonner.tsx`) được mount sẵn tại Root Layout hoặc bên trong `AppProviders.tsx`, tự động đổi màu theo theme của `next-themes`.
2. **Kích hoạt từ Interceptor / Realtime Hub**: Bạn có thể gọi `toast.error(message)` trực tiếp ngay trong hàm bắt lỗi của Axios Interceptor (khi gặp lỗi 401, 403, 500) hoặc trong event callback của SignalR mà không cần phải truyền hook vào từng React Component.