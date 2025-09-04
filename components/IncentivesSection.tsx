import React, { useState, useEffect } from 'react'
import Button from './Button'
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation'
import { Incentive } from '@/lib/types/incentive'

interface IncentiveCardProps {
  backgroundImage?: string
  backgroundVideo?: string
  liveStatus: 'coming_up' | 'live' | 'done'
  category: string
  categoryColor: string
  startDate: string
  endDate: string
}

interface IncentivesSectionProps {
  className?: string
  pageReady?: boolean
}

const IncentiveCard = ({ backgroundImage, backgroundVideo, liveStatus = 'live', category, categoryColor, startDate, endDate }: IncentiveCardProps) => {
  const imgEllipse7 = "http://localhost:3845/assets/8670986fdb518a6ffb1b050c901692ea0306a642.svg"
  const imgEllipse8 = "http://localhost:3845/assets/51eea4ffc43d9f3e0ee44581ac8639e95d47a693.svg"

  // Calculate days for badge text
  const calculateDaysText = () => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (liveStatus === 'live') {
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysLeft > 0 ? `${daysLeft} days left` : 'Last day'
    } else if (liveStatus === 'coming_up') {
      const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil > 0 ? `${daysUntil} days until` : 'Starting soon'
    }
    return ''
  }

  const daysText = calculateDaysText()

  return (
    <div 
      className="rounded-[3px] relative h-full min-h-[300px] overflow-hidden"
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
          alt="Incentive background"
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
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-sm">No Media</span>
        </div>
      )}
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between h-full p-5 relative z-20">
        <div className="flex-1"></div>
        <div className="flex items-center justify-between">
          {/* Status Badge */}
          <div className={`flex items-center gap-2.5 px-[15px] py-[7px] rounded-[60px] shadow-lg ${
            liveStatus === 'live' ? 'bg-black' : 
            liveStatus === 'coming_up' ? 'bg-blue-600' : 'bg-[#959595]'
          }`}>
            <div className={`w-[7px] h-[7px] rounded-full ${
              liveStatus === 'live' ? 'bg-red-500' : 
              liveStatus === 'coming_up' ? 'bg-white' : 'bg-[#535353]'
            }`}></div>
            <span className={`text-[14px] font-semibold flex flex-row gap-5 ${
              liveStatus === 'live' ? 'text-white' : 
              liveStatus === 'coming_up' ? 'text-white' : 'text-white'
            }`}>
              {liveStatus === 'live' ? 'Live' : 
               liveStatus === 'coming_up' ? 'Coming Up' : 'Done'}
            </span>
          </div>
          <span className="font-normal">{daysText}</span>
          {/* Category Badge */}
          <div 
            className="flex items-center gap-2.5 px-[15px] py-[7px] rounded-[60px] shadow-lg"
            style={{ backgroundColor: categoryColor || '#ffffff' }}
          >
            <span className="text-[14px] font-semibold text-black">
              {category || 'Category'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IncentivesSection({ className = '', pageReady = true }: IncentivesSectionProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const filters = ['All', 'Yearly', 'Summer', 'Monthly', 'Live', 'Coming Up', 'Done']

  // Fetch incentives from Supabase
  useEffect(() => {
    const fetchIncentives = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/incentives')
        
        if (!response.ok) {
          throw new Error('Failed to fetch incentives')
        }
        
        const data = await response.json()
        setIncentives(data)
      } catch (err) {
        console.error('Error fetching incentives:', err)
        setError('Failed to load incentives')
      } finally {
        setLoading(false)
      }
    }

    fetchIncentives()
  }, [])
  
  // Filter incentives based on active filter
  const getFilteredIncentives = () => {
    if (activeFilter === 'All') return incentives
    if (activeFilter === 'Live') return incentives.filter(item => item.live_status === 'live')
    if (activeFilter === 'Coming Up') return incentives.filter(item => item.live_status === 'coming_up')
    if (activeFilter === 'Done') return incentives.filter(item => item.live_status === 'done')
    return incentives.filter(item => item.category === activeFilter)
  }
  
  const filteredIncentives = getFilteredIncentives()

  // Animation hooks
  const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200, disabled: !pageReady })
  const descriptionAnimation = useScrollAnimation<HTMLDivElement>({ delay: 400, disabled: !pageReady })
  const filtersAnimation = useScrollAnimation<HTMLDivElement>({ delay: 600, disabled: !pageReady })
  const gridContainerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })
  const buttonAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1000, disabled: !pageReady })
  
  // Create staggered animations for grid items (up to 12 items in a 3x4 grid)
  const gridItemAnimations = useStaggeredScrollAnimation<HTMLDivElement>(12, 900, 100, !pageReady)

  return (
    <section className={`px-[50px] py-[130px] ${className}`}>
      <div className="max-w-[1480px] mx-auto pb-[30px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-10 mb-20">
          <div 
            ref={headerAnimation.ref}
            className={`flex items-start gap-2.5 text-white transition-all duration-700 ${
              headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <span className="text-[16px] font-telegraf">(2)</span>
            <h2 className="text-[60px] font-telegraf font-extrabold uppercase leading-[63px]">
              Incentives.
            </h2>
          </div>
          <div 
            ref={descriptionAnimation.ref}
            className={`text-white text-[16px] font-telegraf max-w-[364px] transition-all duration-700 ${
              descriptionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <p>
            Great commissions are nice, but incredible incentives can be even cooler. Check out what we have cooking.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {/* Filter Buttons */}
          <div 
            ref={filtersAnimation.ref}
            className={`flex items-center justify-center gap-2.5 transition-all duration-700 ${
              filtersAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                  activeFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-gradient-to-b from-[#232323] to-[#171717]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-white text-xl">Loading incentives...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-red-400 text-xl">{error}</div>
            </div>
          )}


          {/* Incentives Grid */}
          {!loading && !error && (
            <div 
              ref={gridContainerAnimation.ref}
              className={`grid grid-cols-3 gap-5 min-h-[1380px] transition-all duration-700 ${
                gridContainerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ gridTemplateRows: 'repeat(4, 1fr)' }}
            >
              {filteredIncentives
                .sort((a, b) => {
                  // Prioritize live status first
                  if (a.live_status === 'live' && b.live_status !== 'live') return -1
                  if (b.live_status === 'live' && a.live_status !== 'live') return 1
                  
                  // Then prioritize yearly category
                  if (a.category === 'Yearly' && b.category !== 'Yearly') return -1
                  if (b.category === 'Yearly' && a.category !== 'Yearly') return 1
                  
                  // Fall back to sort_order
                  return a.sort_order - b.sort_order
                })
                .map((incentive, index) => {
                // Define grid positioning based on index
                let gridClass = 'row-span-2'
                
                // Get the animation for this specific grid item
                const itemAnimation = gridItemAnimations[index] || gridItemAnimations[gridItemAnimations.length - 1]
                
                return (
                  <div 
                    key={incentive.id} 
                    ref={itemAnimation.ref}
                    className={`${gridClass} transition-all duration-700 ${
                      itemAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <IncentiveCard
                      backgroundImage={incentive.background_image_url}
                      backgroundVideo={incentive.background_video_url}
                      liveStatus={incentive.live_status}
                      category={incentive.category}
                      categoryColor={incentive.category_color}
                      startDate={incentive.start_date}
                      endDate={incentive.end_date}
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredIncentives.length === 0 && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-gray-400 text-xl">
                {activeFilter === 'All' ? 'No incentives available' : `No ${activeFilter.toLowerCase()} incentives found`}
              </div>
            </div>
          )}
        </div>

        {/* Explore Button */}
        <div 
          ref={buttonAnimation.ref}
          className={`flex justify-center mt-20 transition-all duration-700 ${
            buttonAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <Button variant="primary">
            EXPLORE INCENTIVES
          </Button>
        </div>
      </div>
    </section>
  )
}
