"use client"

import React, { useEffect, useRef, useState } from "react"
import Head from "next/head"
import { createClient } from "@supabase/supabase-js"

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 })

  // Supabase client
  const supabase = useRef(
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )
  ).current

  useEffect(() => {
    let disposed = false
    if (mapRef.current) return
    if (!mapContainerRef.current) return

    const init = async () => {
      try {
        // 1) Dynamically load mapbox-gl (client-side only)
        const { default: mapboxgl } = await import("mapbox-gl")

        // 2) Validate token
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        if (!token) {
          console.error("NEXT_PUBLIC_MAPBOX_TOKEN is missing. Check .env.local and restart dev server.")
          setLoading(false)
          return
        }
        ;(mapboxgl as any).accessToken = token

        // 3) Initialize the map
        const map = new (mapboxgl as any).Map({
          container: mapContainerRef.current!,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [-98.5795, 39.8283], // Center of the contiguous US
          zoom: 4,
          projection: "mercator", // make map flat, not globe
        })

        mapRef.current = map
        map.addControl(new (mapboxgl as any).NavigationControl(), "top-right")

        map.on("load", async () => {
          if (disposed) return

          // Once the map is ready, fetch project data and add markers
          await fetchAndRenderProjects(mapboxgl)
          setLoading(false)
        })

        map.on("error", (e: unknown) => {
          console.error("Mapbox runtime error:", e)
          setLoading(false)
        })
      } catch (err) {
        console.error("Failed to dynamically load mapbox-gl:", err)
        setLoading(false)
      }
    }

    init()

    return () => {
      disposed = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  /**
   * Fetch projects from Supabase, geocode addresses, and add markers
   */
  const fetchAndRenderProjects = async (mapboxgl: any) => {
    try {
      // 1) Fetch raw payloads (start small for perf and debugging)
      const { data, error } = await supabase
        .from("podio_data")
        .select("id, raw_payload")
        .limit(100)

      if (error) {
        console.error("[Map] Supabase error:", error)
        return
      }

      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string
      const pins: Array<{
        id: string
        lngLat: [number, number]
        isComplete: boolean
        label: string
      }> = []

      let validAddrCount = 0
      let geocodeSuccess = 0
      let geocodeFail = 0

      // 2) Geocode with small concurrency to avoid rate limits
      const batch = 8
      const items = data ?? []
      console.log(`[Map] Fetched ${items.length} rows from podio_data`)

      // Log a couple of payload shapes to confirm field names
      items.slice(0, 3).forEach((rec, idx) => {
        try {
          const p = (typeof rec.raw_payload === 'string' ? JSON.parse(rec.raw_payload as any) : rec.raw_payload) as any
          console.log(`[Map] Sample #${idx + 1} keys:`, Object.keys(p || {}))
          console.log(`[Map] Sample #${idx + 1} energization:`, p?.energization)
        } catch (e) {
          console.warn('[Map] Failed to parse sample raw_payload')
        }
      })

      // Helper to extract address parts with fallbacks
      const extractAddress = (p: any) => {
        const address = p?.address || p?.site_address || p?.street || p?.location?.address || p?.Address
        const city = p?.city || p?.location?.city || p?.City
        const state = p?.state || p?.location?.state || p?.State
        const zip = p?.zip || p?.location?.zip || p?.postal || p?.Zip
        const pto = p?.energization?.["pto-status"] || p?.energization?.pto_status || p?.energization?.ptoStatus
        const isComplete = pto === "Complete"
        return { address, city, state, zip, isComplete }
      }
      for (let i = 0; i < items.length; i += batch) {
        const slice = items.slice(i, i + batch)
        // Process a small batch concurrently
        const results = await Promise.all(
          slice.map(async (rec) => {
            const p = (typeof rec.raw_payload === 'string' ? JSON.parse(rec.raw_payload as any) : rec.raw_payload) as any
            const { address, city, state, zip, isComplete } = extractAddress(p)
            if (!address || !city || !state) {
              return null
            }

            const fullAddress = `${address}, ${city}, ${state} ${zip ?? ""}`.trim()
            validAddrCount++
            const coords = await geocodeAddress(fullAddress, token)
            if (!coords) {
              geocodeFail++
              console.warn('[Map] Geocode failed:', fullAddress)
              return null
            }
            geocodeSuccess++

            return {
              id: rec.id as string,
              lngLat: coords as [number, number],
              isComplete,
              label: `${fullAddress}`,
            }
          })
        )
        results.forEach((r) => r && pins.push(r))
        // Small delay between batches to be gentle on API
        await new Promise((res) => setTimeout(res, 300))
      }

      console.log(`[Map] Valid addresses: ${validAddrCount}, geocoded OK: ${geocodeSuccess}, failed: ${geocodeFail}`)

      // 3) Add markers to the map
      const map = mapRef.current
      if (!map) return
      pins.forEach((pin) => {
        const el = document.createElement("div")
        el.style.width = "10px"
        el.style.height = "10px"
        el.style.borderRadius = "50%"
        el.style.border = "2px solid white"
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.35)"
        el.style.backgroundColor = pin.isComplete ? "#10B981" : "#F59E0B"

        const popup = new mapboxgl.Popup({ offset: 10 }).setHTML(
          `<div style="font-size:12px;line-height:1.3">
            <div><strong>${pin.isComplete ? "Complete" : "In Progress"}</strong></div>
            <div>${pin.label}</div>
          </div>`
        )

        new mapboxgl.Marker(el).setLngLat(pin.lngLat).setPopup(popup).addTo(map)
      })

      // 4) Update stats overlay
      setStats({
        total: pins.length,
        completed: pins.filter((p) => p.isComplete).length,
        inProgress: pins.filter((p) => !p.isComplete).length,
      })

      if (pins.length === 0) {
        // Show a small note overlay for visibility during debugging
        const note = document.createElement('div')
        note.textContent = 'No pins to display (check address fields and geocoding quota)'
        note.style.position = 'absolute'
        note.style.top = '16px'
        note.style.right = '16px'
        note.style.background = 'rgba(0,0,0,0.7)'
        note.style.color = 'white'
        note.style.padding = '6px 10px'
        note.style.borderRadius = '6px'
        note.style.fontSize = '12px'
        const container = mapContainerRef.current
        if (container) container.appendChild(note)
      }
    } catch (err) {
      console.error("[Map] Failed to fetch/render projects:", err)
    }
  }

  /** Geocode a textual address via Mapbox Geocoding API */
  const geocodeAddress = async (
    address: string,
    token: string
  ): Promise<[number, number] | null> => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${token}&limit=1`
      const res = await fetch(url)
      if (!res.ok) return null
      const json = await res.json()
      const center = json?.features?.[0]?.center
      if (center && Array.isArray(center)) return [center[0], center[1]]
      return null
    } catch (e) {
      return null
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <div className="relative flex-1">
        {/* The map container must always be in the DOM so the ref is attached */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-lg">Loading map…</div>
          </div>
        )}

        {/* Simple stats overlay */}
        {!loading && (
          <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded">
            <div>Total: {stats.total}</div>
            <div>Completed: {stats.completed}</div>
            <div>In Progress: {stats.inProgress}</div>
          </div>
        )}
      </div>
    </div>
  )
}