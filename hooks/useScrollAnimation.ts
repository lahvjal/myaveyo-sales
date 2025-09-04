'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  delay?: number
  rootMargin?: string
  disabled?: boolean
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>({
  threshold = 0.1,
  delay = 0,
  rootMargin = '0px 0px -50px 0px',
  disabled = false
}: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    if (disabled) {
      setIsVisible(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, delay, rootMargin, disabled])

  return { ref, isVisible }
}

export function useStaggeredScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  count: number,
  baseDelay: number = 0,
  staggerDelay: number = 100,
  disabled: boolean = false
) {
  const animations = Array.from({ length: count }, (_, index) =>
    useScrollAnimation<T>({ delay: baseDelay + index * staggerDelay, disabled })
  )

  return animations
}
