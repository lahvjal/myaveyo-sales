"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'
import { siteUrl } from '@/lib/siteUrl'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    // If already logged in, redirect
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.replace('/user')
      }
    })
    // Show success banner after email confirmation
    const sp = new URLSearchParams(window.location.search)
    setConfirmed(sp.get('confirmed') === '1')
  }, [])

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setMessage(error.message)
    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/user'
    window.location.replace(redirect)
  }

  const sendMagicLink = async () => {
    setLoading(true)
    setMessage(null)
    const redirectTo = `${siteUrl}/auth/callback`
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })
    setLoading(false)
    if (error) return setMessage(error.message)
    setMessage('Magic link sent! Check your email.')
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    const redirectTo = `${siteUrl}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
    setLoading(false)
    if (error) setMessage(error.message)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0d0d0d] text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-3xl font-telegraf font-bold mb-6">Log in</h1>
        {confirmed && (
          <div className="mb-4 text-sm text-green-400">Email confirmed. Please sign in.</div>
        )}
        <form onSubmit={signIn} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-[3px] bg-[#171717] border border-[#262626] focus:outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-[3px] bg-[#171717] border border-[#262626] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-white text-black rounded-[3px] font-telegraf font-semibold disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="border-t border-white/10 flex-1" />
          <span className="text-white/60 text-sm">or</span>
          <div className="border-t border-white/10 flex-1" />
        </div>

        {/* <button onClick={sendMagicLink} disabled={loading || !email} className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] text-white rounded-[3px] font-telegraf font-semibold disabled:opacity-60 mb-3">
          Send magic link
        </button>
        <button onClick={signInWithGoogle} disabled={loading} className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] text-white rounded-[3px] font-telegraf font-semibold disabled:opacity-60">
          Continue with Google
        </button> */}

        <div className="mt-6 text-sm text-white/80">
          <a href="/signup" className="underline">Create account</a>
          <span className="mx-2">•</span>
          <a href="/forgot-password" className="underline">Forgot password?</a>
        </div>

        {message && <p className="mt-4 text-sm text-white/80">{message}</p>}
      </div>
    </div>
  )
}
