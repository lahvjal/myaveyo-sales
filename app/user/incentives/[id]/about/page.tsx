import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { calculateIncentiveStatus } from '@/lib/types/incentive'
import AdminLayout from '@/components/admin/AdminLayout'
import { getCategoryBadgeStyle, getStatusBadgeClasses } from '@/lib/ui/badges'

interface PageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'

type Incentive = {
  id: string
  title: string
  description: string
  category: string
  category_color: string
  live_status: 'coming_up' | 'live' | 'done'
  background_image_url?: string
  background_video_url?: string
  start_date: string
  end_date: string
  sort_order: number
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function getDaysText(incentive: Incentive) {
  const now = new Date()
  const start = new Date(incentive.start_date)
  const end = new Date(incentive.end_date)
  if (incentive.live_status === 'live') {
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft > 0 ? `${daysLeft} days left` : 'Last day'
  }
  if (incentive.live_status === 'coming_up') {
    const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil > 0 ? `${daysUntil} days until` : 'Starting soon'
  }
  return ''
}

export default async function IncentiveDetailPage({ params }: PageProps) {
  const { id } = params

  const { data: incentive, error } = await supabase
    .from('public_incentives')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !incentive) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white">
        <Navbar />
        <div className="max-w-[1200px] mx-auto px-[24px] md:px-[50px] py-16">
          <div className="text-white/70">Failed to load incentive.</div>
          <div className="mt-6">
            <Link href="/incentives" className="px-4 py-2 bg-white text-black rounded-[3px] font-semibold hover:bg-white/90">Back to incentives</Link>
          </div>
        </div>
      </div>
    )
  }

  // Dynamically recompute status from dates to ensure tag is current
  const status = calculateIncentiveStatus((incentive as Incentive).start_date, (incentive as Incentive).end_date)
  const effective = { ...(incentive as Incentive), live_status: status }
  const daysText = getDaysText(effective)
  return (
    <AdminLayout 
      pageKey="incentives"
      breadcrumbs={[
        { name: 'Incentives', href: '/user/incentives' },
        { name: effective.title }
      ]}
    >  
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="">
        {/* Full-bleed, full-height 2-col layout */}
        <div className="flex flex-col xl:grid xl:grid-cols-2 w-full xl:h-[100vh]">
          {/* Left: Poster / Video */}
          <div className="relative w-full h-[30vh] bg-black xl:h-full">
            {incentive.background_video_url ? (
              <video
                src={incentive.background_video_url}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : incentive.background_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={incentive.background_image_url}
                alt={incentive.title || 'Incentive media'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#232323] to-[#171717] flex items-center justify-center">
                <span className="text-white/60">No media</span>
              </div>
            )}
            
            {/* Title bottom overlay */}
            <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h1 className="font-telegraf text-3xl md:text-4xl font-extrabold uppercase">{effective.title}</h1>
            </div>
          </div>

          {/* Right: Description / Details */}
          <div className="w-full h-[auto] bg-[#0d0d0d] flex flex-col">

            {/* Scrollable content */}
            <div className="flex-1 overflow-auto p-[10vw]">
              <div className="space-y-8">
                {/* Dates and summary */}
                <div className="space-y-8">
                  <h2 className="font-telegraf text-6xl font-bold">{effective.title}</h2>
                  <div className="flex flex-row items-center justify-start gap-[12px]">
                    {/* Overlay badges */}
                    <div className="flex items-start justify-start gap-[12px]">
                      {/* Category badge (centralized) */}
                      <div className="flex items-center gap-2.5 px-[12px] py-[6px] rounded-[60px] shadow-lg" style={getCategoryBadgeStyle(effective.category, effective.category_color)}>
                        <span className="text-[13px] font-semibold text-black">{effective.category}</span>
                      </div>
                      {/* Status badge (centralized) */}
                      {(() => {
                        const s = getStatusBadgeClasses(effective.live_status)
                        return (
                          <div className={`flex items-center gap-2.5 px-[12px] py-[6px] rounded-[60px] shadow-lg ${s.container}`}>
                            <div className={`w-[7px] h-[7px] rounded-full ${s.dot}`} />
                            <span className={`text-[13px] font-semibold ${s.text}`}>
                              {effective.live_status === 'live' ? 'Live' : effective.live_status === 'coming_up' ? 'Coming Up' : 'Done'}
                            </span>
                          </div>
                        )
                      })()}
                    </div>
                    <div className="text-white/70 text-sm">
                      {formatDate(effective.start_date)} – {formatDate(effective.end_date)}
                      {daysText ? <span className="ml-2 text-white/50">({daysText})</span> : null}
                    </div>
                  </div>
                  
                  <p className="mt-1 text-white/85 leading-relaxed">
                    {effective.description || 'No description provided.'}
                  </p>
                </div>

                {/* Key Facts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-[3px] bg-[#121212] border border-[#1d1d1d] p-4">
                    <div className="text-white/60 text-xs">Status</div>
                    <div className="text-white font-semibold mt-1 capitalize">{effective.live_status.replace('_', ' ')}</div>
                  </div>
                  <div className="rounded-[3px] bg-[#121212] border border-[#1d1d1d] p-4">
                    <div className="text-white/60 text-xs">Category</div>
                    <div className="text-white font-semibold mt-1">{effective.category}</div>
                  </div>
                  <div className="rounded-[3px] bg-[#121212] border border-[#1d1d1d] p-4">
                    <div className="text-white/60 text-xs">Start</div>
                    <div className="text-white font-semibold mt-1">{formatDate(effective.start_date)}</div>
                  </div>
                  <div className="rounded-[3px] bg-[#121212] border border-[#1d1d1d] p-4">
                    <div className="text-white/60 text-xs">End</div>
                    <div className="text-white font-semibold mt-1">{formatDate(effective.end_date)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href={`/user/incentives`} className="px-4 py-2 bg-white text-black rounded-[3px] font-semibold hover:bg-white/90">Back to incentives</Link>
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
