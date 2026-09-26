# Color Design System

## Project: `social-metrics-client`

> **Concept:** **Creator & Social Pulse (Sunset Violet & Vivid Coral)**
> **Goal:** Deliver a modern, dynamic interface that captures the spirit of the Creator Economy and cross-platform social media analytics (Facebook, TikTok, YouTube, Instagram, Threads) combined with an AI assistant.

---

## 1. Core Principles

1. **60 - 30 - 10 Color Rule:**
   - **60% (Dominant):** Background spaces (`--background`, `--card`) use clean, easy-on-the-eyes tones (warm pearl in Light Mode and violet-tinted charcoal in Dark Mode).
   - **30% (Secondary):** Information hierarchy, typography, borders (`--foreground`, `--muted`, `--border`, `--secondary`).
   - **10% (Accent / Focal Points):** Call-to-action (CTA) highlights, sidebar menu Active state, AI icons, and standout metrics (`--primary`, `--accent`).
2. **Accessibility (WCAG AA):**
   - Minimum text/background contrast ratio of **4.5:1** for normal text and **3:1** for large text/icons.
   - Never use color as the sole signal; pair it with icons and text labels.
3. **Eye-friendly Dark Theme:**
   - Avoid pure black (`#000000`) as a background to prevent haloing and harsh contrast. Instead use a deep violet-charcoal background (`#0a0710`) for a premium, high-tech sense of depth.

---

## 2. Color Tokens Specification

### 2.1. Light Mode (`:root`)

| CSS Variable             | Tailwind Class                | OKLCH Value                 | HEX (approx.) | Role & Usage Rules                                                                    |
| :----------------------- | :---------------------------- | :-------------------------- | :------------ | :------------------------------------------------------------------------------------ |
| `--background`           | `bg-background`               | `oklch(0.99 0.005 300)`     | `#fcfbff`     | Main canvas background for the entire dashboard                                       |
| `--foreground`           | `text-foreground`             | `oklch(0.18 0.03 300)`      | `#140e1d`     | Primary text color, H1/H2/H3 headings, high contrast                                  |
| `--card`                 | `bg-card`                     | `oklch(1 0 0)`              | `#ffffff`     | Background for stat cards, tables, dialog boxes                                       |
| `--card-foreground`      | `text-card-foreground`        | `oklch(0.18 0.03 300)`      | `#140e1d`     | Text color inside cards                                                               |
| `--popover`              | `bg-popover`                  | `oklch(1 0 0)`              | `#ffffff`     | Background for dropdown menus, tooltips, popover dialogs                              |
| `--popover-foreground`   | `text-popover-foreground`     | `oklch(0.18 0.03 300)`      | `#140e1d`     | Text color in dropdowns and popovers                                                  |
| `--primary`              | `bg-primary` / `text-primary` | `oklch(0.56 0.24 300)`      | `#8e3de8`     | **Vivid Violet** — Primary buttons (CTA), active tabs, highlighted links, AI features |
| `--primary-foreground`   | `text-primary-foreground`     | `oklch(0.99 0 0)`           | `#fcfcfc`     | Text color on `--primary` background                                                  |
| `--secondary`            | `bg-secondary`                | `oklch(0.96 0.02 300)`      | `#f4effe`     | Background for secondary buttons, soft neutral info badges                            |
| `--secondary-foreground` | `text-secondary-foreground`   | `oklch(0.38 0.14 300)`      | `#4f2980`     | Text color on `--secondary` background                                                |
| `--muted`                | `bg-muted`                    | `oklch(0.96 0.015 300)`     | `#f3f0fb`     | Background for search boxes, secondary dividers, hover backgrounds                    |
| `--muted-foreground`     | `text-muted-foreground`       | `oklch(0.52 0.03 300)`      | `#6b6578`     | Secondary labels, dates, muted captions                                               |
| `--accent`               | `bg-accent`                   | `oklch(0.95 0.03 25)`       | `#ffe7e4`     | **Sunset Pastel** — Highlight for special interactive states                          |
| `--accent-foreground`    | `text-accent-foreground`      | `oklch(0.45 0.16 25)`       | `#9b1e22`     | Contrasting text on `--accent` background                                             |
| `--destructive`          | `bg-destructive`              | `oklch(0.577 0.245 27.325)` | `#e7000b`     | Delete buttons, danger warnings, disconnect errors                                    |
| `--border`               | `border-border`               | `oklch(0.92 0.015 300)`     | `#e6e2ed`     | Card borders, table divider lines, avatar borders                                     |
| `--input`                | `border-input`                | `oklch(0.92 0.015 300)`     | `#e6e2ed`     | Border for form input fields                                                          |
| `--ring`                 | `ring-ring`                   | `oklch(0.56 0.24 300)`      | `#8e3de8`     | Accessibility focus ring when tabbing/selecting a field                               |

