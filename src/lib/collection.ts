import type { CollectionItem } from '@/components/collection/types'
import { supabase } from '@/lib/supabase'

export async function fetchCollectionItemById(itemId: string): Promise<CollectionItem | null> {
  const { data, error } = await supabase
    .from('collection')
    .select('*')
    .eq('id', itemId)
    .maybeSingle()

  if (error) {
    console.error('Supabase error fetching collection item:', error)
    return null
  }

  return data
}

export async function fetchCollectionItems(limit?: number): Promise<CollectionItem[]> {
  let query = supabase
    .from('collection')
    .select('*')
    .order('created_at', { ascending: false })

  if (typeof limit === 'number') {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error fetching collection items:', error)
    return []
  }

  return data ?? []
}

export function pickRelatedItems(
  current: CollectionItem,
  items: CollectionItem[],
  limit = 3,
): CollectionItem[] {
  const currentSubcategories = new Set(current.primary_subcategory ?? [])
  const currentCategories = new Set(current.primary_category ?? [])

  const sameSubcategory: CollectionItem[] = []
  const sameCategory: CollectionItem[] = []

  for (const item of items) {
    if (item.id === current.id) {
      continue
    }

    const hasSameSubcategory = (item.primary_subcategory ?? []).some((subcategory) =>
      currentSubcategories.has(subcategory),
    )

    if (hasSameSubcategory) {
      sameSubcategory.push(item)
      continue
    }

    const hasSameCategory = (item.primary_category ?? []).some((category) => currentCategories.has(category))

    if (hasSameCategory) {
      sameCategory.push(item)
    }
  }

  return [...sameSubcategory, ...sameCategory].slice(0, limit)
}
