# Item Detail Pages Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add first-class detail pages for individual collection entries so the site feels like a compendium instead of only a table.

**Architecture:** Keep the current frontend-only architecture and existing `collection` table. Use React Router route params with the existing Supabase anon client, fetch one row by `id`, and render a dedicated detail page that reuses the current data model. Do not add backend services or schema changes in this pass; ship the simplest version that turns each row into a real content object.

**Tech Stack:** React 19, TypeScript, React Router, Supabase JS, Tailwind CSS, shadcn/ui, Vite

---

## What exists today

- Routes live in `src/App.tsx`
- The main experience is `src/components/CollectionTable.tsx`
- Supabase client setup lives in `src/lib/supabase.ts`
- There is currently **no test harness** (no Vitest, React Testing Library, Playwright, or Cypress in `package.json`)
- Production build currently passes with `npm run build`

## Product decision for this implementation

Use **ID-based detail routes**:

- List page stays at `/toooooooooools`
- Detail page becomes `/toooooooooools/:itemId`

Why this route shape:
- IDs already exist and are unique in Supabase
- No slug generation work or slug collision handling is needed
- This keeps the first version small and reliable

## Scope for v1 of detail pages

### In scope
- Detail route for one collection item
- Internal navigation from table row → detail page
- Dedicated detail page layout with:
  - name
  - logo
  - full description
  - primary category / subcategory / tags
  - pricing
  - date added
  - all outbound links
  - back-to-table affordance
  - a small “related items” section
- Loading state
- Not-found state
- Reuse existing Supabase table and frontend anon key

### Out of scope
- Slugs / SEO-friendly names
- Curator notes / ratings / favorites
- Schema changes
- Server-side rendering
- Full responsive redesign of the table page
- Search index changes
- Twitter page cleanup

---

## UX decisions to implement

### Table behavior
Change the primary row interaction:
- **Item name opens the internal detail page**
- Website/social/community icons remain external links

This removes the current duplication where the row name and “Website” icon both lead outward.

### Detail page structure
Top section:
- Back link: `← Back to Toooooooooools`
- logo + name + price badge
- primary category badges
- primary subcategory badges
- external actions: Website, Twitter/X, LinkedIn, GitHub, YouTube, Community

Content section:
- full description
- metadata block:
  - date added
  - price
  - categories
  - subcategories
  - tags

Related items section:
- Prefer same `primary_subcategory`
- Fallback to same `primary_category`
- Exclude current item
- Limit to 6 items

### Not-found state
If the `id` is missing or invalid:
- show “Item not found”
- include button back to `/toooooooooools`

---

## Proposed file changes

### Create
- `src/lib/collection.ts`
- `src/components/CollectionDetailPage.tsx`
- `src/components/collection/CollectionLinks.tsx`
- `src/components/collection/CollectionBadges.tsx`
- `src/components/collection/types.ts`

### Modify
- `src/App.tsx`
- `src/components/CollectionTable.tsx`
- `src/components/layout/Navbar.tsx`
- `README.md`
- `package.json`

### Optional create if needed during implementation
- `src/components/ui/card.tsx`

If a card primitive is not added, use existing Tailwind classes directly and do not add extra abstraction.

---

## Implementation strategy

The current `CollectionTable.tsx` file contains:
- type definitions
- icon rendering
- link rendering
- filtering and grouping logic
- row rendering

That file is already large. Do **not** make it larger by adding detail page logic inline.

Instead:
1. Extract reusable collection types into `src/components/collection/types.ts`
2. Extract shared link rendering into `src/components/collection/CollectionLinks.tsx`
3. Extract shared badge rendering into `src/components/collection/CollectionBadges.tsx`
4. Add fetch helpers in `src/lib/collection.ts`
5. Build the detail page as a separate component

This keeps the table page focused on list browsing and the detail page focused on single-item presentation.

---

## Task 1: Add a minimal test harness

**Objective:** Add a basic frontend test setup so subsequent tasks can verify routing and detail page rendering.

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/components/__tests__/smoke.test.tsx`

**Step 1: Add test dependencies**

Update `package.json` devDependencies with:

```json
{
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^14.6.1",
  "jsdom": "^26.1.0",
  "vitest": "^2.1.9"
}
```

Add scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**Step 2: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: Add test setup**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

**Step 4: Add a smoke test**

Create `src/components/__tests__/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'

