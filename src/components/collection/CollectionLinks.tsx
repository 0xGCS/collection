import type { ReactNode } from 'react'
import { Globe, Link as LinkIcon } from 'lucide-react'

import type { CollectionItem } from '@/components/collection/types'

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-.028.028c.63.63 1.052 1.052 3.513 1.487 1.963.347 3.4.5 5 .5s3.037-.153 5-.5c2.461-.435 2.883-.857 3.513-1.487l-.028-.028C22.657 18.314 24 15.314 24 12c0-6.627-5.373-12-12-12zm6.92 13.9c.04.2.06.41.06.63 0 3.2-3.73 5.8-8.33 5.8s-8.33-2.6-8.33-5.8c0-.22.02-.43.06-.63A1.78 1.78 0 0 1 1.5 12.2c0-.98.8-1.78 1.78-1.78.48 0 .91.19 1.23.5 1.21-.88 2.88-1.45 4.73-1.52l.89-4.17a.34.34 0 0 1 .4-.27l2.95.62a1.26 1.26 0 0 1 2.38.42 1.26 1.26 0 0 1-1.26 1.26c-.61 0-1.12-.44-1.23-1.02l-2.63-.55-.79 3.72c1.83.08 3.48.65 4.68 1.52.32-.31.75-.5 1.23-.5.98 0 1.78.8 1.78 1.78 0 .7-.4 1.3-.98 1.59zm-11.6 1.1a1.26 1.26 0 1 0 2.52 0 1.26 1.26 0 0 0-2.52 0zm7.82 2.72c-.98.98-2.56 1.06-3.14 1.06s-2.16-.08-3.14-1.06a.42.42 0 0 1 .6-.6c.62.62 1.94.84 2.54.84s1.92-.22 2.54-.84a.42.42 0 0 1 .6.6zm-.34-1.46a1.26 1.26 0 1 0 0-2.52 1.26 1.26 0 0 0 0 2.52z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function getCommunityIcon(url: string | null) {
  if (!url) return null

  const lower = url.toLowerCase()

  if (lower.includes('discord.gg') || lower.includes('discord.com')) return 'discord'
  if (lower.includes('t.me') || lower.includes('telegram.me')) return 'telegram'
  if (lower.includes('reddit.com')) return 'reddit'

  return 'generic'
}

function IconLink({ href, children, label }: { href: string; children: ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-text transition-colors hover:text-accent"
    >
      {children}
    </a>
  )
}

interface CollectionLinksProps {
  item: CollectionItem
  className?: string
}

export function CollectionLinks({ item, className = 'flex items-center gap-0.5' }: CollectionLinksProps) {
  const communityType = getCommunityIcon(item.community)
  const hasLinks = item.url || item.twitter || item.linkedin || item.github || item.youtube || item.community

  if (!hasLinks) {
    return null
  }

  return (
    <div className={className}>
      {item.url && (
        <IconLink href={item.url} label="Website">
          <Globe className="h-4 w-4" />
        </IconLink>
      )}
      {item.twitter && (
        <IconLink href={item.twitter} label="Twitter/X">
          <XIcon className="h-3.5 w-3.5" />
        </IconLink>
      )}
      {item.linkedin && (
        <IconLink href={item.linkedin} label="LinkedIn">
          <LinkedInIcon className="h-3.5 w-3.5" />
        </IconLink>
      )}
      {item.github && (
        <IconLink href={item.github} label="GitHub">
          <GitHubIcon className="h-3.5 w-3.5" />
        </IconLink>
      )}
      {item.youtube && (
        <IconLink href={item.youtube} label="YouTube">
          <YouTubeIcon className="h-3.5 w-3.5" />
        </IconLink>
      )}
      {item.community && communityType === 'discord' && (
        <IconLink href={item.community} label="Discord">
          <DiscordIcon className="h-3.5 w-3.5" />
        </IconLink>
      )}
      {item.community && communityType === 'telegram' && (
        <IconLink href={item.community} label="Telegram">
          <TelegramIcon className="h-3.5 w-3.5" />
        </IconLink>
      )}
      {item.community && communityType === 'reddit' && (
        <IconLink href={item.community} label="Reddit">
          <RedditIcon className="h-3.5 w-3.5" />
        </IconLink>
      )}
      {item.community && communityType === 'generic' && (
        <IconLink href={item.community} label="Community">
          <LinkIcon className="h-4 w-4" />
        </IconLink>
      )}
    </div>
  )
}
