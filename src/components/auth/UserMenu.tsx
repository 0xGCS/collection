import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.766 12.276c0-.816-.066-1.636-.207-2.438H12.24v4.62h6.482a5.554 5.554 0 0 1-2.399 3.647v3.017h3.867c2.271-2.09 3.576-5.177 3.576-8.846z"
      />
      <path
        fill="#34A853"
        d="M12.24 24c3.236 0 5.966-1.062 7.955-2.878l-3.867-3.017c-1.077.732-2.465 1.147-4.083 1.147-3.13 0-5.786-2.112-6.74-4.952H1.517v3.11A12.002 12.002 0 0 0 12.24 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.5 14.3a7.19 7.19 0 0 1 0-4.594V6.596H1.516a12.01 12.01 0 0 0 0 10.814L5.5 14.3z"
      />
      <path
        fill="#EA4335"
        d="M12.24 4.75a6.52 6.52 0 0 1 4.604 1.8l3.43-3.43A11.533 11.533 0 0 0 12.24 0 12.002 12.002 0 0 0 1.516 6.596L5.5 9.706c.954-2.84 3.61-4.955 6.74-4.955z"
      />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export default function UserMenu() {
  const { user, loading, signInWithGoogle, signInWithGithub, signOut } = useAuth()

  if (loading) {
    // Placeholder matching the avatar/button footprint to avoid layout shift
    // and a "Sign in" flash while the cached session is restored.
    return <div className="h-8 w-8" />
  }

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-sm text-muted-text hover:text-primary-text">
            Sign in
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => void signInWithGoogle()} className="cursor-pointer">
            <GoogleIcon className="h-4 w-4" />
            Continue with Google
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void signInWithGithub()} className="cursor-pointer">
            <GitHubIcon className="h-4 w-4" />
            Continue with GitHub
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // user_metadata is display-only here — never use it for authorization.
  const displayName =
    (user.user_metadata.full_name as string | undefined) ??
    (user.user_metadata.name as string | undefined) ??
    user.email ??
    'Account'
  const avatarUrl = user.user_metadata.avatar_url as string | undefined
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full outline-none ring-offset-card-bg transition-shadow focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Account menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="text-sm">{initial}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium text-primary-text">{displayName}</p>
          {user.email && <p className="truncate text-xs text-muted-text">{user.email}</p>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOut()} className="cursor-pointer">
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
