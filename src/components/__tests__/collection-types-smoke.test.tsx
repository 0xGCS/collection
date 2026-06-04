import { expect, test } from 'vitest'
import type { CollectionItem } from '@/components/collection/types'

test('collection types module is importable', () => {
  const item: CollectionItem = {
    id: '1',
    name: 'Example',
    description: null,
    url: null,
    logo: null,
    twitter: null,
    linkedin: null,
    github: null,
    youtube: null,
    community: null,
    primary_category: null,
    primary_subcategory: null,
    tags: null,
    prices: null,
    pricing: null,
    created_at: null,
  }

  expect(item.name).toBe('Example')
})
