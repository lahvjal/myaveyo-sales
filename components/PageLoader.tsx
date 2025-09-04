import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageLoaderProps {
  onComplete?: () => void
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        onComplete?.()
      }, 800) // Wait for exit animation to complete
    }, 2000) // Show loader for 2 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0d]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Curtain reveal animation */}
          <div className="absolute inset-0 flex flex-row">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-[#0d0d0d]"
                initial={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
            ))}
          </div>

          {/* Loading content */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Logo or brand name */}
            <motion.h1
              className="text-white text-[48px] font-telegraf font-black mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              AVEYO
            </motion.h1>

            {/* Loading dots animation */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
