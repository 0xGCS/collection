import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import Navbar from '@/components/layout/Navbar'

describe('Navbar detail route breadcrumbs', () => {
  it('shows Home and Toooooooooools when viewing a detail route', () => {
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })

    render(
      <MemoryRouter initialEntries={['/tools/item/123']}>
        <Navbar />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByText('Toooooooooools', { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Toooooooooools' })).toHaveAttribute('href', '/tools')
  })
})
