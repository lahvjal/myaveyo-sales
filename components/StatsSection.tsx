import React, { useState, useEffect } from 'react'
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
  pageReady?: boolean
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
    <div className="flex-1 bg-gradient-to-b from-[#171717] to-[#0d0d0d] h-[170px] sm:h-[190px] lg:h-[205px] rounded-[3px] relative">
      <div className="flex flex-col items-center justify-center h-full px-4 py-5">
        <div className="flex items-start justify-center gap-[6px] sm:gap-[7px] mb-[10px] sm:mb-[15px]">
          {prefix && (
            <span className="text-[#888d95] text-[18px] sm:text-[22px] lg:text-[25px] font-telegraf font-black leading-none">
              {prefix}
            </span>
          )}
          <span className="text-white text-[44px] sm:text-[56px] lg:text-[70px] font-telegraf font-black leading-none">
            {animatedValue}
          </span>
          {suffix && (
            <span className="text-[#888d95] text-[18px] sm:text-[22px] lg:text-[25px] font-telegraf font-black leading-none flex flex-col justify-end">
              {suffix}
            </span>
          )}
        </div>
        <p className="text-[#888d95] text-[12px] sm:text-[13px] lg:text-[14px] font-telegraf text-center">
          {label}
        </p>
      </div>
    </div>
  )
}

export default function StatsSection({ className = '', pageReady = true }: StatsSectionProps) {
  const [stats, setStats] = useState([
    { value: '10', suffix: '%', label: 'Increase' },
    { value: '45', label: 'Projects Sold' },
    { value: '850', prefix: '$', suffix: 'K', label: 'Revenue Generated' },
    { value: '98', suffix: '%', label: 'Customer Satisfaction' }
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/home-stats', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          const formattedStats = data.map((stat: any) => ({
            value: stat.value,
            prefix: stat.prefix || undefined,
            suffix: stat.suffix || undefined,
            label: stat.title
          }))
          // Normalize to exactly 4 items to keep hook count stable
          const normalized = formattedStats.slice(0, 4)
          while (normalized.length < 4) {
            normalized.push({ value: '0', label: '', prefix: undefined, suffix: undefined })
          }
          setStats(normalized)
        }
      } catch (error) {
        console.error('Failed to fetch home stats:', error)
        // Keep default stats on error
      }
    }

    fetchStats()
  }, [])

  const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200, disabled: !pageReady })
  const yearAnimation = useScrollAnimation<HTMLDivElement>({ delay: 400, disabled: !pageReady })
  const cardAnimations = useStaggeredScrollAnimation<HTMLDivElement>(stats.length, 600, 150, !pageReady)

  return (
    <section className={`px-6 sm:px-8 md:px-10 lg:px-[50px] py-16 sm:py-20 lg:py-[130px] ${className}`}>
      <div className="max-w-[1480px] mx-auto pb-[30px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-16 lg:mb-20">
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
              <span className="text-[14px] sm:text-[16px] font-telegraf">(1)</span>
              <h2 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] font-telegraf font-extrabold uppercase leading-[32px] sm:leading-[42px] md:leading-[52px] lg:leading-[63px]">
                Sales Stats.
              </h2>
            </div>
            <div 
            ref={yearAnimation.ref}
            className={`text-white text-[14px] sm:text-[16px] font-telegraf md:pl-[30px] max-w-[660px] transition-all duration-700 ${
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
            className={`text-[rgba(255,255,255,0.4)] text-[14px] sm:text-[16px] font-telegraf font-extrabold transition-all duration-700 ${
              yearAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            _2025
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
