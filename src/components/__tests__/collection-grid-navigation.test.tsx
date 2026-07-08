import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CollectionGrid from '@/components/CollectionGrid'
import type { CollectionItem } from '@/components/collection/types'
import * as collectionModule from '@/lib/collection'

vi.mock('@/lib/collection', () => ({
  fetchCollectionItems: vi.fn(),
  fetchTopics: vi.fn(),
}))

const mockedFetchItems = vi.mocked(collectionModule.fetchCollectionItems)
const mockedFetchTopics = vi.mocked(collectionModule.fetchTopics)

function createItem(overrides: Partial<CollectionItem> = {}): CollectionItem {
  return {
    id: overrides.id ?? 'sample-tool',
    name: overrides.name ?? 'Sample Tool',
    description: overrides.description ?? 'A card item used for navigation testing.',
    short_description: null,
    url: overrides.url ?? 'https://example.com',
    logo: overrides.logo ?? null,
    twitter: overrides.twitter ?? null,
    linkedin: overrides.linkedin ?? null,
    github: overrides.github ?? null,
    youtube: overrides.youtube ?? null,
    community: overrides.community ?? null,
    topics: overrides.topics ?? [{ name: 'AI', slug: 'ai' }],
    categories: overrides.categories ?? [
      { id: 'ai-agents', name: 'Agents', slug: 'ai-agents', topicSlug: 'ai', topicName: 'AI' },
    ],
    tags: overrides.tags ?? ['Featured'],
    prices: overrides.prices ?? 'free',
    pricing: overrides.pricing ?? null,
    features_v2: overrides.features_v2 ?? null,
    created_at: overrides.created_at ?? '2026-01-01T00:00:00.000Z',
  }
}

describe('CollectionGrid navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedFetchItems.mockResolvedValue([createItem()])
    mockedFetchTopics.mockResolvedValue([{ name: 'AI', slug: 'ai' }])
  })

  it('links each card to the internal detail route', async () => {
    render(
      <MemoryRouter>
        <CollectionGrid />
      </MemoryRouter>,
    )

    const cardLink = await screen.findByRole('link', { name: /Sample Tool/i })

    expect(cardLink).toHaveAttribute('href', '/tools/item/sample-tool')
  })
})
