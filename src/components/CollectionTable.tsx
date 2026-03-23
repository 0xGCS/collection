import { useEffect, useState, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  ExternalLink,
  Globe,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Group,
  SortAsc,
  X,
  Trash2,
  Copy,
  Plus,
  Link as LinkIcon,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

interface CollectionItem {
  id: string
  name: string
  description: string | null
  url: string | null
  logo: string | null
  twitter: string | null
  linkedin: string | null
  github: string | null
  youtube: string | null
  community: string | null
  primary_category: string[] | null
  primary_subcategory: string[] | null
  tags: string[] | null
  prices: string | null
  created_at: string | null
}

type SortField = 'name' | 'created_at'
type SortDir = 'asc' | 'desc'
type GroupByField = 'subcategory' | 'tags' | 'prices' | null

interface FilterRow {
  id: string
  field: 'primary_subcategory' | 'tags' | 'prices' | 'links'
  operator: string
  values: string[]
}

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Engineering', 'Artsy', 'Crypto', 'Investing', 'OSINT', 'Learning', 'Social', 'Misc', 'AI']
const PAGE_SIZES = [25, 50, 100]

// ── Price label / palette ─────────────────────────────────────────────────────

const PRICE_LABELS: Record<string, string> = {
  free: 'Free',
  free_trial: 'Free Trial',
  freemium: 'Freemium',
  fund: 'Fund',
  one_time_payment: 'One-time',
  subscription: 'Subscription',
  'varies by service': 'Varies',
}

const PRICE_PALETTE: Record<string, string> = {
  free: 'bg-[#ECFDF5] text-[#065F46] dark:bg-[#064E3B] dark:text-[#6EE7B7]',
  freemium: 'bg-[#EFF6FF] text-[#1D4ED8] dark:bg-[#1E3A5F] dark:text-[#93C5FD]',
  free_trial: 'bg-[#F5F3FF] text-[#6D28D9] dark:bg-[#2E1B69] dark:text-[#C4B5FD]',
  subscription: 'bg-[#FFF1F2] text-[#9F1239] dark:bg-[#4C0519] dark:text-[#FDA4AF]',
  one_time_payment: 'bg-[#FFFBEB] text-[#92400E] dark:bg-[#451A03] dark:text-[#FCD34D]',
  fund: 'bg-[#ECFEFF] text-[#155E75] dark:bg-[#164E63] dark:text-[#67E8F9]',
  'varies by service': 'bg-[#F5F3FF] text-[#6D28D9] dark:bg-[#2E1B69] dark:text-[#C4B5FD]',
}

// ── Badge color palette ───────────────────────────────────────────────────────
// 6 palettes: light bg / light text / dark bg / dark text
// Chosen to be visually distinct and readable in both modes.

const BADGE_PALETTES = [
  // blue
  { light: 'bg-[#EFF6FF] text-[#1D4ED8]', dark: 'dark:bg-[#1E3A5F] dark:text-[#93C5FD]' },
  // violet / purple
  { light: 'bg-[#F5F3FF] text-[#6D28D9]', dark: 'dark:bg-[#2E1B69] dark:text-[#C4B5FD]' },
  // green / emerald
  { light: 'bg-[#ECFDF5] text-[#065F46]', dark: 'dark:bg-[#064E3B] dark:text-[#6EE7B7]' },
  // amber / orange
  { light: 'bg-[#FFFBEB] text-[#92400E]', dark: 'dark:bg-[#451A03] dark:text-[#FCD34D]' },
  // rose / pink
  { light: 'bg-[#FFF1F2] text-[#9F1239]', dark: 'dark:bg-[#4C0519] dark:text-[#FDA4AF]' },
  // cyan / teal
  { light: 'bg-[#ECFEFF] text-[#155E75]', dark: 'dark:bg-[#164E63] dark:text-[#67E8F9]' },
]

// Simple djb2-style hash → deterministic palette index per subcategory name
function getBadgePalette(label: string): string {
  let hash = 5381
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 33) ^ label.charCodeAt(i)
  }
  const p = BADGE_PALETTES[Math.abs(hash) % BADGE_PALETTES.length]
  return `${p.light} ${p.dark} border-0 text-xs font-medium`
}

