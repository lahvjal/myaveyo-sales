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
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="relative z-10 px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4 font-telegraf">
            Sales Leaderboard
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track top performers and see where you rank among the Aveyo sales team
          </p>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Year Filter */}
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => setYearFilter('all')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  yearFilter === 'all'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setYearFilter('current')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  yearFilter === 'current'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                2025 Only
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => setViewMode('completed')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  viewMode === 'completed'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Completed Projects
              </button>
              <button
                onClick={() => setViewMode('total')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  viewMode === 'total'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Total Projects
              </button>
              <button
                onClick={() => setViewMode('rate')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  viewMode === 'rate'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Completion Rate
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-400">Loading leaderboardData...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {leaderboardData.slice(0, 3).map((entry: LeaderboardEntry, index: number) => (
                  <div
                    key={entry.rep_id}
                    className={`relative p-6 rounded-xl border-2 ${
                      index === 0 
                        ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5' 
                        : index === 1
                        ? 'border-gray-400 bg-gradient-to-br from-gray-400/10 to-gray-500/5'
                        : 'border-amber-600 bg-gradient-to-br from-amber-600/10 to-amber-700/5'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{getRankIcon(index)}</div>
                      <h3 className="text-xl font-bold mb-1">{entry.rep_name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{entry.rep_email}</p>
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {getStatValue(entry)}
                      </div>
                      <p className="text-sm text-gray-300">{getStatLabel()}</p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Total</div>
                          <div className="font-semibold">{entry.total_projects}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Active</div>
                          <div className="font-semibold">{entry.active_projects}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rest of Leaderboard */}
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800 font-semibold text-sm">
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
                    className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="col-span-1 font-bold text-gray-400">
                      #{index + 4}
                    </div>
                    <div className="col-span-4">
                      <div className="font-semibold">{entry.rep_name}</div>
                      <div className="text-sm text-gray-400">{entry.rep_email}</div>
                    </div>
                    <div className="col-span-2 text-center font-bold text-blue-400">
                      {getStatValue(entry)}
                    </div>
                    <div className="col-span-2 text-center">
                      {entry.total_projects}
                    </div>
                    <div className="col-span-2 text-center">
                      {entry.active_projects}
                    </div>
                    <div className="col-span-1 text-center text-sm">
                      {entry.completion_rate}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-6 py-12 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Team Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {leaderboardData.length}
              </div>
              <div className="text-gray-300">Active Reps</div>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {leaderboardData.reduce((sum: number, entry: LeaderboardEntry) => sum + entry.completed_projects, 0)}
              </div>
              <div className="text-gray-300">Total Completed</div>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {leaderboardData.reduce((sum: number, entry: LeaderboardEntry) => sum + entry.active_projects, 0)}
              </div>
              <div className="text-gray-300">Active Projects</div>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {Math.round(leaderboardData.reduce((sum: number, entry: LeaderboardEntry) => sum + entry.completion_rate, 0) / leaderboardData.length)}%
              </div>
              <div className="text-gray-300">Avg Completion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
