'use client'
import React from 'react'
import { supabase } from '@/lib/supabase-browser'
import ProjectMilestoneCard from '@/components/projects/ProjectMilestoneCard'
import ProjectCard from '@/components/projects/ProjectCard'

export default function ProjectsPageContent() {
  const [selectedStage, setSelectedStage] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  type Project = {
    id: string
    imageUrl: string
    address: string
    lastUpdatedLabel: string
    stageLabel: 'Pre-Approval' | 'Approvals' | 'Construction' | 'Activation'
    nextMilestoneLabel: string
    createdAt: string // ISO date
  }

  const [projects, setProjects] = React.useState<Project[]>([])

  // Debug: log current user email in the browser console
  React.useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (!mounted) return
      if (error) {
        console.warn('[Projects] getUser error:', error.message)
      }
      console.log('[Projects] current user email:', user?.email ?? '(none)')
    })
    return () => {
      mounted = false
    }
  }, [])

  // Load projects from API (based on current user's rep_id)
  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/projects', { cache: 'no-store' })
        if (!res.ok) {
          const err = await res.json().catch(() => null)
          throw new Error(err?.details || err?.error || 'Failed to load projects')
        }
        const data = await res.json()
        if (!mounted) return
        // Map API records to UI shape with safe fallbacks
        const mapped: Project[] = (Array.isArray(data) ? data : []).map((r: any, idx: number) => {
          const fullAddress = `${r.raw_payload?.address ?? ''} ${r.raw_payload?.city ?? ''}, ${r.raw_payload?.state ?? ''}, ${r.raw_payload?.zip ?? ''}`.trim()
          const imageUrl = `/api/maps/snapshot?address=${encodeURIComponent(fullAddress)}&w=284&h=160&zoom=17`
          return {
          id: r.id ?? String(idx),
          imageUrl,
          address: fullAddress || 'Unknown Address',
          lastUpdatedLabel: r.updated_at ? `Last updated ${new Date(r.updated_at).toLocaleDateString()}` : '',
          stageLabel: (r.milestone || 'Pre-Approval') as Project['stageLabel'],
          nextMilestoneLabel: (() => {
            switch (r.milestone) {
              case 'Pre-Approval':
                return 'Approvals'
              case 'Approvals':
                return 'Construction'
              case 'Construction':
                return 'Final Stage'
              case 'Final Stage':
                return 'Complete'
              default:
                return '—'
            }
          })(),
          createdAt: r.created_at || new Date().toISOString(),
        }})
        console.log('data', data[0])
        setProjects(mapped)
      } catch (e: any) {
        console.error('Projects fetch error:', e)
        if (mounted) setError(e?.message || 'Failed to load projects')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const stages: { label: Project['stageLabel']; color: string }[] = [
    { label: 'Pre-Approval', color: '#f2c94c' },
    { label: 'Approvals', color: '#EF650F' },
    { label: 'Construction', color: '#61dafb' },
    { label: 'Activation', color: '#50fa7b' },
  ]

  // Counts by stage (no MTD/YTD filtering)
  const stageCounts = stages.reduce<Record<string, number>>((acc, s) => {
    acc[s.label] = projects.filter((p) => p.stageLabel === s.label).length
    return acc
  }, {})

  // Filtered project list (by selected stage only)
  const filtered = projects.filter((p) => !selectedStage || p.stageLabel === selectedStage)

  return (
    <>
      {/* Top area: milestone summary grid */}
      <section className="pb-6">
        <div className="flex flex-row">

          {/* Milestones grid */}
          <div className="w-full flex flex-row gap-[14px]">
            <div className="flex flex-col md:flex-row gap-[14px] w-full">
              {stages.map((s) => (
                <ProjectMilestoneCard
                  key={s.label}
                  label={s.label}
                  value={stageCounts[s.label] ?? 0}
                  dotColor={s.color}
                  active={selectedStage === s.label}
                  onClick={() => setSelectedStage((prev) => (prev === s.label ? null : s.label))}
                  className='w-full'
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Projects list (filtered by selected stage) */}
      <section className="pb-10">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-gray-400">Loading projects...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-40 text-red-400">{error}</div>
        ) : (
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
        )}
      </section>
    </>
  )
}
