"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [canReset, setCanReset] = useState(false)

  useEffect(() => {
    // Ensure we have a recovery session (arrives via /auth/callback?type=recovery)
    supabase.auth.getSession().then(({ data }) => {
      setCanReset(Boolean(data.session))
    })
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
          <p className="text-white/80">Open the password recovery link from your email to continue.</p>
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
