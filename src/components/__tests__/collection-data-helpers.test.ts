import { describe, expect, it } from 'vitest'
import { pickRelatedItems } from '@/lib/collection'
import type { CollectionItem } from '@/components/collection/types'

function createItem(overrides: Partial<CollectionItem>): CollectionItem {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    name: overrides.name ?? 'Item',
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
    ...overrides,
  }
}

describe('pickRelatedItems', () => {
  it('prefers same subcategory matches before same category matches', () => {
    const current = createItem({
      id: 'current',
      primary_category: ['AI'],
      primary_subcategory: ['Agents'],
    })

    const sameCategoryOnly = createItem({
      id: 'same-category',
      primary_category: ['AI'],
      primary_subcategory: ['Search'],
    })

    const sameSubcategory = createItem({
      id: 'same-subcategory',
      primary_category: ['Infra'],
      primary_subcategory: ['Agents'],
    })

    const unrelated = createItem({
      id: 'unrelated',
      primary_category: ['Design'],
      primary_subcategory: ['UI'],
    })

    const related = pickRelatedItems(current, [current, sameCategoryOnly, sameSubcategory, unrelated], 2)

    expect(related).toHaveLength(2)
    expect(related.map((item) => item.id)).toEqual(['same-subcategory', 'same-category'])
  })
})
