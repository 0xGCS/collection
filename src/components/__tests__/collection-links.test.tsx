import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollectionLinks } from '@/components/collection/CollectionLinks'
import type { CollectionItem } from '@/components/collection/types'

const sampleItem: CollectionItem = {
  id: '1',
  name: 'Example Tool',
  description: 'Example description',
  url: 'https://example.com',
  logo: null,
  twitter: 'https://x.com/exampletool',
  linkedin: null,
  github: null,
  youtube: null,
  community: null,
  primary_category: ['AI'],
  primary_subcategory: ['Research'],
  tags: ['Featured'],
  prices: 'free_trial',
  pricing: null,
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
