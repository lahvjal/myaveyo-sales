export interface StatsContent {
  id: string
  section: 'header' | 'comparison' | 'growth_path' | 'sale_impact'
  title: string
  subtitle?: string
  content: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreateStatsContentData {
  section: 'header' | 'comparison' | 'growth_path' | 'sale_impact'
  title: string
  subtitle?: string
  content: Record<string, any>
}

export interface UpdateStatsContentData extends CreateStatsContentData {
  id: string
}

// Specific content types for each section
export interface HeaderContent {
  main_title: string
  subtitle: string
  description: string
}

export interface ComparisonContent {
  title: string
  jobs: Array<{
    name: string
    icon: string
    earnings: string
  }>
  highlight_text: string
}

export interface GrowthPathContent {
  title: string
  levels: Array<{
    name: string
    installs: number
    earnings: string
    description: string
  }>
  bottom_text: string
}

export interface SaleImpactContent {
  title: string
  metrics: Array<{
    label: string
    value: string
    icon: string
  }>
  bottom_text: string
}
