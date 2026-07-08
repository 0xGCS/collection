import { useState } from 'react'
import { Link } from 'react-router-dom'

import { formatDate } from '@/lib/utils'
import { CollectionLinks } from '@/components/collection/CollectionLinks'
import { CollectionPriceBadge, CollectionTagList } from '@/components/collection/CollectionBadges'
import type { CollectionItem } from '@/components/collection/types'

function LogoAvatar({ item }: { item: CollectionItem }) {
  const [errored, setErrored] = useState(false)

  if (item.logo && !errored) {
    return (
      <img
        src={item.logo}
        alt=""
        className="h-8 w-8 shrink-0 rounded-lg border border-border object-contain"
        onError={() => setErrored(true)}
      />
    )
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-primary-text">
      {item.name.charAt(0).toUpperCase() || '?'}
    </div>
  )
}

export function CollectionCard({ item }: { item: CollectionItem }) {
  const dateLabel = formatDate(item.created_at)

  // Stretched-link pattern: an overlay <Link> covers the card while the social
  // icons remain separate (pointer-events-auto) anchors — avoids nesting <a> in <a>.
  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card-bg p-5 transition-all hover:-translate-y-0.5 hover:border-blue-500">
      <Link
        to={`/tools/item/${item.id}`}
        aria-label={`View ${item.name} details`}
        className="absolute inset-0 z-0 rounded-xl"
      />

      <div className="pointer-events-none relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <LogoAvatar item={item} />
          <h3 className="min-w-0 flex-1 truncate font-bold text-primary-text">{item.name}</h3>
        </div>

        {(item.short_description || item.description) && (
          <p className="line-clamp-2 text-sm text-muted-text">
            {item.short_description || item.description}
          </p>
        )}

        {item.prices && (
          <div>
            <CollectionPriceBadge price={item.prices} />
          </div>
        )}

        {item.tags?.length ? <CollectionTagList items={item.tags} /> : null}
      </div>

      <div className="pointer-events-none relative z-10 mt-auto flex items-center justify-between pt-2">
        <span className="text-xs text-muted-text">{dateLabel ?? '—'}</span>
        <div className="pointer-events-auto">
          <CollectionLinks item={item} />
        </div>
      </div>
    </div>
  )
}

export function CollectionCardSkeleton() {
  return (
    <div className="flex h-48 animate-pulse flex-col gap-3 rounded-xl bg-muted p-5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-border" />
        <div className="h-4 w-32 rounded bg-border" />
      </div>
      <div className="h-3 w-full rounded bg-border" />
      <div className="h-3 w-3/4 rounded bg-border" />
      <div className="h-5 w-20 rounded-full bg-border" />
    </div>
  )
}
