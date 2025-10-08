"use client"

import React, { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import MapWithPins, { MapPin } from "@/components/map/MapWithPins"

export default function MapPage() {
  const [pins, setPins] = useState<MapPin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const url = "/api/map/projects?status=all&limit=all&raw=true"
        console.log("[MapPage] Fetching pins:", url)
        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) throw new Error(`API ${res.status}`)
        const json = await res.json()
        console.log("[MapPage] API response: pins=", json?.pins?.length, json?.remaining ? `remaining=${json.remaining}` : "")
        if (alive) setPins(json.pins || [])
      } catch (e: any) {
        console.error("[MapPage] Failed to load pins:", e)
        if (alive) setError(e?.message || "Failed to load pins")
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  return (
    <AdminLayout pageKey="map" topBarTitle="Map" breadcrumbs={[]}>
      <div className="relative h-[calc(100vh-80px)] w-full">
        <MapWithPins pins={pins} />
        <div className="absolute top-4 left-4 text-xs text-white/80 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-md shadow">
          {loading ? "Loading…" : `Count: ${pins.length.toLocaleString()}`}
        </div>
        {loading && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-xs text-white/60">Loading project pins…</div>
          </div>
        )}
        {error && (
          <div className="absolute left-4 bottom-4 bg-red-600/80 text-white text-xs px-2 py-1 rounded">
            {error}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}