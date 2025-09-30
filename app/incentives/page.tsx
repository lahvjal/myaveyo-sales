'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import IncentiveCard from '@/components/incentives/IncentiveCard'

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

  const getStatusBadge = (status: string) => {
    const badges = {
      live: 'bg-green-500 text-white',
      coming_up: 'bg-yellow-500 text-black',
      done: 'bg-gray-500 text-white'
    }
    const labels = {
      live: 'Live Now',
      coming_up: 'Coming Soon',
      done: 'Completed'
    }
    return { class: badges[status as keyof typeof badges], label: labels[status as keyof typeof labels] }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-[#0d0d0d] min-h-screen pt-[100px]">
      <Navbar />
      
      <div className="px-6 sm:px-8 md:px-10 lg:px-[50px] py-16 sm:py-20 lg:py-[130px]">
        <div className="max-w-[1480px] mx-auto">
          {/* Header (from CMS) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 sm:pb-10 mb-10 sm:mb-16 lg:mb-20">
            <div className="flex items-start gap-2.5 text-white opacity-100 translate-y-0">
              <span className="text-[14px] sm:text-[16px] font-telegraf">{incentivesCopy.section_number}</span>
              <h1 className="text-[32px] sm:text-[40px] md:text-[52px] lg:text-[60px] font-telegraf font-extrabold uppercase leading-[36px] sm:leading-[44px] md:leading-[56px] lg:leading-[63px]">
                {incentivesCopy.section_title}
              </h1>
            </div>
            <div className="text-white text-[14px] sm:text-[16px] font-telegraf max-w-[400px] opacity-100 translate-y-0">
              <p>
                {incentivesCopy.description}
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="flex flex-wrap justify-center bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
              {['all', 'live', 'coming_up', 'done'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as any)}
                  className={`px-[12px] sm:px-[15px] py-[6px] sm:py-[7px] rounded-[60px] text-[12px] sm:text-[14px] font-inter font-semibold transition-colors capitalize ${
                    filter === filterOption 
                      ? 'bg-white text-black' 
                      : 'bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  {filterOption === 'coming_up' ? 'Coming Soon' : filterOption}
                </button>
              ))}
            </div>
          </div>

          {/* Incentives Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...filteredIncentives]
                .sort((a, b) => {
                  const rank = (s: Incentive['live_status']) => (s === 'live' ? 0 : s === 'coming_up' ? 1 : 2)
                  return rank(a.live_status) - rank(b.live_status)
                })
                .map((incentive) => (
                <a key={incentive.id} href={`/incentives/${incentive.id}`} className="block rounded-[3px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50">
                  <IncentiveCard
                    title={incentive.title}
                    backgroundImage={incentive.background_image_url}
                    backgroundVideo={incentive.background_video_url}
                    liveStatus={incentive.live_status}
                    category={incentive.category}
                    categoryColor={incentive.category_color}
                    startDate={incentive.start_date}
                    endDate={incentive.end_date}
                    variant="detailed"
                  />
                </a>
              ))}
            </div>
          )}

          {filteredIncentives.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-[rgba(255,255,255,0.6)] font-telegraf text-lg">No incentives found for the selected filter.</p>
            </div>
          )}

          {/* CTA Section */}
          {/* <div className="mt-10 sm:mt-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-telegraf font-bold mb-4 sm:mb-6 text-white">Ready to Maximize Your Earnings?</h2>
            <p className="text-base sm:text-lg md:text-xl text-[rgba(255,255,255,0.6)] font-telegraf mb-6 sm:mb-8">
              Join our top performers and start earning more with every sale. 
              Check the leaderboard to see where you stand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/leaderboard"
                className="px-8 py-4 bg-white text-black hover:bg-white/90 rounded-[3px] font-telegraf font-semibold transition-colors"
              >
                View Leaderboard
              </a>
              <a 
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-b from-[#232323] to-[#171717] text-white hover:from-[#2a2a2a] hover:to-[#1e1e1e] rounded-[3px] font-telegraf font-semibold transition-colors"
              >
                My Dashboard
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
