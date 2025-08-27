import React from 'react'
import { useCountingAnimation } from '@/hooks/useCountingAnimation'

interface StatCard2Props {
  value: string
  prefix?: string
  suffix?: string
  title: string
  description: string
  className?: string
  isVisible?: boolean
  delay?: number
}

export default function StatCard2({ 
  value, 
  prefix, 
  suffix, 
  title, 
  description, 
  className = '',
  isVisible = false,
  delay = 0
}: StatCard2Props) {
  // Parse the numeric value for animation
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
  const animatedValue = useCountingAnimation({
    end: numericValue,
    duration: 2000,
    delay: delay,
    isVisible: isVisible
  })

  return (
    <div className={`bg-[rgba(26,27,28,0.4)] rounded-[3px] border-[0.5px] border-[#303030] relative ${className}`}>
      <div className="flex flex-col items-center justify-center p-[20px] h-full">
        <div className="flex flex-col gap-[30px] items-center justify-center text-white w-full">
          {/* Value with prefix/suffix */}
          {prefix || suffix ? (
            <div className="flex gap-[7px] items-start justify-center font-telegraf font-black">
              {prefix && (
                <span className="text-[#888d95] text-[25px]">{prefix}</span>
              )}
              <span className="text-white text-[80px]">{animatedValue}</span>
              {suffix && (
                <div className="flex flex-col justify-end text-[#888d95] text-[25px] w-3.5">
                  {suffix}
                </div>
              )}
            </div>
          ) : (
            <div className="font-telegraf font-black text-[80px] text-white">
              {animatedValue}
            </div>
          )}
          
          {/* Title */}
          <div className="font-telegraf font-bold text-[16px] text-white text-center">
            {title}
          </div>
          
          {/* Description */}
          <div className="font-telegraf text-[14px] text-center text-white w-[254.592px]">
            {description}
          </div>
        </div>
      </div>
    </div>
  )
}