---

### 2.2. Dark Mode (`.dark`)

| CSS Variable             | Tailwind Class                | OKLCH Value                 | HEX (approx.) | Role & Usage Rules                                                           |
| :----------------------- | :---------------------------- | :-------------------------- | :------------ | :--------------------------------------------------------------------------- |
| `--background`           | `bg-background`               | `oklch(0.14 0.02 300)`      | `#0a0710`     | Deep, mysteriously violet-tinted charcoal background, reduces glare          |
| `--foreground`           | `text-foreground`             | `oklch(0.96 0.01 300)`      | `#f3f0f8`     | Off-white text, sharp and well-contrasted                                    |
| `--card`                 | `bg-card`                     | `oklch(0.19 0.025 300)`     | `#15111d`     | Elevated card surfaces, separated from the page background                   |
| `--card-foreground`      | `text-card-foreground`        | `oklch(0.96 0.01 300)`      | `#f3f0f8`     | Text color inside cards in dark mode                                         |
| `--popover`              | `bg-popover`                  | `oklch(0.19 0.025 300)`     | `#15111d`     | Background for floating menus, modal popups                                  |
| `--popover-foreground`   | `text-popover-foreground`     | `oklch(0.96 0.01 300)`      | `#f3f0f8`     | Text in floating menus                                                       |
| `--primary`              | `bg-primary` / `text-primary` | `oklch(0.66 0.24 300)`      | `#ac61ff`     | **Electric Violet Glow** — Neon violet that pops against the dark background |
| `--primary-foreground`   | `text-primary-foreground`     | `oklch(0.12 0.03 300)`      | `#07040f`     | Deep violet-black text with strong contrast on primary buttons               |
| `--secondary`            | `bg-secondary`                | `oklch(0.24 0.03 300)`      | `#211c2b`     | Background for secondary buttons / secondary badges                          |
| `--secondary-foreground` | `text-secondary-foreground`   | `oklch(0.96 0.01 300)`      | `#f3f0f8`     | Text on secondary buttons                                                    |
| `--muted`                | `bg-muted`                    | `oklch(0.23 0.025 300)`     | `#1f1a27`     | Background for inactive states, placeholders, hover                          |
| `--muted-foreground`     | `text-muted-foreground`       | `oklch(0.68 0.03 300)`      | `#9b94a9`     | Captions, post timestamps, muted text                                        |
| `--accent`               | `bg-accent`                   | `oklch(0.25 0.04 25)`       | `#321a18`     | Warm-toned accent highlight in dark mode                                     |
| `--accent-foreground`    | `text-accent-foreground`      | `oklch(0.96 0.02 25)`       | `#ffedeb`     | Text displayed on the dark accent background                                 |
| `--destructive`          | `bg-destructive`              | `oklch(0.704 0.191 22.216)` | `#ff6467`     | Bright coral red for warnings in dark mode                                   |
| `--border`               | `border-border`               | `oklch(0.26 0.025 300)`     | `#26212e`     | Thin borders outlining UI blocks                                             |
| `--input`                | `border-input`                | `oklch(0.26 0.025 300)`     | `#26212e`     | Border for input fields                                                      |
| `--ring`                 | `ring-ring`                   | `oklch(0.66 0.24 300)`      | `#ac61ff`     | Glowing focus ring effect on component focus                                 |

---

### 2.3. Sidebar Navigation

| CSS Variable                   | Light Mode OKLCH (HEX)               | Dark Mode OKLCH (HEX)               | Purpose                                                        |
| :----------------------------- | :----------------------------------- | :---------------------------------- | :------------------------------------------------------------- |
| `--sidebar`                    | `oklch(0.985 0.008 300)` (`#fbf9ff`) | `oklch(0.16 0.022 300)` (`#0f0b15`) | Sidebar background, subtly layered against main content        |
| `--sidebar-foreground`         | `oklch(0.18 0.03 300)` (`#140e1d`)   | `oklch(0.96 0.01 300)` (`#f3f0f8`)  | Default menu text and icon color                               |
| `--sidebar-primary`            | `oklch(0.56 0.24 300)` (`#8e3de8`)   | `oklch(0.66 0.24 300)` (`#ac61ff`)  | Background for the currently selected menu item (active route) |
| `--sidebar-primary-foreground` | `oklch(0.99 0 0)` (`#fcfcfc`)        | `oklch(0.12 0.03 300)` (`#07040f`)  | Icon and text color for the selected menu item                 |
| `--sidebar-accent`             | `oklch(0.95 0.02 300)` (`#f0ecfa`)   | `oklch(0.22 0.03 300)` (`#1d1727`)  | Hover effect when the mouse passes over nav links              |
| `--sidebar-border`             | `oklch(0.92 0.015 300)` (`#e6e2ed`)  | `oklch(0.24 0.02 300)` (`#211d27`)  | Divider line separating the sidebar from main content          |

