import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import CollectionDetailPage from '@/components/CollectionDetailPage'

vi.mock('@/lib/collection', () => ({
  fetchCollectionItemById: vi.fn(() => new Promise(() => {})),
  fetchCollectionItems: vi.fn(() => new Promise(() => {})),
  pickRelatedItems: vi.fn(() => []),
}))

describe('CollectionDetailPage', () => {
  it('shows the loading state for the detail route', () => {
    render(
      <MemoryRouter initialEntries={['/tools/item/test-id']}>
        <Routes>
          <Route path="/tools/item/:itemId" element={<CollectionDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    // Loading renders a skeleton (animate-pulse) instead of text.
    expect(document.querySelector('.animate-pulse')).not.toBeNull()
  })
})
