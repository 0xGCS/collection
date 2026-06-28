import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { fetchCollectionItems } from '@/lib/collection'
import { topicIcon } from '@/components/collection/topic-icons'
import type { CollectionItem } from '@/components/collection/types'

interface CategorySummary {
  slug: string
  name: string
  count: number
}

interface TopicSummary {
  slug: string
  name: string
  icon: string
  total: number
  catCount: number
  categories: CategorySummary[]
}

// Roll the normalized product → category → topic graph into per-topic summaries.
// Counts are distinct products: per category = products in that category, and the
// topic total = distinct products in the topic (a product can span categories).
function buildTopics(items: CollectionItem[]): { topics: TopicSummary[]; totalTools: number } {
  const byTopic = new Map<
    string,
    { name: string; products: Set<string>; cats: Map<string, { name: string; products: Set<string> }> }
  >()
  const allProducts = new Set<string>()

  for (const item of items) {
    for (const cat of item.categories) {
      if (!cat.topicSlug) continue
      allProducts.add(item.id)

      let topic = byTopic.get(cat.topicSlug)
      if (!topic) {
        topic = { name: cat.topicName, products: new Set(), cats: new Map() }
        byTopic.set(cat.topicSlug, topic)
      }
      topic.products.add(item.id)

      let entry = topic.cats.get(cat.slug)
      if (!entry) {
        entry = { name: cat.name, products: new Set() }
        topic.cats.set(cat.slug, entry)
      }
      entry.products.add(item.id)
    }
  }

  const topics: TopicSummary[] = Array.from(byTopic.entries())
    .map(([slug, topic]) => {
      const categories = Array.from(topic.cats.entries())
        .map(([catSlug, cat]) => ({ slug: catSlug, name: cat.name, count: cat.products.size }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      return {
        slug,
        name: topic.name,
        icon: topicIcon(slug),
        total: topic.products.size,
        catCount: categories.length,
        categories,
      }
    })
    .filter((t) => t.catCount > 0)
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))

  return { topics, totalTools: allProducts.size }
}

// ── Category row (shared by both layouts) ─────────────────────────────────────

function CategoryRow({ category }: { category: CategorySummary }) {
  return (
    <Link
      to={`/tools/category/${category.slug}`}
      className="flex items-center justify-between gap-3 rounded-md px-2.5 py-2 text-sm text-primary-text transition-colors hover:bg-row-hover-bg hover:text-accent"
    >
      <span className="truncate">{category.name}</span>
      <span className="shrink-0 font-mono text-xs text-muted-text">{category.count}</span>
    </Link>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-xl border border-border bg-card-bg p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-border" />
        <div className="h-6 w-32 rounded bg-border" />
      </div>
      <div className="h-3 w-40 rounded bg-border" />
      <div className="mt-2 flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-border" />
        ))}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

type Layout = 'cards' | 'index'

export default function TopicsPage() {
  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [layout, setLayout] = useState<Layout>('cards')

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

  const { topics, totalTools } = useMemo(() => buildTopics(items), [items])
  const totalCats = useMemo(() => topics.reduce((sum, t) => sum + t.catCount, 0), [topics])

  const segBase = 'rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors'
  const segActive = `${segBase} bg-blue-600 text-white`
  const segIdle = `${segBase} bg-transparent text-muted-text hover:text-primary-text`

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-primary-text">Topics</h1>
          <p className="text-lg leading-relaxed text-muted-text">
            {loading
              ? 'Everything in the compendium, grouped — pick a lane and dig in.'
              : `Everything in the compendium, grouped. ${totalTools} tools across ${totalCats} categories in ${topics.length} topics — pick a lane and dig in.`}
          </p>
        </div>

        <div className="inline-flex gap-1 rounded-md border border-border bg-card-bg p-1">
          <button type="button" onClick={() => setLayout('cards')} className={layout === 'cards' ? segActive : segIdle}>
            Cards
          </button>
          <button type="button" onClick={() => setLayout('index')} className={layout === 'index' ? segActive : segIdle}>
            Index
          </button>
        </div>
      </header>

      {loading ? (
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : layout === 'cards' ? (
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
          {topics.map((topic) => (
            <section
              key={topic.slug}
              className="flex flex-col rounded-xl border border-border bg-card-bg p-6"
            >
              <div className="mb-1.5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-xl leading-none">
                  {topic.icon}
                </span>
                <h2 className="flex-1 text-2xl font-bold tracking-tight text-primary-text">{topic.name}</h2>
              </div>
              <p className="mb-4 border-b border-border pb-4 text-xs font-medium uppercase tracking-wide text-muted-text">
                {topic.total} tools · {topic.catCount} categories
              </p>
              <div className="flex flex-col gap-0.5">
                {topic.categories.map((cat) => (
                  <CategoryRow key={cat.slug} category={cat} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="gap-5 [column-gap:1.25rem] [column-width:22rem]">
          {topics.map((topic) => (
            <section key={topic.slug} className="mb-9 break-inside-avoid">
              <div className="mb-2 flex items-baseline gap-2 border-b border-border pb-2.5">
                <span className="text-base leading-none">{topic.icon}</span>
                <h2 className="flex-1 text-lg font-bold tracking-tight text-primary-text">{topic.name}</h2>
                <span className="font-mono text-xs text-muted-text">{topic.total}</span>
              </div>
              {topic.categories.map((cat) => (
                <CategoryRow key={cat.slug} category={cat} />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
