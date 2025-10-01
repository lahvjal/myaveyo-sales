"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export const dynamic = 'force-dynamic'

type Me = {
  id?: string
  sub?: string
  email?: string
  rep_id?: string | null
  first_name?: string | null
  last_name?: string | null
  isAdmin?: boolean
  email_verified?: boolean
  phone_verified?: boolean
  role?: string | null
  user_metadata?: Record<string, any>
}

export default function UserProfilePage() {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/me', { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to load profile (${res.status})`)
        const json = await res.json()
        setMe(json || null)
      } catch (e: any) {
        setError(e?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AdminLayout pageKey="dashboard" topBarTitle="Profile">
      <div className="min-h-screen w-full bg-[#0d0d0d] text-white">
        <div className="mx-auto w-full px-6 md:px-10 pt-10 md:pt-[60px] max-w-[1480px]">
          <h1 className="text-3xl md:text-5xl font-telegraf font-bold mb-6">My Profile</h1>

          {loading ? (
            <div className="text-white/70">Loading...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : !me ? (
            <div className="text-white/70">No profile found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Card */}
              <div className="rounded-[8px] border border-[#2a2a2a] bg-[#111] p-5">
                <div className="text-white/60 text-sm mb-3">Account</div>
                <div className="space-y-3 text-sm">
                  <Row label="User ID">{me.id || me.sub || '-'}</Row>
                  <Row label="Email">{me.email || '-'}</Row>
                  <Row label="Role">{me.role || (me.isAdmin ? 'admin' : 'rep') || '-'}</Row>
                  <Row label="Rep ID">{me.rep_id || '-'}</Row>
                </div>
              </div>

              {/* Verification Card */}
              <div className="rounded-[8px] border border-[#2a2a2a] bg-[#111] p-5">
                <div className="text-white/60 text-sm mb-3">Verification</div>
                <div className="space-y-3 text-sm">
                  <Row label="Email Verified">{bool(me.email_verified)}</Row>
                  <Row label="Phone Verified">{bool(me.phone_verified)}</Row>
                  <Row label="Admin">{bool(!!me.isAdmin)}</Row>
                </div>
              </div>

              {/* Identity Card */}
              <div className="rounded-[8px] border border-[#2a2a2a] bg-[#111] p-5">
                <div className="text-white/60 text-sm mb-3">Identity</div>
                <div className="space-y-3 text-sm">
                  <Row label="First Name">{me.first_name || me.user_metadata?.first_name || '-'}</Row>
                  <Row label="Last Name">{me.last_name || me.user_metadata?.last_name || '-'}</Row>
                </div>
              </div>

              {/* Raw Metadata Card */}
              <div className="rounded-[8px] border border-[#2a2a2a] bg-[#111] p-5 overflow-auto">
                <div className="text-white/60 text-sm mb-3">Raw Metadata</div>
                <pre className="text-xs text-white/80 whitespace-pre-wrap break-words">
                  {JSON.stringify(me, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-36 shrink-0 text-white/60">{label}</div>
      <div className="flex-1 text-white/90 break-words">{children}</div>
    </div>
  )
}

function bool(v?: boolean) {
  if (v === undefined || v === null) return '-'
  return v ? 'Yes' : 'No'
}
