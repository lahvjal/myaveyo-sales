import React, { useState, useRef } from 'react'
import ExpandableBlock from './ExpandableBlock'
import Button from './Button'
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation'
import { motion, useScroll, useTransform } from 'framer-motion'

interface OnTheInsideSectionProps {
  className?: string
  pageReady?: boolean
}

export default function OnTheInsideSection({ className = '', pageReady = true }: OnTheInsideSectionProps) {
  const [expandedBlock, setExpandedBlock] = useState<string>('001')
  const sectionRef = useRef<HTMLElement>(null)
  
  // Framer Motion scroll animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  })
  
  const containerWidth = useTransform(
    scrollYProgress,
    [0, 1],
    [1480, typeof window !== 'undefined' ? document.documentElement.clientWidth : 1920]
  )
  
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 1],
    [5, 0]
  )
  
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
  const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200, disabled: !pageReady })
  const descriptionAnimation = useScrollAnimation<HTMLDivElement>({ delay: 600, disabled: !pageReady })
  const videoAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })
  const blockAnimations = useStaggeredScrollAnimation<HTMLDivElement>(blocks.length, 400, 200, !pageReady)
  const buttonAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1200, disabled: !pageReady })

  return (
    <motion.section ref={sectionRef} className={`flex flex-col items-center pt-[130px] ${className}`}>
      <motion.div 
        className="bg-[#e6e6e6] py-[160px] px-[30px] mx-auto overflow-visible"
        style={{ 
          width: containerWidth,
          borderRadius: borderRadius
        }}
      >
        <div className="max-w-[1480px] mx-auto">
          {/* Header */}
          <div className="flex flex-row items-start justify-between w-[100%] pb-10 mb-[160px] h-[500px]">
            <div className="flex flex-col items-start justify-between h-[100%] max-w-[680px]">
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
              <div 
                ref={descriptionAnimation.ref}
                className={`font-telegraf w-[100%] pl-[30%] text-black text-[16px] leading-[28px] transition-all duration-700 ${
                  descriptionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                No limits, just wins. From your first deal to your biggest bonus, we set you up with the tools, training, and support you need to crush goals and climb fast. When you win, the whole team wins—and we celebrate every step of the way.
              </div>
            </div>
            {/* Video thumbnail section */}
            <div 
              ref={videoAnimation.ref}
              className={`w-[40%] mb-[40px] h-[100%] transition-all duration-700 ${
                videoAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="relative h-[100%] bg-black rounded-[5px] overflow-hidden cursor-pointer group">
                <img 
                  src="/images/consumer photos-29.jpeg"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
                  <img src="/play.svg" alt="Play" className="w-10 h-10 ml-1" />
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
      </motion.div>
    </motion.section>
  )
}
