import { describe, expect, it } from 'vitest'
import { buildTagSummaries, formatTagName, itemHasTag, slugifyTag } from '@/lib/tags'
import type { CollectionItem } from '@/components/collection/types'

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
    features_v2: null,
    created_at: null,
    ...overrides,
  }
}

describe('slugifyTag', () => {
  it('passes through clean kebab-case slugs', () => {
    expect(slugifyTag('open-source')).toBe('open-source')
  })

  it('normalizes spaces and special characters', () => {
    expect(slugifyTag('one-time payment')).toBe('one-time-payment')
    expect(slugifyTag('  Web Scraping! ')).toBe('web-scraping')
  })
})

describe('formatTagName', () => {
  it('title-cases plain words', () => {
    expect(formatTagName('open-source')).toBe('Open Source')
    expect(formatTagName('web-scraping')).toBe('Web Scraping')
  })

  it('preserves known acronyms and brand casing', () => {
    expect(formatTagName('ai-agents')).toBe('AI Agents')
    expect(formatTagName('api-access')).toBe('API Access')
    expect(formatTagName('defi')).toBe('DeFi')
    expect(formatTagName('macos-app')).toBe('macOS App')
  })
})

describe('buildTagSummaries', () => {
  it('counts distinct products per slug and merges spellings that slugify identically', () => {
    const items = [
      createItem({ id: 'a', tags: ['open-source', 'one-time-payment'] }),
      createItem({ id: 'b', tags: ['open-source', 'one-time payment'] }),
      createItem({ id: 'c', tags: null }),
    ]

    const summaries = buildTagSummaries(items)
    const bySlug = new Map(summaries.map((s) => [s.slug, s]))

    expect(bySlug.get('open-source')).toMatchObject({ name: 'Open Source', count: 2 })
    expect(bySlug.get('one-time-payment')?.count).toBe(2)
    expect(summaries).toHaveLength(2)
  })
})

describe('itemHasTag', () => {
  it('matches raw tags against a normalized slug', () => {
    const item = createItem({ tags: ['one-time payment'] })
    expect(itemHasTag(item, 'one-time-payment')).toBe(true)
    expect(itemHasTag(item, 'open-source')).toBe(false)
  })
})
