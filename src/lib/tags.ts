import type { CollectionItem } from '@/components/collection/types'

export interface TagSummary {
  slug: string
  name: string
  count: number
}

// Words that should keep a fixed casing instead of plain Title Case.
const SPECIAL_WORDS: Record<string, string> = {
  ai: 'AI',
  api: 'API',
  bin: 'BIN',
  cd: 'CD',
  ci: 'CI',
  cli: 'CLI',
  cms: 'CMS',
  crm: 'CRM',
  css: 'CSS',
  csv: 'CSV',
  defi: 'DeFi',
  dex: 'DEX',
  gdpr: 'GDPR',
  gpt: 'GPT',
  html: 'HTML',
  ide: 'IDE',
  ios: 'iOS',
  json: 'JSON',
  llm: 'LLM',
  macos: 'macOS',
  mcp: 'MCP',
  n8n: 'n8n',
  nextjs: 'Next.js',
  ocr: 'OCR',
  osint: 'OSINT',
  pdf: 'PDF',
  png: 'PNG',
  saas: 'SaaS',
  sdk: 'SDK',
  sec: 'SEC',
  seo: 'SEO',
  sms: 'SMS',
  svg: 'SVG',
  ui: 'UI',
  uk: 'UK',
  url: 'URL',
  us: 'US',
  ux: 'UX',
  vin: 'VIN',
  xlsx: 'XLSX',
}

// Raw tags are stored as lowercase kebab-case slugs (e.g. "open-source"), but a
// stray value may contain spaces or other characters — normalize defensively.
export function slugifyTag(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// "open-source" → "Open Source", "ai-agents" → "AI Agents".
export function formatTagName(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => SPECIAL_WORDS[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Roll every product's tags into deduped per-slug summaries with distinct
// product counts (two raw spellings that slugify identically merge into one).
export function buildTagSummaries(items: CollectionItem[]): TagSummary[] {
  const bySlug = new Map<string, Set<string>>()

  for (const item of items) {
    for (const raw of item.tags ?? []) {
      const slug = slugifyTag(raw)
      if (!slug) continue
      let products = bySlug.get(slug)
      if (!products) {
        products = new Set()
        bySlug.set(slug, products)
      }
      products.add(item.id)
    }
  }

  return Array.from(bySlug.entries()).map(([slug, products]) => ({
    slug,
    name: formatTagName(slug),
    count: products.size,
  }))
}

export function itemHasTag(item: CollectionItem, tagSlug: string): boolean {
  return (item.tags ?? []).some((raw) => slugifyTag(raw) === tagSlug)
}