// ── Brand SVG Icons ──────────────────────────────────────────────────────────

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

// ── Community icon detection ─────────────────────────────────────────────────

function getCommunityIcon(url: string | null) {
  if (!url) return null
  const lower = url.toLowerCase()
  if (lower.includes('discord.gg') || lower.includes('discord.com')) return 'discord'
  if (lower.includes('t.me') || lower.includes('telegram.me')) return 'telegram'
  if (lower.includes('reddit.com')) return 'reddit'
  return 'generic'
}

// ── Link icon button ─────────────────────────────────────────────────────────

function IconLink({ href, children, label }: { href: string; children: React.ReactNode; label: string }) {
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

// ── Main Component ───────────────────────────────────────────────────────────

export default function CollectionTable() {
  const [data, setData] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterRows, setFilterRows] = useState<FilterRow[]>([])

  // Sort
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  // Grouping
  const [groupByField, setGroupByField] = useState<GroupByField>(null)

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Popover states
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [groupOpen, setGroupOpen] = useState(false)

  // ── Fetch data ─────────────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: rows, error } = await supabase
        .from('collection')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
      } else {
        setData(rows ?? [])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // ── Debounced search ───────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // ── All subcategory / tag / price values for filter dropdowns ──────────────

  const allSubcategories = useMemo(() => {
    const set = new Set<string>()
    data.forEach((item) => item.primary_subcategory?.forEach((s) => set.add(s)))
    return Array.from(set).sort()
  }, [data])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    data.forEach((item) => item.tags?.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [data])

  const allPrices = useMemo(() => {
    const set = new Set<string>()
    data.forEach((item) => { if (item.prices) set.add(item.prices) })
    return Array.from(set).sort()
  }, [data])

  // ── Filtered data ──────────────────────────────────────────────────────────

  const filteredData = useMemo(() => {
    let result = data

    // Category filter (OR logic)
    if (selectedCategories.length > 0) {
      result = result.filter((item) =>
        item.primary_category?.some((cat) => selectedCategories.includes(cat))
      )
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      )
    }

    // Advanced filter rows (AND logic between rows)
    for (const row of filterRows) {
      if (row.field === 'primary_subcategory') {
        switch (row.operator) {
          case 'has any of':
            if (row.values.length > 0)
              result = result.filter((item) =>
                item.primary_subcategory?.some((s) => row.values.includes(s))
              )
            break
          case 'has all of':
            if (row.values.length > 0)
              result = result.filter((item) =>
                row.values.every((v) => item.primary_subcategory?.includes(v))
              )
            break
          case 'is exactly':
            if (row.values.length > 0)
              result = result.filter((item) => {
                const subs = item.primary_subcategory ?? []
                return subs.length === row.values.length && row.values.every((v) => subs.includes(v))
              })
            break
          case 'has none of':
            if (row.values.length > 0)
              result = result.filter((item) =>
                !item.primary_subcategory?.some((s) => row.values.includes(s))
              )
            break
          case 'is empty':
            result = result.filter((item) => !item.primary_subcategory || item.primary_subcategory.length === 0)
            break
          case 'is not empty':
            result = result.filter((item) => item.primary_subcategory && item.primary_subcategory.length > 0)
            break
        }
      } else if (row.field === 'tags') {
        switch (row.operator) {
          case 'has any of':
            if (row.values.length > 0)
              result = result.filter((item) =>
                item.tags?.some((t) => row.values.includes(t))
              )
            break
          case 'has all of':
            if (row.values.length > 0)
              result = result.filter((item) =>
                row.values.every((v) => item.tags?.includes(v))
              )
            break
          case 'is exactly':
            if (row.values.length > 0)
              result = result.filter((item) => {
                const ts = item.tags ?? []
                return ts.length === row.values.length && row.values.every((v) => ts.includes(v))
              })
            break
          case 'has none of':
            if (row.values.length > 0)
              result = result.filter((item) =>
                !item.tags?.some((t) => row.values.includes(t))
              )
            break
          case 'is empty':
            result = result.filter((item) => !item.tags || item.tags.length === 0)
            break
          case 'is not empty':
            result = result.filter((item) => item.tags && item.tags.length > 0)
            break
        }
      } else if (row.field === 'prices') {
        switch (row.operator) {
          case 'is any of':
            if (row.values.length > 0)
              result = result.filter((item) => item.prices && row.values.includes(item.prices))
            break
          case 'is none of':
            if (row.values.length > 0)
              result = result.filter((item) => !item.prices || !row.values.includes(item.prices))
            break
          case 'is empty':
            result = result.filter((item) => !item.prices)
            break
          case 'is not empty':
            result = result.filter((item) => !!item.prices)
            break
        }
      } else if (row.field === 'links') {
        for (const val of row.values) {
          switch (val) {
            case 'linkedin':
              result = result.filter((item) => item.linkedin)
              break
            case 'youtube':
              result = result.filter((item) => item.youtube)
              break
            case 'github':
              result = result.filter((item) => item.github)
              break
            case 'twitter':
              result = result.filter((item) => item.twitter)
              break
            case 'discord':
              result = result.filter(
                (item) =>
                  item.community &&
                  (item.community.toLowerCase().includes('discord.gg') ||
                    item.community.toLowerCase().includes('discord.com'))
              )
              break
            case 'telegram':
              result = result.filter(
                (item) =>
                  item.community &&
                  (item.community.toLowerCase().includes('t.me') ||
                    item.community.toLowerCase().includes('telegram.me'))
              )
              break
            case 'reddit':
              result = result.filter(
                (item) => item.community && item.community.toLowerCase().includes('reddit.com')
              )
              break
          }
        }
      }
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        let cmp = 0
        if (sortField === 'name') {
          cmp = a.name.localeCompare(b.name)
        } else if (sortField === 'created_at') {
          cmp = (a.created_at ?? '').localeCompare(b.created_at ?? '')
        }
        return sortDir === 'desc' ? -cmp : cmp
      })
    }

    return result
  }, [data, selectedCategories, debouncedSearch, filterRows, sortField, sortDir])

  // ── Grouped data ───────────────────────────────────────────────────────────

  const groupedData = useMemo(() => {
    if (!groupByField) return null
    const groups: Record<string, CollectionItem[]> = {}
    for (const item of filteredData) {
      if (groupByField === 'subcategory') {
        const keys = item.primary_subcategory ?? ['Uncategorized']
        for (const key of keys) {
          if (!groups[key]) groups[key] = []
          groups[key].push(item)
        }
      } else if (groupByField === 'tags') {
        const keys = item.tags && item.tags.length > 0 ? item.tags : ['Untagged']
        for (const key of keys) {
          if (!groups[key]) groups[key] = []
          groups[key].push(item)
        }
      } else if (groupByField === 'prices') {
        const key = item.prices ? (PRICE_LABELS[item.prices] ?? item.prices) : 'No Price'
        if (!groups[key]) groups[key] = []
        groups[key].push(item)
      }
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredData, groupByField])

  // ── Pagination ─────────────────────────────────────────────────────────────

  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIdx = (page - 1) * pageSize
  const endIdx = Math.min(startIdx + pageSize, totalItems)
  const paginatedData = groupByField ? filteredData : filteredData.slice(startIdx, endIdx)

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
    setPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedCategories([])
    setPage(1)
  }, [])

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        if (sortDir === 'asc') {
          setSortDir('desc')
        } else {
          setSortField(null)
          setSortDir('asc')
        }
      } else {
        setSortField(field)
        setSortDir('asc')
      }
      setPage(1)
    },
    [sortField, sortDir]
  )

  const addFilterRow = useCallback(() => {
    setFilterRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), field: 'primary_subcategory', operator: 'has any of', values: [] },
    ])
  }, [])

  const removeFilterRow = useCallback((id: string) => {
    setFilterRows((prev) => prev.filter((r) => r.id !== id))
    setPage(1)
  }, [])

  const duplicateFilterRow = useCallback((id: string) => {
    setFilterRows((prev) => {
      const row = prev.find((r) => r.id === id)
      if (!row) return prev
      return [...prev, { ...row, id: crypto.randomUUID() }]
    })
  }, [])

  const updateFilterRow = useCallback((id: string, updates: Partial<FilterRow>) => {
    setFilterRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    )
    setPage(1)
  }, [])

  // ── Collapsed groups state ─────────────────────────────────────────────────

  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const toggleGroup = useCallback((group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }, [])

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderLinksCell = (item: CollectionItem) => {
    const communityType = getCommunityIcon(item.community)
    return (
      <div className="flex items-center gap-0.5">
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

  const renderRow = (item: CollectionItem) => (
    <tr key={item.id} className="border-b border-border transition-colors hover:bg-row-hover-bg">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {item.logo && (
            <img
              src={item.logo}
              alt=""
              className="h-5 w-5 shrink-0 rounded object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary-text hover:text-accent transition-colors"
            >
              {item.name}
              <ExternalLink className="h-3 w-3 text-accent" />
            </a>
          ) : (
            <span className="font-medium text-primary-text">{item.name}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-text max-w-md">
        <span className="line-clamp-2">{item.description}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {item.primary_subcategory?.map((sub) => (
            <Badge
              key={sub}
              variant="secondary"
              className={getBadgePalette(sub)}
            >
              {sub}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {item.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={getBadgePalette(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        {item.prices && (
          <Badge
            variant="secondary"
            className={`${PRICE_PALETTE[item.prices] ?? ''} border-0 text-xs font-medium`}
          >
            {PRICE_LABELS[item.prices] ?? item.prices}
          </Badge>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-muted-text whitespace-nowrap">
        {item.created_at ? new Date(item.created_at).toISOString().slice(0, 10) : '—'}
      </td>
      <td className="px-4 py-3">{renderLinksCell(item)}</td>
    </tr>
  )

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
    return sortDir === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-accent" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-accent" />
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-muted-text">Loading collection...</p>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="px-6 py-4">
      {/* Category Filter Pills */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={selectedCategories.includes(cat) ? 'default' : 'secondary'}
            className={
              selectedCategories.includes(cat)
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : 'bg-table-header-bg text-muted-text hover:text-primary-text'
            }
            onClick={() => toggleCategory(cat)}
          >
            {cat}
          </Button>
        ))}
        {selectedCategories.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive/90"
            onClick={clearFilters}
          >
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        )}

        {/* Right-side toolbar */}
        <div className="ml-auto flex items-center gap-1">
          {/* Group */}
          <Popover open={groupOpen} onOpenChange={setGroupOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className={`text-sm ${groupByField ? 'text-accent' : 'text-muted-text'}`}>
                <Group className="mr-1 h-4 w-4" />
                Group
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-card-bg" align="end">
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary-text">Group by</p>
                {(['subcategory', 'tags', 'prices'] as const).map((opt) => (
                  <Button
                    key={opt}
                    variant={groupByField === opt ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setGroupByField(groupByField === opt ? null : opt)
                      setCollapsedGroups(new Set())
                      setGroupOpen(false)
                    }}
                  >
                    {opt === 'subcategory' ? 'Primary Subcategory' : opt === 'tags' ? 'Tags' : 'Prices'}
                  </Button>
                ))}
                {groupByField && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive"
                    onClick={() => {
                      setGroupByField(null)
                      setGroupOpen(false)
                    }}
                  >
                    Remove grouping
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className={`text-sm ${filterRows.length > 0 ? 'text-accent' : 'text-muted-text'}`}>
                <Filter className="mr-1 h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[600px] bg-card-bg" align="end">
              <div className="space-y-3">
                <p className="text-sm font-medium text-primary-text">Filters</p>
                {filterRows.map((row) => (
                  <div key={row.id} className="flex items-center gap-2">
                    <span className="text-xs text-muted-text shrink-0">Where</span>
                    <Select
                      value={row.field}
                      onValueChange={(v: string) => updateFilterRow(row.id, { field: v as FilterRow['field'], operator: v === 'prices' ? 'is any of' : 'has any of', values: [] })}
                    >
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary_subcategory">Primary Sub...</SelectItem>
                        <SelectItem value="tags">Tags</SelectItem>
                        <SelectItem value="prices">Prices</SelectItem>
                        <SelectItem value="links">Links</SelectItem>
                      </SelectContent>
                    </Select>
                    {(row.field === 'primary_subcategory' || row.field === 'tags') && (
                      <>
                        <Select
                          value={row.operator}
                          onValueChange={(v: string) => updateFilterRow(row.id, { operator: v })}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="has any of">has any of</SelectItem>
                            <SelectItem value="has all of">has all of</SelectItem>
                            <SelectItem value="is exactly">is exactly</SelectItem>
                            <SelectItem value="has none of">has none of</SelectItem>
                            <SelectItem value="is empty">is empty</SelectItem>
                            <SelectItem value="is not empty">is not empty</SelectItem>
                          </SelectContent>
                        </Select>
                        {!['is empty', 'is not empty'].includes(row.operator) && (
                          <div className="flex-1">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs font-normal">
                                  {row.values.length > 0
                                    ? `${row.values.length} selected`
                                    : 'Select values...'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 max-h-60 overflow-auto bg-card-bg p-2" align="start">
                                {(row.field === 'tags' ? allTags : allSubcategories).map((val) => (
                                  <label
                                    key={val}
                                    className="flex items-center gap-2 px-2 py-1 text-xs text-primary-text cursor-pointer hover:bg-row-hover-bg rounded"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={row.values.includes(val)}
                                      onChange={(e) => {
                                        const newVals = e.target.checked
                                          ? [...row.values, val]
                                          : row.values.filter((v) => v !== val)
                                        updateFilterRow(row.id, { values: newVals })
                                      }}
                                      className="rounded"
                                    />
                                    {val}
                                  </label>
                                ))}
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      </>
                    )}
                    {row.field === 'prices' && (
                      <>
                        <Select
                          value={row.operator}
                          onValueChange={(v: string) => updateFilterRow(row.id, { operator: v })}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="is any of">is any of</SelectItem>
                            <SelectItem value="is none of">is none of</SelectItem>
                            <SelectItem value="is empty">is empty</SelectItem>
                            <SelectItem value="is not empty">is not empty</SelectItem>
                          </SelectContent>
                        </Select>
                        {!['is empty', 'is not empty'].includes(row.operator) && (
                          <div className="flex-1">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs font-normal">
                                  {row.values.length > 0
                                    ? `${row.values.length} selected`
                                    : 'Select prices...'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-52 bg-card-bg p-2" align="start">
                                {allPrices.map((price) => (
                                  <label
                                    key={price}
                                    className="flex items-center gap-2 px-2 py-1 text-xs text-primary-text cursor-pointer hover:bg-row-hover-bg rounded"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={row.values.includes(price)}
                                      onChange={(e) => {
                                        const newVals = e.target.checked
                                          ? [...row.values, price]
                                          : row.values.filter((v) => v !== price)
                                        updateFilterRow(row.id, { values: newVals })
                                      }}
                                      className="rounded"
                                    />
                                    {PRICE_LABELS[price] ?? price}
                                  </label>
                                ))}
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      </>
                    )}
                    {row.field === 'links' && (
                      <div className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs font-normal">
                              {row.values.length > 0
                                ? `${row.values.length} selected`
                                : 'Select link types...'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 bg-card-bg p-2" align="start">
                            {['twitter', 'linkedin', 'github', 'youtube', 'discord', 'telegram', 'reddit'].map(
                              (ltype) => (
                                <label
                                  key={ltype}
                                  className="flex items-center gap-2 px-2 py-1 text-xs text-primary-text cursor-pointer hover:bg-row-hover-bg rounded capitalize"
                                >
                                  <input
                                    type="checkbox"
                                    checked={row.values.includes(ltype)}
                                    onChange={(e) => {
                                      const newVals = e.target.checked
                                        ? [...row.values, ltype]
                                        : row.values.filter((v) => v !== ltype)
                                      updateFilterRow(row.id, { values: newVals })
                                    }}
                                    className="rounded"
                                  />
                                  Has {ltype === 'twitter' ? 'Twitter/X' : ltype.charAt(0).toUpperCase() + ltype.slice(1)}
                                </label>
                              )
                            )}
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-text hover:text-primary-text shrink-0"
                      onClick={() => duplicateFilterRow(row.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-text hover:text-destructive shrink-0"
                      onClick={() => removeFilterRow(row.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-accent"
                  onClick={addFilterRow}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add condition
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort */}
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className={`text-sm ${sortField ? 'text-accent' : 'text-muted-text'}`}>
                <SortAsc className="mr-1 h-4 w-4" />
                Sort
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-card-bg" align="end">
              <div className="space-y-1">
                <p className="text-sm font-medium text-primary-text mb-2">Sort by</p>
                <Button
                  variant={sortField === 'name' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-between text-xs"
                  onClick={() => {
                    handleSort('name')
                    setSortOpen(false)
                  }}
                >
                  Name
                  {sortField === 'name' && (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                </Button>
                <Button
                  variant={sortField === 'created_at' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-between text-xs"
                  onClick={() => {
                    handleSort('created_at')
                    setSortOpen(false)
                  }}
                >
                  Date Added
                  {sortField === 'created_at' && (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                </Button>
                {sortField && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-destructive"
                    onClick={() => {
                      setSortField(null)
                      setSortDir('asc')
                      setSortOpen(false)
                    }}
                  >
                    Remove sort
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card-bg border-border text-primary-text placeholder:text-muted-text"
        />
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-border bg-card-bg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-table-header-bg">
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-text cursor-pointer select-none"
                onClick={() => handleSort('name')}
              >
                <span className="inline-flex items-center">
                  Name
                  {sortIndicator('name')}
                </span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-text">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-text">
                Primary Subcategory
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-text">
                Tags
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-text">
                Prices
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-text cursor-pointer select-none"
                onClick={() => handleSort('created_at')}
              >
                <span className="inline-flex items-center">
                  Date Added
                  {sortIndicator('created_at')}
                </span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-text">
                Links
              </th>
            </tr>
          </thead>
          <tbody>
            {groupByField && groupedData
              ? groupedData.map(([group, items]) => (
                  <GroupSection
                    key={group}
                    group={group}
                    items={items}
                    collapsed={collapsedGroups.has(group)}
                    onToggle={() => toggleGroup(group)}
                    renderRow={renderRow}
                  />
                ))
              : paginatedData.map(renderRow)}
            {!groupByField && paginatedData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-text">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!groupByField && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-text">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v: string) => {
                  setPageSize(Number(v))
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span>
              Showing {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} of {totalItems} entries
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Group Section sub-component ──────────────────────────────────────────────

function GroupSection({
  group,
  items,
  collapsed,
  onToggle,
  renderRow,
}: {
  group: string
  items: CollectionItem[]
  collapsed: boolean
  onToggle: () => void
  renderRow: (item: CollectionItem) => React.ReactNode
}) {
  return (
    <>
      <tr
        className="cursor-pointer bg-table-header-bg hover:bg-row-hover-bg"
        onClick={onToggle}
      >
        <td colSpan={7} className="px-4 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-text">
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            {group}
            <Badge variant="secondary" className="ml-2 text-xs">
              {items.length}
            </Badge>
          </div>
        </td>
      </tr>
      {!collapsed && items.map(renderRow)}
    </>
  )
}
