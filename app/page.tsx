'use client'

import React, { useState } from 'react'
import Button from '@/components/Button'
import LetsTalkCard from '@/components/LetsTalkCard'
import Navbar from '@/components/Navbar'
import StatsSection from '@/components/StatsSection'
import IncentivesSection from '@/components/IncentivesSection'
import SalesSection from '@/components/SalesSection'
import OnTheInsideSection from '@/components/OnTheInsideSection'
import BuildCareers from '@/components/BuildCareers'
import RotatingLogoBanner from '@/components/RotatingLogoBanner'
import VideoCallToActionSection from '@/components/VideoCallToActionSection'
import PageLoader from '@/components/PageLoader'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

// Image constants from Figma
const imgAMan = "http://localhost:3845/assets/c75767911e539a98cf3080c76af0df77e6a62117.png"
const imgFrame157 = "http://localhost:3845/assets/9e76bd435a037801fde2cb5914636ad4afe51b19.png"
const imgUnion = "http://localhost:3845/assets/2f982368dcdf0c844c261719034ae8aa1f62e998.svg"
const imgUnion1 = "http://localhost:3845/assets/7dce532d62b76cfb27ce43354d83030e92ea9b74.svg"
const imgVector116 = "http://localhost:3845/assets/5fe2a32dc067120eb3a1b0499801e0069a379f4e.svg"
const imgVector117 = "http://localhost:3845/assets/b74939b67987caa88b59e0e1a8a00f872135632d.svg"

export default function Home() {
  const [showLoader, setShowLoader] = useState(true)
  const [pageReady, setPageReady] = useState(false)

  const handleLoaderComplete = () => {
    setShowLoader(false)
    // Small delay to ensure loader is fully gone before starting page animations
    setTimeout(() => {
      setPageReady(true)
    }, 100)
  }

  const welcomeAnimation = useScrollAnimation<HTMLParagraphElement>({ delay: 200, disabled: !pageReady })
  const headingAnimation = useScrollAnimation<HTMLHeadingElement>({ delay: 400, disabled: !pageReady })
  const subheadingAnimation = useScrollAnimation<HTMLHeadingElement>({ delay: 600, disabled: !pageReady })
  const buttonsAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })
  const descriptionAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1000, disabled: !pageReady })
  const copyrightAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1100, disabled: !pageReady })
  const cardAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1200, disabled: !pageReady })

  return (
    <>
      {showLoader && (
        <PageLoader onComplete={handleLoaderComplete} />
      )}
      <div className="bg-[#0d0d0d] min-h-screen flex flex-col">
        {/* Hero Section with Video Background */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center center',
            minWidth: '100%',
            minHeight: '100%'
          }}
          // poster="https://images.unsplash.com/photo-1551524164-687a55dd1126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
        >
          {/* <source src="/videos/aveyoWEB1.mov" type="video/quicktime" /> */}
          {/* Fallback for better browser compatibility */}
          <source src="/videos/aveyoWEB1a.mp4" type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-black/20" />
        {/* Navigation */}
        <Navbar />

        {/* Hero Content */}
        <div className="flex flex-col justify-between px-24 py-16 min-h-[calc(100vh-120px)] relative z-10">
          {/* Main Hero Text */}
          <div className="flex-1 flex flex-col justify-end pb-12">
            <div className="max-w-4xl">
              <p 
                ref={welcomeAnimation.ref}
                className={`text-white text-[11px] tracking-[4.4px] uppercase mb-8 opacity-80 font-telegraf transition-all duration-700 ${
                  welcomeAnimation.isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                WELCOME
              </p>
              
              <h2 
                ref={headingAnimation.ref}
                className={`text-white text-[100px] font-black uppercase leading-[84px] mb-5 font-telegraf transition-all duration-700 ${
                  headingAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                EPICENTER OF EVERYTHING AWESOME
              </h2>
              <h1 
                ref={subheadingAnimation.ref}
                className={`text-white text-[40px] font-extrabold uppercase leading-[30px] mb-12 font-telegraf transition-all duration-700 ${
                  subheadingAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                EARNING. LIVING. GROWING.
              </h1>
              {/* CTA Buttons */}
              <div 
                ref={buttonsAnimation.ref}
                className={`flex gap-8 transition-all duration-700 ${
                  buttonsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                <Button variant="primary">
                  JOIN AVEYO
                </Button>
                <Button variant="secondary">
                  LOGIN
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-end justify-between">
            {/* Left - Description */}
            <div 
              ref={descriptionAnimation.ref}
              className={`max-w-[406px] transition-all duration-700 ${
                descriptionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <p className="text-white text-xl leading-normal font-telegraf">
              Earn Better. Experience More. Live Brighter. A more fulfilling future is waiting for you.
              </p>
            </div>

            {/* Center - Copyright */}
            <div 
              ref={copyrightAnimation.ref}
              className={`text-center transition-all duration-700 ${
                copyrightAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <p className="text-[rgba(255,255,255,0.4)] text-[15px] uppercase font-telegraf">
                © 2025 MYAVEYO
              </p>
            </div>

            {/* Right - Let's Talk Card */}
            <div 
              ref={cardAnimation.ref}
              className={`transition-all duration-700 ${
                cardAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <LetsTalkCard 
                backgroundImage={imgFrame157}
                onClick={() => console.log('Let\'s talk clicked')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <StatsSection pageReady={pageReady} />

      {/* Rotating Logo Banner */}
      <RotatingLogoBanner />

      {/* Incentives Section */}
      <IncentivesSection pageReady={pageReady} />

      {/* Sales Section */}
      <SalesSection pageReady={pageReady} />

      {/* On The Inside Section */}
      <OnTheInsideSection pageReady={pageReady} />

      {/* Video Call to Action Section */}
      <VideoCallToActionSection 
        buttonText="JOIN THE TEAM"
        onButtonClick={() => console.log('Join the team clicked')}
        pageReady={pageReady}
      />

      </div>
    </>
  )
}
