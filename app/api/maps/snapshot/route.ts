import { NextResponse } from 'next/server'

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export async function GET(req: Request) {
  try {
    if (!MAPBOX_TOKEN) {
      console.error('[maps/snapshot] Missing MAPBOX_TOKEN')
      return NextResponse.json({ error: 'Missing MAPBOX_TOKEN' }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')?.trim()
    const zoom = Number(searchParams.get('zoom') || 17)
    const width = Number(searchParams.get('w') || 284)
    const height = Number(searchParams.get('h') || 160)

    if (!address) {
      return NextResponse.json({ error: 'address query param is required' }, { status: 400 })
    }

    // 1) Geocode the address -> [lon, lat]
    const geoUrl = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`)
    geoUrl.searchParams.set('access_token', MAPBOX_TOKEN)
    geoUrl.searchParams.set('limit', '1')

    const geoRes = await fetch(geoUrl.toString())
    if (!geoRes.ok) {
      const text = await geoRes.text()
      console.error('[maps/snapshot] Geocoding failed', { status: geoRes.status, url: geoUrl.toString(), text })
      return NextResponse.json({ error: 'Geocoding failed', status: geoRes.status, url: geoUrl.toString(), details: text }, { status: 502 })
    }
    const geo = await geoRes.json()
    const feature = geo?.features?.[0]
    const center = feature?.center
    if (!center || center.length < 2) {
      console.error('[maps/snapshot] No geocoding result for address', address)
      return NextResponse.json({ error: 'No geocoding result for address', address }, { status: 404 })
    }
    const [lon, lat] = center

    // 2) Static image (satellite)
    const staticUrl = new URL(
      `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon},${lat},${zoom},0,0/${Math.max(1, Math.min(1280, width))}x${Math.max(1, Math.min(1280, height))}`
    )
    staticUrl.searchParams.set('access_token', MAPBOX_TOKEN)

    const imgRes = await fetch(staticUrl.toString())
    if (!imgRes.ok) {
      const text = await imgRes.text()
      console.error('[maps/snapshot] Static image fetch failed', { status: imgRes.status, url: staticUrl.toString(), text })
      return NextResponse.json({ error: 'Static image fetch failed', status: imgRes.status, url: staticUrl.toString(), details: text }, { status: 502 })
    }

    const arrayBuf = await imgRes.arrayBuffer()
    return new Response(arrayBuf, {
      status: 200,
      headers: {
        'Content-Type': imgRes.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (e: any) {
    console.error('[maps/snapshot] Unexpected error', e)
    return NextResponse.json({ error: 'Unexpected error', details: e?.message || String(e) }, { status: 500 })
  }
}
