import { Badge } from '@/components/ui/badge'
import type { CollectionItem } from '@/components/collection/types'
import { getBadgePalette, PRICE_LABELS, PRICE_PALETTE } from '@/components/collection/badge-utils'

interface CollectionTagListProps {
  items?: string[] | null
}

export function CollectionTagList({ items }: CollectionTagListProps) {
  if (!items?.length) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Badge key={item} variant="secondary" className={getBadgePalette(item)}>
          {item}
        </Badge>
      ))}
    </div>
  )
}

interface CollectionPriceBadgeProps {
  price?: CollectionItem['prices']
}

export function CollectionPriceBadge({ price }: CollectionPriceBadgeProps) {
  if (!price) {
    return null
  }

  return (
    <Badge variant="secondary" className={`${PRICE_PALETTE[price] ?? ''} border-0 text-xs font-medium`}>
      {PRICE_LABELS[price] ?? price}
    </Badge>
  )
}
