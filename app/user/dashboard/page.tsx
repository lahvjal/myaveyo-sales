"use client"

import React, { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { supabase } from '@/lib/supabase-browser'
import Link from "next/link"
import Button from "@/components/Button"
import ProjectMilestoneCard from "@/components/projects/ProjectMilestoneCard"
import Top3Card from "@/components/leaderboard/Top3Card"
import { fetchTopLeaders, LeaderboardEntry } from "@/lib/client/leaderboard"
import UserRankRow from "@/components/leaderboard/UserRankRow"
import IncentiveCard from "@/components/incentives/IncentiveCard"



type Incentive = {
  id: string
  title: string
  description?: string
  background_image_url: string
  background_video_url?: string
  live_status: 'coming_up' | 'live' | 'done'
  category: string
  category_color: string
  start_date: string
  end_date: string
  sort_order: number
}

function SectionHeader({ title, actionLabel, actionHref }: { title: string; actionLabel?: string; actionHref?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-white font-semibold tracking-tight">{title}</h2>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" className="!rounded-[3px]">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  )
}

function KpiCard({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="bg-[#111111] rounded-[8px] border border-[#262626] p-5">
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-4 text-white text-3xl font-bold">{value}</div>
      <div className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">YTD</div>
    </div>
  )
}

function MedalCard({ place, name, tsi, tss, tone }: { place: 1 | 2 | 3; name: string; tsi: number; tss: number; tone: string }) {
  const medal: Record<1 | 2 | 3, string> = { 1: "🥇", 2: "🥈", 3: "🥉" }
  return (
    <div className="bg-[#151515] rounded-[8px] border border-[#2a2a2a] p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-16 rounded-sm flex items-center justify-center text-2xl" style={{ background: tone }}>{medal[place]}</div>
        <div className="flex-1">
          <div className="text-white font-semibold">{name}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            <span className="text-white text-base font-bold mr-1">{tsi}</span>TSI
            <span className="ml-4 text-gray-300">{tss}</span>
            <span className="ml-1">TSS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [loadingIncentives, setLoadingIncentives] = useState(true)
  const [incentivesError, setIncentivesError] = useState<string | null>(null)
  const [projLoading, setProjLoading] = useState(true)
  const [projError, setProjError] = useState<string | null>(null)
  const [projCounts, setProjCounts] = useState({
    preApproval: 0,
    approvals: 0,
    construction: 0,
    activation: 0,
  })
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
  const [leadersLoading, setLeadersLoading] = useState(true)
  const [leadersError, setLeadersError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string>('')

  useEffect(() => {
    let mounted = true
    const loadMe = async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' })
        if (!res.ok) return
        const me = await res.json()
        const first: string = me?.firstName || ''
        if (mounted) setFirstName(first)
      } catch {}
    }
    loadMe()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadMe()
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchIncentives = async () => {
      try {
        setLoadingIncentives(true)
        const res = await fetch('/api/incentives')
        if (!res.ok) throw new Error('Failed to fetch incentives')
        const data = await res.json()
        setIncentives(Array.isArray(data) ? data : [])
      } catch (e: any) {
        console.error('Dashboard incentives fetch error:', e)
        setIncentivesError(e?.message || 'Failed to load incentives')
      } finally {
        setLoadingIncentives(false)
      }
    }
    fetchIncentives()
  }, [])

  // Load leaderboard top 3 from API (shared helper)
  useEffect(() => {
    const loadLeaders = async () => {
      try {
        setLeadersLoading(true)
        setLeadersError(null)
        const top3 = await fetchTopLeaders({ role: 'all', time: 'ytd', metric: 'tsi', limit: 3 })
        setLeaders(top3)
      } catch (e: any) {
        console.error('Dashboard leaderboard fetch error:', e)
        setLeadersError(e?.message || 'Failed to load leaderboard')
      } finally {
        setLeadersLoading(false)
      }
    }
    loadLeaders()
  }, [])

  // Load current user's projects and compute counts by stage
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjLoading(true)
        setProjError(null)
        const res = await fetch('/api/projects', { cache: 'no-store' })
        if (!res.ok) {
          const err = await res.json().catch(() => null)
          throw new Error(err?.details || err?.error || 'Failed to load projects')
        }
        const data = await res.json()
        const items: any[] = Array.isArray(data) ? data : []
        // Normalize stage from dataset; DB uses 'Approvals'
        const getStage = (r: any): string => r?.milestone || r?.stage_label || r?.stage || ''
        const counts = items.reduce(
          (acc, r) => {
            const s = String(getStage(r))
            if (s === 'Pre-Approval') acc.preApproval += 1
            else if (s === 'Approvals' || s === 'Approval') acc.approvals += 1
            else if (s === 'Construction') acc.construction += 1
            else if (s === 'Activation' || s === 'Final Stage' || s === 'Complete') acc.activation += 1
            return acc
          },
          { preApproval: 0, approvals: 0, construction: 0, activation: 0 }
        )
        setProjCounts(counts)
      } catch (e: any) {
        console.error('Dashboard projects fetch error:', e)
        setProjError(e?.message || 'Failed to load projects')
      } finally {
        setProjLoading(false)
      }
    }
    loadProjects()
  }, [])

  return (
    <AdminLayout pageKey="dashboard">
      <div className="min-h-screen bg-[#0b0b0b] px-6 md:px-8 py-8">
        <div className="max-w-[1480px] mx-auto">
          <h1 className="text-6xl font-telegraf font-bold mb-4">
            Welcome{firstName ? `, ${firstName}` : ', Bro'}
          </h1>
          {/* <p className="text-gray-400 text-lg">
            Management the CMS and applications submitted from the website.
          </p> */}
          {/* My Projects */}
          <div className="mb-20 flex flex-col gap-[20px]">
            <SectionHeader title="My Projects" actionLabel="See Projects" actionHref="/user/projects" />
            {projLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="relative min-h-[180px] rounded-[3px] bg-[#111111] overflow-hidden skeleton">
                    
                  </div>
                ))}
              </div>
            ) : projError ? (
              <div className="flex items-center justify-center h-24 text-red-400">{projError}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ProjectMilestoneCard label="Pre-Approval" value={projCounts.preApproval} dotColor="#f2c94c" />
                <ProjectMilestoneCard label="Approvals" value={projCounts.approvals} dotColor="#EF650F" />
                <ProjectMilestoneCard label="Construction" value={projCounts.construction} dotColor="#61dafb" />
                <ProjectMilestoneCard label="Activation" value={projCounts.activation} dotColor="#50fa7b" />
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="mb-20 flex flex-col gap-[20px]">
            <SectionHeader title="Leaderboard" actionLabel="View Leaderboard" actionHref="/user/leaderboard" />
            {/* Current user rank row */}
            {/* <UserRankRow rank={67} name="Johnny Ives" tsi={164} tss={286} withLabels/> */}
            {/* Top 3 */}
            {leadersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="bg-gradient-to-t from-[#0d0d0d] to-[#171717] rounded-[3px] h-[180px] relative flex items-start justify-between overflow-clip skeleton">
                  </div>
                ))}
              </div>
            ) : leadersError ? (
              <div className="text-red-400">{leadersError}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {leaders.length === 0 ? (
                  <div className="text-gray-400">No leaderboard data</div>
                ) : leaders.map((p, idx) => (
                  <Top3Card key={`${p.name}-${idx}`} rank={(idx + 1) as 1 | 2 | 3} name={p.name} tsi={p.tsi} tss={p.tss} />
                ))}
              </div>
            )}
            
          </div>

          {/* Incentives */}
          <div className="mb-20 flex flex-col gap-[20px]">
            <SectionHeader title="Incentives" actionLabel="View All Incentives" actionHref="/user/incentives" />
            {loadingIncentives ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx}
        className="rounded-[3px] relative h-full min-h-[600px] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 skeleton">
                  </div>
                ))}
              </div>
            ) : incentivesError ? (
              <div className="flex justify-center items-center h-[220px] text-red-400">{incentivesError}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {incentives
                  .sort((a, b) => {
                    // 1) Live first
                    const liveRank = (s: Incentive['live_status']) => (s === 'live' ? 0 : s === 'coming_up' ? 1 : 2)
                    const liveCmp = liveRank(a.live_status) - liveRank(b.live_status)
                    if (liveCmp !== 0) return liveCmp

                    // 2) Category priority: Yearly (0), Summer (1), others (2)
                    const catRank = (c: string) => {
                      const v = c?.toLowerCase()
                      if (v === 'yearly') return 0
                      if (v === 'summer') return 1
                      return 2
                    }
                    const catCmp = catRank(a.category) - catRank(b.category)
                    if (catCmp !== 0) return catCmp

                    // 3) sort_order ascending as tiebreaker
                    return a.sort_order - b.sort_order
                  })
                  .slice(0, 3)
                  .map((inc) => (
                    <IncentiveCard
                      key={inc.id}
                      title={inc.title}
                      backgroundImage={inc.background_image_url}
                      backgroundVideo={inc.background_video_url}
                      liveStatus={inc.live_status}
                      category={inc.category}
                      categoryColor={inc.category_color}
                      startDate={inc.start_date}
                      endDate={inc.end_date}
                      variant="detailed"
                      onViewClick={() => (window.location.href = `/user/incentives/${inc.id}`)}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* EDU Progress */}
          <div className="mb-20 flex flex-col gap-[20px]">
            <SectionHeader title="EDU Progress" actionLabel="Go To EDU" actionHref="/user/edu" />
            <div className="rounded-[8px] border border-[#2a2a2a] bg-[#111111] h-[220px] flex items-center justify-center text-gray-500 text-sm">
              COMING SOON
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
