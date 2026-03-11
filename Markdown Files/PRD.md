# Personal Compendium - Product Requirements Document

## 1. Overview

A personal compendium website showcasing a curated collection of interesting websites, tools, applications, and platforms. The site features a landing page and a full-featured data table view. Data is sourced from a Supabase PostgreSQL database.

**Contact:** [Telegram](https://t.me/OxGCS)

**Donations:** `0x0024E8728351E5FE888DBe61AFbc0010B9B0300d`

---

## 2. Tech Stack

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| Framework     | React 18+ with TypeScript                       |
| Build Tool    | Vite                                            |
| Styling       | Tailwind CSS                                    |
| UI Components | shadcn/ui                                       |
| Routing       | React Router v6                                 |
| Database      | Supabase (PostgreSQL)                           |
| DB Client     | `@supabase/supabase-js`                         |
| Icons         | Lucide React                                    |
| Deployment    | Vercel (preferred) or Netlify                   |

The Figma Make prototype (`zk01ZL9yf2y5fU23uij928`) serves as the reference implementation for component structure and layout.

---

## 3. Site Architecture

### 3.1 Navigation Structure

Top-bar navigation with the following hierarchy:

```
Home (Landing Page)
├── Toooooooools
└── Twitter (Coming Soon)
```

### 3.2 Pages

| Page           | Route             | Data Source           | Description                                   |
| -------------- | ----------------- | --------------------- | --------------------------------------------- |
| Home           | `/`               | —                     | Landing page with welcome message             |
| Toooooooooools | `/toooooooooools` | Supabase `collection` | List of tools and websites I find interesting |
| Twitter        | `/twitter`        | —                     | Interesting Twitter accounts — Coming soon    |

### 3.3 Header / Top Navigation Bar

- Left side: "Home" breadcrumb link → active page name (e.g., `Home / Toooooooooools`)
- Right side (Toooooooools page only): **Group** | **Filter** | **Sort** | density toggle icon | search icon | overflow menu (`⋯`)
- The navigation persists across all pages

---

## 4. Landing Page

### 4.1 Content

> Welcome to my overly-engineered side project. I'm into Crypto, AI, Vibe Coding, OSINT, and Investing. This is my own personal compendium of people, sites, and apps I find to be interesting or useful in these areas.

### 4.2 Elements

- Headline: **"Welcome to my overly-engineered side project."**
- Subtext: body copy as above
- Primary CTA button: **"Explore Toooooooooools"** → links to `/toooooooooools`
- "Have suggestions?" card with Telegram icon and link: [Message me on Telegram](https://t.me/OxGCS)
- "Support this project:" card with wallet address: `0x0024E8728351E5FE888DBe61AFbc0010B9B0300d` (displayed in a monospace code block, copyable)

---

## 5. Toooooooooools Page

### 5.1 Page Layout (top to bottom)

1. Top navigation bar (shared)
2. Category filter pill buttons
3. Search bar (full width)
4. Data table
5. Pagination controls

### 5.2 Table Columns

| Column               | Display Label         | DB Field              | Description                                              |
| -------------------- | --------------------- | --------------------- | -------------------------------------------------------- |
| Name                 | NAME                  | `name`                | Name of the tool/website, rendered as an external link. A small favicon/logo (`logo` field) is shown to the left of the name when available. An external link icon (↗) appears next to the name. |
| Description          | DESCRIPTION           | `description`         | Short description of the tool/website                   |
| Primary Subcategory  | PRIMARY SUBCATEGORY   | `primary_subcategory` | Array of subcategory tags, rendered as colored pill badges |
| Date Added           | DATE ADDED            | `created_at`          | Date the entry was added (formatted as `YYYY-MM-DD`)    |
| Links                | LINKS                 | See §5.3              | Row of social/platform icon links                        |

> **Note:** `primary_category` is not displayed as a table column — it is used exclusively to power the category filter buttons (§5.5).

### 5.3 Links Column Specification

Each row in the Links column displays a set of icon buttons. An icon is only rendered if the corresponding field is non-null/non-empty in the database.

| Icon        | DB Field    | Detection / Description                                              |
| ----------- | ----------- | -------------------------------------------------------------------- |
| Globe 🌐    | `url`       | Primary website URL                                                  |
| Twitter/X   | `twitter`   | Twitter / X profile URL                                              |
| LinkedIn    | `linkedin`  | LinkedIn page URL                                                    |
| GitHub      | `github`    | GitHub repository or profile URL                                     |
| YouTube     | `youtube`   | YouTube channel URL                                                  |
| Discord     | `community` | Shown when `community` URL contains `discord.gg` or `discord.com`   |
| Telegram    | `community` | Shown when `community` URL contains `t.me` or `telegram.me`         |
| Reddit      | `community` | Shown when `community` URL contains `reddit.com`                    |

Icons are rendered as small clickable icon buttons that open the link in a new tab. Only icons with a populated field are shown; absent links are hidden entirely (no placeholder).

**`community` field icon detection logic:**

The `community` column is a single text field. The correct platform icon is determined by inspecting the URL value at render time:

```
if community contains "discord.gg" or "discord.com"  → show Discord logo
if community contains "t.me" or "telegram.me"         → show Telegram logo
if community contains "reddit.com"                    → show Reddit logo
```

Only one community icon is ever shown per row (since the field holds a single URL). If the URL doesn't match any known pattern, fall back to a generic link icon.

### 5.4 Category / Subcategory Taxonomy

| Category    | Subcategory               |
| ----------- | ------------------------- |
| AI          | Vibe Coding Tools         |
| AI          | AI-Powered Productivity   |
| AI          | Coding Agents             |
| AI          | Notetakers                |
| AI          | AI Designer               |
| AI          | AI-Powered Research       |
| AI          | Prompt Engineering        |
| AI          | AI Agents                 |
| AI          | Registries                |
| Artsy       | Design Inspiration        |
| Artsy       | Interface Design Tools    |
| Artsy       | Design Mockups            |
| Artsy       | Wireframing               |
| Artsy       | Design Resources          |
| Artsy       | UI Frameworks             |
| Artsy       | Colors                    |
| Artsy       | Icon Sets                 |
| Artsy       | Figma Tools               |
| Crypto      | Analytics                 |
| Crypto      | Research (Crypto)         |
| Crypto      | Infrastructure            |
| Crypto      | Tools (Crypto)            |
| Crypto      | Prediction Markets        |
| Crypto      | Payments                  |
| Engineering | Website Builders          |
| Engineering | Code Editors              |
| Engineering | Developer Tools           |
| Engineering | APIs                      |
| Engineering | Scrapers                  |
| Investing   | Research (Investing)      |
| Investing   | Tools (Investing)         |
| Investing   | News                      |
| Investing   | Newsletters               |
| Investing   | Groups                    |
| Investing   | Funds/Investment Managers |
| Learning    | Online Courses            |
| Learning    | Books                     |
| Learning    | Tutorials                 |
| Misc        | Directories               |
| Misc        | Githubs                   |
| Misc        | Browser Extensions        |
| Misc        | Utilities                 |
| OSINT       | Automation                |
| OSINT       | Discord (OSINT)           |
| OSINT       | Website Information       |
| OSINT       | Company Lookup            |
| OSINT       | People Lookup             |
| OSINT       | Data Breaches             |
| OSINT       | Email Lookup              |
| OSINT       | Image & Photo             |
| OSINT       | Username Lookup           |
| OSINT       | Phone Number              |
| OSINT       | Telegram                  |
| OSINT       | Sockpuppets               |
| OSINT       | Social Accounts           |
| OSINT       | Vehicles                  |
| Social      | Discord Servers           |
| Social      | Telegram Bots             |
| Social      | Telegram Channels         |

### 5.5 Category Filter (Pill Buttons)

**Location:** Between the top navigation bar and the search bar.

**UI:**
- 9 clickable pill buttons, one per category: `Engineering` | `Artsy` | `Crypto` | `Investing` | `OSINT` | `Learning` | `Social` | `Misc` | `AI`
- **Selected state:** blue background, white text
- **Unselected state:** gray background, default text
- A red **"Clear filters"** button appears (alongside the pills) when one or more categories are active

**Behavior:**
- Multi-select: multiple categories can be active simultaneously
- Clicking an active category deselects it
- Default view shows all entries with no active filters
- Works in combination with the search bar and advanced filters
- Changing category selection resets pagination to page 1

**Data mapping:** Filters on the `primary_category` array column — a row is shown if any of its `primary_category` values matches any selected category.

### 5.6 Subcategory Filter

Accessible via the **Filter** button in the top-right toolbar. Opens a filter panel.

**Filter row structure:**
- `Where` label
- Field selector dropdown: defaults to `Primary Sub...` (Primary Subcategory)
- Operator dropdown with options:
  - `has any of`
  - `has all of`
  - `is exactly`
  - `has none of`
  - `is empty`
  - `is not empty`
- Value selector: multi-select dropdown listing all subcategory values (alphabetically sorted)
- Delete row button (trash icon)
- Duplicate row button

**Additional controls:**
- `+ Add condition` — adds another filter row (AND logic between rows)
- `+ Add condition group` — groups conditions (for nested AND/OR logic)

Multiple filter rows can be active simultaneously. All rows use AND logic by default.

### 5.7 Sort

Accessible via the **Sort** button in the top-right toolbar.

Columns that support sorting:
- **Name** — ascending (A→Z) or descending (Z→A)
- **Date Added** — ascending (oldest first) or descending (newest first)

Only one sort can be active at a time. The active sort column shows a directional arrow indicator in the column header.

### 5.8 Links Filter

Accessible via the **Filter** panel (same as §5.6), with `Links` as the selected field.

**Filterable link fields:**
- Has LinkedIn (`linkedin` is not null)
- Has YouTube (`youtube` is not null)
- Has Discord (`community` is not null AND `community` contains `discord.gg` or `discord.com`)
- Has Telegram (`community` is not null AND `community` contains `t.me` or `telegram.me`)
- Has Reddit (`community` is not null AND `community` contains `reddit.com`)
- Has GitHub (`github` is not null)
- Has Twitter/X (`twitter` is not null)

**Logic:** Multiple link filters can be combined with AND or OR operators.

### 5.9 Search Bar

**Location:** Full-width bar below the category filter pills.

**Behavior:**
- Live/debounced text search (triggers after user stops typing, ~300ms debounce)
- Searches across: `name` and `description` fields (case-insensitive, partial match)
- Works in combination with active category filters and advanced filters
- Resets pagination to page 1 on input change
- Placeholder text: `Search...`

### 5.10 Grouping

Accessible via the **Group** button in the top-right toolbar.

**Group by:** Primary Subcategory (`primary_subcategory`)

When grouping is active:
- Rows are clustered under collapsible section headers, one per subcategory value
- Each section header displays the subcategory name and a row count
- Sections are collapsible/expandable
- Rows that belong to multiple subcategories appear under each applicable group
- Pagination is disabled or applied within each group (TBD — recommend disabling pagination when grouping is active and instead showing all results)

### 5.11 Pagination

**Location:** Below the table.

**Entries per page options:** 25 (default) | 50 | 100

**Controls:**
- Dropdown selector for entries per page (left side)
- Total results count: e.g., `Showing 51–100 of 528 entries` (center or left)
- Page indicator: e.g., `Page 3 of 11`
- Navigation buttons: **First** / **Previous** / **Next** / **Last**

**Behavior:**
- Selected entries-per-page persists for the session
- Any filter or search change resets to page 1
- Grouping view disables standard pagination (shows all grouped results)

---

## 6. Data Schema

### 6.1 Supabase Connection

| Property    | Value                                                                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Project URL | `https://bgfxtzrkjskrjocwqazt.supabase.co`                                                                                                                                                                         |
| Project ID  | `bgfxtzrkjskrjocwqazt`                                                                                                                                                                                             |
| Anon Key    | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZnh0enJranNrcmpvY3dxYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjcyMzIsImV4cCI6MjA4NTgwMzIzMn0.3UUmWP7zbDd7dY-dj_h-d2t6zHC0Ia6t38YbWE3Gh_E` |


> ⚠️ The service role key should never be committed to the frontend codebase. Use it only in server-side scripts (e.g., `enrich_collection.py`, the dead links checker).

### 6.2 `collection` Table

Primary data table. RLS is currently disabled.

| Column               | Type           | Nullable | Description                                                                 |
| -------------------- | -------------- | -------- | --------------------------------------------------------------------------- |
| `id`                 | `uuid`         | No       | Primary key, auto-generated via `gen_random_uuid()`                         |
| `name`               | `text`         | No       | Display name of the tool/website. Unique.                                   |
| `description`        | `text`         | Yes      | Short description                                                           |
| `url`                | `text`         | Yes      | Primary website URL. Unique.                                                |
| `logo`               | `text`         | Yes      | URL to the favicon or logo image. Displayed next to the name in the table.  |
| `twitter`            | `text`         | Yes      | Full Twitter/X profile URL                                                  |
| `linkedin`           | `text`         | Yes      | Full LinkedIn page URL                                                      |
| `github`             | `text`         | Yes      | Full GitHub repository or profile URL                                       |
| `youtube`            | `text`         | Yes      | Full YouTube channel URL                                                    |
| `community`          | `text`         | Yes      | Community link (Discord, Telegram channel, subreddit, etc.)                 |
| `primary_category`   | `text[]`       | Yes      | Array of category tags. Valid values: `AI`, `Engineering`, `Artsy`, `Misc`, `Crypto`, `OSINT`, `Investing`, `Learning`, `Social` |
| `primary_subcategory`| `text[]`       | Yes      | Array of subcategory tags (see §5.4 for valid values)                       |
| `created_at`         | `timestamptz`  | Yes      | Timestamp when the record was added. Defaults to `now()`.                   |

### 6.3 `dead_links` Table

Identical schema to `collection`. Stores entries that have been removed from `collection` because their primary URL (`url`) no longer resolves successfully. RLS is enabled.

---

## 7. Adding Data

New entries are added via the `enrich_collection.py` script. This script:

1. Accepts a URL (or batch of URLs) as input
2. Fetches metadata from the target page (title, description, favicon)
3. Uses an AI model to generate or refine the description and infer `primary_category` and `primary_subcategory` tags
4. Upserts the enriched record into the `collection` table via the Supabase service role key

The script is run manually by the site owner. It is not exposed as a public endpoint.

---

## 8. Dead Links Checker

### 8.1 Schedule

Runs once per week (e.g., every Sunday at midnight UTC via a cron job or scheduled task).

### 8.2 Logic

For each row in the `collection` table where `url` is not null:

1. Send an HTTP `HEAD` request (with a 10-second timeout) to the `url`
2. If the response status is **not** in the 2xx or 3xx range, or if the request times out / throws a connection error, flag the entry as a dead link
3. Copy the full row to the `dead_links` table
4. Delete the row from the `collection` table

### 8.3 Implementation Notes

- Use the service role key (never the anon key) for write operations
- Log all checked URLs and their HTTP status codes to a local file or stdout for review
- Run checks with a small delay between requests (e.g., 500ms) to avoid rate-limiting
- The script can be run as a standalone Python script via cron, or as a Supabase Edge Function on a scheduled trigger

---

## 9. Deployment

| Property        | Value                                              |
| --------------- | -------------------------------------------------- |
| Hosting         | Vercel (preferred) or Netlify                      |
| Build command   | `vite build`                                       |
| Output dir      | `dist`                                             |
| Environment vars| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`      |

The Supabase anon key is safe to expose in the frontend as it is scoped to read-only public access. The service role key must never be included in the frontend build.

---

## 10. Visual Design Reference

The Figma Make project (`https://www.figma.com/make/zk01ZL9yf2y5fU23uij928/`) contains the reference implementation. Key design decisions:

- **Component library:** shadcn/ui (pre-built components for table, dropdown, badge, button, input, popover, etc.)
- **Subcategory badges:** Colored pill badges — each subcategory has a consistent assigned color
- **Table row hover:** Subtle background highlight on row hover
- **Responsive:** Desktop-first; mobile layout is not a primary requirement for v1

### 10.1 Typography

| Property    | Value                                                                 |
| ----------- | --------------------------------------------------------------------- |
| Font family | **Space Grotesk**                                                     |
| Source      | Google Fonts (`https://fonts.google.com/specimen/Space+Grotesk`)      |
| Weights     | 400 (regular), 500 (medium), 600 (semibold), 700 (bold)               |
| Usage       | Applied globally as the base font family for all text on the site     |

### 10.2 Color Themes

The site supports **Light Mode** and **Dark Mode**. A toggle in the UI allows the user to switch between them. The default mode should follow the user's OS preference (`prefers-color-scheme`).

#### Light Mode ("Clean")

| Token              | Value     | Usage                                          |
| ------------------ | --------- | ---------------------------------------------- |
| Background         | `#F8FAFC` | Page background                                |
| Card background    | `#FFFFFF` | Cards, table surface, nav bar                  |
| Primary text       | `#0F172A` | Headings, body text                            |
| Muted text         | `#64748B` | Descriptions, column headers, secondary labels |
| Accent             | `#3B82F6` | CTA button, active nav link, active filter pill, external link icon |
| Accent foreground  | `#FFFFFF` | Text on accent-colored elements                |
| Border             | `#E2E8F0` | Table borders, card outlines, input borders    |
| Table header bg    | `#F1F5F9` | Column header row background                   |
| Row hover bg       | `#F8FAFC` | Table row hover state                          |
| Nav border         | `#E2E8F0` | Bottom border of the top navigation bar        |
| Badge (primary)    | bg `#EFF6FF` / text `#3B82F6` | First subcategory badge on a row  |
| Badge (secondary)  | bg `#F0FDF4` / text `#16A34A` | Additional subcategory badges     |

#### Dark Mode ("Dark")

| Token              | Value     | Usage                                          |
| ------------------ | --------- | ---------------------------------------------- |
| Background         | `#0F172A` | Page background                                |
| Card background    | `#1E293B` | Cards, table surface, nav bar                  |
| Primary text       | `#F1F5F9` | Headings, body text                            |
| Muted text         | `#94A3B8` | Descriptions, column headers, secondary labels |
| Accent             | `#818CF8` | CTA button, active nav link, active filter pill, external link icon |
| Accent foreground  | `#FFFFFF` | Text on accent-colored elements                |
| Border             | `#334155` | Table borders, card outlines, input borders    |
| Table header bg    | `#1E293B` | Column header row background                   |
| Row hover bg       | `#263347` | Table row hover state                          |
| Nav border         | `#334155` | Bottom border of the top navigation bar        |
| Badge (primary)    | bg `#312E81` / text `#A5B4FC` | First subcategory badge on a row  |
| Badge (secondary)  | bg `#064E3B` / text `#6EE7B7` | Additional subcategory badges     |

### 10.3 Light/Dark Mode Toggle

- A sun/moon icon toggle is displayed in the top navigation bar (right side)
- Default mode is determined by `prefers-color-scheme` media query
- User's manual selection is persisted in `localStorage` for the session and future visits
- Implemented via a CSS class toggle on the `<html>` element (e.g., `class="dark"`) using Tailwind's `darkMode: 'class'` strategy
