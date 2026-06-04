# CLAUDE.md — Personal Compendium

> Full product requirements are in `PRD.md`. This file covers working conventions, commands, and project structure.

---

## Project Overview

A personal compendium website listing curated tools, websites, and platforms. The current product surface includes a landing page, a filterable directory table, item detail pages, and a placeholder Twitter page. GitHub repo: `https://github.com/0xGCS/collection`

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS (`darkMode: 'class'`)
- **UI components:** shadcn/ui
- **Routing:** React Router v7
- **Database client:** `@supabase/supabase-js`
- **Icons:** Lucide React (general UI) + inline SVGs for brand icons (Discord, Telegram, Reddit, X, LinkedIn, GitHub, YouTube)
- **Font:** Space Grotesk (Google Fonts, weights 400/500/600/700)
- **Deployment:** Vercel

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

## Environment Variables

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Project Structure

```
src/
├── components/
│   ├── ui/                      # shadcn/ui primitives (Button, Badge, Input, etc.)
│   ├── layout/
│   │   └── Navbar.tsx           # Top navigation bar with light/dark toggle
│   ├── collection/             # Shared collection building blocks
│   │   ├── types.ts             # CollectionItem type (source of truth)
│   │   ├── badge-utils.ts       # Price labels/palettes + getBadgePalette()
│   │   ├── CollectionBadges.tsx # CollectionTagList, CollectionPriceBadge
│   │   └── CollectionLinks.tsx  # Brand/social icon links + community detection
│   ├── LandingPage.tsx
│   ├── CollectionGrid.tsx       # Card-grid directory (category pages + filters)
│   └── CollectionDetailPage.tsx # Two-column item detail page
├── lib/
│   ├── supabase.ts              # Supabase client initialisation
│   ├── collection.ts            # Data fetchers + pickRelatedItems()
│   └── utils.ts                 # cn() helper and shared utilities
├── styles/
│   └── index.css                # Tailwind directives + Space Grotesk import
├── App.tsx                      # Routes (see below)
└── main.tsx
```

**Routes** (React Router v7, in `App.tsx`):

| Path | Component | Notes |
|---|---|---|
| `/` | `LandingPage` | |
| `/tools` | `CollectionGrid` | All items, no category filter |
| `/tools/:category` | `CollectionGrid` | Pre-filtered by category slug (e.g. `/tools/ai`) |
| `/tools/item/:itemId` | `CollectionDetailPage` | `/item/` prefix avoids collision with category slugs |
| `/twitter` | TwitterPage | Renders "Coming Soon" |
| `/toooooooooools` → `/tools` | redirect | Legacy link preservation |
| `/toooooooooools/:itemId` → `/tools/item/:itemId` | redirect | Legacy detail-link preservation |

> The navbar link points to `/tools` but the **display label stays `Toooooooooools`**.

---

## Code Conventions

- **File naming:** PascalCase for components (`CollectionGrid.tsx`), camelCase for utilities (`supabase.ts`)
- **Styling:** Tailwind utility classes only — no plain CSS modules or inline styles
- **Components:** Functional components with TypeScript props interfaces; no class components
- **Imports:** Use `@/` path alias for `src/` (configured in `vite.config.ts` and `tsconfig.json`)
- **shadcn/ui:** Install components via `npx shadcn@latest add <component>` — do not hand-write shadcn primitives
- **No prop drilling:** Use React context or co-locate state near where it is used

---

## Design Tokens

Space Grotesk is the only font used site-wide. Tailwind's `dark` class strategy drives theming — do not use `prefers-color-scheme` media queries in CSS. The user's mode preference is stored in `localStorage` under the key `theme`.

**Light mode** → `#F8FAFC` bg / `#3B82F6` accent
**Dark mode** → `#0F172A` bg / `#818CF8` accent

Full token tables are in `PRD.md §10.2`.

---

## Supabase Notes

- **Table:** `public.collection` (528 rows, read-only from the frontend)
- **RLS:** Enable RLS on `collection` with a public `SELECT` policy for the `anon` role before deploying
- **Arrays:** `primary_category` and `primary_subcategory` are `text[]` — use Postgres array operators for filtering (e.g., `@>`, `&&`)
- **Dead links table:** `public.dead_links` — identical schema to `collection`; never write to it from the frontend

---

## Key Business Rules (quick reference)

- `community` URL → detect platform at render time: `discord.gg/discord.com` → Discord icon, `t.me/telegram.me` → Telegram icon, `reddit.com` → Reddit icon; fallback to generic link icon
- Category filter pills filter on `primary_category` array (multi-select, OR logic across selected categories)
- Any filter/search/sort change resets pagination to page 1
- Grouping by subcategory disables standard pagination (show all results grouped)
- Default entries per page: 25; options: 25 / 50 / 100

---

## Out of Scope for v1

- Mobile/responsive layout
- Authentication or user accounts
- Twitter page (route exists but renders "Coming Soon")
- The `enrich_collection.py` data enrichment script (pre-existing, not part of the web build)
- The dead links checker script (scheduled Python script, not part of the web build)
