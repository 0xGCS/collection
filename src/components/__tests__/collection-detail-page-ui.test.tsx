import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import CollectionDetailPage from '@/components/CollectionDetailPage'
import type { CollectionItem } from '@/components/collection/types'
import * as collectionModule from '@/lib/collection'

vi.mock('@/lib/collection', () => ({
  fetchCollectionItemById: vi.fn(),
  fetchCollectionItems: vi.fn(),
  pickRelatedItems: vi.fn(() => []),
}))

const mockedFetchCollectionItemById = vi.mocked(collectionModule.fetchCollectionItemById)

const sampleItem: CollectionItem = {
  id: 'sample-tool',
  name: 'Sample Tool',
  description: 'A useful detail page example for the collection.',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  twitter: 'https://x.com/sampletool',
  linkedin: null,
  github: 'https://github.com/example/sample-tool',
  youtube: null,
  community: 'https://discord.gg/sample',
  primary_category: ['AI'],
  primary_subcategory: ['Research'],
  tags: ['Featured', 'Agents'],
  prices: 'free_trial',
  pricing: 'Contact sales for enterprise plans.',
  created_at: '2026-01-01T00:00:00.000Z',
}

describe('CollectionDetailPage UI', () => {
  it('renders the detail content for a loaded collection item', async () => {
    mockedFetchCollectionItemById.mockResolvedValue(sampleItem)

    render(
      <MemoryRouter initialEntries={['/tools/item/sample-tool']}>
        <Routes>
          <Route path="/tools/item/:itemId" element={<CollectionDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Sample Tool' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to collection/i })).toHaveAttribute('href', '/tools')
    expect(screen.getByText('A useful detail page example for the collection.')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('Research')).toBeInTheDocument()
    expect(screen.getByText('Featured')).toBeInTheDocument()
    expect(screen.getByText('Free Trial')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Date Added')).toBeInTheDocument()
    expect(screen.getByText('2026-01-01')).toBeInTheDocument()
    expect(screen.getByTitle('Website')).toHaveAttribute('href', sampleItem.url)
    expect(screen.getByTitle('GitHub')).toHaveAttribute('href', sampleItem.github)
    expect(screen.getByTitle('Discord')).toHaveAttribute('href', sampleItem.community)
    expect(screen.getByRole('link', { name: /visit website/i })).toHaveAttribute('href', sampleItem.url)

    await waitFor(() => {
      expect(document.title).toBe('Sample Tool | Collection')
    })
  })
})
