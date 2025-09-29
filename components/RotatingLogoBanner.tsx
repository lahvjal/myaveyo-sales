'use client'

import React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface RotatingLogoBannerProps {
  pageReady?: boolean
}

export default function RotatingLogoBanner({ pageReady = true }: RotatingLogoBannerProps) {
  const bannerAnim = useScrollAnimation<HTMLDivElement>({ delay: 200, disabled: !pageReady })

  return (
    <div className="w-full overflow-hidden bg-[#0d0d0d] py-8">
      <div
        ref={bannerAnim.ref}
        className={`flex animate-marquee gap-[50px] items-center opacity-20 transition-all duration-700 ${
          bannerAnim.isVisible ? 'opacity-20 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Create multiple logo instances for seamless infinite scroll */}
        {Array.from({ length: 24 }, (_, index) => (
          <React.Fragment key={index}>
            <div className="h-[19px] w-[110px] flex-shrink-0">
              <img 
                src="/logo.svg" 
                alt="Aveyo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="h-[70px] w-[110px] flex-shrink-0">
              <img 
                src="/aveyoSalesLogo.svg?v=1"
                alt="Aveyo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Failed to load aveyoSalesLogo.svg');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
