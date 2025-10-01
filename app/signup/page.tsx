"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'
import { siteUrl } from '@/lib/siteUrl'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repId, setRepId] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.replace('/user')
      }
    })
  }, [])

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rep_id: repId.trim() }),
      })
      setLoading(false)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        return setMessage(data?.error || 'Failed to sign up')
      }
      setMessage(data?.message || 'Check your email to confirm your account.')
    } catch (err: any) {
      setLoading(false)
      setMessage(err?.message || 'Failed to sign up')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0d0d0d] text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-3xl font-telegraf font-bold mb-6">Sign up</h1>
        <form onSubmit={signUp} className="space-y-4">
          <input
            type="text"
            value={repId}
            onChange={(e) => setRepId(e.target.value)}
            placeholder="Rep ID"
            className="w-full px-4 py-3 rounded-[3px] bg-[#171717] border border-[#262626] focus:outline-none"
            required
          />
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
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-white text-black rounded-[3px] font-telegraf font-semibold disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-sm text-white/80">
          <a href="/login" className="underline">Already have an account? Log in</a>
        </div>

        {message && <p className="mt-4 text-sm text-white/80">{message}</p>}
      </div>
    </div>
  )
}
