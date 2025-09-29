"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const [message, setMessage] = useState('Finishing sign-in...')

  useEffect(() => {
    const run = async () => {
      try {
        // Handles magic link and OAuth PKCE flows
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code') || undefined
        if (!code) {
          throw new Error('Missing authorization code in callback URL')
        }
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) throw error

        const params = new URLSearchParams(window.location.search)
        const type = params.get('type')
        const redirect = params.get('redirect')

        if (type === 'recovery') {
          // When coming from a password recovery link, send to reset form
          window.location.replace('/reset-password')
          return
        }

        window.location.replace(redirect || '/user')
      } catch (e: any) {
        console.error(e)
        setMessage(e.message || 'Authentication failed')
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
      <p className="text-white/80">{message}</p>
    </div>
  )
}
