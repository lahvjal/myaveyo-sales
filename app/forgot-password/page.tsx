"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const redirectTo = `${window.location.origin}/auth/callback?type=recovery`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    setLoading(false)
    if (error) return setMessage(error.message)
    setMessage('Password reset email sent. Check your inbox.')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0d0d0d] text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-3xl font-telegraf font-bold mb-6">Forgot password</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-[3px] bg-[#171717] border border-[#262626] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-white text-black rounded-[3px] font-telegraf font-semibold disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send reset email'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-white/80">{message}</p>}
      </div>
    </div>
  )
}