---

## 3. Charts & Data Visualization Palette

A set of 5 analytics colors, harmonized with the **Creator & Social Pulse** concept's color spectrum, to clearly distinguish data across bar charts, line charts, pie charts, and conversion funnels:

| Token       | Color Name        | Light Mode (HEX)                   | Dark Mode (HEX)                    | Suggested Data Meaning                         |
| :---------- | :---------------- | :--------------------------------- | :--------------------------------- | :--------------------------------------------- |
| `--chart-1` | **Vivid Violet**  | `oklch(0.58 0.24 305)` (`#9d40e8`) | `oklch(0.68 0.22 305)` (`#b96aff`) | Overall Performance metrics / AI Predictions   |
| `--chart-2` | **Sunset Coral**  | `oklch(0.68 0.20 30)` (`#fb5a46`)  | `oklch(0.72 0.19 30)` (`#ff6c58`)  | Post engagement (Engagement, Shares, Comments) |
| `--chart-3` | **Golden Amber**  | `oklch(0.76 0.18 75)` (`#f29c00`)  | `oklch(0.80 0.16 75)` (`#f9ad26`)  | Impressions & Reach                            |
| `--chart-4` | **Neon Mint**     | `oklch(0.70 0.18 175)` (`#00c098`) | `oklch(0.74 0.17 175)` (`#00cca5`) | New Followers / Growth                         |
| `--chart-5` | **Electric Blue** | `oklch(0.58 0.21 245)` (`#007eec`) | `oklch(0.66 0.20 245)` (`#0098ff`) | Link Clicks & CTR                              |

---

## 4. Social Platform Brand Colors

Platform brand colors are kept true to their original identity, subtly integrated with the system palette:

| Platform      | Tailwind Class                       | Display Color        | Usage Notes                             |
| :------------ | :----------------------------------- | :------------------- | :-------------------------------------- |
| **YouTube**   | `bg-red-500` / `#ef4444`             | Bright YouTube Red   | Video stats, views, subscribers         |
| **TikTok**    | `bg-black dark:bg-zinc-200`          | Black / Cyber White  | Short-form video, viral metrics, sounds |
| **Facebook**  | `bg-blue-600` / `#2563eb`            | Meta Blue            | Fanpage reach, community engagement     |
| **Instagram** | `bg-pink-500` / `#ec4899`            | Pink-Purple Gradient | Reels, Stories, saves, profile          |
| **Threads**   | `bg-neutral-800 dark:bg-neutral-200` | Neutral Black        | Text discussions, reposts               |

---

## 5. Code Usage Guidelines & Rules

### 5.1. Buttons & Interactive Components (Buttons & Badges)

- **Primary CTA (Launch campaign, sync data, AI analysis):**
  ```tsx
  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
    <Sparkles className="mr-2 size-4" /> Generate AI Content
  </Button>
  ```
- **Secondary Action (Filter data, export report file):**
  ```tsx
  <Button variant="secondary">
    <Download className="mr-2 size-4" /> Export PDF
  </Button>
  ```
- **Positive / Negative Growth Badges:**
  - Growth: use mint green `text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40`.
  - Decline warning: use red-orange `text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40`.

### 5.2. Charts (with Recharts)

Use the CSS variables directly in chart configuration so it smoothly and automatically adapts between Light and Dark mode:

```tsx
const chartConfig = {
  total: { label: "Total Engagement", color: "var(--color-chart-1)" },
  shares: { label: "Shares", color: "var(--color-chart-2)" },
  reach: { label: "Reach", color: "var(--color-chart-3)" },
  followers: { label: "New Followers", color: "var(--color-chart-4)" },
};
```

---

_This document is automatically updated when Concept 3 is applied to `src/app/globals.css`._
