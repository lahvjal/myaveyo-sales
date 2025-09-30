"use client"

import { useEffect, useMemo, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"

type JoinRequest = {
  id: string
  created_at?: string
  first_name?: string
  last_name?: string
  full_name?: string
  email?: string
  phone?: string
  city?: string
  state?: string
  source?: string
  notes?: string
  message?: string
  experience?: string
}

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<JoinRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/admin/join-requests", { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load applications (${res.status})`)
        const json = await res.json()
        setRows(Array.isArray(json?.data) ? json.data : [])
      } catch (e: any) {
        console.error("/admin/applications fetch error:", e)
        setError(e?.message || "Failed to load applications")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) =>
      [
        r.full_name,
        [r.first_name, r.last_name].filter(Boolean).join(' '),
        r.email,
        r.phone,
        [r.city, r.state].filter(Boolean).join(' '),
        r.notes,
        r.message,
        r.experience,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [rows, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageClamped = Math.min(page, totalPages)
  const paged = filtered.slice((pageClamped - 1) * pageSize, pageClamped * pageSize)

  return (
    <AdminLayout
      pageKey="admin"
      topBarTitle="Admin"
      breadcrumbs={[
        { name: "Admin", href: "/admin" },
        { name: "Applications" },
      ]}
    >
      <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
        <div className="max-w-7xl mx-auto text-white">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-telegraf font-bold">Applications</h1>
            <div className="text-white/60">{rows.length} total</div>
          </div>

          <div className="mb-6">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search name, email, phone, city, state, source..."
              className="w-full md:w-[420px] px-3 py-2 rounded bg-[#1a1a1a] border border-[#2a2a2a] outline-none focus:border-white/40"
            />
          </div>

          {loading ? (
            <div className="text-white/70">Loading...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <div className="rounded-[6px] border border-[#2a2a2a] overflow-hidden">
              <div className="grid grid-cols-7 gap-0 bg-[#111] px-4 py-3 text-sm text-white/60">
                <div>Date</div>
                <div>Name</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Location</div>
                <div>Experience</div>
                <div>Message</div>
              </div>
              <div>
                {paged.map((r) => (
                  <div key={r.id} className="grid grid-cols-7 gap-0 px-4 py-3 border-t border-[#222] text-sm">
                    <div className="text-white/80">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'}</div>
                    <div className="truncate">{r.full_name || [r.first_name, r.last_name].filter(Boolean).join(' ') || '-'}</div>
                    <div className="truncate">{r.email || '-'}</div>
                    <div className="truncate">{r.phone || '-'}</div>
                    <div className="truncate">{[r.city, r.state].filter(Boolean).join(', ') || '-'}</div>
                    <div className="truncate" title={(r.experience || '') as string}>{r.experience || '-'}</div>
                    <div className="truncate relative group" title={(r.message || r.notes || '') as string}>
                      {r.message || r.notes || '-'}
                      {(r.message || r.notes) && (
                        <div className="hidden group-hover:block absolute left-0 top-full mt-1 z-50 max-w-[560px] whitespace-pre-wrap rounded border border-[#2a2a2a] bg-[#0f0f0f] p-3 text-white shadow-xl">
                          {r.message || r.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {paged.length === 0 && (
                  <div className="px-4 py-8 text-white/60">No applications</div>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > pageSize && (
            <div className="mt-6 flex items-center gap-3">
              <button
                className="px-3 py-2 rounded bg-[#1a1a1a] border border-[#2a2a2a] disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageClamped === 1}
              >
                Prev
              </button>
              <div className="text-white/70 text-sm">
                Page {pageClamped} of {totalPages}
              </div>
              <button
                className="px-3 py-2 rounded bg-[#1a1a1a] border border-[#2a2a2a] disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageClamped === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

