'use client'

import React from 'react'
import Button from './Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface VideoCallToActionSectionProps {
  buttonText: string
  onButtonClick: () => void
  className?: string
  pageReady?: boolean
  buttonVariant?: 'primary' | 'secondary'
}

export default function VideoCallToActionSection({ 
  buttonText, 
  onButtonClick, 
  className = '', 
  pageReady = true, 
  buttonVariant = 'primary'
}: VideoCallToActionSectionProps) {
  const buttonAnimation = useScrollAnimation<HTMLDivElement>({ delay: 400, disabled: !pageReady })

  return (
    <section className={`px-[50px] relative w-full h-screen overflow-hidden ${className}`}>
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/aveyo-cool-bg.mp4" type="video/mp4" />
      </video>
      
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center pb-16">
        {/* Bottom Center Button */}
        <div 
          ref={buttonAnimation.ref}
          className={`transition-all duration-700 mt-[800px] ${
            buttonAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <Button 
            variant={buttonVariant}
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  )
}
