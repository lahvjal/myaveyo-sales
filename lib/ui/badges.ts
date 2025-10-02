export type LiveStatus = 'coming_up' | 'live' | 'done'

export interface BadgeClasses {
  container: string
  dot?: string
  text: string
}

// Centralized classes for status badges (used in IncentiveCard)
export const getStatusBadgeClasses = (status: LiveStatus): BadgeClasses => {
  switch (status) {
    case 'live':
      return {
        container: 'bg-[#222222]',
        dot: 'bg-red-500',
        text: 'text-white',
      }
    case 'coming_up':
      return {
        container: 'bg-blue-600',
        dot: 'bg-white',
        text: 'text-white',
      }
    case 'done':
    default:
      return {
        container: 'bg-[#959595]',
        dot: 'bg-[#535353]',
        text: 'text-white',
      }
  }
}

// Category badge styling. If a color is provided from DB, prefer it.
export const getCategoryBadgeStyle = (category?: string, color?: string) => {
  // You can override per category here if you want themed defaults
  const defaults: Record<string, string> = {
    Yearly: '#FFE999',
    Summer: '#FFD1A6',
    Monthly: '#C1F0D0',
  }
  const bg = color || (category ? defaults[category] : undefined) || '#ffffff'
  return { backgroundColor: bg }
}

// Neutral pill used across project cards, etc.
export const pillClass = 'inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#35393c] to-[#272a2e] px-2.5 py-2 text-[14px] text-white'
