"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-browser'

export default function AuthCallbackPage() {
  const [message, setMessage] = useState('Finishing sign-in...')
  const [showLoginCta, setShowLoginCta] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        // Handles magic link and OAuth PKCE flows
        const url = new URL(window.location.href)
        const params = new URLSearchParams(url.search)
        const hashParams = new URLSearchParams((window.location.hash || '').replace(/^#/, ''))

        const code = params.get('code') || hashParams.get('code') || undefined
        const access_token = hashParams.get('access_token')
        const refresh_token = hashParams.get('refresh_token')
        const err = hashParams.get('error') || params.get('error')
        const errDesc = hashParams.get('error_description') || params.get('error_description')

        // 1) If hash tokens are present, set the session directly
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) throw error
        } else if (code) {
          // 2) Otherwise, exchange authorization code for a session
          const authAny: any = supabase.auth as any
          let error: any = null
          try {
            const res = await authAny.exchangeCodeForSession({ code })
            error = res?.error || null
          } catch {
            const res = await authAny.exchangeCodeForSession(code)
            error = res?.error || null
          }
          if (error) throw error
        } else {
          // Some email confirmations redirect without tokens; treat as confirmed and prompt sign-in
          if (err) {
            throw new Error(decodeURIComponent(errDesc || err))
          }
          setMessage('Email confirmed. You can now sign in.')
          setShowLoginCta(true)
          // Also auto-redirect after a short delay for convenience
          setTimeout(() => window.location.replace('/login'), 1500)
          return
        }

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
        setShowLoginCta(true)
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-white/80">{message}</p>
        {showLoginCta && (
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-white text-black rounded-[3px] font-telegraf font-semibold"
          >
            Go to login
          </a>
        )}
      </div>
    </div>
  )
}
