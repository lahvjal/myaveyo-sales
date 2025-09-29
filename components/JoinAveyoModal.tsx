"use client"

import React, { useState } from 'react'

interface JoinAveyoModalProps {
  open: boolean
  onClose: () => void
  onSubmitted?: () => void
}

export default function JoinAveyoModal({ open, onClose, onSubmitted }: JoinAveyoModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    experience: 'beginner',
    message: '',
  })

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [key]: e.target.value })
  }

  const validEmail = (v: string) => /.+@.+\..+/.test(v)
  const validPhone = (v: string) => v === '' || /[0-9()\-+\.\s]{7,}/.test(v)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.firstName || !form.lastName) return setError('Please enter your first and last name.')
    if (!validEmail(form.email)) return setError('Please enter a valid email.')
    if (!validPhone(form.phone)) return setError('Please enter a valid phone number.')

    setSubmitting(true)
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Submission failed (${res.status})`)
      }
      setSuccess(true)
      onSubmitted?.()
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-[620px] mx-4 bg-[#0f0f0f] text-white rounded-lg border border-[#2a2a2a] shadow-xl">
        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
          <h2 className="text-xl font-telegraf font-bold">Join Aveyo</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="text-2xl font-telegraf font-bold">Thanks! 🎉</div>
              <p className="text-white/75">We received your info. Our team will reach out shortly.</p>
              <button onClick={onClose} className="mt-2 px-5 py-2 bg-white text-black rounded-md font-semibold">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-900/40 border border-red-600 rounded text-red-200 text-sm">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">First name</label>
                  <input value={form.firstName} onChange={update('firstName')} className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Last name</label>
                  <input value={form.lastName} onChange={update('lastName')} className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={update('email')} className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Phone</label>
                  <input value={form.phone} onChange={update('phone')} className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Location</label>
                  <input value={form.location} onChange={update('location')} className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Experience</label>
                  <select value={form.experience} onChange={update('experience')} className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/20">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Message</label>
                <textarea rows={4} value={form.message} onChange={update('message')} className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-white/20 text-white/90 hover:bg-white/10">Cancel</button>
                <button disabled={submitting} className="px-5 py-2 bg-white text-black rounded-md font-semibold disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
