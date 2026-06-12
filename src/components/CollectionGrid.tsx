import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, FilterX, Search } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CollectionLinks } from '@/components/collection/CollectionLinks'
import { CollectionPriceBadge, CollectionTagList } from '@/components/collection/CollectionBadges'
import { PRICE_LABELS } from '@/components/collection/badge-utils'
import type { CollectionItem } from '@/components/collection/types'

// ── Categories ───────────────────────────────────────────────────────────────

interface CategoryDef {
  name: string
  slug: string
  icon: string
}

const CATEGORIES: CategoryDef[] = [
  { name: 'Engineering', slug: 'engineering', icon: '⚙️' },
  { name: 'Artsy', slug: 'artsy', icon: '🎨' },
  { name: 'Crypto', slug: 'crypto', icon: '₿' },
  { name: 'Investing', slug: 'investing', icon: '📈' },
  { name: 'OSINT', slug: 'osint', icon: '🔍' },
  { name: 'Learning', slug: 'learning', icon: '📚' },
  { name: 'Social', slug: 'social', icon: '💬' },
  { name: 'Misc', slug: 'misc', icon: '🗂️' },
  { name: 'AI', slug: 'ai', icon: '🤖' },
]

const PAGE_SIZES = [25, 50, 100]

const LINK_TYPES = ['twitter', 'linkedin', 'github', 'youtube', 'discord', 'telegram', 'reddit'] as const

function linkTypeLabel(type: string) {
  if (type === 'twitter') return 'Twitter/X'
  return type.charAt(0).toUpperCase() + type.slice(1)
}

// ── Multi-select dropdown ──────────────────────────────────────────────────────

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  renderOption,
  width = 'w-56',
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  renderOption?: (value: string) => string
  width?: string
}) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 justify-between text-xs font-normal ${selected.length > 0 ? 'border-blue-500 text-accent' : ''}`}
        >
          {selected.length > 0 ? `${label} (${selected.length})` : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${width} max-h-72 overflow-auto bg-card-bg p-2`} align="start">
        {options.length === 0 ? (
          <p className="px-2 py-1 text-xs text-muted-text">No options.</p>
        ) : (
          options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-primary-text hover:bg-row-hover-bg"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="rounded"
              />
              {renderOption ? renderOption(option) : option}
            </label>
          ))
        )}
      </PopoverContent>
    </Popover>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────────

function LogoAvatar({ item }: { item: CollectionItem }) {
  const [errored, setErrored] = useState(false)

  if (item.logo && !errored) {
    return (
      <img
        src={item.logo}
        alt=""
        className="h-8 w-8 shrink-0 rounded-lg border border-border object-contain"
        onError={() => setErrored(true)}
      />
    )
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-primary-text">
      {item.name.charAt(0).toUpperCase() || '?'}
    </div>
  )
}