test('smoke test works', () => {
  render(<div>Hello test</div>)
  expect(screen.getByText('Hello test')).toBeInTheDocument()
})
```

**Step 5: Install and run tests**

Run:

```bash
npm install
npm run test
```

Expected: PASS — one test passes.

**Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/components/__tests__/smoke.test.tsx
git commit -m "test: add vitest setup"
```

---

## Task 2: Extract shared collection types

**Objective:** Move the collection item shape out of `CollectionTable.tsx` so it can be reused by the detail page and helper modules.

**Files:**
- Create: `src/components/collection/types.ts`
- Modify: `src/components/CollectionTable.tsx`

**Step 1: Write failing test for type-driven import usage**

Create `src/components/__tests__/collection-types-smoke.test.tsx`:

```tsx
import type { CollectionItem } from '@/components/collection/types'

test('collection item type module is importable', () => {
  const item: Pick<CollectionItem, 'id' | 'name'> = {
    id: '123',
    name: 'Example',
  }

  expect(item.name).toBe('Example')
})
```

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- collection-types-smoke
```

Expected: FAIL — module not found.

**Step 3: Create shared types file**

Create `src/components/collection/types.ts`:

```ts
export interface CollectionItem {
  id: string
  name: string
  description: string | null
  url: string | null
  logo: string | null
  twitter: string | null
  linkedin: string | null
  github: string | null
  youtube: string | null
  community: string | null
  primary_category: string[] | null
  primary_subcategory: string[] | null
  tags: string[] | null
  prices: string | null
  pricing: string | null
  created_at: string | null
}
```

**Step 4: Update `CollectionTable.tsx` to import the type**

Replace the inline interface with:

```ts
import type { CollectionItem } from '@/components/collection/types'
```

**Step 5: Run tests**

Run:

```bash
npm run test
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/components/collection/types.ts src/components/CollectionTable.tsx src/components/__tests__/collection-types-smoke.test.tsx
git commit -m "refactor: extract shared collection types"
```

---

## Task 3: Extract shared badge helpers

**Objective:** Reuse subcategory/tag/category/price badge rendering between the table and detail page.

**Files:**
- Create: `src/components/collection/CollectionBadges.tsx`
- Modify: `src/components/CollectionTable.tsx`
- Test: `src/components/__tests__/collection-badges.test.tsx`

**Step 1: Write failing test**

Create `src/components/__tests__/collection-badges.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { CollectionTagList, CollectionPriceBadge } from '@/components/collection/CollectionBadges'

test('renders tag badges and price badge', () => {
  render(
    <div>
      <CollectionTagList values={['AI', 'OSINT']} />
      <CollectionPriceBadge value="free" />
    </div>
  )

  expect(screen.getByText('AI')).toBeInTheDocument()
  expect(screen.getByText('OSINT')).toBeInTheDocument()
  expect(screen.getByText('Free')).toBeInTheDocument()
})
```

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- collection-badges
```

Expected: FAIL — module not found.

**Step 3: Create badge helpers**

Create `src/components/collection/CollectionBadges.tsx` with:
- `PRICE_LABELS`
- `PRICE_PALETTE`
- `getBadgePalette()`
- `CollectionTagList`
- `CollectionPriceBadge`

Use the existing palette logic from `CollectionTable.tsx` and export it from the new file.

Suggested interface:

```tsx
interface CollectionTagListProps {
  values: string[] | null | undefined
}

interface CollectionPriceBadgeProps {
  value: string | null | undefined
}
```

**Step 4: Update `CollectionTable.tsx`**

Replace inline badge rendering with the shared components.

Examples:

```tsx
<CollectionTagList values={item.primary_subcategory} />
<CollectionTagList values={item.tags} />
<CollectionPriceBadge value={item.prices} />
```

If you need different sizing between subcategories and tags, add a small `kind` prop rather than duplicating components.

**Step 5: Run tests and build**

Run:

```bash
npm run test
npm run build
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/components/collection/CollectionBadges.tsx src/components/CollectionTable.tsx src/components/__tests__/collection-badges.test.tsx
git commit -m "refactor: extract collection badge helpers"
```

---

## Task 4: Extract shared link rendering

**Objective:** Reuse outbound link rendering between the table and the detail page.

**Files:**
- Create: `src/components/collection/CollectionLinks.tsx`
- Modify: `src/components/CollectionTable.tsx`
- Test: `src/components/__tests__/collection-links.test.tsx`

**Step 1: Write failing test**

