import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CollectionPriceBadge,
  CollectionTagList,
} from '@/components/collection/CollectionBadges'
import {
  PRICE_LABELS,
  PRICE_PALETTE,
  getBadgePalette,
} from '@/components/collection/badge-utils'

describe('CollectionBadges', () => {
  it('renders tag badges with the shared palette classes', () => {
    render(<CollectionTagList items={['AI', 'Research']} />)

    const aiBadge = screen.getByText('AI')
    const researchBadge = screen.getByText('Research')

    expect(aiBadge).toBeInTheDocument()
    expect(researchBadge).toBeInTheDocument()
    expect(aiBadge).toHaveClass(...getBadgePalette('AI').split(' '))
    expect(researchBadge).toHaveClass(...getBadgePalette('Research').split(' '))
  })

  it('renders a price badge with the shared label and palette', () => {
    render(<CollectionPriceBadge price="free_trial" />)

    const priceBadge = screen.getByText(PRICE_LABELS.free_trial)

    expect(priceBadge).toBeInTheDocument()
    expect(priceBadge).toHaveClass(...`${PRICE_PALETTE.free_trial} border-0 text-xs font-medium`.split(' '))
  })
})
