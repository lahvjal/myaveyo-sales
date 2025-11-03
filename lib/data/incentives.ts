import { SupabaseClient } from '@supabase/supabase-js'

export type Incentive = {
  id: string
  title: string
  description?: string | null
  category: string
  category_color: string
  background_image_url: string
  background_video_url?: string | null
  start_date: string
  end_date: string
  sort_order: number
  is_published: boolean
  live_status: 'coming_up' | 'live' | 'done'
}

export function calculateIncentiveStatus(startDate: string, endDate: string): Incentive['live_status'] {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (now < start) return 'coming_up'
  if (now > end) return 'done'
  return 'live'
}

export async function getIncentives(supabase: SupabaseClient<any, any, any>): Promise<Incentive[]> {
  const { data, error } = await supabase
    .from('public_incentives')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  const items = (data || []) as Incentive[]
  // Recompute live_status dynamically from dates
  return items.map((inc) => ({
    ...inc,
    live_status: calculateIncentiveStatus(inc.start_date, inc.end_date),
  }))
}
