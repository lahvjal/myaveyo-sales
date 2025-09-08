'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

interface LeaderboardEntry {
  rep_name: string
  rep_email: string
  rep_id: string
  total_projects: number
  completed_projects: number
  active_projects: number
  completion_rate: number
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'completed' | 'total' | 'rate'>('completed')
  const [yearFilter, setYearFilter] = useState<'all' | 'current'>('all')
  const [mounted, setMounted] = useState(false)
  

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      
      // Use the API route which handles the complex query
      const orderBy = viewMode === 'completed' ? 'completed_projects DESC' : 
                     viewMode === 'total' ? 'total_projects DESC' : 
                     'completion_rate DESC'
      
      const yearParam = yearFilter === 'current' ? '&year=current' : ''
      const response = await fetch(`/api/leaderboard?order_by=${encodeURIComponent(orderBy)}${yearParam}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setLeaderboardData(data || [])
    } catch (error) {
      console.error('Error fetching leaderboardData:', error)
      // Use mock data as fallback
      setLeaderboardData([
        {
          rep_name: "AUSTIN TOWNSEND",
          rep_email: "austin.townsend@myaveyo.com",
          rep_id: "2927337066",
          total_projects: 237,
          completed_projects: 128,
          active_projects: 86,
          completion_rate: 54.0
        },
        {
          rep_name: "SAWYER KIEFFER", 
          rep_email: "sawyer.kieffer@myaveyo.com",
          rep_id: "2927338862",
          total_projects: 180,
          completed_projects: 93,
          active_projects: 60,
          completion_rate: 51.7
        },
        {
          rep_name: "FARIS GRAHOVIC",
          rep_email: "faris.grahovic@myaveyo.com", 
          rep_id: "2927337685",
          total_projects: 125,
          completed_projects: 64,
          active_projects: 41,
          completion_rate: 51.2
        },
        {
          rep_name: "REED EVANS",
          rep_email: "reed.evans@myaveyo.com",
          rep_id: "2927338719", 
          total_projects: 150,
          completed_projects: 59,
          active_projects: 66,
          completion_rate: 39.3
        },
        {
          rep_name: "SCOTT BURGESS",
          rep_email: "scott.burgess@myaveyo.com",
          rep_id: "2927338865",
          total_projects: 161,
          completed_projects: 53,
          active_projects: 42,
          completion_rate: 32.9
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchLeaderboard()
    }
  }, [viewMode, yearFilter, mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈" 
    if (index === 2) return "🥉"
    return `#${index + 1}`
  }

  const getStatValue = (entry: LeaderboardEntry) => {
    switch (viewMode) {
      case 'completed': return entry.completed_projects
      case 'total': return entry.total_projects
      case 'rate': return `${entry.completion_rate}%`
      default: return entry.completed_projects
    }
  }

  const getStatLabel = () => {
    switch (viewMode) {
      case 'completed': return 'Completed Projects'
      case 'total': return 'Total Projects'
      case 'rate': return 'Completion Rate'
      default: return 'Completed Projects'
    }
  }

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      <Navbar />
      
