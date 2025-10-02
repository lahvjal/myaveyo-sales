import React, { useState, useEffect } from 'react'
import Button from './Button'
import StatCard2 from './StatCard2'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { motion } from 'framer-motion'

interface SalesSectionProps {
  className?: string
  pageReady?: boolean
  onJoinClick?: () => void
}

interface SalesContent {
  grid: {
    section_title: {
      prefix: string
      title: string
      content: string
    }
    copyright: {
      icon: string
      text: string
    }
    h3_text: {
      text: string
    }
    large_image: {
      alt: string
      url: string
    }
    text_block: {
      title: string
      content: string
    }
    button_block: {
      text: string
      variant: string
    }
    stat_card_1: {
      title: string
      value: string
      prefix: string
      suffix: string
      description: string
    }
    stat_card_2: {
      title: string
      value: string
      prefix: string
      suffix: string
      description: string
    }
    bottom_image: {
      alt: string
      url: string
    }
  }
}

export default function SalesSection({ className = '', pageReady = true, onJoinClick }: SalesSectionProps) {
  const [content, setContent] = useState<SalesContent>({
    grid: {
      section_title: {
        prefix: '(3)',
        title: 'Not your average sales gig.',
        content: ''
      },
      copyright: {
        icon: '/images/world.svg',
        text: '2025 aveyo_sales'
      },
      h3_text: {
        text: 'UNLIMITED POTENTIAL. PROVEN METHODS. MASSIVE EARNINGS. REAL FREEDOM. AND A CULTURE THAT CARES. HERE, YOUR HARD WORK SPEAKS FOR ITSELF.'
      },
      large_image: {
        alt: 'Sales representative',
        url: '/images/donny-hammond.jpeg'
      },
      text_block: {
        title: 'A COMPLETELY KITTED TOOL KIT.',
        content: 'No limits, just wins. From your first deal to your biggest bonus, we set you up with the tools, training, and support you need to crush goals and climb fast. When you win, the whole team wins—and we celebrate every step of the way.'
      },
      button_block: {
        text: 'JOIN THE TEAM',
        variant: 'primary'
      },
      stat_card_1: {
        title: 'Sales Reps Nationwide',
        value: '150',
        prefix: '',
        suffix: '+',
        description: 'We are a growing team across the country'
      },
      stat_card_2: {
        title: 'Industry leading leadership',
        value: '3',
        prefix: 'TOP',
        suffix: '',
        description: 'And Sales Support'
      },
      bottom_image: {
        alt: 'Team photo',
        url: '/images/Alpha Aveyo-4.jpeg'
      }
    }
  })

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/sales')
        if (response.ok) {
          const data = await response.json()
          setContent(data as SalesContent)
        }
      } catch (error) {
        console.error('Failed to fetch sales content:', error)
        // Keep default content on error
      }
    }

    fetchContent()
  }, [])

  const imgCard = "http://localhost:3845/assets/aefbcf1e801101e6f975e071036c708ab99584f1.png"
  const imgCard1 = "http://localhost:3845/assets/2cc6b99064c5dec2895c25489e864578ff6e43dd.png"
  const imgUnion = "http://localhost:3845/assets/80c219426186feb64d676f8cfead76d4e8dbbae5.svg"
  const imgUnion1 = "http://localhost:3845/assets/35c89e8b53e75e6b47294d4f5ba80fa1ffc1e608.svg"
  const imgVector116 = "http://localhost:3845/assets/b74939b67987caa88b59e0e1a8a00f872135632d.svg"

  // Animation hooks
  const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200, disabled: !pageReady })
  const copyrightAnimation = useScrollAnimation<HTMLDivElement>({ delay: 400, disabled: !pageReady })
  const descriptionAnimation = useScrollAnimation<HTMLDivElement>({ delay: 600, disabled: !pageReady })
  const imageCardAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })
  const textBlockAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })
  const buttonAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })
  const statCard1Animation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })
  const statCard2Animation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })
  const bottomImageAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })

  return (
    <section className={`px-6 sm:px-8 md:px-10 lg:px-[50px] py-16 sm:py-20 lg:py-[130px] relative flex flex-col items-center overflow-hidden ${className}`} id="sales-section">

      <div className="max-w-[1480px] mx-auto pb-[30px] relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 pb-8 sm:pb-10 mb-10 sm:mb-16 lg:mb-20">
          <div 
            ref={headerAnimation.ref}
            className={`flex items-start gap-2.5 text-white transition-all duration-700 ${
              headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <span className="text-[14px] sm:text-[16px] font-telegraf">{content.grid.section_title.prefix}</span>
            <h2 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] font-telegraf font-extrabold uppercase leading-[32px] sm:leading-[42px] md:leading-[52px] lg:leading-[63px] max-w-[900px]">
              {content.grid.section_title.title}
            </h2>
          </div>
        </div>

        {/* Content Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 sm:pb-10 mb-10 sm:mb-16 lg:mb-20">
          {/* Left Side - Rotated Copyright */}
          <div 
            ref={copyrightAnimation.ref}
            className={`hidden md:flex h-[0px] items-center justify-center relative w-[0px] transition-all duration-700 ${
              copyrightAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="flex-none rotate-[90deg]">
              <div className="flex gap-5 items-center justify-start opacity-40 pb-[30px]">
                <div className="relative size-[49.586px]">
                  <img alt="" className="block max-w-none size-full" src="/images/world-icon.svg" />
                </div>
                <div className="font-telegraf font-extrabold text-white text-[15px] uppercase text-nowrap">
                  {content.grid.copyright.text}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Description */}
          <div 
            ref={descriptionAnimation.ref}
            className={`font-telegraf font-bold text-white text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] text-left md:text-right uppercase w-full md:w-[642.702px] transition-all duration-700 ${
              descriptionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <span className="font-telegraf font-black">
              {content.grid.h3_text.text}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <motion.div 
          className="grid md:auto-rows-[300px] sm:auto-rows-[200px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
              }
            }
          }}
        >
          {/* Large Image Card - spans 2 rows, 1 column */}
          <div 
            className="lg:row-span-2 bg-cover bg-center bg-no-repeat rounded-[3px] relative overflow-hidden min-h-[240px]"
            style={{ backgroundImage: `url('${content.grid.large_image.url}')` }}
            ref={imageCardAnimation.ref}
          >
            <div className="flex flex-row h-full w-full">
              <motion.div 
                className="flex-1 bg-[#0d0d0d]"
                initial={{ y: 0 }}
                animate={imageCardAnimation.isVisible ? { y: "-100%" } : { y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
              <motion.div 
                className="flex-1 bg-[#0d0d0d]"
                initial={{ y: 0 }}
                animate={imageCardAnimation.isVisible ? { y: "-100%" } : { y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.4,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
            </div>
          </div>

          {/* Text Block */}
          <div 
            ref={textBlockAnimation.ref}
            className={`flex flex-col items-start justify-center px-5 sm:px-[30px] py-4 sm:py-0 transition-all duration-700 ${
              textBlockAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <b className='mb-[20px] sm:mb-[40px]'>{content.grid.text_block.title}</b>
            <div className="font-telegraf text-white text-[14px] sm:text-[16px] leading-[24px] sm:leading-[28px] w-full">
              {content.grid.text_block.content}
            </div>
          </div>

          {/* Join Button */}
          <div 
            ref={buttonAnimation.ref}
            className={`flex flex-col items-center justify-center px-6 sm:px-[90px] py-2.5 transition-all duration-700 ${
              buttonAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <Button variant={content.grid.button_block.variant as any} className="w-full" onClick={onJoinClick}>
              {content.grid.button_block.text}
            </Button>
          </div>

          {/* Stats Card 1 */}
          <div 
            ref={statCard1Animation.ref}
            className={`transition-all duration-700 ${
              statCard1Animation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <StatCard2
              value={content.grid.stat_card_1.value}
              prefix={content.grid.stat_card_1.prefix}
              suffix={content.grid.stat_card_1.suffix}
              title={content.grid.stat_card_1.title}
              description={content.grid.stat_card_1.description}
              className='h-full'
              isVisible={statCard1Animation.isVisible}
              delay={200}
            />
          </div>

          {/* Stats Card 2 */}
          <div 
            ref={statCard2Animation.ref}
            className={`transition-all duration-700 ${
              statCard2Animation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <StatCard2
              value={content.grid.stat_card_2.value}
              prefix={content.grid.stat_card_2.prefix}
              suffix={content.grid.stat_card_2.suffix}
              title={content.grid.stat_card_2.title}
              description={content.grid.stat_card_2.description}
              className='h-full'
              isVisible={statCard2Animation.isVisible}
              delay={400}
            />
          </div>

          {/* Large Bottom Image */}
          <div 
            className="lg:row-span-2 lg:col-span-3 bg-cover bg-center bg-no-repeat rounded-[3px] relative overflow-hidden min-h-[260px]"
            style={{ backgroundImage: `url('${content.grid.bottom_image.url}')` }}
            ref={bottomImageAnimation.ref}
          >
            <div className="flex flex-row h-full w-full">
              <motion.div 
                className="flex-1 bg-[#0d0d0d]"
                initial={{ y: 0 }}
                animate={bottomImageAnimation.isVisible ? { y: "-100%" } : { y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
              <motion.div 
                className="flex-1 bg-[#0d0d0d]"
                initial={{ y: 0 }}
                animate={bottomImageAnimation.isVisible ? { y: "-100%" } : { y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
              <motion.div 
                className="flex-1 bg-[#0d0d0d]"
                initial={{ y: 0 }}
                animate={bottomImageAnimation.isVisible ? { y: "-100%" } : { y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.4,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
              <motion.div 
                className="flex-1 bg-[#0d0d0d]"
                initial={{ y: 0 }}
                animate={bottomImageAnimation.isVisible ? { y: "-100%" } : { y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.5,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
              <motion.div 
                className="flex-1 bg-[#0d0d0d]"
                initial={{ y: 0 }}
                animate={bottomImageAnimation.isVisible ? { y: "-100%" } : { y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.6,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
              <motion.div 
                className="flex-1 bg-[#0d0d0d]"
                initial={{ y: 0 }}
                animate={bottomImageAnimation.isVisible ? { y: "-100%" } : { y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.7,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      {/* Background Union */}
      <div
        className="absolute h-[auto] bottom-[-1070px] w-[110%] z-0"
      >
        <img alt="" className="block max-w-none size-full opacity-[3%] object-cover" src="/aveyoSalesLogo.svg" />
      </div>
    </section>
  )
}
