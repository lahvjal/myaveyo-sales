import React, { useState, useEffect } from 'react'

interface ExpandableBlockProps {
  id: string
  title: string
  description?: string
  backgroundImage?: string
  isExpanded?: boolean
  onToggle?: (id: string) => void
  children?: React.ReactNode
  className?: string
}

export default function ExpandableBlock({
  id,
  title,
  description,
  backgroundImage,
  isExpanded = false,
  onToggle,
  children,
  className = ''
}: ExpandableBlockProps) {
  const imgFrame125 = "http://localhost:3845/assets/df2505692b6efda9481e01755160ed46d8dff5c5.svg"
  const [showGreyBackground, setShowGreyBackground] = useState(!isExpanded)

  const handleToggle = () => {
    if (onToggle) {
      onToggle(id)
    }
  }

  useEffect(() => {
    if (isExpanded) {
      // When expanding, immediately remove grey background
      setShowGreyBackground(false)
    } else {
      // When collapsing, show grey background immediately to fade in during collapse
      setShowGreyBackground(true)
    }
  }, [isExpanded])

  const PlusIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}
    >
      <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div 
      className={`rounded-[3px] border-[0.5px] border-[#888d95] relative transition-all duration-500 ease-in-out overflow-hidden ${className}`}
      style={{ 
        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Grey overlay that appears after collapse */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          showGreyBackground ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: '#6C6C6D' }}
      />
      
      <div className="flex flex-col items-center justify-between overflow-clip h-full relative z-10">
        <div className="flex grow items-center justify-between px-10 w-full h-full">
          <div className={`flex items-start justify-start ${isExpanded ? 'flex-col gap-[30px]' : 'gap-2.5'}`}>
            <div className="font-telegraf font-bold text-white text-[14px] leading-[23px]">
              {id}
            </div>
            <div className="font-telegraf font-bold text-white text-[60px] leading-normal">
              {title}
            </div>
            <div 
              className={`transition-all duration-500 ease-in-out ${
                isExpanded 
                  ? 'opacity-100 max-h-96 transform translate-y-0' 
                  : 'opacity-0 max-h-0 transform -translate-y-4'
              }`}
            >
              {description && (
                <div className="font-telegraf font-bold text-white text-[14px] leading-[23px] w-[454.375px] mb-[30px]">
                  {description}
                </div>
              )}
              {children}
            </div>
          </div>
          <button 
            onClick={handleToggle}
            className="flex items-center justify-center border border-white rounded-[3px] size-[50px] hover:bg-white hover:bg-opacity-10 transition-all duration-300"
          >
            {isExpanded ? (
              <div className="bg-[#d9d9d9] h-0.5 w-[30px]" />
            ) : (
              <PlusIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
