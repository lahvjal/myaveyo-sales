'use client'

import { track as vercelTrack } from '@vercel/analytics'

export const track = (event: string, props?: Record<string, any>) => {
  try {
    vercelTrack(event, props)
  } catch (e) {
    // no-op in SSR/non-browser contexts
  }
}
