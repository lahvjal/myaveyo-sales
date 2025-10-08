"use client"

import React, { useEffect, useRef, useState } from "react"
import "mapbox-gl/dist/mapbox-gl.css"

export type MapPin = {
  id: string
  lngLat: [number, number]
  isComplete?: boolean
  label?: string
}

export type MapWithPinsProps = {
  className?: string
  styleUrl?: string
  center?: [number, number]
  zoom?: number
  pins?: MapPin[]
  hideLabels?: boolean
  darkGrayscale?: boolean
  cluster?: boolean
}

export default function MapWithPins({
  className,
  styleUrl = "mapbox://styles/mapbox/dark-v11",
  center = [-98.5795, 39.8283],
  zoom = 5.2,
  pins = [],
  hideLabels = true,
  darkGrayscale = true,
  cluster = true,
}: MapWithPinsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const pinsRef = useRef<MapPin[]>(pins)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let disposed = false
    if (mapRef.current) {
      // Map already initialized (Fast Refresh or re-render). Ensure overlay is hidden.
      setLoading(false)
      return
    }
    if (!containerRef.current) return

    const init = async () => {
      try {
        const { default: mapboxgl } = await import("mapbox-gl")
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || (process.env as any).MAPBOX_TOKEN
        if (!token) {
          setErrorMsg("Missing NEXT_PUBLIC_MAPBOX_TOKEN")
          setLoading(false)
          return
        }
        ;(mapboxgl as any).accessToken = token

        // Slightly wider view on small screens and responsive sizes
        const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches
        const initialZoom = isMobile ? Math.max((zoom ?? 4) - 2, 2.2) : zoom

        const map = new (mapboxgl as any).Map({
          container: containerRef.current!,
          style: styleUrl,
          center,
          zoom: initialZoom,
          projection: "mercator",
        })
        mapRef.current = map
        map.addControl(new (mapboxgl as any).NavigationControl(), "top-right")

        const restyle = () => {
          if (!map) return
          try {
            const style = map.getStyle()
            const layers = style?.layers || []
            // Hide all roads/bridges/tunnels explicitly across zoom classes
            layers.forEach((layer: any) => {
              const id = String(layer?.id || '')
              const isRoad = id.startsWith('road-') || id.includes('road-')
              const isBridge = id.startsWith('bridge-') || id.includes('bridge-')
              const isTunnel = id.startsWith('tunnel-') || id.includes('tunnel-')
              if (isRoad || isBridge || isTunnel) {
                try { map.setLayoutProperty(id, 'visibility', 'none') } catch {}
              }
            })
            if (hideLabels) {
              layers.forEach((layer: any) => {
                if (layer.type === "symbol") {
                  try { map.setLayoutProperty(layer.id, "visibility", "none") } catch {}
                }
              })
            }
            if (darkGrayscale) {
              const colors = {
                background: "#0d0d0d",
                water: "#0d0d0d",
                land: "#1c1c1c",
                park: "#191b1f",
                building: "#222429",
                buildingOutline: "#2b2e34",
                roadMinor: "#2f3238",
                roadMajor: "#3f4147",
                bridge: "#5a5d63",
                admin: "#2a2d33",
              }
              layers.forEach((layer: any) => {
                try {
                  if (layer.type === "background") map.setPaintProperty(layer.id, "background-color", colors.background)
                  if (layer.id.includes("water")) {
                    if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", colors.water)
                    if (layer.type === "line") map.setPaintProperty(layer.id, "line-color", colors.water)
                  }
                  if (layer.id.includes("land") || layer.id.includes("landuse")) {
                    if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", colors.land)
                    if (layer.type === "background") map.setPaintProperty(layer.id, "background-color", colors.land)
                  }
                  if (layer.id.includes("park") || layer.id.includes("green")) {
                    if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", colors.park)
                  }
                  if (layer.id.includes("building")) {
                    if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", colors.building)
                    if (layer.type === "line") map.setPaintProperty(layer.id, "line-color", colors.buildingOutline)
                    try { map.setPaintProperty(layer.id, "fill-extrusion-color", colors.building) } catch {}
                  }
                  if (layer.id.includes("road")) {
                    const shade = layer.id.match(/(motorway|trunk|primary|secondary|tertiary|main)/)
                      ? colors.roadMajor
                      : colors.roadMinor
                    if (layer.type === "line") map.setPaintProperty(layer.id, "line-color", shade)
                    if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", shade)
                  }
                  if (layer.id.includes("bridge") && layer.type === "line") {
                    map.setPaintProperty(layer.id, "line-color", colors.bridge)
                  }
                  if (layer.id.includes("tunnel") && layer.type === "line") {
                    map.setPaintProperty(layer.id, "line-color", colors.roadMinor)
                  }
                  if (layer.id.includes("admin") && layer.type === "line") {
                    map.setPaintProperty(layer.id, "line-color", colors.admin)
                  }
                } catch {}
              })
            }
          } catch {}
        }

        const addPins = (arr?: MapPin[]) => {
          // clear existing
          try { markersRef.current.forEach(m => m.remove && m.remove()) } catch {}
          markersRef.current = []
          const list = arr ?? pinsRef.current
          const pinColor = "#9EC5FE"
          const domPinSize = (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches) ? 12 : 10
          if (!cluster) {
            list.forEach((pin) => {
              const el = document.createElement("div")
              el.style.width = `${domPinSize}px`
              el.style.height = `${domPinSize}px`
              el.style.borderRadius = "50%"
              el.style.border = "2px solid white"
              el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.35)"
              el.style.backgroundColor = pinColor

              const popupHtml = `<div style=\"font-size:12px;line-height:1.3\">\n                <div><strong>${pin.isComplete ? "PTO Complete" : "In Progress"}</strong></div>\n                <div>${pin.label ?? ""}</div>\n              </div>`

              const popup = new (mapboxgl as any).Popup({ offset: 10 }).setHTML(popupHtml)
              const marker = new (mapboxgl as any).Marker(el).setLngLat(pin.lngLat).setPopup(popup).addTo(map)
              markersRef.current.push(marker)
            })
          } else {
            // Cluster mode via GeoJSON source + layers
            const sourceId = "pins-src"
            const clusterLayerId = "pins-clusters"
            const clusterCountId = "pins-cluster-count"
            const unclusteredId = "pins-unclustered"

            const toGeoJSON = (items: MapPin[]) => ({
              type: "FeatureCollection",
              features: items.map((p) => ({
                type: "Feature",
                geometry: { type: "Point", coordinates: p.lngLat },
                properties: { isComplete: !!p.isComplete, label: p.label ?? "" },
              })),
            }) as any

            const ensureSourceAndLayers = () => {
              if (!map.getSource(sourceId)) {
                map.addSource(sourceId, {
                  type: "geojson",
                  data: toGeoJSON(list),
                  cluster: true,
                  clusterRadius: 40,
                  clusterMaxZoom: 14,
                })
              } else {
                try { (map.getSource(sourceId) as any).setData(toGeoJSON(list)) } catch {}
              }

              // Responsive cluster radius stops
              const clusterRadiusStops = [
                // [threshold, size]
                [50, (isMobile ? 12 : 12)],
                [100, (isMobile ? 18 : 18)],
                [150, (isMobile ? 24 : 24)],
                [200, (isMobile ? 30 : 30)],
              ] as const

              if (!map.getLayer(clusterLayerId)) {
                map.addLayer({
                  id: clusterLayerId,
                  type: "circle",
                  source: sourceId,
                  filter: ["has", "point_count"],
                  paint: {
                    "circle-color": pinColor,
                    "circle-radius": [
                      "step",
                      ["get", "point_count"],
                      // base size when < first threshold
                      (isMobile ? 16 : 12),
                      clusterRadiusStops[0][0], clusterRadiusStops[0][1],
                      clusterRadiusStops[1][0], clusterRadiusStops[1][1],
                      clusterRadiusStops[2][0], clusterRadiusStops[2][1],
                      clusterRadiusStops[3][0], clusterRadiusStops[3][1],
                    ],
                    "circle-stroke-color": "#ffffff",
                    "circle-stroke-width": 1.5,
                  },
                })
              }

              if (!map.getLayer(clusterCountId)) {
                map.addLayer({
                  id: clusterCountId,
                  type: "symbol",
                  source: sourceId,
                  filter: ["has", "point_count"],
                  layout: {
                    "text-field": ["get", "point_count_abbreviated"],
                    "text-size": 14,
                  },
                  paint: {
                    "text-color": "#0b1220",
                  },
                })
              }

              if (!map.getLayer(unclusteredId)) {
                map.addLayer({
                  id: unclusteredId,
                  type: "circle",
                  source: sourceId,
                  filter: ["!has", "point_count"],
                  paint: {
                    "circle-color": pinColor,
                    "circle-radius": isMobile ? 8 : 6,
                    "circle-stroke-color": "#ffffff",
                    "circle-stroke-width": 1.5,
                  },
                })

                // Popup on click for unclustered points
                map.on("click", unclusteredId, (e: any) => {
                  try {
                    const f = e.features?.[0]
                    if (!f) return
                    const coords = f.geometry.coordinates.slice()
                    const label = f.properties?.label || ""
                    const isComplete = !!f.properties?.isComplete
                    const html = `<div style=\"font-size:12px;line-height:1.3\">\n                      <div><strong>${isComplete ? "PTO Complete" : "In Progress"}</strong></div>\n                      <div>${label}</div>\n                    </div>`
                    new (mapboxgl as any).Popup({ offset: 10 }).setLngLat(coords).setHTML(html).addTo(map)
                  } catch {}
                })

                // Zoom into clusters on click
                map.on("click", clusterLayerId, async (e: any) => {
                  const f = e.features?.[0]
                  if (!f) return
                  const clusterId = f.properties.cluster_id
                  const source: any = map.getSource(sourceId)
                  source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
                    if (err) return
                    map.easeTo({ center: f.geometry.coordinates, zoom })
                  })
                })

                map.on("mouseenter", clusterLayerId, () => { map.getCanvas().style.cursor = "pointer" })
                map.on("mouseleave", clusterLayerId, () => { map.getCanvas().style.cursor = "" })
                map.on("mouseenter", unclusteredId, () => { map.getCanvas().style.cursor = "pointer" })
                map.on("mouseleave", unclusteredId, () => { map.getCanvas().style.cursor = "" })
              }
            }

            ensureSourceAndLayers()
          }
        }

        map.on("load", () => {
          if (disposed) return
          try { map.resize() } catch {}
          restyle()
          addPins()
          setLoading(false)
        })

        // Re-apply styling and pins after a style change
        map.on("styledata", () => {
          restyle()
          addPins()
          setLoading(false)
        })

        // When the map has no ongoing render tasks, ensure loading is cleared
        map.once("idle", () => setLoading(false))

        map.on("error", (e: any) => {
          setErrorMsg(e?.error?.message || "Mapbox runtime error")
          setLoading(false)
        })
      } catch (err) {
        setErrorMsg("Failed to load map library")
        setLoading(false)
      }
    }

    init()

    // Fallback: if for some reason load event doesn't fire (rare), clear loading after timeout
    const t = setTimeout(() => setLoading(false), 2500)

    return () => {
      disposed = true
      clearTimeout(t)
      if (mapRef.current) {
        try { markersRef.current.forEach(m => m.remove && m.remove()) } catch {}
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers when pins prop changes
  useEffect(() => {
    pinsRef.current = pins
    const run = async () => {
      if (!mapRef.current) return
      try {
        const { default: mapboxgl } = await import("mapbox-gl")
        // In cluster mode, update source data; otherwise, re-render DOM markers
        if (cluster) {
          const map = mapRef.current
          const source: any = map.getSource("pins-src")
          if (source) {
            const fc = {
              type: "FeatureCollection",
              features: pinsRef.current.map(p => ({ type: "Feature", geometry: { type: "Point", coordinates: p.lngLat }, properties: { isComplete: !!p.isComplete, label: p.label ?? "" } }))
            }
            try { source.setData(fc as any) } catch {}
          } else {
            // layers may be lost on style change, so call addPins to recreate
            const add = (mapRef.current as any) && (mapRef.current.on ? true : false)
            if (add) {
              // call our existing helper which ensures layers/sources
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
            }
          }
        } else {
          try { markersRef.current.forEach(m => m.remove && m.remove()) } catch {}
          markersRef.current = []
          pinsRef.current.forEach((pin) => {
            const el = document.createElement("div")
            el.style.width = "10px"
            el.style.height = "10px"
            el.style.borderRadius = "50%"
            el.style.border = "2px solid white"
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.35)"
            el.style.backgroundColor = pin.isComplete ? "#10B981" : "#F59E0B"
            const popupHtml = `<div style=\"font-size:12px;line-height:1.3\">${pin.label ?? ""}</div>`
            const popup = new (mapboxgl as any).Popup({ offset: 10 }).setHTML(popupHtml)
            const marker = new (mapboxgl as any).Marker(el).setLngLat(pin.lngLat).setPopup(popup).addTo(mapRef.current)
            markersRef.current.push(marker)
          })
        }
      } catch {}
    }
    run()
  }, [pins, cluster])

  return (
    <div className={className ?? "relative h-[calc(100vh-80px)] w-full"}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {(loading || errorMsg) && (
        <div className="absolute inset-0 grid place-items-center bg-black/40 text-white pointer-events-none">
          <div className="text-sm opacity-80">{errorMsg ?? "Loading map…"}</div>
        </div>
      )}
    </div>
  )
}
