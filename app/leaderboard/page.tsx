'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'

// Helper functions moved inline to avoid server-side imports
const formatPoints = (points: number): string => {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`
  }
  return points.toString()
}

const formatRoleLabel = (role: string): string => {
  switch (role) {
    case 'closer': return 'Closer'
    case 'setter': return 'Setter'
    case 'all': return 'All Roles'
    default: return role
  }
}

const formatTimeLabel = (time: string): string => {
  switch (time) {
    case 'ytd': return 'Year to Date'
    case 'mtd': return 'Month to Date'
    default: return time
  }
}

interface LeaderboardEntry {
  rank: number
  name: string
  tss: number // Total Solar Sold (points from sold projects)
  tsi: number // Total Solar Installed (points from installed projects)
  role?: 'all' | 'closer' | 'setter'
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [totalStats, setTotalStats] = useState({
    totalReps: 0,
    totalTSS: 0,
    totalTSI: 0,
    avgTSS: 0
  })
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<'all' | 'closer' | 'setter'>('all')
  const [timeFilter, setTimeFilter] = useState<'ytd' | 'mtd'>('ytd')
  const [mounted, setMounted] = useState(false)
  

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/leaderboard?role=${roleFilter}&time=${timeFilter}`)
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data')
      }
      
      const data = await response.json()
      
      // Handle new API response structure
      if (data.leaderboard && data.totalStats) {
        setLeaderboardData(data.leaderboard || [])
        setTotalStats(data.totalStats)
      } else {
        // Fallback for old API structure
        setLeaderboardData(data || [])
        setTotalStats({
          totalReps: data?.length || 0,
          totalTSS: data?.reduce((sum: number, entry: LeaderboardEntry) => sum + entry.tss, 0) || 0,
          totalTSI: data?.reduce((sum: number, entry: LeaderboardEntry) => sum + entry.tsi, 0) || 0,
          avgTSS: Math.round((data?.reduce((sum: number, entry: LeaderboardEntry) => sum + entry.tss, 0) || 0) / (data?.length || 1))
        })
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      // Set fallback data if API fails
      setLeaderboardData([])
      setTotalStats({ totalReps: 0, totalTSS: 0, totalTSI: 0, avgTSS: 0 })
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
  }, [roleFilter, timeFilter, mounted])

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

  const getTSSValue = (entry: LeaderboardEntry) => {
    return formatPoints(entry.tss)
  }

  const getTSIValue = (entry: LeaderboardEntry) => {
    return formatPoints(entry.tsi)
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
          <div className='flex items-center justify-center mb-[50px] gap-[30px]'>

            {/* Role Filter */}
            <div className="flex justify-center">
              <div className="flex bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
                <button
                  onClick={() => setRoleFilter('all')}
                  className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                    roleFilter === 'all'
                      ? 'bg-white text-black'
                      : 'bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setRoleFilter('closer')}
                  className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                    roleFilter === 'closer'
                      ? 'bg-white text-black'
                      : 'bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  Closer
                </button>
                <button
                  onClick={() => setRoleFilter('setter')}
                  className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                    roleFilter === 'setter'
                      ? 'bg-white text-black'
                      : 'bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  Setter
                </button>
              </div>
            </div>

            {/* Time Period Filter */}
            <div className="flex justify-center">
              <div className="flex bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
                <button
                  onClick={() => setTimeFilter('ytd')}
                  className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                    timeFilter === 'ytd'
                      ? 'bg-white text-black'
                      : 'bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  YTD
                </button>
                <button
                  onClick={() => setTimeFilter('mtd')}
                  className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                    timeFilter === 'mtd'
                      ? 'bg-white text-black'
                      : 'bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  MTD
                </button>
              </div>
            </div>

          </div>
          {/* Leaderboard */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="grid gap-6 mb-[100px]">
              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                {leaderboardData.slice(0, 3).map((entry: LeaderboardEntry, index: number) => (
                  <div
                    key={entry.name}
                    className="bg-gradient-to-t flex from-[#0d0d0d] items-start justify-between overflow-clip relative rounded-[3px] h-[180px] to-[#171717]"
                  >
                    {/* Left sidebar with rank */}
                    <div className={`bg-gradient-to-b flex flex-col gap-[15px] h-full items-center justify-center relative shrink-0 w-[59px] ${
                      index === 0 
                        ? 'from-[#514629] to-[#342e22]' 
                        : index === 1
                        ? 'from-[#4a4a4a] to-[#2a2a2a]'
                        : 'from-[#5d4037] to-[#3e2723]'
                    }`}>
                      {/* Crown/Medal Icon */}
                      <div className="h-[25.783px] relative shrink-0 w-5">
                        <div className="text-2xl">
                          {index === 0 ? "👑" : index === 1 ? "🥈" : "🥉"}
                        </div>
                      </div>
                      {/* Rank Number */}
                      <div className="font-telegraf font-black leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
                        #{index + 1}
                      </div>
                    </div>
                    
                    {/* Main content area */}
                    <div className="basis-0 flex flex-col gap-[15px] grow h-full items-center justify-center min-h-px min-w-px relative shrink-0">
                      {/* Player Name */}
                      <div className="font-telegraf font-black leading-[0] not-italic relative shrink-0 text-[25px] text-nowrap text-white text-center px-2 mb-[15px]">
                        {entry.name}
                      </div>
                      
                      {/* TSI Score */}
                      <div className="flex gap-[15px] items-center justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-nowrap mb-[10px]">
                        <div className="font-telegraf font-black relative shrink-0 text-white">
                          {getTSIValue(entry)}
                        </div>
                        <div className="font-telegraf font-light relative shrink-0 text-[rgba(255,255,255,0.5)]">
                          TSI
                        </div>
                      </div>
                      
                      {/* TSS Score */}
                      <div className="flex font-telegraf font-light gap-[15px] items-center justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-[rgba(255,255,255,0.5)] text-nowrap mb-[10px]">
                        <div className="relative shrink-0">
                          {getTSSValue(entry)}
                        </div>
                        <div className="relative shrink-0">
                          TSS
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rest of Leaderboard */}
              <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] overflow-hidden">
                {/* Header Row */}
                <div className="grid gap-4 p-6 bg-gradient-to-b from-[#232323] to-[#171717] border-b border-[#333]" style={{gridTemplateColumns: '80px 1fr 1fr 1fr'}}>
                  <div className="text-white/60 text-[14px] font-inter font-semibold">Rank</div>
                  <div className="text-white/60 text-[14px] font-inter font-semibold">Sales Rep</div>
                  <div className="text-white/60 text-[14px] font-inter font-semibold flex justify-center">TSI</div>
                  <div className="text-white/60 text-[14px] font-inter font-semibold flex justify-center">TSS</div>
                  
                </div>

                {/* Leaderboard Entries */}
                {leaderboardData.slice(3).map((entry, index) => (
                  <div 
                    key={`${entry.name}-${index}`} 
                    className="grid gap-4 p-6 border-b border-[#333] hover:bg-white/5 transition-colors"
                    style={{gridTemplateColumns: '80px 1fr 1fr 1fr'}}
                  >
                    {/* Rank */}
                    <div className="flex items-center">
                      <span className="text-white text-[18px] font-inter font-bold">
                        {getRankIcon(index + 3)}
                      </span>
                    </div>
                    {/* Sales Rep */}
                    <div className="flex flex-col">
                      <span className="text-white text-[16px] font-inter font-semibold">
                        {entry.name}
                      </span>
                    </div>

                    {/* TSI Value */}
                    <div className="flex items-center justify-center">
                      <span className="text-white text-[18px] font-inter font-bold">
                        {getTSIValue(entry)}
                      </span>
                    </div>

                    {/* TSS Value */}
                    <div className="flex items-center justify-center">
                      <span className="text-[18px] font-inter font-light text-[rgba(255,255,255,0.5)]">
                        {getTSSValue(entry)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Performance Summary */}
          <div className="mb-8">
            <div className="flex items-end justify-between mb-8">
              <div className="flex flex-col items-start gap-2.5 text-white">
                <div className="flex items-start gap-2.5 text-white">
                  <span className="text-[16px] font-telegraf">(2)</span>
                  <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-[42px]">
                    Team Performance.
                  </h2>
                </div>
                <div className="text-white text-[16px] font-telegraf pl-[30px] pr-[330px]">
                  <p>
                    Real-time performance metrics from all sales reps.
                    <br />
                    These numbers represent our collective success.
                  </p>
                </div>
              </div>
              <div className="text-[rgba(255,255,255,0.4)] text-[16px] font-telegraf font-extrabold">
                _{new Date().getFullYear()}
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex-1 bg-gradient-to-b from-[#171717] to-[#0d0d0d] h-[205px] rounded-[3px] relative">
                <div className="flex flex-col items-center justify-center h-full p-5">
                  <div className="flex items-start justify-center gap-[7px] mb-[15px]">
                    <span className="text-white text-[70px] font-telegraf font-black leading-none">
                      {totalStats.totalReps}
                    </span>
                  </div>
                  <p className="text-[#888d95] text-[14px] font-telegraf text-center">
                    Total Reps
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-gradient-to-b from-[#171717] to-[#0d0d0d] h-[205px] rounded-[3px] relative">
                <div className="flex flex-col items-center justify-center h-full p-5">
                  <div className="flex items-start justify-center gap-[7px] mb-[15px]">
                    <span className="text-white text-[70px] font-telegraf font-black leading-none">
                      {totalStats.totalTSS.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[#888d95] text-[14px] font-telegraf text-center">
                    Total TSS
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-gradient-to-b from-[#171717] to-[#0d0d0d] h-[205px] rounded-[3px] relative">
                <div className="flex flex-col items-center justify-center h-full p-5">
                  <div className="flex items-start justify-center gap-[7px] mb-[15px]">
                    <span className="text-white text-[70px] font-telegraf font-black leading-none">
                      {totalStats.totalTSI.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[#888d95] text-[14px] font-telegraf text-center">
                    Total TSI
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-gradient-to-b from-[#171717] to-[#0d0d0d] h-[205px] rounded-[3px] relative">
                <div className="flex flex-col items-center justify-center h-full p-5">
                  <div className="flex items-start justify-center gap-[7px] mb-[15px]">
                    <span className="text-white text-[70px] font-telegraf font-black leading-none">
                      {totalStats.avgTSS}
                    </span>
                  </div>
                  <p className="text-[#888d95] text-[14px] font-telegraf text-center">
                    Average TSS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