Create `src/components/__tests__/collection-links.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { CollectionLinks } from '@/components/collection/CollectionLinks'
import type { CollectionItem } from '@/components/collection/types'

const item: CollectionItem = {
  id: '1',
  name: 'Example',
  description: 'Example description',
  url: 'https://example.com',
  logo: null,
  twitter: 'https://x.com/example',
  linkedin: null,
  github: null,
  youtube: null,
  community: null,
  primary_category: ['AI'],
  primary_subcategory: ['Agents'],
  tags: ['automation'],
  prices: 'free',
  pricing: 'free',
  created_at: '2026-04-15T00:00:00+00:00',
}

test('renders website and twitter links', () => {
  render(<CollectionLinks item={item} />)

  expect(screen.getByTitle('Website')).toBeInTheDocument()
  expect(screen.getByTitle('Twitter/X')).toBeInTheDocument()
})
```

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- collection-links
```

Expected: FAIL — module not found.

**Step 3: Create shared links component**

Create `src/components/collection/CollectionLinks.tsx`.

Move these pieces from `CollectionTable.tsx` into it:
- brand SVG icons
- community detection helper
- small icon button component
- list renderer

Export a main component:

```tsx
export function CollectionLinks({
  item,
  iconOnly = true,
}: {
  item: CollectionItem
  iconOnly?: boolean
})
```

Behavior:
- `iconOnly=true`: compact icon row for the table
- `iconOnly=false`: text-capable / larger action buttons for detail page hero actions

If supporting both modes makes the component messy, export two components instead:
- `CollectionLinkIcons`
- `CollectionLinkButtons`

That is preferable to prop soup.

**Step 4: Replace inline link cell rendering in table**

Update the table cell to use the shared component.

**Step 5: Run tests and build**

Run:

```bash
npm run test
npm run build
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/components/collection/CollectionLinks.tsx src/components/CollectionTable.tsx src/components/__tests__/collection-links.test.tsx
git commit -m "refactor: extract collection link rendering"
```

---

## Task 5: Add collection data helpers

**Objective:** Create a small data-access layer for fetching one item and related items from Supabase.

**Files:**
- Create: `src/lib/collection.ts`
- Test: `src/components/__tests__/collection-data-helpers.test.ts`

**Step 1: Write failing tests for pure helper logic**

Create `src/components/__tests__/collection-data-helpers.test.ts`:

```ts
import { pickRelatedItems } from '@/lib/collection'
import type { CollectionItem } from '@/components/collection/types'

const base = (overrides: Partial<CollectionItem>): CollectionItem => ({
  id: '1',
  name: 'Example',
  description: 'desc',
  url: 'https://example.com',
  logo: null,
  twitter: null,
  linkedin: null,
  github: null,
  youtube: null,
  community: null,
  primary_category: ['AI'],
  primary_subcategory: ['Agents'],
  tags: ['automation'],
  prices: 'free',
  pricing: 'free',
  created_at: '2026-04-15T00:00:00+00:00',
  ...overrides,
})

test('prefers same subcategory before same category', () => {
  const current = base({ id: 'current' })
  const sameSub = base({ id: 'same-sub', primary_subcategory: ['Agents'] })
  const sameCat = base({ id: 'same-cat', primary_subcategory: ['Chatbots'] })
  const other = base({ id: 'other', primary_category: ['Crypto'], primary_subcategory: ['Wallets'] })

  const result = pickRelatedItems(current, [sameCat, other, sameSub], 6)

  expect(result.map((item) => item.id)).toEqual(['same-sub', 'same-cat'])
})
```

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- collection-data-helpers
```

Expected: FAIL — module not found.

**Step 3: Create helper module**

Create `src/lib/collection.ts` and export:

```ts
import { supabase } from '@/lib/supabase'
import type { CollectionItem } from '@/components/collection/types'

export async function fetchCollectionItemById(itemId: string): Promise<CollectionItem | null> {
  const { data, error } = await supabase
    .from('collection')
    .select('*')
    .eq('id', itemId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function fetchCollectionItems(limit = 1000): Promise<CollectionItem[]> {
  const { data, error } = await supabase
    .from('collection')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export function pickRelatedItems(
  current: CollectionItem,
  items: CollectionItem[],
  limit = 6,
): CollectionItem[] {
  const currentSubcategories = new Set(current.primary_subcategory ?? [])
  const currentCategories = new Set(current.primary_category ?? [])

  const filtered = items.filter((item) => item.id !== current.id)

  const sameSubcategory = filtered.filter((item) =>
    (item.primary_subcategory ?? []).some((value) => currentSubcategories.has(value)),
  )

  const sameCategory = filtered.filter(
    (item) =>
      !sameSubcategory.some((candidate) => candidate.id === item.id) &&
      (item.primary_category ?? []).some((value) => currentCategories.has(value)),
  )

  return [...sameSubcategory, ...sameCategory].slice(0, limit)
}
```

