import { NextRequest, NextResponse } from "next/server"
export const runtime = "nodejs"
import { createSupabaseServer } from "@/lib/supabase-server"

// Mapbox server token. Prefer MAPBOX_TOKEN (server-side), fallback to NEXT_PUBLIC_MAPBOX_TOKEN for dev.
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN

function canonicalizeAddress(address?: string, city?: string, state?: string, zip?: string) {
  const a = [address?.trim(), city?.trim(), state?.trim(), zip?.trim()].filter(Boolean).join(", ")
  return a
}

function isCompleteStatus(status?: string) {
  if (!status) return false
  const s = status.toLowerCase()
  return s === "complete" || s === "active"
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const statusParam = (url.searchParams.get("status") || "all").toLowerCase()
    const limitRaw = url.searchParams.get("limit") || "500"
    const limitNum = limitRaw.toLowerCase() === "all" ? null : Math.min(parseInt(limitRaw, 10) || 500, 10000)
    const raw = (url.searchParams.get("raw") || "false").toLowerCase() === "true"
    console.log("[api/projects] start", { statusParam, limit: limitNum ?? 'all' })

    const supabase = createSupabaseServer()

    // Read coords from cache table first (fast path)
    let q = supabase
      .from("project_locations")
      .select("project_id, lat, lng, updated_at")
      .order("updated_at", { ascending: false })
    const { data: locs, error: locErr } = limitNum ? await q.limit(limitNum) : await q
    if (locErr) return NextResponse.json({ error: locErr.message }, { status: 500 })
    // Filter to USA (CONUS + Alaska + Hawaii) via coarse bounding boxes
    const inUSA = (lat: number, lng: number) => {
      // CONUS
      const conus = lng >= -125 && lng <= -66.5 && lat >= 24 && lat <= 49.5
      // Alaska
      const alaska = lng >= -170 && lng <= -130 && lat >= 50 && lat <= 72
      // Hawaii
      const hawaii = lng >= -161 && lng <= -154 && lat >= 18.8 && lat <= 22.8
      return conus || alaska || hawaii
    }
    const locsUSA = (locs || []).filter(r => typeof r.lat === 'number' && typeof r.lng === 'number' && inUSA(r.lat, r.lng))
    console.log("[api/projects] project_locations count", locs?.length || 0, "usa", locsUSA.length)

    const ids = (locsUSA || []).map((r) => r.project_id)
    if (ids.length === 0) return NextResponse.json({ pins: [] })

    // Raw diagnostic mode: return pins straight from cache without joining podio_data
    if (raw) {
      const pins = (locsUSA || []).map((r) => ({
        id: r.project_id,
        lngLat: [r.lng, r.lat] as [number, number],
        isComplete: true,
        label: "",
      }))
      console.log("[api/projects] raw mode returning pins", pins.length)
      return NextResponse.json({ pins })
    }

    // Join back to podio_data for labels and optional status filtering
    const { data: rowsRaw, error } = await supabase
      .from("podio_data")
      .select("id, status, raw_payload")
      .in("id", ids as any)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const rows = (rowsRaw as any[]) || []
    console.log("[api/projects] podio_data joined rows", rows.length)

    const locMap = new Map<string, { lat: number; lng: number }>()
    for (const r of locsUSA || []) locMap.set(r.project_id, { lat: r.lat, lng: r.lng })

    const out: Array<{ id: string; lngLat: [number, number]; isComplete: boolean; label: string }> = []
    for (const rec of rows) {
      const coords = locMap.get(rec.id)
      if (!coords) continue
      // Safe JSON parse of raw_payload; fallback to empty object
      let payload: any = (rec as any).raw_payload
      if (typeof payload === "string") {
        try { payload = JSON.parse(payload) } catch { payload = {} }
      }
      const label = canonicalizeAddress(payload?.address, payload?.city, payload?.state, payload?.zip)
      const isComplete = isCompleteStatus((rec as any).status)
      if (statusParam === "complete" && !isComplete) continue
      if (statusParam === "inprogress" && isComplete) continue
      out.push({ id: (rec as any).id, lngLat: [coords.lng, coords.lat], isComplete, label })
    }
    console.log("[api/projects] returning pins", out.length)
    return NextResponse.json({ pins: out })
  } catch (e: any) {
    console.error("[api/projects] unhandled", e)
    return NextResponse.json({ error: e?.message || "Unhandled error" }, { status: 500 })
  }
}
