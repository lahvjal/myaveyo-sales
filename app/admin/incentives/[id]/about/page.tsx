import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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

export default async function AdminIncentiveAboutPage({ params }: PageProps) {
  const { id } = params

  const { data: incentive, error } = await supabase
    .from('public_incentives')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !incentive) {
    const tabs = [
      { id: 'about', name: 'About', href: `/admin/incentives/${id}/about` },
      { id: 'leaderboard', name: 'Leaderboard', href: `/admin/incentives/${id}/leaderboard` }
    ]
    return (
      <AdminLayout pageKey="incentives" topBarTabs={tabs} activeTab="about">
        <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
          <div className="text-white/70">Failed to load incentive.</div>
        </div>
      </AdminLayout>
    )
  }

  const daysText = getDaysText(incentive as Incentive)
  const tabs = [
    { id: 'about', name: 'About', href: `/admin/incentives/${id}/about` },
    { id: 'leaderboard', name: 'Leaderboard', href: `/admin/incentives/${id}/leaderboard` }
  ]

  return (
    <AdminLayout pageKey="incentives" topBarTabs={tabs} activeTab="about">
      <div className="bg-[#0d0d0d] min-h-screen text-white">
        {/* Full-bleed, full-height 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-[100vh]">
          {/* Left: Poster / Video */}
          <div className="relative w-full h-full bg-black">
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
              <h1 className="font-telegraf text-3xl md:text-4xl font-extrabold uppercase">{incentive.title}</h1>
            </div>
          </div>

          {/* Right: Description / Details */}
          <div className="w-full h-full bg-[#0d0d0d] flex flex-col">

            {/* Scrollable content */}
            <div className="flex-1 overflow-auto p-[50px]">
              <div className="space-y-8">
                {/* Dates and summary */}
                <div className="space-y-2">
                  <div className="flex flex-row items-center justify-start gap-[12px]">
                    {/* Overlay badges */}
                    <div className="flex items-start justify-start gap-[12px]">
                      <div className="flex items-center gap-2.5 px-[12px] py-[6px] rounded-[60px] shadow-lg"
                          style={{ backgroundColor: incentive.category_color || '#ffffff' }}>
                        <span className="text-[13px] font-semibold text-black">{incentive.category}</span>
                      </div>
                      <div className={`flex items-center gap-2.5 px-[12px] py-[6px] rounded-[60px] shadow-lg ${
                        incentive.live_status === 'live' ? 'bg-white' : incentive.live_status === 'coming_up' ? 'bg-[#E7BF21]' : 'bg-[#959595]'
                      }`}>
                        <div className={`w-[7px] h-[7px] rounded-full ${
                          incentive.live_status === 'live' ? 'bg-red-500' : incentive.live_status === 'coming_up' ? 'bg-white' : 'bg-[#535353]'
                        }`} />
                        <span className="text-[13px] font-semibold text-black">
                          {incentive.live_status === 'live' ? 'Live' : incentive.live_status === 'coming_up' ? 'Coming Up' : 'Done'}
                        </span>
                      </div>
                    </div>
                    <div className="text-white/70 text-sm">
                      {formatDate(incentive.start_date)} – {formatDate(incentive.end_date)}
                      {daysText ? <span className="ml-2 text-white/50">({daysText})</span> : null}
                    </div>
                  </div>
                  <h2 className="font-telegraf text-2xl font-bold">{incentive.title}</h2>
                  <p className="mt-1 text-white/85 leading-relaxed">
                    {incentive.description || 'No description provided.'}
                  </p>
                </div>

                {/* Key Facts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-[3px] bg-[#121212] border border-[#1d1d1d] p-4">
                    <div className="text-white/60 text-xs">Status</div>
                    <div className="text-white font-semibold mt-1 capitalize">{incentive.live_status.replace('_', ' ')}</div>
                  </div>
                  <div className="rounded-[3px] bg-[#121212] border border-[#1d1d1d] p-4">
                    <div className="text-white/60 text-xs">Category</div>
                    <div className="text-white font-semibold mt-1">{incentive.category}</div>
                  </div>
                  <div className="rounded-[3px] bg-[#121212] border border-[#1d1d1d] p-4">
                    <div className="text-white/60 text-xs">Start</div>
                    <div className="text-white font-semibold mt-1">{formatDate(incentive.start_date)}</div>
                  </div>
                  <div className="rounded-[3px] bg-[#121212] border border-[#1d1d1d] p-4">
                    <div className="text-white/60 text-xs">End</div>
                    <div className="text-white font-semibold mt-1">{formatDate(incentive.end_date)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href={`/admin/incentives`} className="px-4 py-2 bg-white text-black rounded-[3px] font-semibold hover:bg-white/90">
                    Back to Incentives
                  </Link>
                  {Boolean(incentive.background_image_url || incentive.background_video_url) && (
                    <Link href={incentive.background_video_url || incentive.background_image_url || '#'} target="_blank" className="px-4 py-2 bg-gradient-to-b from-[#232323] to-[#171717] text-white rounded-[3px] font-semibold hover:from-[#2a2a2a] hover:to-[#1e1e1e]">
                      Open Media
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
