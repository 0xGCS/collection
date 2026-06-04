export const PRICE_LABELS: Record<string, string> = {
  free: 'Free',
  free_trial: 'Free Trial',
  freemium: 'Freemium',
  fund: 'Fund',
  one_time_payment: 'One-time',
  subscription: 'Subscription',
  'varies by service': 'Varies',
}

export const PRICE_PALETTE: Record<string, string> = {
  free: 'bg-[#ECFDF5] text-[#065F46] dark:bg-[#064E3B] dark:text-[#6EE7B7]',
  freemium: 'bg-[#EFF6FF] text-[#1D4ED8] dark:bg-[#1E3A5F] dark:text-[#93C5FD]',
  free_trial: 'bg-[#F5F3FF] text-[#6D28D9] dark:bg-[#2E1B69] dark:text-[#C4B5FD]',
  subscription: 'bg-[#FFF1F2] text-[#9F1239] dark:bg-[#4C0519] dark:text-[#FDA4AF]',
  one_time_payment: 'bg-[#FFFBEB] text-[#92400E] dark:bg-[#451A03] dark:text-[#FCD34D]',
  fund: 'bg-[#ECFEFF] text-[#155E75] dark:bg-[#164E63] dark:text-[#67E8F9]',
  'varies by service': 'bg-[#F5F3FF] text-[#6D28D9] dark:bg-[#2E1B69] dark:text-[#C4B5FD]',
}

const BADGE_PALETTES = [
  { light: 'bg-[#EFF6FF] text-[#1D4ED8]', dark: 'dark:bg-[#1E3A5F] dark:text-[#93C5FD]' },
  { light: 'bg-[#F5F3FF] text-[#6D28D9]', dark: 'dark:bg-[#2E1B69] dark:text-[#C4B5FD]' },
  { light: 'bg-[#ECFDF5] text-[#065F46]', dark: 'dark:bg-[#064E3B] dark:text-[#6EE7B7]' },
  { light: 'bg-[#FFFBEB] text-[#92400E]', dark: 'dark:bg-[#451A03] dark:text-[#FCD34D]' },
  { light: 'bg-[#FFF1F2] text-[#9F1239]', dark: 'dark:bg-[#4C0519] dark:text-[#FDA4AF]' },
  { light: 'bg-[#ECFEFF] text-[#155E75]', dark: 'dark:bg-[#164E63] dark:text-[#67E8F9]' },
]

export function getBadgePalette(label: string): string {
  let hash = 5381
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 33) ^ label.charCodeAt(i)
  }
  const palette = BADGE_PALETTES[Math.abs(hash) % BADGE_PALETTES.length]
  return `${palette.light} ${palette.dark} border-0 text-xs font-medium`
}
