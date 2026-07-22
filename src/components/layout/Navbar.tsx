import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import UserMenu from '@/components/auth/UserMenu'

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getBreadcrumbPath(pathname: string) {
  if (pathname === '/tools/topics') return '/tools/topics'
  if (pathname === '/tools' || pathname.startsWith('/tools/')) return '/tools'
  if (pathname === '/tags' || pathname.startsWith('/tags/')) return '/tags'
  return pathname
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

  const breadcrumbPath = getBreadcrumbPath(location.pathname)

  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-nav-border bg-card-bg px-6">
      <Link to="/" aria-label="Home" className="flex shrink-0 items-center">
        <img src="/logo.svg" alt="" className="h-7 w-7 shrink-0" />
      </Link>

      <div className="flex items-center gap-2">
        <Link to="/tools">
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm ${breadcrumbPath === '/tools' ? 'text-accent' : 'text-muted-text hover:text-primary-text'}`}
          >
            Toooooooooools
          </Button>
        </Link>
        <Link to="/tools/topics">
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm ${breadcrumbPath === '/tools/topics' ? 'text-accent' : 'text-muted-text hover:text-primary-text'}`}
          >
            Topics
          </Button>
        </Link>
        <Link to="/tags">
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm ${breadcrumbPath === '/tags' ? 'text-accent' : 'text-muted-text hover:text-primary-text'}`}
          >
            Tags
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
        <UserMenu />
      </div>
    </nav>
  )
}
