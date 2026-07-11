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
│   │   └── Navbar.tsx           # Top navigation bar with light/dark toggle + UserMenu
│   ├── auth/
│   │   └── UserMenu.tsx         # Navbar auth UI: sign-in dropdown / avatar menu
│   ├── collection/             # Shared collection building blocks
│   │   ├── types.ts             # CollectionItem type (source of truth)
│   │   ├── badge-utils.ts       # Price labels/palettes + getBadgePalette()
│   │   ├── CollectionBadges.tsx # CollectionTagList, CollectionPriceBadge
│   │   ├── CollectionCard.tsx   # Shared product card (grid + tag pages)
│   │   └── CollectionLinks.tsx  # Brand/social icon links + community detection
│   ├── LandingPage.tsx
│   ├── CollectionGrid.tsx       # Card-grid directory (category pages + filters)
│   └── CollectionDetailPage.tsx # Two-column item detail page
├── contexts/
│   └── AuthContext.tsx          # AuthProvider + useAuth() (session, user, sign-in/out)
├── lib/
│   ├── supabase.ts              # Supabase client initialisation (PKCE auth flow)
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
| `/tools/topics` | `TopicsPage` | Overview of topics → categories with per-category product counts; Cards/Index toggle |
| `/tools/:category` | `CollectionGrid` | Pre-filtered by **topic** slug (e.g. `/tools/ai`) |
| `/tools/category/:categorySlug` | `CollectionGrid` | Pre-selects the **Category** filter for that category slug (target of `/tools/topics` links); derives its topic automatically |
| `/tools/item/:itemId` | `CollectionDetailPage` | `/item/` prefix avoids collision with category slugs |
| `/tags` | `TagsPage` | All tags from `collection.tags` with product counts; Popular/A–Z sort |
| `/tags/:tagSlug` | `TagDetailPage` | Products matching the tag; unknown slug renders a "Tag not found" state |
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

- **Main table:** `public.collection` (~650 rows, read-only from the frontend)
- **Column-level grants on `collection`:** `anon`/`authenticated` have `SELECT` on only the columns the UI renders (see `supabase/migrations/20260711120000_restrict_collection_public_columns.sql`). Consequences: `select=*` is rejected by PostgREST, so `COLLECTION_SELECT` in `src/lib/collection.ts` must list columns explicitly and stay in sync with the grant; a new `collection` column is **private by default** until added to both. `primary_category`, `primary_subcategory`, and `pricing` (raw enrichment jsonb) are deliberately not granted.
- **Taxonomy is normalized** into `product → category → topic`:
  - `public.topics` — broad subject areas (`id, name, slug`). 12 topics.
  - `public.categories` — specific product types (`id, topic_id, name, slug`); each category belongs to exactly one topic. Slugs are topic-prefixed (e.g. `crypto-infrastructure` vs `engineering-infrastructure`) because names repeat across topics.
  - `public.product_categories` — junction (`product_id, category_id`), composite PK. A product has 1–3 categories; its topics are derived from those categories (can span multiple topics).
- **RLS:** every frontend-read table (`collection`, `topics`, `categories`, `product_categories`) needs a public `SELECT` policy for **both the `anon` and `authenticated` roles**. Logged-in users query as `authenticated`, so an anon-only policy silently returns zero rows the moment someone signs in — the pages render but look empty. Any new frontend-read table must ship with `for select to anon, authenticated using (true)`.
- **Data access:** the frontend reads via `src/lib/collection.ts`, which embeds the junction with a PostgREST nested select (`*, product_categories ( categories ( …, topics (…) ) )`) and `normalizeItem()` flattens it into `item.topics[]` and `item.categories[]` on `CollectionItem`.
- **Legacy columns:** `collection.primary_category` / `primary_subcategory` (`text[]`) are deprecated — kept until the normalized UI is validated in prod, then dropped (same phased pattern as `features` → `features_v2`). The UI no longer reads them.
- **Tags:** `collection.tags` (`text[]`) stays on the product — flexible attributes (e.g. `open-source`, `api`, `freemium`). Values are lowercase kebab-case slugs; `src/lib/tags.ts` (`slugifyTag`, `formatTagName`, `buildTagSummaries`) derives display names and counts, and powers `/tags` + `/tags/:tagSlug`.
- **Dead links table:** `public.dead_links` — never write to it from the frontend

---

## Auth (Supabase Auth, Google + GitHub OAuth)

- **Flow:** PKCE (`flowType: 'pkce'` in `src/lib/supabase.ts`). `detectSessionInUrl` (default) exchanges the `?code=` param on whatever page loads — there is **no `/auth/callback` route**; `redirectTo` is `window.location.origin + window.location.pathname` so users return to the page they signed in from.
- **State:** `AuthProvider` (`src/contexts/AuthContext.tsx`) wraps the app inside `BrowserRouter`; `useAuth()` exposes `session`, `user`, `loading`, `signInWithGoogle`, `signInWithGithub`, `signOut`. Session comes from a single `onAuthStateChange` subscription — **never `await` supabase calls inside that callback** (it deadlocks).
- **UI:** `UserMenu` in the navbar — "Sign in" dropdown (Google/GitHub, inline SVG brand icons) when signed out; avatar (from `user_metadata.avatar_url`, initial fallback) with name/email + Sign out when signed in. `user_metadata` is display-only — never use it for authorization (it's user-editable).
- **Users** are stored automatically in `auth.users` on first sign-in. The same verified email via both providers auto-links into one user.
- **No `profiles` table yet** — deliberately deferred until ratings/personal-collection features need it (then: `profiles` + signup trigger outside `public` + RLS with `USING`/`WITH CHECK`, backfill from `auth.users`).
- **Dashboard config** (Supabase → Auth → URL Configuration): Site URL `https://gregscompendium.com/`; redirect allowlist is exactly `https://gregscompendium.com/**` and `http://localhost:5173/**` — the `/**` wildcards are required for the return-to-same-page redirect. Google/GitHub OAuth apps point at the Supabase callback (`https://<ref>.supabase.co/auth/v1/callback`), never at the app domain.

---

## Key Business Rules (quick reference)

- `community` URL → detect platform at render time: `discord.gg/discord.com` → Discord icon, `t.me/telegram.me` → Telegram icon, `reddit.com` → Reddit icon; fallback to generic link icon
- **Topic nav pills** are sourced dynamically from the `topics` table; only topics present in the loaded data render (empty topics like `Misc` auto-hide). Icons live in a `slug → emoji` map in `CollectionGrid.tsx`. The `/tools/:category` route param resolves against **topic slugs**; a product appears under every topic it belongs to.
- **Category filter** lists categories from the junction, **scoped to the active topic** (grouped by topic when "All" is selected); it filters by category `slug` to avoid same-named categories across topics colliding.
- Any filter/search/sort change resets pagination to page 1
- Default entries per page: 25; options: 25 / 50 / 100

---

## Out of Scope for v1

- Mobile/responsive layout
- Rating products and saving to a personal collection (auth shipped as their prerequisite — see Auth section)
- Twitter page (route exists but renders "Coming Soon")
- The `enrich_collection.py` data enrichment script (pre-existing, not part of the web build)
- The dead links checker script (scheduled Python script, not part of the web build)
