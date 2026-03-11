import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const pageNames: Record<string, string> = {
  '/': 'Home',
  '/toooooooooools': 'Toooooooooools',
  '/twitter': 'Twitter',
}

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)
  const location = useLocation()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const currentPage = pageNames[location.pathname] ?? 'Home'
  const isHome = location.pathname === '/'

  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-nav-border bg-card-bg px-6">
      <div className="flex items-center gap-1 text-sm">
        <Link to="/" className="text-muted-text hover:text-accent transition-colors">
          Home
        </Link>
        {!isHome && (
          <>
            <span className="text-muted-text">/</span>
            <span className="font-medium text-primary-text">{currentPage}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link to="/toooooooooools">
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm ${location.pathname === '/toooooooooools' ? 'text-accent' : 'text-muted-text hover:text-primary-text'}`}
          >
            Toooooooooools
          </Button>
        </Link>
        <Link to="/twitter">
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm ${location.pathname === '/twitter' ? 'text-accent' : 'text-muted-text hover:text-primary-text'}`}
          >
            Twitter
          </Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-text hover:text-primary-text">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </nav>
  )
}
