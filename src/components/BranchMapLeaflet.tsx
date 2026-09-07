'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import 'leaflet/dist/leaflet.css'
import type { Branch } from '@/lib/data/branches'

/**
 * A real, interactive street map (Leaflet + OpenStreetMap tiles) — actual
 * roads and place names, not a stylised projection. No API key or billing
 * account required, unlike Google Maps. Markers are plain divIcons (a small
 * styled dot) rather than Leaflet's default pin, which sidesteps the classic
 * "broken marker image" bundler issue entirely.
 *
 * Leaflet touches `window` at import time, so it's loaded dynamically inside
 * an effect — never at module scope — to stay safe under React Server
 * Components, which still evaluate 'use client' modules once on the server.
 */
export function BranchMapLeaflet({
  branches,
  highlightSlugs,
}: {
  /** The full branch list — always constant. Filtering is expressed via
   * `highlightSlugs`, not by shrinking this array, so markers are created
   * once and never torn down/rebuilt as a search narrows. */
  branches: Branch[]
  highlightSlugs?: string[]
}) {
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<Map<string, import('leaflet').Marker>>(new Map())
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !mapElRef.current || mapRef.current) return

      const map = L.map(mapElRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([-26.5, 27], 5)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      branches.forEach((b) => {
        const icon = L.divIcon({
          className: '',
          html: `<span class="branch-map-dot" data-slug="${b.slug}"></span>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })
        const marker = L.marker([b.lat, b.lng], { icon, keyboard: false })
          .addTo(map)
          .bindTooltip(`${b.name}${b.province === 'Pan-Africa' ? `, ${b.country}` : `, ${b.province}`}`, {
            direction: 'top',
            offset: [0, -8],
          })
        marker.on('click', () => router.push(`/branches/${b.slug}`))
        markersRef.current.set(b.slug, marker)
      })

      mapRef.current = map
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-run on every search/location change: dim non-matches, fit the view to
  // whatever currently matches. This is what makes the map load-bearing
  // rather than decorative.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const highlightSet = highlightSlugs ? new Set(highlightSlugs) : null
    const matchedLatLngs: [number, number][] = []

    markersRef.current.forEach((marker, slug) => {
      const el = marker.getElement()?.querySelector<HTMLElement>('.branch-map-dot')
      const isMatch = !highlightSet || highlightSet.has(slug)
      if (el) el.style.opacity = isMatch ? '1' : '0.2'
      if (isMatch) {
        const b = branches.find((x) => x.slug === slug)
        if (b) matchedLatLngs.push([b.lat, b.lng])
      }
    })

    if (matchedLatLngs.length === 1) {
      map.flyTo(matchedLatLngs[0], 11, { duration: 0.6 })
    } else if (matchedLatLngs.length > 1) {
      import('leaflet').then((L) => {
        map.flyToBounds(L.latLngBounds(matchedLatLngs), { padding: [32, 32], maxZoom: 9, duration: 0.6 })
      })
    }
  }, [highlightSlugs, branches])

  return (
    <div
      ref={mapElRef}
      className="h-[360px] w-full overflow-hidden rounded-[var(--radius-base)] border border-hairline-strong lg:h-full lg:min-h-[420px]"
    />
  )
}
