"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [canReset, setCanReset] = useState(false)
  const [errorHint, setErrorHint] = useState<string | null>(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const qpCode = url.searchParams.get('code')
    // Supabase often places tokens in the hash for recovery/magic links
    const hash = new URLSearchParams((window.location.hash || '').replace(/^#/, ''))
    const hashCode = hash.get('code')
    const access_token = hash.get('access_token')
    const refresh_token = hash.get('refresh_token')
    const hashError = hash.get('error') || url.searchParams.get('error')
    const hashErrorCode = hash.get('error_code') || url.searchParams.get('error_code')
    const hashErrorDesc = hash.get('error_description') || url.searchParams.get('error_description')
    const code = qpCode || hashCode

    const ensureSession = async () => {
      // Show friendly message for expired/invalid codes
      if (hashErrorCode === 'otp_expired') {
        setErrorHint('This reset link has expired. Please request a new one.')
      } else if (hashErrorCode === 'otp_invalid' || hashError === 'access_denied') {
        setErrorHint('This reset link is invalid. Please request a new one.')
      } else if (hashErrorDesc) {
        try {
          setErrorHint(decodeURIComponent(hashErrorDesc))
        } catch {
          setErrorHint(hashErrorDesc)
        }
      }

      // If we already have a session, allow reset
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setCanReset(true)
        return
      }
      // 1) If tokens are present in the hash, set session directly
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token })
        if (!error) {
          setCanReset(true)
          return
        }
      }
      // 2) Fallback to code exchange flows
      if (code) {
        // Support both signatures across versions: ({ code }) and (code)
        const authAny: any = supabase.auth as any
        let error: any = null
        try {
          const res = await authAny.exchangeCodeForSession({ code })
          error = res?.error || null
        } catch {
          const res = await authAny.exchangeCodeForSession(code)
          error = res?.error || null
        }
        if (!error) {
          setCanReset(true)
          return
        }
      }
      setCanReset(false)
    }
    ensureSession()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) return setMessage('Password must be at least 8 characters')
    if (password !== confirm) return setMessage('Passwords do not match')
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return setMessage(error.message)
    setMessage('Password updated! Redirecting...')
    setTimeout(() => {
      window.location.replace('/login')
    }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0d0d0d] text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-3xl font-telegraf font-bold mb-6">Reset password</h1>
        {!canReset ? (
          <div className="space-y-4">
            <p className="text-white/80">
              {errorHint || 'Open the password recovery link from your email to continue.'}
            </p>
            <a
              href="/forgot-password"
              className="inline-block px-4 py-3 bg-white text-black rounded-[3px] font-telegraf font-semibold"
            >
              Request a new reset link
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-3 rounded-[3px] bg-[#171717] border border-[#262626] focus:outline-none"
              required
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3 rounded-[3px] bg-[#171717] border border-[#262626] focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-white text-black rounded-[3px] font-telegraf font-semibold disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
        {message && <p className="mt-4 text-sm text-white/80">{message}</p>}
      </div>
    </div>
  )
}
