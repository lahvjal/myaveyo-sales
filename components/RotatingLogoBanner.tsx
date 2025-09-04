'use client'

import React from 'react'

export default function RotatingLogoBanner() {
  return (
    <div className="w-full overflow-hidden bg-[#0d0d0d] py-8">
      <div className="flex animate-marquee gap-[50px] items-center opacity-20">
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
