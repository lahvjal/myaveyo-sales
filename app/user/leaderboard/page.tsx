"use client"

import { useState, useEffect } from "react"
import { fetchLeaderboardFull, LeaderboardEntry, LeaderboardStats } from "@/lib/client/leaderboard"
import AdminLayout from "@/components/admin/AdminLayout"

// Helper functions copied from public leaderboard for consistent formatting
const formatPoints = (points: number): string => {
  if (points >= 1000) return `${(points / 1000).toFixed(1)}K`
  return points.toString()
}

const formatRoleLabel = (role: string): string => {
  switch (role) {
    case "closer":
      return "Closer"
    case "setter":
      return "Setter"
    case "all":
      return "All Roles"
    default:
      return role
  }
}

const formatTimeLabel = (time: string): string => {
  switch (time) {
    case "ytd":
      return "Year to Date"
    case "mtd":
      return "Month to Date"
    default:
      return time
  }
}

// Uses shared client types

export default function AdminLeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [totalStats, setTotalStats] = useState<LeaderboardStats>({ totalReps: 0, totalTSS: 0, totalTSI: 0, avgTSS: 0 })
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<"all" | "closer" | "setter">("all")
  const [timeFilter, setTimeFilter] = useState<"ytd" | "mtd">("ytd")
  const [metricFilter, setMetricFilter] = useState<"tsi" | "tss">("tsi")
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const { leaderboard, totalStats } = await fetchLeaderboardFull({ role: roleFilter, time: timeFilter, metric: metricFilter })
      setLeaderboardData(leaderboard)
      setTotalStats(totalStats)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      setLeaderboardData([])
      setTotalStats({ totalReps: 0, totalTSS: 0, totalTSI: 0, avgTSS: 0 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (mounted) fetchLeaderboard()
  }, [roleFilter, timeFilter, metricFilter, mounted])

  const filteredData = leaderboardData.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  // Keep global ranking order when filtering so ranks remain accurate
  const filteredDataSorted = [...filteredData].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  const getRankIconFromRank = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  const getTSSValue = (entry: LeaderboardEntry) => formatPoints(entry.tss)
  const getTSIValue = (entry: LeaderboardEntry) => formatPoints(entry.tsi)

  return (
    <AdminLayout pageKey="leaderboard" topBarTitle="Leaderboard" topBarTabs={[]}> 
      <div className="bg-[#0d0d0d] min-h-screen">
        <div className="px-6 md:px-10 py-8">
          <div className="max-w-[1480px] mx-auto">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center mb-10 gap-4">
              {/* Role Filter */}
              <div className="flex bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
                {(["all", "closer", "setter"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                      roleFilter === r ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/10"
                    }`}
                  >
                    {formatRoleLabel(r)}
                  </button>
                ))}
              </div>

              {/* Time Filter */}
              <div className="flex bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
                {(["ytd", "mtd"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                      timeFilter === t ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/10"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Metric Filter */}
              <div className="flex bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
                {(["tsi", "tss"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetricFilter(m)}
                    className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                      metricFilter === m ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/10"
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="w-full md:w-auto">
                <div className="flex items-center gap-2 bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] px-3 py-2 w-full md:w-[320px]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reps by name"
                    className="bg-transparent outline-none text-white placeholder:text-white/60 w-full"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-white/70 hover:text-white text-sm px-2"
                      aria-label="Clear search"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <div className="text-white text-xl font-telegraf">No results</div>
                <div className="text-white/60">Try a different name or clear the search</div>
              </div>
            ) : (
              <div className="grid gap-6 mb-[60px]">
                {/* Top 3 Podium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                  {filteredDataSorted.slice(0, 3).map((entry: LeaderboardEntry) => (
                    <div key={entry.name} className="bg-gradient-to-t from-[#0d0d0d] to-[#171717] rounded-[3px] h-[180px] relative flex items-start justify-between overflow-clip">
                      <div
                        className={`bg-gradient-to-b h-full w-[59px] flex flex-col items-center justify-center gap-[15px] ${
                          entry.rank === 1
                            ? "from-[#514629] to-[#342e22]"
                            : entry.rank === 2
                            ? "from-[#4a4a4a] to-[#2a2a2a]"
                            : entry.rank === 3
                            ? "from-[#5d4037] to-[#3e2723]"
                            : "from-[#232323] to-[#171717]"
                        }`}
                      >
                        <div className="text-2xl">{entry.rank === 1 || entry.rank === 2 || entry.rank === 3 ? getRankIconFromRank(entry.rank ?? 0) : ''}</div>
                        <div className="text-white text-[14px] font-telegraf font-black">#{entry.rank}</div>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-[10px] px-2 grow h-full">
                        <div className="text-white text-[25px] font-telegraf font-black">{entry.name}</div>
                        <div className="flex items-center gap-[10px]">
                          <div className="text-white text-[17px] font-telegraf font-black">{getTSIValue(entry)}</div>
                          <div className="text-[rgba(255,255,255,0.5)] text-[17px] font-telegraf font-light">TSI</div>
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <div className="text-[rgba(255,255,255,0.5)] text-[17px] font-telegraf font-light">{getTSSValue(entry)}</div>
                          <div className="text-[rgba(255,255,255,0.5)] text-[17px] font-telegraf font-light">TSS</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rest */}
                <div className="overflow-hidden flex flex-col gap-[5px]">
                  <div className="grid gap-4 p-6 rounded-[3px]" style={{ gridTemplateColumns: "80px 1fr 1fr 1fr" }}>
                    <div className="text-[18px] font-telegraf font-light text-[rgba(255,255,255,0.5)]">Rank</div>
                    <div className="text-[18px] font-telegraf font-light text-[rgba(255,255,255,0.5)]">Sales Rep</div>
                    <div className="text-[18px] font-telegraf font-light text-[rgba(255,255,255,0.5)] flex justify-center">TSI</div>
                    <div className="text-[18px] font-telegraf font-light text-[rgba(255,255,255,0.5)] flex justify-center">TSS</div>
                  </div>

                  {filteredDataSorted.slice(3).map((entry) => (
                    <div
                      key={`${entry.name}-${entry.rank}`}
                      className="grid gap-4 p-6 hover:bg-white/5 transition-colors bg-[rgb(16,16,16)] rounded-[3px]"
                      style={{ gridTemplateColumns: "80px 1fr 1fr 1fr" }}
                    >
                      <div className="flex items-center">
                        <span className="text-white text-[18px] font-telegraf font-bold">{getRankIconFromRank(entry.rank ?? 0)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-[16px] font-telegraf font-semibold">{entry.name}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-white text-[18px] font-telegraf font-bold">{getTSIValue(entry)}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-[18px] font-telegraf font-light text-[rgba(255,255,255,0.5)]">{getTSSValue(entry)}</span>
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
                    <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-[42px]">Team Performance.</h2>
                  </div>
                  <div className="text-white text-[16px] font-telegraf md:max-w-[520px]">
                    <p>
                      Real-time performance metrics from all sales reps.
                      <br />These numbers represent our collective success.
                    </p>
                  </div>
                </div>
                <div className="text-[rgba(255,255,255,0.4)] text-[16px] font-telegraf font-extrabold">_{new Date().getFullYear()}</div>
              </div>

              <div className="grid md:grid-cols-4 gap-5">
                <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] h-[205px] rounded-[3px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-[70px] font-telegraf font-black leading-none">{totalStats.totalReps}</div>
                    <p className="text-[#888d95] text-[14px] font-telegraf">Total Reps</p>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] h-[205px] rounded-[3px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-[70px] font-telegraf font-black leading-none">{totalStats.totalTSS.toLocaleString()}</div>
                    <p className="text-[#888d95] text-[14px] font-telegraf">Total TSS</p>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] h-[205px] rounded-[3px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-[70px] font-telegraf font-black leading-none">{totalStats.totalTSI.toLocaleString()}</div>
                    <p className="text-[#888d95] text-[14px] font-telegraf">Total TSI</p>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] h-[205px] rounded-[3px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-[70px] font-telegraf font-black leading-none">{totalStats.avgTSS}</div>
                    <p className="text-[#888d95] text-[14px] font-telegraf">Average TSS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
