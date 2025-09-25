import React from 'react'
import Button from '@/components/Button'

export interface IncentiveCardProps {
  backgroundImage?: string
  backgroundVideo?: string
  liveStatus: 'coming_up' | 'live' | 'done'
  title?: string
  category: string
  categoryColor: string
  startDate: string
  endDate: string
  variant?: 'simple' | 'detailed'
  onViewClick?: () => void
}

export default function IncentiveCard({
  backgroundImage,
  backgroundVideo,
  liveStatus = 'live',
  title,
  category,
  categoryColor,
  startDate,
  endDate,
  variant = 'simple',
  onViewClick,
}: IncentiveCardProps) {
  // Calculate days for badge text
  const calculateDaysText = () => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (liveStatus === 'live') {
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysLeft > 0 ? `${daysLeft} days left` : 'Last day'
    } else if (liveStatus === 'coming_up') {
      const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil > 0 ? `${daysUntil} days until` : 'Starting soon'
    }
    return ''
  }

  const daysText = calculateDaysText()

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="rounded-[3px] relative h-full min-h-[600px] overflow-hidden">
      {/* Background Media */}
      {backgroundVideo ? (
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error('Video failed to load:', backgroundVideo)
            e.currentTarget.style.display = 'none'
          }}
          onLoadedData={() => {
            console.log('Video loaded successfully:', backgroundVideo)
          }}
        />
      ) : backgroundImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backgroundImage}
          alt="Incentive background"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error('Image failed to load:', backgroundImage)
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', backgroundImage)
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-sm">No Media</span>
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end h-full relative z-20">
        <div className="flex items-center justify-between p-[20px]">
          {/* Status Badge */}
          <div
            className={`flex items-center gap-2.5 px-[15px] py-[7px] rounded-[60px] shadow-lg ${
              liveStatus === 'live' ? 'bg-black' : liveStatus === 'coming_up' ? 'bg-blue-600' : 'bg-[#959595]'
            }`}
          >
            <div
              className={`w-[7px] h-[7px] rounded-full ${
                liveStatus === 'live' ? 'bg-red-500' : liveStatus === 'coming_up' ? 'bg-white' : 'bg-[#535353]'
              }`}
            ></div>
            <span
              className={`text-[14px] font-semibold flex flex-row gap-5 ${
                liveStatus === 'live' ? 'text-white' : liveStatus === 'coming_up' ? 'text-white' : 'text-white'
              }`}
            >
              {liveStatus === 'live' ? 'Live' : liveStatus === 'coming_up' ? 'Coming Up' : 'Done'}
            </span>
          </div>
          {variant === 'simple' && <span className="font-normal">{daysText}</span>}
          {/* Category Badge */}
          <div className="flex items-center gap-2.5 px-[15px] py-[7px] rounded-[60px] shadow-lg" style={{ backgroundColor: categoryColor || '#ffffff' }}>
            <span className="text-[14px] font-semibold text-black">{category || 'Category'}</span>
          </div>
        </div>
        {variant === 'detailed' && (
        <div className="flex inset-x-0 bottom-0 z-30">
          <div className="w-full bg-[#171717] px-5 py-5">
            {title && (
              <div className="text-white font-extrabold text-[24px] leading-tight mb-2">
                {title}
              </div>
            )}
            <div className="text-[14px] text-white/85 mb-4">
              {formatDate(startDate)} – {formatDate(endDate)}
              {daysText ? <span className="ml-3 text-white/70">({daysText})</span> : null}
            </div>
            <Button
              onClick={onViewClick}
              className="w-full"
            >
              View
            </Button>
          </div>
        </div>
        )}
      </div>

      
    </div>
  )
}
