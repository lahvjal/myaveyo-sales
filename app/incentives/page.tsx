'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import IncentivesList from '@/components/incentives/IncentivesList'
import type { Incentive as IncentiveModel } from '@/lib/types/incentive'

interface Incentive {
  id: string
  title: string
  description: string
  category: string
  category_color: string
  live_status: 'coming_up' | 'live' | 'done'
  background_image_url: string
  background_video_url?: string
  start_date: string
  end_date: string
  sort_order: number
}

export default function IncentivesPage() {
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'live' | 'coming_up' | 'done'>('all')
  const [mounted, setMounted] = useState(false)
  const [copyLoading, setCopyLoading] = useState(true)
  const [incentivesCopy, setIncentivesCopy] = useState<{ section_number: string; section_title: string; description: string }>({
    section_number: '(2)',
    section_title: 'Incentives.',
    description: 'Great commissions are nice, but incredible incentives can be even cooler. Check out what we have cooking.',
  })

  const fetchIncentives = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/incentives')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setIncentives(data || [])
    } catch (error) {
      console.error('Error fetching incentives:', error)
      // Mock data fallback
      setIncentives([
        {
          id: '1',
          title: 'Aveyo UNLMTD \'25',
          description: 'Our biggest yearly incentive program with unlimited earning potential. Hit your targets and unlock exclusive rewards throughout 2025.',
          category: 'Yearly',
          category_color: '#3B82F6',
          live_status: 'live',
          background_image_url: '/images/incentive-bg-1.jpg',
          start_date: '2025-01-01',
          end_date: '2025-12-31',
          sort_order: 1
        },
        {
          id: '2', 
          title: '0 to 60',
          description: 'Fast-track your sales performance in this high-energy sprint. Go from zero to sixty deals and earn premium bonuses.',
          category: 'Sprint',
          category_color: '#EF4444',
          live_status: 'live',
          background_image_url: '/images/incentive-bg-2.jpg',
          start_date: '2025-08-21',
          end_date: '2025-09-06',
          sort_order: 2
        },
        {
          id: '3',
          title: 'Grab Bag',
          description: 'Monthly surprise rewards and challenges. Complete daily tasks and weekly goals to unlock mystery prizes.',
          category: 'Monthly',
          category_color: '#10B981',
          live_status: 'live',
          background_image_url: '/images/incentive-bg-3.jpg',
          start_date: '2025-09-01',
          end_date: '2025-09-30',
          sort_order: 3
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchIncentivesCopy = async () => {
    try {
      const res = await fetch('/api/cms/home-incentives')
      if (res.ok) {
        const data = await res.json()
        setIncentivesCopy({
          section_number: data.section_number ?? '(2)',
          section_title: data.section_title ?? 'Incentives.',
          description: data.description ?? '',
        })
      }
    } catch (e) {
      console.error('Error fetching incentives copy:', e)
    } finally {
      setCopyLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchIncentives()
    fetchIncentivesCopy()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const filteredIncentives = incentives.filter(incentive => {
    if (filter === 'all') return true
    return incentive.live_status === filter
  })
  // (Note) Badge helpers and date formatters removed here since rendering moved into IncentivesList/IncentiveCard
  return (
    <div className="bg-[#0d0d0d] min-h-screen pt-[100px]">
      <Navbar />
      <div className="px-6 sm:px-8 md:px-10 lg:px-[50px] py-16 sm:py-20 lg:py-[130px]">
        <IncentivesList
          incentivesCopy={incentivesCopy}
          filter={filter}
          onFilterChange={(next) => setFilter(next)}
          loading={loading}
          filteredIncentives={([...filteredIncentives]
            .sort((a, b) => {
              const rank = (s: Incentive['live_status']) => (s === 'live' ? 0 : s === 'coming_up' ? 1 : 2)
              return rank(a.live_status) - rank(b.live_status)
            }) as IncentiveModel[])}
        />
      </div>
    </div>
  )
}