      <div className="px-[50px] py-[130px]">
        <div className="max-w-[1480px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-10 mb-20">
            <div className="flex items-start gap-2.5 text-white opacity-100 translate-y-0">
              <span className="text-[16px] font-telegraf">(L)</span>
              <h1 className="text-[60px] font-telegraf font-extrabold uppercase leading-[63px]">
                Leaderboard.
              </h1>
            </div>
            <div className="text-white text-[16px] font-telegraf max-w-[400px] opacity-100 translate-y-0">
              <p>
                Track top performers and see where you rank among the Aveyo sales team.
              </p>
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex justify-center mb-4">
            <div className="flex bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
              <button
                onClick={() => setYearFilter('all')}
                className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                  yearFilter === 'all'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white hover:bg-white/10'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setYearFilter('current')}
                className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                  yearFilter === 'current'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white hover:bg-white/10'
                }`}
              >
                2025 Only
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
              <button
                onClick={() => setViewMode('completed')}
                className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                  viewMode === 'completed'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white hover:bg-white/10'
                }`}
              >
                Completed Projects
              </button>
              <button
                onClick={() => setViewMode('total')}
                className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                  viewMode === 'total'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white hover:bg-white/10'
                }`}
              >
                Total Projects
              </button>
              <button
                onClick={() => setViewMode('rate')}
                className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                  viewMode === 'rate'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white hover:bg-white/10'
                }`}
              >
                Completion Rate
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {leaderboardData.slice(0, 3).map((entry: LeaderboardEntry, index: number) => (
                  <div
                    key={entry.rep_id}
                    className={`relative p-6 bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] border ${
                      index === 0 
                        ? 'border-yellow-500/30' 
                        : index === 1
                        ? 'border-gray-400/30'
                        : 'border-amber-600/30'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{getRankIcon(index)}</div>
                      <h3 className="text-xl font-telegraf font-bold mb-1 text-white">{entry.rep_name}</h3>
                      <p className="text-[rgba(255,255,255,0.6)] text-sm mb-4 font-telegraf">{entry.rep_email}</p>
                      <div className="text-3xl font-telegraf font-bold text-white mb-2">
                        {getStatValue(entry)}
                      </div>
                      <p className="text-sm text-[rgba(255,255,255,0.6)] font-telegraf">{getStatLabel()}</p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-[rgba(255,255,255,0.6)] font-telegraf">Total</div>
                          <div className="font-telegraf font-semibold text-white">{entry.total_projects}</div>
                        </div>
                        <div>
                          <div className="text-[rgba(255,255,255,0.6)] font-telegraf">Active</div>
                          <div className="font-telegraf font-semibold text-white">{entry.active_projects}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rest of Leaderboard */}
              <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-b from-[#232323] to-[#171717] font-telegraf font-semibold text-sm text-white">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-4">Sales Rep</div>
                  <div className="col-span-2 text-center">{getStatLabel()}</div>
                  <div className="col-span-2 text-center">Total Projects</div>
                  <div className="col-span-2 text-center">Active Projects</div>
                  <div className="col-span-1 text-center">Rate</div>
                </div>
                
                {leaderboardData.slice(3).map((entry: LeaderboardEntry, index: number) => (
                  <div
                    key={entry.rep_id}
                    className="grid grid-cols-12 gap-4 p-4 border-b border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <div className="col-span-1 font-telegraf font-bold text-[rgba(255,255,255,0.6)]">
                      #{index + 4}
                    </div>
                    <div className="col-span-4">
                      <div className="font-telegraf font-semibold text-white">{entry.rep_name}</div>
                      <div className="text-sm text-[rgba(255,255,255,0.6)] font-telegraf">{entry.rep_email}</div>
                    </div>
                    <div className="col-span-2 text-center font-telegraf font-bold text-white">
                      {getStatValue(entry)}
                    </div>
                    <div className="col-span-2 text-center font-telegraf text-white">
                      {entry.total_projects}
                    </div>
                    <div className="col-span-2 text-center font-telegraf text-white">
                      {entry.active_projects}
                    </div>
                    <div className="col-span-1 text-center text-sm font-telegraf text-white">
                      {entry.completion_rate}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-telegraf font-bold mb-8 text-white">Team Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px]">
                <div className="text-3xl font-telegraf font-bold text-white mb-2">
                  {leaderboardData.length}
                </div>
                <div className="text-[rgba(255,255,255,0.6)] font-telegraf">Active Reps</div>
              </div>
              <div className="p-6 bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px]">
                <div className="text-3xl font-telegraf font-bold text-white mb-2">
                  {leaderboardData.reduce((sum: number, entry: LeaderboardEntry) => sum + entry.completed_projects, 0)}
                </div>
                <div className="text-[rgba(255,255,255,0.6)] font-telegraf">Total Completed</div>
              </div>
              <div className="p-6 bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px]">
                <div className="text-3xl font-telegraf font-bold text-white mb-2">
                  {leaderboardData.reduce((sum: number, entry: LeaderboardEntry) => sum + entry.active_projects, 0)}
                </div>
                <div className="text-[rgba(255,255,255,0.6)] font-telegraf">Active Projects</div>
              </div>
              <div className="p-6 bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px]">
                <div className="text-3xl font-telegraf font-bold text-white mb-2">
                  {Math.round(leaderboardData.reduce((sum: number, entry: LeaderboardEntry) => sum + entry.completion_rate, 0) / leaderboardData.length)}%
                </div>
                <div className="text-[rgba(255,255,255,0.6)] font-telegraf">Avg Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
