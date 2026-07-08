import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { fetchCollectionItems } from '@/lib/collection'
import { formatTagName, itemHasTag, slugifyTag } from '@/lib/tags'
import { CollectionCard, CollectionCardSkeleton } from '@/components/collection/CollectionCard'
import { Button } from '@/components/ui/button'
import type { CollectionItem } from '@/components/collection/types'

type ProductSort = 'newest' | 'alpha'

function TagNotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">404 · Tag</p>
      <h1 className="text-3xl font-bold tracking-tight text-primary-text">Tag not found.</h1>
      <p className="max-w-lg leading-relaxed text-muted-text">
        We couldn't find a tag at that address. It may have been renamed or removed.
      </p>
      <Link to="/tags" className="mt-2">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">Back to all tags</Button>
      </Link>
    </div>
  )
}

export default function TagDetailPage() {
  const { tagSlug } = useParams<{ tagSlug: string }>()
  const slug = slugifyTag(tagSlug ?? '')
  const tagName = formatTagName(slug)

  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<ProductSort>('newest')

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${tagName} Tools | Greg's Compendium`
    return () => {
      document.title = previousTitle
    }
  }, [tagName])

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

  const taggedItems = useMemo(() => {
    const matches = items.filter((item) => itemHasTag(item, slug))
    return [...matches].sort((a, b) =>
      sort === 'newest'
        ? (b.created_at ?? '').localeCompare(a.created_at ?? '')
        : a.name.localeCompare(b.name),
    )
  }, [items, slug, sort])

  // Tags only exist through products, so once the data has loaded a slug with
  // no matches is a 404 — there is no separate "tag exists but empty" state.
  if (!loading && taggedItems.length === 0) {
    return <TagNotFound />
  }

  const count = taggedItems.length
  const base = 'rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors'
  const active = `${base} bg-blue-600 text-white`
  const idle = `${base} bg-transparent text-muted-text hover:text-primary-text`

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm">
          <Link to="/tags" className="text-muted-text transition-colors hover:text-accent">
            Tags
          </Link>
          <span className="text-muted-text">/</span>
          <span className="font-medium text-primary-text">{tagName}</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-primary-text sm:text-3xl">
          {tagName} Tools
        </h1>
        <p className="mt-2 text-sm text-muted-text">
          {loading ? '…' : `${count} ${count === 1 ? 'tool' : 'tools'} tagged ${tagName}`}
        </p>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-text sm:text-base">
          Browse tools tagged {tagName} in Greg's Compendium.
        </p>
      </header>

      <div className="mb-5 flex items-center justify-end sm:mb-6">
        <div className="inline-flex gap-1 rounded-md border border-border bg-card-bg p-1">
          <button type="button" onClick={() => setSort('newest')} className={sort === 'newest' ? active : idle}>
            Newest
          </button>
          <button type="button" onClick={() => setSort('alpha')} className={sort === 'alpha' ? active : idle}>
            A–Z
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CollectionCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {taggedItems.map((item) => (
            <CollectionCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
