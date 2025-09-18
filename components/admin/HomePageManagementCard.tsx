'use client'

import Image from 'next/image'
import Link from 'next/link'

interface HomePageManagementCardProps {
  title: string
  description?: string
  status: 'active' | 'coming-soon'
  href?: string
  onClick?: () => void
  className?: string
}

export default function HomePageManagementCard({
  title,
  description = 'Click to manage',
  status,
  href,
  onClick,
  className = ''
}: HomePageManagementCardProps) {
  const isActive = status === 'active'
  const isComingSoon = status === 'coming-soon'

  return (
    <div 
      className={`
        h-[210px] bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] items-center justify-between overflow-clip p-[20px] relative rounded-[3px] size-full to-[#111111] cursor-pointer transition-all duration-200 group
        ${isComingSoon ? 'opacity-50' : 'opacity-100'}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Status Badge */}
      <div className="content-stretch flex gap-[10px] items-center justify-start relative shrink-0 w-full">
        <div className="relative shrink-0 size-[13px]">
          {/* Status Circle */}
          <div 
            className={`
              size-full rounded-full
              ${isActive ? 'bg-green-500' : 'bg-orange-500'}
            `}
          />
        </div>
        <div className="font-telegraf not-italic relative shrink-0 text-[#888d95] text-[12px] text-nowrap uppercase">
          {isActive ? 'Active' : 'Coming Soon'}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-[7px] grow items-start justify-center relative w-full">
        {/* Title */}
        <div className="font-telegraf font-bold not-italic relative shrink-0 text-[20px] text-nowrap text-white">
          {title}
        </div>
        
        {/* Description with Arrow */}
        {isActive && href ? (
          <Link href={href} className="content-stretch flex gap-[7px] group-hover:gap-[14px] items-center justify-start relative shrink-0 transition-all duration-200">
            <div className="font-telegraf not-italic relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
              {description}
            </div>
            <div className="h-0 relative shrink-0 w-[19.795px]">
              <div className="absolute bottom-[-3.68px] left-0 right-[-2.53%] top-[-3.68px]">
                <Image 
                  src="/images/19bdf0709754153b49ebf81ac3d7a8353d01454d.svg"
                  alt="Arrow"
                  width={20}
                  height={8}
                  className="size-full"
                />
              </div>
            </div>
          </Link>
        ) : (
          <div className="content-stretch flex gap-[7px] group-hover:gap-[14px] items-center justify-start relative shrink-0 transition-all duration-200">
            <div className="font-telegraf not-italic relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
              {description}
            </div>
            <div className="h-0 relative shrink-0 w-[19.795px]">
              <div className="absolute bottom-[-3.68px] left-0 right-[-2.53%] top-[-3.68px]">
                <Image 
                  src="/images/19bdf0709754153b49ebf81ac3d7a8353d01454d.svg"
                  alt="Arrow"
                  width={20}
                  height={8}
                  className="size-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
