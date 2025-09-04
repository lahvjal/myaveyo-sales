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
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-green-600/20" />
        <div className="relative z-10 px-6 py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 font-telegraf">
            Sales Incentives
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Unlock your earning potential with our exclusive incentive programs. 
            From monthly sprints to yearly challenges, there's always a way to boost your rewards.
          </p>
          
          {/* Filter Buttons */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              {['all', 'live', 'coming_up', 'done'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as any)}
                  className={`px-6 py-3 rounded-md font-medium transition-all capitalize ${
                    filter === filterOption 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {filterOption === 'coming_up' ? 'Coming Soon' : filterOption}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incentives Grid */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-400">Loading incentives...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredIncentives.map((incentive) => {
                const statusBadge = getStatusBadge(incentive.live_status)
                
                return (
                  <div
                    key={incentive.id}
                    className="group relative bg-gray-900 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                  >
                    {/* Background Image/Video */}
                    <div className="relative h-64 overflow-hidden">
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
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                        {incentive.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {incentive.description}
                      </p>

                      {/* Dates */}
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                        <span>Start: {formatDate(incentive.start_date)}</span>
                        <span>End: {formatDate(incentive.end_date)}</span>
                      </div>

                      {/* Action Button */}
                      <button 
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${
                          incentive.live_status === 'live'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : incentive.live_status === 'coming_up'
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
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
              <p className="text-gray-400 text-lg">No incentives found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Maximize Your Earnings?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our top performers and start earning more with every sale. 
            Check the leaderboard to see where you stand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/leaderboard"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              View Leaderboard
            </a>
            <a 
              href="/dashboard"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              My Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
