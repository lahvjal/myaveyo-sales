"use client"

import React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import Link from "next/link"

function SectionHeader({ title, actionLabel, actionHref }: { title: string; actionLabel?: string; actionHref?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-white font-semibold tracking-tight">{title}</h2>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 text-[13px] px-3 py-2 rounded bg-white text-black hover:bg-gray-100"
        >
          {actionLabel}
          <span aria-hidden>→</span>
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

function IncentiveCard({ title, status, cadence, img }: { title: string; status: string; cadence: string; img: string }) {
  return (
    <div className="relative rounded-[8px] overflow-hidden border border-[#2a2a2a] bg-[#0f0f0f]">
      {/* image placeholder */}
      <div className="aspect-[3/4] w-full bg-[#0b0b0b] flex items-center justify-center text-gray-600 text-sm">
        <span>{title}</span>
      </div>
      <div className="absolute left-3 bottom-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-2 text-xs bg-black/80 text-white px-2 py-1 rounded-full">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full" /> {status}
        </span>
        <span className="text-xs bg-yellow-300/90 text-black px-2 py-1 rounded-full">{cadence}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AdminLayout
      pageKey="dashboard"
      topBarTitle="Dashboard"
      topBarIcon="/images/be4cc85f4c02771c35b4a1e613279641f6cf76e8.svg"
      topBarTabs={[]}
    >
      <div className="min-h-screen bg-[#0b0b0b] px-6 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* My Projects */}
          <SectionHeader title="My Projects" actionLabel="See Projects" actionHref="/projects" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard color="#f59e0b" label="Pre-Approval" value="10" />
            <KpiCard color="#ea580c" label="Approval" value="8" />
            <KpiCard color="#60a5fa" label="Construction" value="9" />
            <KpiCard color="#22c55e" label="Activation" value="18" />
          </div>

          {/* Leaderboard */}
          <SectionHeader title="Leaderboard" actionLabel="View Leaderboard" actionHref="/admin/leaderboard" />
          <div className="bg-gradient-to-b from-[#161616] to-[#101010] rounded-[8px] border border-[#2a2a2a] p-4 mb-4">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-white">#67</span>
                <span className="text-white font-semibold">Johnny Ives</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg mr-1">164</span>
                <span>TSI</span>
                <span className="ml-6 text-gray-300">286</span>
                <span className="ml-1">TSS</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <MedalCard place={1} name="Kadin Kutzke" tsi={164} tss={286} tone="#3b3428" />
            <MedalCard place={2} name="Austin Townsend" tsi={120} tss={230} tone="#2f3137" />
            <MedalCard place={3} name="Kadin Kutzke" tsi={90} tss={186} tone="#3a2c26" />
          </div>

          {/* Incentives */}
          <SectionHeader title="Incentives" actionLabel="View All Incentives" actionHref="/incentives" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <IncentiveCard title="SINK OR SWIM" status="Live" cadence="Yearly" img="" />
            <IncentiveCard title="King of the Kill" status="Live" cadence="Yearly" img="" />
            <IncentiveCard title="2025 ANNUAL TSI" status="Live" cadence="Yearly" img="" />
          </div>

          {/* EDU Progress */}
          <SectionHeader title="EDU Progress" actionLabel="Go To EDU" actionHref="/edu" />
          <div className="rounded-[8px] border border-[#2a2a2a] bg-[#111111] h-[220px] flex items-center justify-center text-gray-500 text-sm">
            COMING SOON
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
