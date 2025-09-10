'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

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

  useEffect(() => {
    setMounted(true)
    fetchIncentives()
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
    <div className="bg-[#0d0d0d] min-h-screen">
      <Navbar />
      
      <div className="px-[50px] py-[130px]">
        <div className="max-w-[1480px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-10 mb-20">
            <div className="flex items-start gap-2.5 text-white opacity-100 translate-y-0">
              <span className="text-[16px] font-telegraf">(I)</span>
              <h1 className="text-[60px] font-telegraf font-extrabold uppercase leading-[63px]">
                Incentives.
              </h1>
            </div>
            <div className="text-white text-[16px] font-telegraf max-w-[400px] opacity-100 translate-y-0">
              <p>
                Unlock your earning potential with our exclusive incentive programs. From monthly sprints to yearly challenges.
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
              {['all', 'live', 'coming_up', 'done'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as any)}
                  className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors capitalize ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredIncentives.map((incentive) => {
                const statusBadge = getStatusBadge(incentive.live_status)
                
                return (
                  <div
                    key={incentive.id}
                    className="group relative bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] overflow-hidden hover:scale-105 transition-all duration-300"
                  >
                    {/* Background Image/Video */}
                    <div className="relative h-80 overflow-hidden">
                      {incentive.background_video_url ? (
                        <video 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          autoPlay
                          muted
                          loop
                          playsInline
                        >
                          <source src={incentive.background_video_url} type="video/mp4" />
                        </video>
                      ) : (
                        <div 
                          className="w-full h-full bg-gradient-to-br group-hover:scale-110 transition-transform duration-500"
                          style={{
                            background: `linear-gradient(135deg, ${incentive.category_color}20, ${incentive.category_color}40)`
                          }}
                        />
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: incentive.category_color }}
                        >
                          {incentive.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 h-64 flex flex-col justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-telegraf font-bold mb-3 text-white group-hover:text-white/80 transition-colors">
                          {incentive.title}
                        </h3>
                        
                        <p className="text-[rgba(255,255,255,0.6)] font-telegraf mb-4 line-clamp-4 text-sm">
                          {incentive.description}
                        </p>

                        {/* Dates */}
                        <div className="flex flex-col gap-1 text-xs text-[rgba(255,255,255,0.6)] font-telegraf mb-4">
                          <span>Start: {formatDate(incentive.start_date)}</span>
                          <span>End: {formatDate(incentive.end_date)}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button 
                        className={`w-full py-3 rounded-[3px] font-telegraf font-semibold transition-all ${
                          incentive.live_status === 'live'
                            ? 'bg-white text-black hover:bg-white/90'
                            : incentive.live_status === 'coming_up'
                            ? 'bg-gradient-to-b from-[#232323] to-[#171717] text-white hover:from-[#2a2a2a] hover:to-[#1e1e1e]'
                            : 'bg-gradient-to-b from-[#232323] to-[#171717] text-[rgba(255,255,255,0.6)] cursor-not-allowed'
                        }`}
                        disabled={incentive.live_status === 'done'}
                      >
                        {incentive.live_status === 'live' ? 'Join Now' : 
                         incentive.live_status === 'coming_up' ? 'Get Notified' : 
                         'View Results'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {filteredIncentives.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-[rgba(255,255,255,0.6)] font-telegraf text-lg">No incentives found for the selected filter.</p>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <h2 className="text-4xl font-telegraf font-bold mb-6 text-white">Ready to Maximize Your Earnings?</h2>
            <p className="text-xl text-[rgba(255,255,255,0.6)] font-telegraf mb-8">
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
          </div>
        </div>
      </div>
    </div>
  )
}
