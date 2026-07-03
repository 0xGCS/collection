import type { Category, CollectionItem, Topic } from '@/components/collection/types'
import { supabase } from '@/lib/supabase'

// Nested embed: each collection row carries its product_categories → categories → topics.
const COLLECTION_SELECT = `*, short_description, product_categories ( categories ( id, name, slug, topic_id, topics ( id, name, slug ) ) )`

interface RawTopic {
  id?: string
  name?: string | null
  slug?: string | null
}

interface RawCategory {
  id?: string
  name?: string | null
  slug?: string | null
  topic_id?: string | null
  topics?: RawTopic | RawTopic[] | null
}

interface RawProductCategory {
  categories?: RawCategory | RawCategory[] | null
}

// Flatten the embedded product_categories into `categories` (with topic info) and a
// deduped `topics` list. PostgREST may return embedded relations as objects or arrays.
function normalizeItem(raw: Record<string, unknown>): CollectionItem {
  const { product_categories, ...rest } = raw as { product_categories?: RawProductCategory[] | null }

  const categories: Category[] = []
  const topicsBySlug = new Map<string, Topic>()

  for (const pc of product_categories ?? []) {
    const cat = Array.isArray(pc?.categories) ? pc.categories[0] : pc?.categories
    if (!cat || !cat.id || !cat.name || !cat.slug) {
      continue
    }

    const topic = Array.isArray(cat.topics) ? cat.topics[0] : cat.topics
    const topicSlug = topic?.slug ?? ''
    const topicName = topic?.name ?? ''

    categories.push({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      topicSlug,
      topicName,
    })

    if (topicSlug && !topicsBySlug.has(topicSlug)) {
      topicsBySlug.set(topicSlug, { id: topic?.id, name: topicName, slug: topicSlug })
    }
  }

  // Sort categories/topics by name for stable rendering.
  categories.sort((a, b) => a.name.localeCompare(b.name))
  const topics = Array.from(topicsBySlug.values()).sort((a, b) => a.name.localeCompare(b.name))

  return {
    ...(rest as Omit<CollectionItem, 'topics' | 'categories'>),
    topics,
    categories,
  }
}

export async function fetchCollectionItemById(itemId: string): Promise<CollectionItem | null> {
  const { data, error } = await supabase
    .from('collection')
    .select(COLLECTION_SELECT)
    .eq('id', itemId)
    .maybeSingle()

  if (error) {
    console.error('Supabase error fetching collection item:', error)
    return null
  }

  return data ? normalizeItem(data as Record<string, unknown>) : null
}

export async function fetchCollectionItems(limit?: number): Promise<CollectionItem[]> {
  let query = supabase
    .from('collection')
    .select(COLLECTION_SELECT)
    .order('created_at', { ascending: false })

  if (typeof limit === 'number') {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error fetching collection items:', error)
    return []
  }

  return (data ?? []).map((row) => normalizeItem(row as Record<string, unknown>))
}

export async function fetchTopics(): Promise<Topic[]> {
  const { data, error } = await supabase.from('topics').select('id, name, slug').order('name')

  if (error) {
    console.error('Supabase error fetching topics:', error)
    return []
  }

  return (data ?? []) as Topic[]
}

export function pickRelatedItems(
  current: CollectionItem,
  items: CollectionItem[],
  limit = 3,
): CollectionItem[] {
  const currentCategorySlugs = new Set(current.categories.map((c) => c.slug))
  const currentTopicSlugs = new Set(current.topics.map((t) => t.slug))

  const sameCategory: CollectionItem[] = []
  const sameTopic: CollectionItem[] = []

  for (const item of items) {
    if (item.id === current.id) {
      continue
    }

    const hasSameCategory = item.categories.some((c) => currentCategorySlugs.has(c.slug))

    if (hasSameCategory) {
      sameCategory.push(item)
      continue
    }

    const hasSameTopic = item.topics.some((t) => currentTopicSlugs.has(t.slug))

    if (hasSameTopic) {
      sameTopic.push(item)
    }
  }

  return [...sameCategory, ...sameTopic].slice(0, limit)
}
