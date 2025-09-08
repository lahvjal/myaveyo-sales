'use client'

interface CardProps {
  backgroundImage?: string
  backgroundVideo?: string
  statusBadgeText?: string
  statusBadgeColor?: 'live' | 'coming_up' | 'done'
  daysText?: string
  categoryBadgeText?: string
  categoryBadgeColor?: string
  className?: string
}

const Card = ({ 
  backgroundImage, 
  backgroundVideo, 
  statusBadgeText, 
  statusBadgeColor = 'live',
  daysText, 
  categoryBadgeText, 
  categoryBadgeColor = '#ffffff',
  className = ""
}: CardProps) => {
  return (
    <div 
      className={`rounded-[3px] relative h-full min-h-[300px] overflow-hidden ${className}`}
    >
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
        <img 
          src={backgroundImage} 
          alt="Card background"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error('Image failed to load:', backgroundImage)
            e.currentTarget.style.display = 'none'
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', backgroundImage)
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#171717] to-[#0d0d0d] flex items-center justify-center">
          <span className="text-[rgba(255,255,255,0.6)] text-sm font-telegraf">No Media</span>
        </div>
      )}
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between h-full p-5 relative z-20">
        <div className="flex-1"></div>
        <div className="flex items-center justify-between">
          {/* Status Badge */}
          {statusBadgeText && (
            <div className={`flex items-center gap-2.5 px-[15px] py-[7px] rounded-[60px] shadow-lg ${
              statusBadgeColor === 'live' ? 'bg-black' : 
              statusBadgeColor === 'coming_up' ? 'bg-blue-600' : 'bg-[#959595]'
            }`}>
              <div className={`w-[7px] h-[7px] rounded-full ${
                statusBadgeColor === 'live' ? 'bg-red-500' : 
                statusBadgeColor === 'coming_up' ? 'bg-white' : 'bg-[#535353]'
              }`}></div>
              <span className="text-[14px] font-telegraf font-semibold text-white">
                {statusBadgeText}
              </span>
            </div>
          )}
          
          {/* Days Text */}
          {daysText && (
            <span className="text-white font-telegraf font-normal text-[14px]">{daysText}</span>
          )}
          
          {/* Category Badge */}
          {categoryBadgeText && (
            <div 
              className="flex items-center gap-2.5 px-[15px] py-[7px] rounded-[60px] shadow-lg"
              style={{ backgroundColor: categoryBadgeColor }}
            >
              <span className="text-[14px] font-telegraf font-semibold text-black">
                {categoryBadgeText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
