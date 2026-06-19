export interface CollectionFeature {
  label: string
  description: string
}

export interface CollectionItem {
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
  pricing: string | null
  features_v2: CollectionFeature[] | null
  created_at: string | null
}
