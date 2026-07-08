import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { fetchCollectionItems } from '@/lib/collection'
import { buildTagSummaries, type TagSummary } from '@/lib/tags'
import { getBadgePalette } from '@/components/collection/badge-utils'

const POPULAR_COUNT = 8
// The "Popular tags" row only appears once the tag set is big enough to need it.
const POPULAR_MIN_TAGS = 12

type TagSort = 'popular' | 'alpha'

function byCount(a: TagSummary, b: TagSummary) {
  return b.count - a.count || a.name.localeCompare(b.name)
}

function byName(a: TagSummary, b: TagSummary) {
  return a.name.localeCompare(b.name)
}

function SortToggle({ sort, onChange }: { sort: TagSort; onChange: (next: TagSort) => void }) {
  const base = 'rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors'
  const active = `${base} bg-blue-600 text-white`
  const idle = `${base} bg-transparent text-muted-text hover:text-primary-text`

  return (
    <div className="inline-flex gap-1 rounded-md border border-border bg-card-bg p-1">
      <button type="button" onClick={() => onChange('popular')} className={sort === 'popular' ? active : idle}>
        Popular
      </button>
      <button type="button" onClick={() => onChange('alpha')} className={sort === 'alpha' ? active : idle}>
        A–Z
      </button>
    </div>
  )
}

function TagCard({ tag }: { tag: TagSummary }) {
  return (
    <Link
      to={`/tags/${tag.slug}`}
      className="flex flex-col gap-1 rounded-xl border border-border bg-card-bg px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-blue-500"
    >
      <span className="text-[0.9375rem] font-semibold text-primary-text">{tag.name}</span>
      <span className="text-xs text-muted-text">
        {tag.count} {tag.count === 1 ? 'product' : 'products'}
      </span>
    </Link>
  )
}

function SkeletonTagCard() {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-xl border border-border bg-card-bg px-4 py-3.5">
      <div className="h-4 w-24 rounded bg-border" />
      <div className="h-3 w-16 rounded bg-border" />
    </div>
  )
}

export default function TagsPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchCollectionItems>>>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<TagSort>('popular')

  useEffect(() => {
    const previousTitle = document.title
    document.title = "Browse Tags | Greg's Compendium"
    return () => {
      document.title = previousTitle
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const data = await fetchCollectionItems()
      if (cancelled) return
      setItems(data)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const tags = useMemo(() => buildTagSummaries(items), [items])
  const popularTags = useMemo(() => [...tags].sort(byCount).slice(0, POPULAR_COUNT), [tags])
  const sortedTags = useMemo(
    () => [...tags].sort(sort === 'popular' ? byCount : byName),
    [tags, sort],
  )
  const showPopular = tags.length >= POPULAR_MIN_TAGS

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 sm:mb-11">
        <h1 className="text-3xl font-bold tracking-tight text-primary-text sm:text-4xl">
          Browse by Tags
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-text sm:text-lg">
          Explore tools by feature, audience, use case, and product attribute.
        </p>
        {/* Mobile: sort control sits below the intro (mockup 1c). */}
        <div className="mt-6 sm:hidden">
          <SortToggle sort={sort} onChange={setSort} />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:[grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
          {Array.from({ length: 16 }).map((_, i) => (
            <SkeletonTagCard key={i} />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card-bg px-6 py-14 text-center">
          <p className="text-[0.9375rem] text-muted-text">No tags available yet.</p>
        </div>
      ) : (
        <>
          {showPopular && (
            <section className="mb-8 sm:mb-11" aria-label="Popular tags">
              <h2 className="mb-3.5 text-base font-semibold text-primary-text sm:mb-4 sm:text-lg">
                Popular tags
              </h2>
              {/* Desktop: count-badge cards in a 4-up grid (mockup 1b). */}
              <div className="hidden gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-4">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    to={`/tags/${tag.slug}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card-bg px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-blue-500"
                  >
                    <span className="truncate text-[0.9375rem] font-semibold text-primary-text">
                      {tag.name}
                    </span>
                    <span className="inline-flex h-6 min-w-7 shrink-0 items-center justify-center rounded-full bg-table-header-bg px-2 text-xs font-semibold text-muted-text">
                      {tag.count}
                    </span>
                  </Link>
                ))}
              </div>
              {/* Mobile: compact colored pills (mockup 1c). */}
              <div className="flex flex-wrap gap-2 sm:hidden">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    to={`/tags/${tag.slug}`}
                    className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold ${getBadgePalette(tag.slug)}`}
                  >
                    {tag.name}
                    <span className="font-medium opacity-70">{tag.count}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section aria-label="All tags">
            <div className="mb-3.5 flex items-center justify-between gap-4 sm:mb-5">
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-base font-semibold text-primary-text sm:text-lg">All tags</h2>
                <span className="text-[0.8125rem] text-muted-text">
                  {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
                </span>
              </div>
              <div className="hidden sm:block">
                <SortToggle sort={sort} onChange={setSort} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:[grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
              {sortedTags.map((tag) => (
                <TagCard key={tag.slug} tag={tag} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
