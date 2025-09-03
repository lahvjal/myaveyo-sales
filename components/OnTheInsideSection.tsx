import React, { useState } from 'react'
import ExpandableBlock from './ExpandableBlock'
import Button from './Button'
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation'

interface OnTheInsideSectionProps {
  className?: string
}

export default function OnTheInsideSection({ className = '' }: OnTheInsideSectionProps) {
  const [expandedBlock, setExpandedBlock] = useState<string>('001')
  
  const imgCard = "http://localhost:3845/assets/dc52173e611d9ad77837e8dfdd59a3cb14c1ad4a.png"
  
  const blocks = [
    {
      id: '001',
      title: 'The Culture',
      description: 'Our culture is built on a curated combination of our values and attitudes. We work hard, but have fun. We celebrate wins, but keep each other accountable. We’re cool. We’re energetic. And we’re always engaged.',
      backgroundImage: "/images/unlmtd.png"
    },
    {
      id: '002',
      title: 'The Training',
      description: 'From day one, you\'ll get hands-on training that actually works. No fluff, just real skills that help you close deals and build lasting relationships.',
      backgroundImage: "/images/presentation.png"
    },
    {
      id: '003',
      title: 'The Lifestyle',
      description: 'Work hard, live well. Flexible schedules, remote options, and the freedom to design your career around the life you want to live.',
      backgroundImage: "/images/WEBSITE PHOTO.png"
    },
    {
      id: '004',
      title: 'The Growth',
      description: 'Your potential is unlimited here. Clear advancement paths, mentorship programs, and opportunities to lead from day one.',
      backgroundImage: "/images/growth.png"
    }
  ]

  const handleToggle = (id: string) => {
    setExpandedBlock(expandedBlock === id ? '' : id)
  }

  const filters = ['All', 'Yearly', 'Summer', 'Live', 'Done']
  const [activeFilter, setActiveFilter] = useState('All')

  // Animation hooks
  const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200 })
  const blockAnimations = useStaggeredScrollAnimation<HTMLDivElement>(blocks.length, 400, 200)
  const buttonAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1200 })

  return (
    <section className={`px-[50px] py-0 ${className}`}>
      <div className="bg-[#e6e6e6] rounded-[5px] py-[160px] px-[30px]">
        <div className="max-w-[1480px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-start pb-10 mb-[60px]">
            <div 
              ref={headerAnimation.ref}
              className={`flex items-start gap-2.5 transition-all duration-700 ${
                headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <span className="text-[16px] font-telegraf text-black">(4)</span>
              <div className="flex flex-col gap-5 items-end">
                <h2 className="text-[60px] font-telegraf font-extrabold uppercase leading-[63px] text-black text-right">
                PULLING BACK
                <br />
                THE CURTAIN
                </h2>
                <div className="font-telegraf text-[16px] text-right text-black leading-[28px]">
                  What's working with Aveyo like?
                </div>
              </div>
            </div>
          </div>

          {/* Expandable Blocks Grid */}
          <div className="grid grid-cols-1 gap-5 mb-[60px]">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                ref={blockAnimations[index].ref}
                className={`transition-all duration-700 ${
                  blockAnimations[index].isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                <ExpandableBlock
                  id={block.id}
                  title={block.title}
                  description={block.description}
                  backgroundImage={block.backgroundImage}
                  isExpanded={expandedBlock === block.id}
                  onToggle={handleToggle}
                  className={`${expandedBlock === block.id ? 'h-[500px]' : 'h-[120px]'} relative before:absolute before:inset-0 before:bg-black before:opacity-30 before:z-10`}
                >
                  {/* Filter buttons - only show in expanded state for "The Culture"
                  {block.id === '001' && expandedBlock === block.id && (
                    <div className="flex flex-wrap gap-2.5 items-center">
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
                  )} */}
                </ExpandableBlock>
              </div>
            ))}
          </div>

          {/* Apply Now Button */}
          <div 
            ref={buttonAnimation.ref}
            className={`flex justify-center transition-all duration-700 ${
              buttonAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <Button variant="primary" theme="dark">
              APPLY NOW
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
