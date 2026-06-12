import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format an ISO date string as e.g. "Jun 9, 2026". Uses UTC so the displayed
// day matches the stored date regardless of the viewer's timezone.
export function formatDate(date: string | null | undefined) {
  if (!date) {
    return null
  }

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
