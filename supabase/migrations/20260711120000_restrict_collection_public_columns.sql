-- Restrict what the public Data API can read from `collection` to exactly the
-- columns the site renders. With column-level grants, PostgREST rejects
-- `select=*` — so the frontend commit that pins COLLECTION_SELECT to explicit
-- columns (src/lib/collection.ts) MUST be deployed before this migration runs.
--
-- RLS stays on with the existing "Public read access" policies: grants decide
-- which columns are reachable, RLS decides which rows. Both are required.
-- Columns added to `collection` later are private until explicitly granted here.

revoke all on table public.collection from anon, authenticated;

grant select (
  id,
  name,
  description,
  short_description,
  url,
  logo,
  twitter,
  linkedin,
  github,
  youtube,
  community,
  tags,
  prices,
  features_v2,
  created_at
) on table public.collection to anon, authenticated;

-- Not granted (frontend never renders them):
--   primary_category, primary_subcategory  → deprecated legacy taxonomy
--   pricing                                → raw enrichment jsonb (incl. scraped notes)

-- Taxonomy tables stay fully readable, but drop the default write grants.
-- Writes were already blocked by RLS (no write policies); this removes the
-- standing grants as well.
revoke insert, update, delete, truncate, references, trigger
  on table public.topics, public.categories, public.product_categories
  from anon, authenticated;

-- dead_links is internal-only (scheduled Python script via service role).
-- RLS already returns zero rows to the API roles; revoke the grants too.
revoke all on table public.dead_links from anon, authenticated;
