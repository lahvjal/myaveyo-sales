import React from 'react'
import Button from './Button'
import StatCard2 from './StatCard2'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { motion } from 'framer-motion'

interface SalesSectionProps {
  className?: string
  pageReady?: boolean
}

export default function SalesSection({ className = '', pageReady = true }: SalesSectionProps) {
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
    <section className={`px-[50px] py-[130px] relative flex flex-col items-center ${className}`}>

      <div className="max-w-[1480px] mx-auto pb-[30px] relative z-10">
        {/* Header */}
        <div className="flex items-center justify-start pb-10 mb-20">
          <div 
            ref={headerAnimation.ref}
            className={`flex items-start gap-2.5 text-white transition-all duration-700 ${
              headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <span className="text-[16px] font-telegraf">(3)</span>
            <h2 className="text-[60px] font-telegraf font-extrabold uppercase leading-[63px] w-[623.886px]">
              Not Your Average Sales Gig.
            </h2>
          </div>
        </div>

        {/* Content Row */}
        <div className="flex items-center justify-between pb-10 mb-20">
          {/* Left Side - Rotated Copyright */}
          <div 
            ref={copyrightAnimation.ref}
            className={`flex h-[0px] items-center justify-center relative w-[0px] transition-all duration-700 ${
              copyrightAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="flex-none rotate-[90deg]">
              <div className="flex gap-5 items-center justify-start opacity-40 pb-[30px]">
                <div className="relative size-[49.586px]">
                  <img alt="" className="block max-w-none size-full" src="/images/world-icon.svg" />
                </div>
                <div className="font-telegraf font-extrabold text-white text-[15px] uppercase text-nowrap">
                  © 2025 myaveyo
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Description */}
          <div 
            ref={descriptionAnimation.ref}
            className={`font-telegraf font-bold text-white text-[30px] text-right uppercase w-[642.702px] transition-all duration-700 ${
              descriptionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <span className="font-telegraf font-black">
            UNLIMITED POTENTIAL. PROVEN METHODS. MASSIVE EARNINGS. REAL FREEDOM.
            </span>
            <span className="text-[rgba(255,255,255,0.6)]">
              {' '}AND A CULTURE THAT CARES. HERE, YOUR HARD WORK SPEAKS FOR ITSELF.
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <motion.div 
          className="grid grid-cols-3 grid-rows-4 gap-5 h-[1386px] w-full"
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
            className="row-span-2 bg-cover bg-center bg-no-repeat rounded-[3px] relative overflow-hidden"
            style={{ backgroundImage: `url('/images/donny-hammond.jpeg')` }}
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

          {/* Text Block - middle column, first row */}
          <div 
            ref={textBlockAnimation.ref}
            className={`flex flex-col items-start justify-center px-[30px] py-0 transition-all duration-700 ${
              textBlockAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <b className='mb-[40px]'>A COMPLETELY KITTED TOOL KIT.</b>
            <div className="font-telegraf text-white text-[16px] leading-[28px] w-full">
              No limits, just wins. From your first deal to your biggest bonus, we set you up with the tools, training, and support you need to crush goals and climb fast. When you win, the whole team wins—and we celebrate every step of the way.
            </div>
          </div>

          {/* Join Button - right column, first row */}
          <div 
            ref={buttonAnimation.ref}
            className={`flex flex-col items-center justify-center px-[90px] py-2.5 transition-all duration-700 ${
              buttonAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <Button variant="primary" className="w-full">
              JOIN THE TEAM
            </Button>
          </div>

          {/* Stats Card 1 - middle column, second row */}
          <div 
            ref={statCard1Animation.ref}
            className={`transition-all duration-700 ${
              statCard1Animation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <StatCard2
              value="540"
              title="Milestones Achieved"
              description="Career milestones achieved by Aveyo reps last year"
              className='h-full'
              isVisible={statCard1Animation.isVisible}
              delay={200}
            />
          </div>

          {/* Stats Card 2 - right column, second row */}
          <div 
            ref={statCard2Animation.ref}
            className={`transition-all duration-700 ${
              statCard2Animation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <StatCard2
              value="850"
              prefix="$"
              suffix="K"
              title="Total Earned"
              description="By our reps in commissions and bonuses"
              className='h-full'
              isVisible={statCard2Animation.isVisible}
              delay={400}
            />
          </div>

          {/* Large Bottom Image - spans 2 rows, 3 columns */}
          <div 
            className="row-span-2 col-span-3 bg-cover bg-center bg-no-repeat rounded-[3px] relative overflow-hidden"
            style={{ backgroundImage: `url('/images/Alpha Aveyo-4.jpeg')` }}
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
        className="absolute h-[500px] top-[1900px] w-[1200px] z-0 overflow-hidden"
      >
        <img alt="" className="block max-w-none size-full opacity-5 object-cover" src="/aveyoSalesLogo.svg" />
      </div>
    </section>
  )
}
