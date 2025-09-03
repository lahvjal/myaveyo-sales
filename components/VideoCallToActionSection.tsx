'use client'

import React from 'react'
import Button from './Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface VideoCallToActionSectionProps {
  className?: string
  buttonText?: string
  buttonVariant?: 'primary' | 'secondary'
  onButtonClick?: () => void
}

export default function VideoCallToActionSection({ 
  className = '',
  buttonText = 'GET STARTED',
  buttonVariant = 'primary',
  onButtonClick
}: VideoCallToActionSectionProps) {
  const buttonAnimation = useScrollAnimation<HTMLDivElement>({ delay: 400 })

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
      <div className="relative z-10 h-full flex items-end justify-center pb-16">
        {/* Bottom Center Button */}
        <div 
          ref={buttonAnimation.ref}
          className={`transition-all duration-700 ${
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
