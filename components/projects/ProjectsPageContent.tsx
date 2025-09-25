'use client'
import React from 'react'
import PeriodToggleVertical, { Period } from '@/components/projects/PeriodToggleVertical'
import ProjectMilestoneCard from '@/components/projects/ProjectMilestoneCard'
import ProjectCard from '@/components/projects/ProjectCard'

export default function ProjectsPageContent() {
  const [period, setPeriod] = React.useState<Period>('YTD')
  const [selectedStage, setSelectedStage] = React.useState<string | null>(null)

  type Project = {
    id: string
    imageUrl: string
    address: string
    lastUpdatedLabel: string
    stageLabel: 'Pre-Approval' | 'Approval' | 'Construction' | 'Activation'
    nextMilestoneLabel: string
    createdAt: string // ISO date
  }

  // Mock data with varying stages and createdAt dates
  const projects: Project[] = [
    {
      id: '1',
      imageUrl: 'https://placehold.co/284x160?text=Map',
      address: '2056 N 3830 W Lehi UT',
      lastUpdatedLabel: 'Last updated 1 week ago',
      stageLabel: 'Pre-Approval',
      nextMilestoneLabel: 'Install Substantial Completion',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      imageUrl: 'https://placehold.co/284x160?text=Map',
      address: '456 N 3830 W Lehi UT',
      lastUpdatedLabel: 'Last updated 1 week ago',
      stageLabel: 'Approval',
      nextMilestoneLabel: 'Install Substantial Completion',
      createdAt: new Date(new Date().getFullYear(), 0, 15).toISOString(), // mid Jan (YTD)
    },
    {
      id: '3',
      imageUrl: 'https://placehold.co/284x160?text=Map',
      address: '998 N 3830 W Lehi UT',
      lastUpdatedLabel: 'Last updated 1 week ago',
      stageLabel: 'Construction',
      nextMilestoneLabel: 'Install Substantial Completion',
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString(), // early MTD
    },
    {
      id: '4',
      imageUrl: 'https://placehold.co/284x160?text=Map',
      address: '2056 N 3830 W Lehi UT',
      lastUpdatedLabel: 'Last updated 1 week ago',
      stageLabel: 'Activation',
      nextMilestoneLabel: 'Closeout',
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth()-1, 20).toISOString(), // last month
    },
    {
      id: '5',
      imageUrl: 'https://placehold.co/284x160?text=Map',
      address: '456 N 3830 W Lehi UT',
      lastUpdatedLabel: 'Last updated 1 week ago',
      stageLabel: 'Pre-Approval',
      nextMilestoneLabel: 'Approval',
      createdAt: new Date(new Date().getFullYear(), 5, 1).toISOString(), // June (YTD)
    },
    {
      id: '6',
      imageUrl: 'https://placehold.co/284x160?text=Map',
      address: '998 N 3830 W Lehi UT',
      lastUpdatedLabel: 'Last updated 1 week ago',
      stageLabel: 'Construction',
      nextMilestoneLabel: 'Activation',
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(), // MTD
    },
  ]

  const stages: { label: Project['stageLabel']; color: string }[] = [
    { label: 'Pre-Approval', color: '#f2c94c' },
    { label: 'Approval', color: '#f2c94c' },
    { label: 'Construction', color: '#61dafb' },
    { label: 'Activation', color: '#50fa7b' },
  ]

  // Compute period range
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const start = period === 'YTD' ? startOfYear : startOfMonth

  const withinPeriod = (d: string) => {
    const date = new Date(d)
    return date >= start && date <= now
  }

  // Counts by stage for current period
  const stageCounts = stages.reduce<Record<string, number>>((acc, s) => {
    acc[s.label] = projects.filter((p) => p.stageLabel === s.label && withinPeriod(p.createdAt)).length
    return acc
  }, {})

  // Filtered project list
  const filtered = projects.filter((p) => withinPeriod(p.createdAt) && (!selectedStage || p.stageLabel === selectedStage))

  const sub = period

  return (
    <>
      {/* Top area: toggle + milestone summary grid */}
      <section className="px-6 py-6">
        <div className="flex flex-row">

          {/* Milestones grid */}
          <div className="w-full flex flex-row gap-[14px]">
            <PeriodToggleVertical value={period} onChange={setPeriod} />
            <div className="flex flex-row gap-[14px] w-full">
              {stages.map((s) => (
                <ProjectMilestoneCard
                  key={s.label}
                  label={s.label}
                  value={stageCounts[s.label] ?? 0}
                  dotColor={s.color}
                  sublabel={sub}
                  active={selectedStage === s.label}
                  onClick={() => setSelectedStage((prev) => (prev === s.label ? null : s.label))}
                  className='w-full'
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Projects list (filtered by period and selected stage) */}
      <section className="px-6 pb-10">
        <div className="space-y-4">
        {filtered.map((p) => (
            <ProjectCard
            key={p.id}
            imageUrl={p.imageUrl}
            address={p.address}
            lastUpdatedLabel={p.lastUpdatedLabel}
            stageLabel={p.stageLabel}
            nextMilestoneLabel={p.nextMilestoneLabel}
            />
        ))}
        </div>
      </section>
    </>
  )
}
