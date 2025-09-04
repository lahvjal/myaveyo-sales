'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface VideoMaskSectionProps {
  className?: string
  pageReady?: boolean
}

export default function VideoMaskSection({ className = '', pageReady = true }: VideoMaskSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Framer Motion scroll animation for the entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  // Transform the mask scale from zoomed in (4x) to normal (1x) as user scrolls
  const maskScale = useTransform(scrollYProgress, [0, 0.7], [30, 1.3])
  
  // Parallax effect for the video - moves slower than scroll
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '0%'])
  
  // Mask positioning through scroll progress - moves from top to center to bottom
  // Mask positioning transforms - controls how the mask moves during scroll
  // maskY: Moves mask vertically from top (0%) to lower position (30%) as user scrolls
  // maskX: Moves mask horizontally from left (-50%) to right (20%) as user scrolls
  const maskY = useTransform(scrollYProgress, [0, 0.7], ['0%','0%'])
  const maskX = useTransform(scrollYProgress, [0, 0.7], ['-150%', '0%'])
  
  return (
    <motion.section 
      ref={sectionRef} 
      className={`relative w-full ${className}`}
      style={{ height: '300vh' }} // Make section much taller for immersive scroll
    >
      {/* Sticky Container for Video and Mask */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-10">
        {/* Background Video with Parallax */}
        <motion.div
          className="absolute inset-0 w-full h-[120%]" // Make video taller for parallax effect
          style={{ y: videoY }}
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/intro-compressed.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        {/* Animated Mask Overlay with Parallax */}
        <motion.div
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            scale: maskScale,
            y: maskY,
            x: maskX
          }}
        >
          <div 
            className="w-full h-full bg-[#0d0d0d]"
            style={{
              maskImage: 'url(/aveyo-cutout.svg)',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: 'url(/aveyo-cutout.svg)',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center'
            }}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}
