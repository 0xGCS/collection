import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { Link, MemoryRouter } from 'react-router-dom'

test('router-aware smoke test works', () => {
  render(
    <MemoryRouter>
      <Link to="/toooooooooools/test-id">Example link</Link>
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: 'Example link' })).toHaveAttribute(
    'href',
    '/toooooooooools/test-id',
  )
})
