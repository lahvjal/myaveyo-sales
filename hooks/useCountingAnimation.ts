'use client'

import { useEffect, useState } from 'react'

interface UseCountingAnimationOptions {
  start?: number
  end: number
  duration?: number
  delay?: number
  isVisible?: boolean
}

export function useCountingAnimation({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  isVisible = true
}: UseCountingAnimationOptions) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    if (!isVisible) {
      setCount(start)
      return
    }

    const timer = setTimeout(() => {
      let startTime: number | null = null
      const startValue = start
      const endValue = end
      const totalDuration = duration

      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / totalDuration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = startValue + (endValue - startValue) * easeOutQuart

        setCount(Math.round(currentValue))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timer)
  }, [start, end, duration, delay, isVisible])

  return count
}
