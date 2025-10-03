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
      // When disabled (e.g., during page loader), keep content hidden so it can animate-in later
      // once animations are enabled and the element enters the viewport.
      setIsVisible(false)
      return
    }

    // Helper to find the nearest scrollable parent to use as IntersectionObserver root
    const getScrollParent = (el: HTMLElement | null): HTMLElement | null => {
      let parent: HTMLElement | null = el?.parentElement || null
      while (parent) {
        const style = window.getComputedStyle(parent)
        const overflowY = style.overflowY
        const overflow = style.overflow
        const isScrollable = ['auto', 'scroll'].includes(overflowY) || ['auto', 'scroll'].includes(overflow)
        if (isScrollable && parent.scrollHeight > parent.clientHeight) {
          return parent
        }
        parent = parent.parentElement
      }
      return null
    }

    const rootEl = getScrollParent(ref.current)

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
        rootMargin,
        root: rootEl || null
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
      
      // Check if element is already in viewport after a small delay to ensure DOM is ready
      setTimeout(() => {
        if (currentRef) {
          const rect = currentRef.getBoundingClientRect()
          if (rootEl) {
            const rootRect = rootEl.getBoundingClientRect()
            const isInViewport = rect.top < rootRect.bottom && rect.bottom > rootRect.top
            if (isInViewport) {
              setTimeout(() => {
                setIsVisible(true)
              }, delay)
            }
          } else {
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
            if (isInViewport) {
              setTimeout(() => {
                setIsVisible(true)
              }, delay)
            }
          }
        }
      }, 100)
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