function CollectionCard({ item }: { item: CollectionItem }) {
  const dateLabel = formatDate(item.created_at)

  // Stretched-link pattern: an overlay <Link> covers the card while the social
  // icons remain separate (pointer-events-auto) anchors — avoids nesting <a> in <a>.
  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card-bg p-5 transition-all hover:-translate-y-0.5 hover:border-blue-500">
      <Link
        to={`/tools/item/${item.id}`}
        aria-label={item.name}
        className="absolute inset-0 z-0 rounded-xl"
      />

      <div className="pointer-events-none relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <LogoAvatar item={item} />
          <h3 className="min-w-0 flex-1 truncate font-bold text-primary-text">{item.name}</h3>
        </div>

        {item.description && <p className="line-clamp-2 text-sm text-muted-text">{item.description}</p>}

        {item.prices && (
          <div>
            <CollectionPriceBadge price={item.prices} />
          </div>
        )}

        {item.tags?.length ? <CollectionTagList items={item.tags} /> : null}
      </div>

      <div className="pointer-events-none relative z-10 mt-auto flex items-center justify-between pt-2">
        <span className="text-xs text-muted-text">{dateLabel ?? '—'}</span>
        <div className="pointer-events-auto">
          <CollectionLinks item={item} />
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex h-48 animate-pulse flex-col gap-3 rounded-xl bg-muted p-5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-border" />
        <div className="h-4 w-32 rounded bg-border" />
      </div>
      <div className="h-3 w-full rounded bg-border" />
      <div className="h-3 w-3/4 rounded bg-border" />
      <div className="h-5 w-20 rounded-full bg-border" />
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function CollectionGrid() {
  const { category: categorySlug } = useParams<{ category?: string }>()
  const navigate = useNavigate()

  const activeCategory = useMemo(
    () => CATEGORIES.find((c) => c.slug === categorySlug?.toLowerCase()) ?? null,
    [categorySlug],
  )

  const [data, setData] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedLinkTypes, setSelectedLinkTypes] = useState<string[]>([])
  const [dateSort, setDateSort] = useState<'newest' | 'oldest' | 'none'>('newest')

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // ── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      setLoading(true)
      const { data: rows, error } = await supabase
        .from('collection')
        .select('*')
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (error) {
        console.error('Supabase error:', error)
      } else {
        setData(rows ?? [])
      }
      setLoading(false)
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [])

  // ── Debounced search ───────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Filter setters that also reset pagination to page 1.
  const setSubcategoriesAndReset = (next: string[]) => {
    setSelectedSubcategories(next)
    setPage(1)
  }
  const setTagsAndReset = (next: string[]) => {
    setSelectedTags(next)
    setPage(1)
  }
  const setPricesAndReset = (next: string[]) => {
    setSelectedPrices(next)
    setPage(1)
  }
  const setLinkTypesAndReset = (next: string[]) => {
    setSelectedLinkTypes(next)
    setPage(1)
  }
  const setDateSortAndReset = (next: typeof dateSort) => {
    setDateSort(next)
    setPage(1)
  }

  // ── Option lists ───────────────────────────────────────────────────────────

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
    data.forEach((item) => {
      if (item.prices) set.add(item.prices)
    })
    return Array.from(set).sort()
  }, [data])

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredData = useMemo(() => {
    let result = data

    if (activeCategory) {
      result = result.filter((item) => item.primary_category?.includes(activeCategory.name))
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)),
      )
    }

    if (selectedSubcategories.length > 0) {
      result = result.filter((item) =>
        item.primary_subcategory?.some((s) => selectedSubcategories.includes(s)),
      )
    }

    if (selectedTags.length > 0) {
      result = result.filter((item) => item.tags?.some((t) => selectedTags.includes(t)))
    }

    if (selectedPrices.length > 0) {
      result = result.filter((item) => item.prices && selectedPrices.includes(item.prices))
    }

    if (selectedLinkTypes.length > 0) {
      result = result.filter((item) =>
        selectedLinkTypes.some((type) => {
          switch (type) {
            case 'twitter':
              return Boolean(item.twitter)
            case 'linkedin':
              return Boolean(item.linkedin)
            case 'github':
              return Boolean(item.github)
            case 'youtube':
              return Boolean(item.youtube)
            case 'discord':
              return Boolean(
                item.community &&
                  (item.community.toLowerCase().includes('discord.gg') ||
                    item.community.toLowerCase().includes('discord.com')),
              )
            case 'telegram':
              return Boolean(
                item.community &&
                  (item.community.toLowerCase().includes('t.me') ||
                    item.community.toLowerCase().includes('telegram.me')),
              )
            case 'reddit':
              return Boolean(item.community && item.community.toLowerCase().includes('reddit.com'))
            default:
              return false
          }
        }),
      )
    }

    if (dateSort !== 'none') {
      result = [...result].sort((a, b) => {
        const cmp = (a.created_at ?? '').localeCompare(b.created_at ?? '')
        return dateSort === 'newest' ? -cmp : cmp
      })
    }

    return result
  }, [
    data,
    activeCategory,
    debouncedSearch,
    selectedSubcategories,
    selectedTags,
    selectedPrices,
    selectedLinkTypes,
    dateSort,
  ])

  // ── Pagination ─────────────────────────────────────────────────────────────

  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = Math.min(startIdx + pageSize, totalItems)
  const paginatedData = filteredData.slice(startIdx, endIdx)

  // ── Handlers ───────────────────────────────────────────────────────────────

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    selectedSubcategories.length > 0 ||
    selectedTags.length > 0 ||
    selectedPrices.length > 0 ||
    selectedLinkTypes.length > 0

  const clearAllFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setSelectedSubcategories([])
    setSelectedTags([])
    setSelectedPrices([])
    setSelectedLinkTypes([])
    setPage(1)
  }

  const goToCategory = (slug: string | null) => {
    navigate(slug ? `/tools/${slug}` : '/tools')
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Category pills */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => goToCategory(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !activeCategory
              ? 'bg-blue-600 text-white'
              : 'border border-border bg-card-bg text-muted-text hover:bg-muted'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => goToCategory(cat.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory?.slug === cat.slug
                ? 'bg-blue-600 text-white'
                : 'border border-border bg-card-bg text-muted-text hover:bg-muted'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-text" />
        <Input
          type="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          placeholder="Search by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card-bg border-border pl-9 text-primary-text placeholder:text-muted-text"
        />
      </div>

      {/* Filter dropdowns */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <MultiSelect
          label="Subcategory"
          options={allSubcategories}
          selected={selectedSubcategories}
          onChange={setSubcategoriesAndReset}
        />
        <MultiSelect label="Tags" options={allTags} selected={selectedTags} onChange={setTagsAndReset} />
        <MultiSelect
          label="Pricing"
          options={allPrices}
          selected={selectedPrices}
          onChange={setPricesAndReset}
          renderOption={(value) => PRICE_LABELS[value] ?? value}
          width="w-52"
        />
        <MultiSelect
          label="Link Type"
          options={[...LINK_TYPES]}
          selected={selectedLinkTypes}
          onChange={setLinkTypesAndReset}
          renderOption={linkTypeLabel}
          width="w-48"
        />
        <Select value={dateSort} onValueChange={(v: string) => setDateSortAndReset(v as typeof dateSort)}>
          <SelectTrigger className="h-9 w-40 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Date: Newest</SelectItem>
            <SelectItem value="oldest">Date: Oldest</SelectItem>
            <SelectItem value="none">Date: Unsorted</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-xs text-destructive hover:text-destructive/90"
            onClick={clearAllFilters}
          >
            <FilterX className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Grid / states */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card-bg py-20 text-center">
          <FilterX className="h-8 w-8 text-muted-text" />
          <p className="text-muted-text">No items match your filters.</p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((item) => (
              <CollectionCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between text-sm text-muted-text">
            <div className="flex items-center gap-2">
              <span>Per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v: string) => {
                  setPageSize(Number(v))
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-20 text-xs">
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
              <span className="ml-2">
                {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} of {totalItems}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
