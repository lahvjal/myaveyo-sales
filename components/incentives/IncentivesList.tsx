import React from 'react'
import IncentiveCard from '@/components/incentives/IncentiveCard'
import type { Incentive } from '@/lib/types/incentive'

export type IncentivesCopy = {
  section_number: string
  section_title: string
  description: string
}

interface IncentivesListProps {
  incentivesCopy: IncentivesCopy
  filter: 'all' | 'live' | 'coming_up' | 'done'
  onFilterChange: (next: 'all' | 'live' | 'coming_up' | 'done') => void
  loading: boolean
  filteredIncentives: Incentive[]
}

export default function IncentivesList({
  incentivesCopy,
  filter,
  onFilterChange,
  loading,
  filteredIncentives,
}: IncentivesListProps) {
  return (
    <div className="max-w-[1480px] mx-auto">
      {/* Header (from CMS) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 sm:pb-10 mb-10 sm:mb-16 lg:mb-20">
        <div className="flex items-start gap-2.5 text-white opacity-100 translate-y-0">
          <span className="text-[14px] sm:text-[16px] font-telegraf">{incentivesCopy.section_number}</span>
          <h1 className="text-[32px] sm:text-[40px] md:text-[52px] lg:text-[60px] font-telegraf font-extrabold uppercase leading-[36px] sm:leading-[44px] md:leading-[56px] lg:leading-[63px]">
            {incentivesCopy.section_title}
          </h1>
        </div>
        <div className="text-white text-[14px] sm:text-[16px] font-telegraf max-w-[400px] opacity-100 translate-y-0">
          <p>{incentivesCopy.description}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center mb-8 sm:mb-12">
        <div className="flex flex-wrap justify-center bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1">
          {(['all', 'live', 'coming_up', 'done'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => onFilterChange(filterOption)}
              className={`px-[12px] sm:px-[15px] py-[6px] sm:py-[7px] rounded-[60px] text-[12px] sm:text-[14px] font-inter font-semibold transition-colors capitalize ${
                filter === filterOption ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'
              }`}
            >
              {filterOption === 'coming_up' ? 'Coming Soon' : filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Incentives Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx}
        className="rounded-[3px] relative h-full min-h-[600px] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 skeleton">
                  </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredIncentives.map((incentive) => (
            <a
              key={incentive.id}
              href={`/user/incentives/${incentive.id}`}
              className="block rounded-[3px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <IncentiveCard
                title={incentive.title}
                backgroundImage={incentive.background_image_url}
                backgroundVideo={incentive.background_video_url}
                liveStatus={incentive.live_status}
                category={incentive.category}
                categoryColor={incentive.category_color}
                startDate={incentive.start_date}
                endDate={incentive.end_date}
                variant="detailed"
              />
            </a>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredIncentives.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-[rgba(255,255,255,0.6)] font-telegraf text-lg">No incentives found for the selected filter.</p>
        </div>
      )}
    </div>
  )
}
