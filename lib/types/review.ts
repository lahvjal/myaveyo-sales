export interface Review {
  id?: string
  title: string
  description: string
  video_url: string
  thumbnail_url: string
  type: 'customer' | 'rep'
  featured: boolean
  customer_name?: string
  rep_name?: string
  location: string
  date_recorded: string
  status: 'active' | 'inactive' | 'pending'
  created_at?: string
  updated_at?: string
}

export interface ReviewFilters {
  type?: 'all' | 'customer' | 'rep'
  featured?: boolean
  status?: 'active' | 'inactive' | 'pending'
  limit?: number
}
