import React from 'react'
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation'
import { useCountingAnimation } from '@/hooks/useCountingAnimation'

interface StatCardProps {
  value: string
  suffix?: string
  prefix?: string
  label: string
  isVisible?: boolean
  delay?: number
}

interface StatsSectionProps {
  className?: string
}

const StatCard = ({ value, suffix, prefix, label, isVisible = false, delay = 0 }: StatCardProps) => {
  // Parse the numeric value for animation
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
  const animatedValue = useCountingAnimation({
    end: numericValue,
    duration: 2000,
    delay: delay,
    isVisible: isVisible
  })

  return (
    <div className="flex-1 bg-[#121212] h-[205px] rounded-[3px] border-[0.5px] border-[#303030] relative">
      <div className="flex flex-col items-center justify-center h-full p-5">
        <div className="flex items-start justify-center gap-[7px] mb-[15px]">
          {prefix && (
            <span className="text-[#888d95] text-[25px] font-telegraf font-black leading-none">
              {prefix}
            </span>
          )}
          <span className="text-white text-[70px] font-telegraf font-black leading-none">
            {animatedValue}
          </span>
          {suffix && (
            <span className="text-[#888d95] text-[25px] font-telegraf font-black leading-none flex flex-col justify-end">
              {suffix}
            </span>
          )}
        </div>
        <p className="text-[#888d95] text-[14px] font-telegraf text-center">
          {label}
        </p>
      </div>
    </div>
  )
}

export default function StatsSection({ className = '' }: StatsSectionProps) {
  const stats = [
    { value: '10', suffix: '%', label: 'Increase' },
    { value: '45', label: 'Projects Sold' },
    { value: '850', prefix: '$', suffix: 'K', label: 'Revenue Generated' },
    { value: '98', suffix: '%', label: 'Customer Satisfaction' }
  ]

  const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200 })
  const yearAnimation = useScrollAnimation<HTMLDivElement>({ delay: 400 })
  const cardAnimations = useStaggeredScrollAnimation<HTMLDivElement>(stats.length, 600, 150)

  return (
    <section className={`px-[50px] py-0 ${className}`}>
      <div className="max-w-[1480px] mx-auto pb-[30px]">
        {/* Header */}
        <div className="flex items-end justify-between h-[63px] mb-20">
          <div 
            ref={headerAnimation.ref}
            className={`flex flex-col items-start gap-2.5 text-white transition-all duration-700 ${
              headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div 
            ref={headerAnimation.ref}
            className={`flex items-start gap-2.5 text-white transition-all duration-700 ${
              headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            >
              <span className="text-[16px] font-telegraf">(1)</span>
              <h2 className="text-[60px] font-telegraf font-extrabold uppercase leading-[63px]">
                Stats.
              </h2>
            </div>
            <div 
            ref={yearAnimation.ref}
            className={`text-white text-[16px] font-telegraf pl-[330px] transition-all duration-700 ${
              yearAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <p>
              A real-time look into our company-wide sales metrics.
              <br />
              They'd be better if you worked here.
            </p>
          </div>
          </div>
          <div 
            ref={yearAnimation.ref}
            className={`text-[rgba(255,255,255,0.4)] text-[16px] font-telegraf font-extrabold transition-all duration-700 ${
              yearAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            _2025
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-5">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={cardAnimations[index].ref}
              className={`flex-1 transition-all duration-700 ${
                cardAnimations[index].isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <StatCard
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                label={stat.label}
                isVisible={cardAnimations[index].isVisible}
                delay={200 + index * 100}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
