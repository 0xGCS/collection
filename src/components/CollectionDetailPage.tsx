import { useEffect, useState } from 'react'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { CollectionLinks } from '@/components/collection/CollectionLinks'
import { CollectionPriceBadge, CollectionTagList } from '@/components/collection/CollectionBadges'
import { Badge } from '@/components/ui/badge'
import type { CollectionItem } from '@/components/collection/types'
import * as collectionModule from '@/lib/collection'
import { formatDate } from '@/lib/utils'

const fetchCollectionItemById = collectionModule.fetchCollectionItemById
const fetchCollectionItems = collectionModule.fetchCollectionItems ?? (async () => [])
const pickRelatedItems = collectionModule.pickRelatedItems ?? (() => [])

function getRelatedItemContext(item: CollectionItem) {
  const description = item.description?.trim()

  if (description) {
    return description
  }

  if (item.primary_subcategory?.length) {
    return item.primary_subcategory.join(', ')
  }

  if (item.primary_category?.length) {
    return item.primary_category.join(', ')
  }

  return 'Explore this tool in the collection.'
}

function parseFeatures(item: CollectionItem): string[] {
  // `features` is not part of the schema today; support it gracefully if present.
  const raw = (item as CollectionItem & { features?: unknown }).features

  if (Array.isArray(raw)) {
    return raw.map((f) => String(f).trim()).filter(Boolean)
  }

  if (typeof raw === 'string') {
    return raw
      .split(/\r?\n|•|;/)
      .map((f) => f.trim())
      .filter(Boolean)
  }

  return []
}

function SidebarCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card-bg p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-text">{label}</p>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function LogoFallback({ name }: { name: string }) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-secondary text-2xl font-semibold text-primary-text">
      {name.charAt(0).toUpperCase() || '?'}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-8 flex items-center gap-6">
        <div className="h-16 w-16 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-3">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-9 w-36 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-xl bg-muted lg:col-span-2" />
        <div className="flex flex-col gap-4">
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function CollectionDetailPage() {
  const { itemId } = useParams<{ itemId: string }>()
  const [item, setItem] = useState<CollectionItem | null>(null)
  const [relatedItems, setRelatedItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadItemDetail() {
      if (!itemId) {
        setError('Missing collection item id.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      setItem(null)
      setRelatedItems([])

      try {
        const [fetchedItem, allItems] = await Promise.all([
          fetchCollectionItemById(itemId),
          fetchCollectionItems(),
        ])

        if (isCancelled) {
          return
        }

        setItem(fetchedItem)

        if (fetchedItem) {
          setRelatedItems(pickRelatedItems(fetchedItem, allItems))
        }
      } catch (loadError) {
        console.error('Unexpected error loading collection detail page:', loadError)

        if (!isCancelled) {
          setError('Unable to load this collection item right now.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadItemDetail()

    return () => {
      isCancelled = true
    }
  }, [itemId])

  useEffect(() => {
    if (!item?.name) {
      return
    }

    const previousTitle = document.title
    document.title = `${item.name} | Collection`

    return () => {
      document.title = previousTitle
    }
  }, [item])

  if (loading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-xl border border-border bg-card-bg p-8 text-center">
          <h1 className="text-2xl font-bold text-primary-text">Unable to load item</h1>
          <p className="mt-3 text-muted-text">{error}</p>
          <Link to="/tools" className="mt-6 inline-flex text-sm font-medium text-accent hover:underline">
            Back to collection
          </Link>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-xl border border-border bg-card-bg p-8 text-center">
          <h1 className="text-2xl font-bold text-primary-text">Item not found</h1>
          <p className="mt-3 text-muted-text">
            We couldn&apos;t find a collection item for <span className="font-medium">{itemId}</span>.
          </p>
          <Link to="/tools" className="mt-6 inline-flex text-sm font-medium text-accent hover:underline">
            Back to collection
          </Link>
        </div>
      </div>
    )
  }

  const features = parseFeatures(item)

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/tools"
        className="inline-flex items-center gap-1 text-sm text-muted-text transition-colors hover:text-primary-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collection
      </Link>

      {/* Hero */}
      <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center">
        {item.logo ? (
          <img
            src={item.logo}
            alt={`${item.name} logo`}
            className="h-16 w-16 shrink-0 rounded-xl border border-border bg-card-bg object-contain p-1"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <LogoFallback name={item.name} />
        )}

        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-primary-text">{item.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <CollectionLinks item={item} className="flex items-center gap-1" />
          </div>
        </div>
      </div>

      {/* Two-column content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card-bg p-6">
            <h2 className="mb-2 text-lg font-semibold text-primary-text">Description</h2>
            <p className="text-sm leading-7 text-muted-text">
              {item.description?.trim() || 'No description is available for this collection item yet.'}
            </p>

            {features.length > 0 && (
              <>
                <h2 className="mb-2 mt-6 text-lg font-semibold text-primary-text">Key Features</h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-text">
                  {features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          {item.prices && (
            <SidebarCard label="Pricing">
              <CollectionPriceBadge price={item.prices} />
            </SidebarCard>
          )}

          <SidebarCard label="Date Added">
            <p className="text-sm text-primary-text">{formatDate(item.created_at) ?? '—'}</p>
          </SidebarCard>

          {(item.primary_category?.length || item.primary_subcategory?.length) && (
            <SidebarCard label="Category">
              <div className="flex flex-col gap-2">
                {item.primary_category?.length ? <CollectionTagList items={item.primary_category} /> : null}
                {item.primary_subcategory?.length ? (
                  <CollectionTagList items={item.primary_subcategory} />
                ) : null}
              </div>
            </SidebarCard>
          )}

          {item.tags?.length ? (
            <SidebarCard label="Tags">
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border border-blue-500 px-3 py-0.5 text-xs font-medium text-blue-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </SidebarCard>
          ) : null}
        </div>
      </div>

      {/* Related */}
      {relatedItems.length ? (
        <section className="mt-8 rounded-xl border border-border bg-card-bg p-6">
          <h2 className="text-2xl font-semibold text-primary-text">Related tools</h2>
          <p className="mt-1 text-sm text-muted-text">Keep browsing similar items from the collection.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedItems.map((relatedItem) => (
              <Link
                key={relatedItem.id}
                to={`/tools/item/${relatedItem.id}`}
                className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-blue-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-primary-text">{relatedItem.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-text">
                      {getRelatedItemContext(relatedItem)}
                    </p>
                  </div>

                  {relatedItem.primary_subcategory?.[0] ? (
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-primary-text">
                      {relatedItem.primary_subcategory[0]}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
