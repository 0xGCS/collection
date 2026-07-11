import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CollectionDetailPage from '@/components/CollectionDetailPage'
import type { CollectionItem } from '@/components/collection/types'
import * as collectionModule from '@/lib/collection'

vi.mock('@/lib/collection', () => ({
  fetchCollectionItemById: vi.fn(),
  fetchCollectionItems: vi.fn(),
  pickRelatedItems: vi.fn(),
}))

const mockedFetchCollectionItemById = vi.mocked(collectionModule.fetchCollectionItemById)
const mockedFetchCollectionItems = vi.mocked(collectionModule.fetchCollectionItems)
const mockedPickRelatedItems = vi.mocked(collectionModule.pickRelatedItems)

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

describe('CollectionDetailPage related items', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a related tools section with internal links for related items', async () => {
    const currentItem = createItem({
      id: 'current-tool',
      name: 'Current Tool',
      description: 'Primary detail page item.',
      topics: [{ name: 'AI', slug: 'ai' }],
      categories: [{ id: 'ai-agents', name: 'Agents', slug: 'ai-agents', topicSlug: 'ai', topicName: 'AI' }],
    })

    const relatedItems = [
      createItem({
        id: 'related-one',
        name: 'Related One',
        description: 'Helpful context for the first related tool.',
        categories: [{ id: 'ai-agents', name: 'Agents', slug: 'ai-agents', topicSlug: 'ai', topicName: 'AI' }],
      }),
      createItem({
        id: 'related-two',
        name: 'Related Two',
        description: null,
        categories: [
          { id: 'ai-workflows', name: 'Workflows', slug: 'ai-workflows', topicSlug: 'ai', topicName: 'AI' },
        ],
      }),
    ]

    mockedFetchCollectionItemById.mockResolvedValue(currentItem)
    mockedFetchCollectionItems.mockResolvedValue([currentItem, ...relatedItems])
    mockedPickRelatedItems.mockReturnValue(relatedItems)

    render(
      <MemoryRouter initialEntries={['/tools/item/current-tool']}>
        <Routes>
          <Route path="/tools/item/:itemId" element={<CollectionDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Related tools' })).toBeInTheDocument()
    expect(mockedFetchCollectionItems).toHaveBeenCalledTimes(1)
    expect(mockedPickRelatedItems).toHaveBeenCalledWith(currentItem, [currentItem, ...relatedItems])

    expect(screen.getByRole('link', { name: /related one/i })).toHaveAttribute(
      'href',
      '/tools/item/related-one',
    )
    expect(screen.getByRole('link', { name: /related two/i })).toHaveAttribute(
      'href',
      '/tools/item/related-two',
    )
    expect(screen.getByText('Helpful context for the first related tool.')).toBeInTheDocument()
    expect(screen.getAllByText('Workflows')).toHaveLength(2)
  })
})
