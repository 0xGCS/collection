import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollectionLinks } from '@/components/collection/CollectionLinks'
import type { CollectionItem } from '@/components/collection/types'

const sampleItem: CollectionItem = {
  id: '1',
  name: 'Example Tool',
  description: 'Example description',
  short_description: null,
  url: 'https://example.com',
  logo: null,
  twitter: 'https://x.com/exampletool',
  linkedin: null,
  github: null,
  youtube: null,
  community: null,
  topics: [{ name: 'AI', slug: 'ai' }],
  categories: [{ id: 'ai-research', name: 'Research', slug: 'ai-research', topicSlug: 'ai', topicName: 'AI' }],
  tags: ['Featured'],
  prices: 'free_trial',
  features_v2: null,
  created_at: '2026-01-01T00:00:00.000Z',
}

describe('CollectionLinks', () => {
  it('renders website and Twitter/X links for a collection item', () => {
    render(<CollectionLinks item={sampleItem} />)

    const websiteLink = screen.getByTitle('Website')
    const twitterLink = screen.getByTitle('Twitter/X')

    expect(websiteLink).toBeInTheDocument()
    expect(websiteLink).toHaveAttribute('href', sampleItem.url)
    expect(twitterLink).toBeInTheDocument()
    expect(twitterLink).toHaveAttribute('href', sampleItem.twitter)
  })
})
