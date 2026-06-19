import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CollectionGrid from '@/components/CollectionGrid'
import type { CollectionItem } from '@/components/collection/types'

const { selectMock, orderMock, fromMock } = vi.hoisted(() => ({
  selectMock: vi.fn(),
  orderMock: vi.fn(),
  fromMock: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: fromMock,
  },
}))

function createItem(overrides: Partial<CollectionItem> = {}): CollectionItem {
  return {
    id: overrides.id ?? 'sample-tool',
    name: overrides.name ?? 'Sample Tool',
    description: overrides.description ?? 'A card item used for navigation testing.',
    url: overrides.url ?? 'https://example.com',
    logo: overrides.logo ?? null,
    twitter: overrides.twitter ?? null,
    linkedin: overrides.linkedin ?? null,
    github: overrides.github ?? null,
    youtube: overrides.youtube ?? null,
    community: overrides.community ?? null,
    primary_category: overrides.primary_category ?? ['AI'],
    primary_subcategory: overrides.primary_subcategory ?? ['Agents'],
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

    orderMock.mockResolvedValue({
      data: [createItem()],
      error: null,
    })

    selectMock.mockReturnValue({
      order: orderMock,
    })

    fromMock.mockReturnValue({
      select: selectMock,
    })
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