Note: fetching all items for related-content selection is acceptable for this first version because the current dataset is ~600 rows. Keep it simple.

**Step 4: Run tests**

Run:

```bash
npm run test
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/collection.ts src/components/__tests__/collection-data-helpers.test.ts
git commit -m "feat: add collection data helpers"
```

---

## Task 6: Add the detail page route shell

**Objective:** Add a routed page that reads the route param and shows loading / error / not-found states.

**Files:**
- Create: `src/components/CollectionDetailPage.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/__tests__/collection-detail-page-shell.test.tsx`

**Step 1: Write failing route test**

Create `src/components/__tests__/collection-detail-page-shell.test.tsx`:

```tsx
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import CollectionDetailPage from '@/components/CollectionDetailPage'

test('shows loading state for detail route', () => {
  render(
    <MemoryRouter initialEntries={['/toooooooooools/abc-123']}>
      <Routes>
        <Route path="/toooooooooools/:itemId" element={<CollectionDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})
```

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- collection-detail-page-shell
```

Expected: FAIL — component not found.

**Step 3: Create route shell**

Create `src/components/CollectionDetailPage.tsx` with:
- `useParams()` to read `itemId`
- local state for `loading`, `item`, `relatedItems`, and `error`
- `useEffect()` to fetch data via `fetchCollectionItemById()` and `fetchCollectionItems()`
- early-return render states:
  - loading
  - error
  - not found
  - success shell

Suggested state flow:

```tsx
const { itemId } = useParams()
const [item, setItem] = useState<CollectionItem | null>(null)
const [relatedItems, setRelatedItems] = useState<CollectionItem[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

**Step 4: Add route to `App.tsx`**

Add:

```tsx
<Route path="/toooooooooools/:itemId" element={<CollectionDetailPage />} />
```

**Step 5: Run tests**

Run:

```bash
npm run test
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/components/CollectionDetailPage.tsx src/App.tsx src/components/__tests__/collection-detail-page-shell.test.tsx
git commit -m "feat: add collection detail page route shell"
```

---

## Task 7: Build the detail page UI

**Objective:** Turn the route shell into a useful detail page using existing collection metadata.

**Files:**
- Modify: `src/components/CollectionDetailPage.tsx`
- Test: `src/components/__tests__/collection-detail-page-ui.test.tsx`

**Step 1: Write failing UI test**

Create `src/components/__tests__/collection-detail-page-ui.test.tsx` that mocks the data helper module and asserts visible detail page content:

```tsx
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import CollectionDetailPage from '@/components/CollectionDetailPage'

vi.mock('@/lib/collection', () => ({
  fetchCollectionItemById: vi.fn().mockResolvedValue({
    id: '1',
    name: 'Replit',
    description: 'Cloud IDE',
    url: 'https://replit.com',
    logo: null,
    twitter: 'https://x.com/replit',
    linkedin: null,
    github: 'https://github.com/replit',
    youtube: null,
    community: null,
    primary_category: ['AI', 'Engineering'],
    primary_subcategory: ['Code Editors'],
    tags: ['productivity'],
    prices: 'subscription',
    pricing: 'subscription',
    created_at: '2026-04-15T00:00:00+00:00',
  }),
  fetchCollectionItems: vi.fn().mockResolvedValue([]),
  pickRelatedItems: vi.fn().mockReturnValue([]),
}))

test('renders item detail content', async () => {
  render(
    <MemoryRouter initialEntries={['/toooooooooools/1']}>
      <Routes>
        <Route path="/toooooooooools/:itemId" element={<CollectionDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByText('Replit')).toBeInTheDocument()
  expect(screen.getByText('Cloud IDE')).toBeInTheDocument()
  expect(screen.getByText('Subscription')).toBeInTheDocument()
  expect(screen.getByText('Code Editors')).toBeInTheDocument()
})
```

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- collection-detail-page-ui
```

Expected: FAIL — text not yet rendered.

**Step 3: Implement the success UI**

Render:
- back link to `/toooooooooools`
- hero section with logo, name, price badge
- category/subcategory/tag badges using `CollectionBadges`
- description section
- outbound links section using `CollectionLinks`
- metadata panel

Suggested page skeleton:

```tsx
<div className="mx-auto max-w-6xl px-6 py-8">
  <Link to="/toooooooooools" className="...">← Back to Toooooooooools</Link>

  <div className="mt-6 rounded-xl border border-border bg-card-bg p-6">
    ...hero content...
  </div>

  <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
    <section className="rounded-xl border border-border bg-card-bg p-6">
      ...description...
    </section>
    <aside className="rounded-xl border border-border bg-card-bg p-6">
      ...metadata...
    </aside>
  </div>
</div>
```

**Step 4: Add detail page niceties**

Include:
- `document.title = `${item.name} | Collection`` inside `useEffect()` or a dedicated effect
- logo fallback if image fails
- em dash for missing values
- `new Date(item.created_at).toISOString().slice(0, 10)` for date formatting to match current UI

**Step 5: Run tests and build**

Run:

```bash
npm run test
npm run build
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/components/CollectionDetailPage.tsx src/components/__tests__/collection-detail-page-ui.test.tsx
git commit -m "feat: build collection detail page UI"
```

---

## Task 8: Add related items section

**Objective:** Help users continue browsing from a detail page instead of dead-ending after one item.

**Files:**
- Modify: `src/components/CollectionDetailPage.tsx`
- Test: `src/components/__tests__/collection-detail-page-related.test.tsx`

**Step 1: Write failing test**

Create `src/components/__tests__/collection-detail-page-related.test.tsx` that mocks related items and asserts the section renders links back into the app.

Example expectations:

```tsx
expect(await screen.findByText('Related tools')).toBeInTheDocument()
expect(screen.getByRole('link', { name: 'Cursor' })).toHaveAttribute('href', '/toooooooooools/2')
```

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- collection-detail-page-related
```

Expected: FAIL.

**Step 3: Render related items section**

Below the main content, add a section:

```tsx
<section className="mt-6 rounded-xl border border-border bg-card-bg p-6">
  <h2 className="text-lg font-semibold text-primary-text">Related tools</h2>
  ...cards or compact rows...
</section>
```

For each related item render:
- internal link to its detail page
- optional logo
- name
- one-line description or subcategory badges

Keep this section simple. Do not build a carousel.

**Step 4: Run tests and build**

Run:

```bash
npm run test
npm run build
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/CollectionDetailPage.tsx src/components/__tests__/collection-detail-page-related.test.tsx
git commit -m "feat: add related items to collection detail pages"
```

---

## Task 9: Update table navigation to point internally

**Objective:** Make the list page drive users into detail pages rather than immediately off-site.

**Files:**
- Modify: `src/components/CollectionTable.tsx`
- Test: `src/components/__tests__/collection-table-navigation.test.tsx`

**Step 1: Write failing test**

Create a test that renders a simplified table item and asserts the visible name links to `/toooooooooools/:id`.

Example assertion:

```tsx
expect(screen.getByRole('link', { name: /Replit/i })).toHaveAttribute('href', '/toooooooooools/1')
```

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- collection-table-navigation
```

Expected: FAIL — name still points to external URL.

**Step 3: Update the row name link**

Current behavior:
- name links to external `item.url`
- website icon also links externally

New behavior:
- name links internally using `<Link to={`/toooooooooools/${item.id}`}>`
- external website remains available in the links column
- if there is no `url`, the detail page still works because route is internal

Recommended replacement inside `renderRow()`:

```tsx
<Link
  to={`/toooooooooools/${item.id}`}
  className="inline-flex items-center gap-1 font-medium text-primary-text transition-colors hover:text-accent"
>
  {item.name}
</Link>
```

Do **not** show the external-link icon next to the internal detail link; that icon visually implies an outbound navigation.

**Step 4: Keep row semantics clean**

- keep logo behavior unchanged
- keep links column unchanged
- do not make the full row clickable in this pass

**Step 5: Run tests and build**

Run:

```bash
npm run test
npm run build
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/components/CollectionTable.tsx src/components/__tests__/collection-table-navigation.test.tsx
git commit -m "feat: route collection rows to detail pages"
```

---

## Task 10: Update navbar breadcrumbs for detail pages

**Objective:** Make navigation context correct when the user is inside a detail page.

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Test: `src/components/__tests__/navbar-detail-route.test.tsx`

**Step 1: Write failing test**

Create a test that renders the navbar under `/toooooooooools/123` and asserts:
- Home link exists
- breadcrumb shows `Toooooooooools`
- no weird fallback label like `Home`

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- navbar-detail-route
```

Expected: FAIL — current `pageNames` map only handles exact path matches.

**Step 3: Update navbar path handling**

Replace exact-only labeling with lightweight pathname logic.

Suggested approach:

```ts
const isToolsRoute = location.pathname === '/toooooooooools' || location.pathname.startsWith('/toooooooooools/')
const isTwitterRoute = location.pathname === '/twitter'
const currentPage = isToolsRoute ? 'Toooooooooools' : isTwitterRoute ? 'Twitter' : 'Home'
```

Keep breadcrumb rendering simple. Do not add multi-level dynamic page titles in the navbar yet.

**Step 4: Run tests**

Run:

```bash
npm run test
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/__tests__/navbar-detail-route.test.tsx
git commit -m "feat: support detail page breadcrumbs in navbar"
```

---

## Task 11: Document the new route and product behavior

**Objective:** Keep project docs aligned with the shipped product surface.

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`

**Step 1: Update README**

Change the product description from “two pages” to reflect:
- landing page
- tools index page
- tool detail pages
- Twitter placeholder page

Add one short section:

```md
## Current Routes

- `/` — landing page
- `/toooooooooools` — filterable directory table
- `/toooooooooools/:itemId` — item detail page
- `/twitter` — placeholder page
```

**Step 2: Update CLAUDE.md**

Adjust the project overview and structure so future work doesn’t assume the site is only a landing page plus table.

While editing `CLAUDE.md`, remove the real Supabase anon key and replace it with placeholders:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

This is not optional. The current tracked file should not continue to contain a live-looking key.

**Step 3: Verify docs**

Run:

```bash
git diff -- README.md CLAUDE.md
```

Expected: docs accurately describe the new product surface and no secret value remains in `CLAUDE.md`.

**Step 4: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: update routes and remove embedded key"
```

---

## Task 12: Final verification

**Objective:** Prove the feature works end-to-end before merge.

**Files:**
- No code changes required unless fixes are needed

**Step 1: Run the full verification suite**

Run:

```bash
npm run test
npm run lint
npm run build
```

Expected:
- all tests pass
- lint passes
- build passes

**Step 2: Run the app locally**

Run:

```bash
npm run dev
```

Manually verify:
- `/toooooooooools` loads
- clicking a row name opens `/toooooooooools/:itemId`
- detail page shows full description and metadata
- external action links open real destinations
- related items section renders when data exists
- invalid route like `/toooooooooools/not-a-real-id` shows not-found state
- navbar breadcrumb still shows `Home / Toooooooooools`
- dark mode still works on detail pages

**Step 3: Review bundle warning**

If `npm run build` still shows the >500 kB chunk warning, document it in the PR but do not solve it in this feature unless the detail-page work noticeably worsens it. That is a separate optimization task.

**Step 4: Final commit if needed**

```bash
git add .
git commit -m "chore: polish collection detail pages"
```

---

## Acceptance criteria

The feature is complete when all of the following are true:

- Users can open an internal detail page for any collection item
- The detail page uses the existing Supabase data model only
- The table page still supports search, filter, sort, group, and pagination
- Row names link internally, while website/social icons remain external
- Detail pages show full metadata in a readable layout
- Related items are visible on the detail page
- Missing or invalid IDs show a clean not-found state
- Navbar breadcrumbs still make sense on detail routes
- README and CLAUDE.md reflect the new route structure
- No live-looking credential remains committed in `CLAUDE.md`

---

## Notes for implementation

- Prefer small refactors over heroic rewrites
- Do not move filtering logic out of `CollectionTable.tsx` in this feature unless required
- Do not introduce a global state library
- Do not add server-side rendering
- Do not add slugs yet
- If detail-page data fetching causes visible loading flicker, that is acceptable for v1
- Keep the implementation understandable; this codebase’s strength is simplicity

---

## Recommended follow-up after this plan ships

1. Add curator notes / “why it matters” to entries
2. Replace Twitter placeholder nav or remove it
3. Consider slugged URLs after detail pages prove useful
4. Move more list filtering/searching server-side if data size grows materially
