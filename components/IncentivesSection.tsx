import React, { useState } from 'react'
import Button from './Button'
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation'

interface IncentiveCardProps {
  backgroundImage: string
  liveStatus?: 'live' | 'done'
  category: string
  categoryColor: string
}

interface IncentivesSectionProps {
  className?: string
}

const IncentiveCard = ({ backgroundImage, liveStatus = 'live', category, categoryColor }: IncentiveCardProps) => {
  const imgEllipse7 = "http://localhost:3845/assets/8670986fdb518a6ffb1b050c901692ea0306a642.svg"
  const imgEllipse8 = "http://localhost:3845/assets/51eea4ffc43d9f3e0ee44581ac8639e95d47a693.svg"

  return (
    <div 
      className="bg-cover bg-center bg-no-repeat rounded-[3px] border-[0.5px] border-[#333537] relative h-full"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="flex flex-col justify-between h-full p-5">
        <div className="flex-1"></div>
        <div className="flex items-end justify-between">
          {/* Live/Done Status */}
          <div className={`flex items-center gap-2.5 px-[15px] py-[7px] rounded-[60px] ${
            liveStatus === 'live' ? 'bg-black' : 'bg-[#959595]'
          }`}>
            <img 
              alt="Status" 
              className="w-[6.848px] h-[6.848px]" 
              src={liveStatus === 'live' ? imgEllipse7 : imgEllipse8} 
            />
            <span className={`text-[14px] font-inter font-semibold ${
              liveStatus === 'live' ? 'text-white' : 'text-[#535353]'
            }`}>
              {liveStatus === 'live' ? 'Live' : 'Done'}
            </span>
          </div>

          {/* Category Badge */}
          <div 
            className="flex items-center gap-2.5 px-[15px] py-[7px] rounded-[60px]"
            style={{ backgroundColor: categoryColor }}
          >
            <span className="text-[14px] font-inter font-semibold text-black">
              {category}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IncentivesSection({ className = '' }: IncentivesSectionProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  
  const filters = ['All', 'Yearly', 'Summer', 'Live', 'Done']
  
  const imgCard = "http://localhost:3845/assets/fa6e1661e36b53f6161777fc68ad85d9738d26b4.png"
  const imgCard1 = "http://localhost:3845/assets/9ce5a9b0bd9ea18a4938bba88fb6678603a9fb31.png"
  const imgCard2 = "http://localhost:3845/assets/3c22f0c228c028598c4d43a5c3a0235c35660c5a.png"

  const incentives = [
    { 
      id: 1, 
      backgroundImage: imgCard, 
      liveStatus: 'live' as const, 
      category: 'Yearly', 
      categoryColor: '#f2e181',
      gridArea: 'span 1 / span 1'
    },
    { 
      id: 2, 
      backgroundImage: imgCard1, 
      liveStatus: 'live' as const, 
      category: 'Yearly', 
      categoryColor: '#f2e181',
      gridArea: 'span 1 / span 1'
    },
    { 
      id: 3, 
      backgroundImage: imgCard2, 
      liveStatus: 'live' as const, 
      category: 'Yearly', 
      categoryColor: '#f2e181',
      gridArea: 'span 1 / span 1'
    },
    { 
      id: 4, 
      backgroundImage: imgCard2, 
      liveStatus: 'live' as const, 
      category: 'Summer', 
      categoryColor: '#93c3f6',
      gridArea: 'span 1 / span 1'
    },
    { 
      id: 5, 
      backgroundImage: imgCard2, 
      liveStatus: 'done' as const, 
      category: 'Summer', 
      categoryColor: '#93c3f6',
      gridArea: 'span 1 / span 1'
    },
    { 
      id: 6, 
      backgroundImage: imgCard2, 
      liveStatus: 'done' as const, 
      category: 'Summer', 
      categoryColor: '#93c3f6',
      gridArea: 'span 1 / span 1'
    }
  ]
  
  // Filter incentives based on active filter
  const getFilteredIncentives = () => {
    if (activeFilter === 'All') return incentives
    if (activeFilter === 'Live') return incentives.filter(item => item.liveStatus === 'live')
    if (activeFilter === 'Done') return incentives.filter(item => item.liveStatus === 'done')
    return incentives.filter(item => item.category === activeFilter)
  }
  
  const filteredIncentives = getFilteredIncentives()

  // Animation hooks
  const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200 })
  const descriptionAnimation = useScrollAnimation<HTMLDivElement>({ delay: 400 })
  const filtersAnimation = useScrollAnimation<HTMLDivElement>({ delay: 600 })
  const gridAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800 })
  const buttonAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1000 })

  return (
    <section className={`px-[50px] pb-10 ${className}`}>
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
              Every milestone comes with a payoff. From luxury trips and company cars to cash bonuses and exclusive 
              gear—our incentives are designed to keep you winning in and out of the field.
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
                    : 'border border-white text-white hover:bg-white hover:text-black'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Incentives Grid */}
          <div 
            ref={gridAnimation.ref}
            className={`grid grid-cols-3 gap-5 min-h-[1380px] transition-all duration-700 ${
              gridAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ gridTemplateRows: 'repeat(4, 1fr)' }}
          >
            {filteredIncentives.map((incentive, index) => {
              // Define grid positioning based on index
              let gridClass = 'row-span-2'
              
              return (
                <div key={incentive.id} className={gridClass}>
                  <IncentiveCard
                    backgroundImage={incentive.backgroundImage}
                    liveStatus={incentive.liveStatus}
                    category={incentive.category}
                    categoryColor={incentive.categoryColor}
                  />
                </div>
              )
            })}
          </div>
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
