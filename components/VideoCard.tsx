'use client'

interface VideoCardProps {
  thumbnailUrl?: string
  title: string
  description: string
  customerName?: string
  repName?: string
  location?: string
  dateRecorded?: string
  type: 'customer' | 'rep'
  featured?: boolean
  onClick?: () => void
  className?: string
}

const VideoCard = ({ 
  thumbnailUrl,
  title,
  description,
  customerName,
  repName,
  location,
  dateRecorded,
  type,
  featured = false,
  onClick,
  className = ""
}: VideoCardProps) => {
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div
      className={`bg-gradient-to-b from-[#171717] to-[#191919] rounded-[3px] overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Video Thumbnail */}
      <div className="relative h-[500px] w-full bg-[#0d0d0d] ">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l8-5-8-5z"/>
              </svg>
            </div>
          </div>
        )}
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-telegraf font-bold">
            ⭐ Featured
          </div>
        )}
        
        {/* Type Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-telegraf font-bold ${
          type === 'customer' 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          {type === 'customer' ? 'Customer' : 'Rep'}
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <img 
            src="/play.svg" 
            alt="Play" 
            className="w-12 h-12"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white font-telegraf font-bold text-[18px] mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="text-[rgba(255,255,255,0.7)] text-[14px] font-telegraf mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="space-y-2 text-[12px] text-[rgba(255,255,255,0.5)] font-telegraf">
          {customerName && (
            <p>👤 {customerName}</p>
          )}
          {repName && (
            <p>🏆 {repName}</p>
          )}
          {location && (
            <p>📍 {location}</p>
          )}
          {dateRecorded && (
            <p>📅 {formatDate(dateRecorded)}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCard
