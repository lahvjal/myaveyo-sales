export interface Incentive {
  id: string
  title: string
  description?: string
  background_image_url: string
  live_status: 'coming_up' | 'live' | 'done'
  category: string
  category_color: string
  start_date: string
  end_date: string
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface CreateIncentiveData {
  title: string
  description?: string
  background_image_url: string
  category: string
  category_color: string
  start_date: string
  end_date: string
  sort_order?: number
  is_published?: boolean
}

export interface UpdateIncentiveData extends Partial<CreateIncentiveData> {
  id: string
  live_status?: 'coming_up' | 'live' | 'done'
}

// Helper function to calculate status based on dates
export function calculateIncentiveStatus(startDate: string, endDate: string): 'coming_up' | 'live' | 'done' {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (now < start) return 'coming_up'
  if (now >= start && now <= end) return 'live'
  return 'done'
}
