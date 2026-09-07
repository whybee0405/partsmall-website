// Generates src/lib/data/networkMap.generated.ts — a real, coordinate-accurate
// Southern Africa map with every real branch/country point plotted. Same
// technique as heroMap.generated.ts: real world-atlas boundary data, real
// coordinates from branches.ts, nothing hand-approximated. Run with:
//   npx tsx scripts/generate-network-map-data.ts
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as topojson from 'topojson-client'
import { BRANCHES } from '../src/lib/data/branches'

const __dirname = dirname(fileURLToPath(import.meta.url))
const topology = JSON.parse(readFileSync(join(__dirname, 'vendor/world-110m.json'), 'utf8'))
const geo = topojson.feature(topology as any, (topology as any).objects.countries) as any

const PAD = 30
const lats = BRANCHES.map((b) => b.lat)
const lngs = BRANCHES.map((b) => b.lng)
const latMin = Math.min(...lats) - 2.2
const latMax = Math.max(...lats) + 2.2
const lngMin = Math.min(...lngs) - 2.2
const lngMax = Math.max(...lngs) + 2.2
const meanLatCos = Math.cos((((latMin + latMax) / 2) * Math.PI) / 180)

const W = 900
const scale = (W - PAD * 2) / ((lngMax - lngMin) * meanLatCos)
const H = (latMax - latMin) * scale + PAD * 2

function project([lng, lat]: [number, number]): [number, number] {
  return [
    Number(((lng - lngMin) * meanLatCos * scale + PAD).toFixed(2)),
    Number(((latMax - lat) * scale + PAD).toFixed(2)),
  ]
}
function ring(coords: [number, number][]) {
  return coords.map(project).map(([x, y]) => `${x},${y}`).join(' L ')
}
function pathFor(geometry: any): string {
  if (!geometry) return ''
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  return polys.map((poly: [number, number][][]) => poly.map((r) => `M ${ring(r)} Z`).join(' ')).join(' ')
}

// Only keep country paths that actually intersect our viewbox region, so we
// aren't shipping the whole world's boundary data for a Southern Africa crop.
function bboxOfGeometry(geometry: any): [number, number, number, number] | null {
  let minLng = Infinity,
    maxLng = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      }
    }
  }
  if (!isFinite(minLng)) return null
  return [minLng, minLat, maxLng, maxLat]
}
function intersects(a: [number, number, number, number], b: [number, number, number, number]) {
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1]
}
const viewBbox: [number, number, number, number] = [lngMin, latMin, lngMax, latMax]

const countryPaths = geo.features
  .filter((f: any) => {
    const bbox = bboxOfGeometry(f.geometry)
    return bbox && intersects(bbox, viewBbox)
  })
  .map((f: any) => pathFor(f.geometry))
  .join(' ')

const points = BRANCHES.map((b) => ({
  slug: b.slug,
  name: b.name,
  province: b.province,
  country: b.country,
  kind: b.province === 'Pan-Africa' ? 'panafrica' : 'za',
  xy: project([b.lng, b.lat]),
}))

const out = `// GENERATED FILE — do not hand-edit.
// Regenerate with: npx tsx scripts/generate-network-map-data.ts
// Source: real branch coordinates (branches.ts) projected onto real world
// boundary data (world-atlas, Natural Earth-derived, ISC licensed).

export const MAP_W = ${W}
export const MAP_H = ${Math.round(H)}
export const COUNTRY_PATHS = ${JSON.stringify(countryPaths)}
export const NETWORK_POINTS: {
  slug: string
  name: string
  province: string
  country: string
  kind: 'za' | 'panafrica'
  xy: [number, number]
}[] = ${JSON.stringify(points, null, 2)}
`

writeFileSync(join(__dirname, '../src/lib/data/networkMap.generated.ts'), out)
console.log('wrote src/lib/data/networkMap.generated.ts —', W, 'x', Math.round(H), '—', points.length, 'points')
