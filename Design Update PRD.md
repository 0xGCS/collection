# Personal Compendium Website — Design Update PRD

## Summary

This is a personal collection of websites, tools, and apps spanning various categories. The goal of this update is to modernize the UI by replacing the existing table-based directory with a card-grid layout, adding dedicated category pages, and redesigning the individual product detail pages.

**Current URLs:**
- Landing page: https://gregscompendium.com
- Tools page: https://gregscompendium.com/toooooooooools

---

## Reference Design

Two reference screenshots have been provided:
1. **Category page** — card grid with filters, category nav pills, and tool cards
2. **Product detail page** — two-column layout with description/features on left, metadata sidebar on right

The reference design uses a dark-mode palette with deep navy/black backgrounds, dark charcoal cards, blue accents, and pill-shaped tags with semantic color coding.

---

## Changes

### 1. Change URL Path from '/toooooooooools' to '/tools'

The url path should change from `https://gregscompendium.com/toooooooooools` to `https://gregscompendium.com/tools`. On the UI/Header the page name should still be `Toooooooooools`.

**Implementation notes:**
- All new routes use `/tools` as the base path (see routing table below)
- Add a redirect from `/toooooooooools` → `/tools` so any existing bookmarks or shared links don't 404
- In `Navbar.tsx`, update the nav link `href` from `/toooooooooools` to `/tools` — the display label stays `Toooooooooools`
- Update the `CLAUDE.md` project structure and route references to reflect the new paths

### 2. Category Pages

#### New Routes
Add dedicated routes for each category under `/tools/:category`:

| Category | Route |
|---|---|
| Engineering | `/tools/engineering` |
| Artsy | `/tools/artsy` |
| Crypto | `/tools/crypto` |
| Investing | `/tools/investing` |
| OSINT | `/tools/osint` |
| Learning | `/tools/learning` |
| Social | `/tools/social` |
| Misc | `/tools/misc` |
| AI | `/tools/ai` |

The base `/tools` route should still work and show all items (no category filter active).

#### Layout: Card Grid

Replace the existing table view with a **3-column responsive card grid**.

Each card displays:
- **Logo** — square favicon/logo, rounded corners (~32×32px)
- **Name** — bold, white, ~18px
- **Short description** — 2-line truncated snippet
- **Pricing badge** — pill-shaped, styled per existing price badge conventions
- **Tags** — pill-shaped, color-coded, flex-wrapped
- **Date added** — small muted text, bottom-left of card
- **Social/link icons** — X, GitHub, Discord, LinkedIn, YouTube, etc. — bottom-right of card

**Card styling (match reference):**
- Background: `bg-card` (dark charcoal, e.g. `#161b28`)
- Border: 1px subtle border `border-border`
- Border radius: `rounded-xl`
- Padding: `p-5`
- Hover state: subtle border brightening or `translateY(-2px)` lift

Cards are clickable and navigate to the product detail page (`/tools/item/:itemId`).

#### Navigation Pills (Category Selector)

At the top of the page, render a horizontal row of category pill buttons. Each pill shows a small icon + label:

| Category | Icon suggestion |
|---|---|
| Engineering | ⚙️ |
| Artsy | 🎨 |
| Crypto | ₿ |
| Investing | 📈 |
| OSINT | 🔍 |
| Learning | 📚 |
| Social | 💬 |
| Misc | 🗂️ |
| AI | 🤖 |

Active category pill: solid blue background (`bg-blue-600`), white text.  
Inactive: dark background with border, muted text. Hover: slight brightness increase.

Clicking a pill filters the grid to that category AND navigates to the corresponding `/tools/:category` route. An "All" pill should be included and navigates to `/tools`.

When navigating between category pills, scroll the window to the top.

#### Filters

Below the category pills, display:
1. **Search bar** — full-width text input, searches by name and description
2. **Filter dropdowns** — a row of 5 dropdowns:
   - Subcategory
   - Tags
   - Pricing (Free / Freemium / Subscription / Paid)
   - Date Added (sort/filter)
   - Link Type (Twitter/X, LinkedIn, GitHub, Discord, YouTube — filters to items that have that link)

All filters are additive (AND logic within a category, OR logic across selected values in a single filter). Any filter change resets to page 1.

**Empty state:** If filters return 0 results, show a centered empty state message — e.g., a muted icon + "No items match your filters." + a "Clear filters" link that resets all active filters.

#### Loading State

While the Supabase query is in flight, show a grid of skeleton cards (same dimensions as real cards) using a shimmer/pulse animation (`animate-pulse bg-muted rounded-xl`). Do not show a spinner overlay — skeleton cards preserve layout stability.

#### Pagination
- Default page size: 25 items
- Page size options: 25 / 50 / 100
- Standard prev/next pagination controls at the bottom of the grid

---

### 3. Product Detail Pages

#### Route
Existing route: `/tools/:itemId` — **change to `/tools/item/:itemId`** to avoid collision with category routes (see Routing Changes Summary below).

#### Layout

Replace the current detail page with a **two-column layout** that matches the reference design:

**Hero Section (full width):**
- Product logo (large square, rounded corners, ~64×64px)
- Product name (large bold, ~32px, white)
- "Visit Website" button (solid blue, white text, rounded) — links to `url` field
- Social/community icons row: X, LinkedIn, GitHub, YouTube, Discord — rendered as icon-only links using brand colors

**Main Content (two-column, ~66% / 33% split):**

Left column — large dark card:
- **Description** heading + full description text
- **Key Features** heading + bulleted list (from `features` field if it exists, otherwise omit section)

Right column — stacked smaller dark cards:
- **Pricing** card — label + pricing badge
- **Date Added** card — formatted date
- **Category / Subcategory** card — shown as pill badges
- **Tags** card — pill-shaped outlined tags, blue border + blue text (ghost style)

#### Card Styling (detail page)
- Same dark charcoal card background as category cards
- Rounded corners `rounded-xl`
- Generous internal padding `p-6`
- Subtle 1px border

#### Loading & Error States
- While fetching the item, show a skeleton layout matching the two-column structure
- If the item is not found (no row returned), show a "Not found" message with a link back to `/tools`

---

## Design Tokens (existing — do not change)

From `CLAUDE.md`:
- **Font:** Space Grotesk (already in use)
- **Dark mode bg:** `#0F172A`
- **Accent:** `#818CF8` (dark) / `#3B82F6` (light)
- **Tailwind dark class strategy** — `darkMode: 'class'`
- Use existing Tailwind utility classes; no new CSS modules or inline styles

---

## Routing Changes Summary

| Route | Component | Notes |
|---|---|---|
| `/` | `LandingPage` | No change |
| `/toooooooooools` | — | Redirect → `/tools` (preserve old links) |
| `/tools` | `CollectionGrid` (renamed) | All items, no category filter |
| `/tools/:category` | `CollectionGrid` | Category pre-filtered |
| `/tools/item/:itemId` | `CollectionDetailPage` | **Note: change prefix to `/item/`** to avoid collision with category slugs |
| `/twitter` | TwitterPage | No change |

> ⚠️ **Important:** The existing detail route `/tools/:itemId` will conflict with the new `/tools/:category` routes because category slugs and item IDs share the same path segment. Resolve this by moving detail pages to `/tools/item/:itemId`. Update all internal `Link` references accordingly.

---

## Out of Scope

- Mobile/responsive layout
- Authentication or user accounts
- Twitter page (route exists, keep "Coming Soon")
- Landing page redesign
- Any changes to Supabase schema or data enrichment scripts
- Dark/light mode toggle behavior (keep existing)
