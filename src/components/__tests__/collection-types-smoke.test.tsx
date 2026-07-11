import { expect, test } from 'vitest'
import type { CollectionItem } from '@/components/collection/types'

test('collection types module is importable', () => {
  const item: CollectionItem = {
    id: '1',
    name: 'Example',
    description: null,
    short_description: null,
    url: null,
    logo: null,
    twitter: null,
    linkedin: null,
    github: null,
    youtube: null,
    community: null,
    topics: [],
    categories: [],
    tags: null,
    prices: null,
    features_v2: null,
    created_at: null,
  }

  expect(item.name).toBe('Example')
})
