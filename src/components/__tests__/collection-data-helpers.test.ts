import { describe, expect, it } from 'vitest'
import { pickRelatedItems } from '@/lib/collection'
import type { Category, CollectionItem, Topic } from '@/components/collection/types'

function topic(slug: string, name: string): Topic {
  return { slug, name }
}

function cat(slug: string, name: string, topicSlug: string, topicName: string): Category {
  return { id: slug, slug, name, topicSlug, topicName }
}

function createItem(overrides: Partial<CollectionItem>): CollectionItem {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    name: overrides.name ?? 'Item',
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
    pricing: null,
    features_v2: null,
    created_at: null,
    ...overrides,
  }
}

describe('pickRelatedItems', () => {
  it('prefers same category matches before same topic matches', () => {
    const current = createItem({
      id: 'current',
      topics: [topic('ai', 'AI')],
      categories: [cat('ai-agents', 'Agents', 'ai', 'AI')],
    })

    const sameTopicOnly = createItem({
      id: 'same-topic',
      topics: [topic('ai', 'AI')],
      categories: [cat('ai-search', 'Search', 'ai', 'AI')],
    })

    const sameCategory = createItem({
      id: 'same-category',
      topics: [topic('ai', 'AI')],
      categories: [cat('ai-agents', 'Agents', 'ai', 'AI')],
    })

    const unrelated = createItem({
      id: 'unrelated',
      topics: [topic('design', 'Design')],
      categories: [cat('design-ui', 'UI', 'design', 'Design')],
    })

    const related = pickRelatedItems(current, [current, sameTopicOnly, sameCategory, unrelated], 2)

    expect(related).toHaveLength(2)
    expect(related.map((item) => item.id)).toEqual(['same-category', 'same-topic'])
  })
})
