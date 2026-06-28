// Topic icons aren't stored in the DB, so map them by topic slug here.
// Shared by the directory (CollectionGrid) and the Topics overview page.
export const TOPIC_ICONS: Record<string, string> = {
  ai: '🤖',
  crypto: '₿',
  design: '🎨',
  directories: '🗂️',
  engineering: '⚙️',
  investing: '📈',
  learning: '📚',
  media: '🎬',
  misc: '🗂️',
  osint: '🔍',
  productivity: '⚡',
  social: '💬',
}

export function topicIcon(slug: string): string {
  return TOPIC_ICONS[slug] ?? '🔖'
}
