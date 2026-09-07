// Generates src/lib/data/heroMap.generated.ts — pre-projected map geometry
// for the hero. Run once (or whenever the point set changes): node
// scripts/generate-hero-map-data.mjs. Nothing here ships to the client;
// only the plain path-string output does.
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as topojson from 'topojson-client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const topology = JSON.parse(readFileSync(join(__dirname, 'vendor/world-110m.json'), 'utf8'))
const geo = topojson.feature(topology, topology.objects.countries)

// Real coordinates only — Korea HQ, then a representative real subset of the
// branches.ts network (full Gauteng/coastal spread + all 5 pan-African
// country points), plus real coordinates for a handful of major cities
// elsewhere in Africa for the illustrative "broader reach" routes.
export const KOREA = { name: 'Goyang, South Korea', lat: 37.6584, lng: 126.832 }
export const PRIMARY = { name: 'Alberton (Gauteng hub)', lat: -26.2669894, lng: 28.1220546 }
export const SECONDARY = [
  { name: 'Cape Town', lat: -33.9249, lng: 18.4241, kind: 'za' },
  { name: 'Durban', lat: -29.8587, lng: 31.0218, kind: 'za' },
  { name: 'Gaborone, Botswana', lat: -24.6581357, lng: 25.9088474, kind: 'panafrica' },
  { name: 'Matsapha, Eswatini', lat: -26.494482, lng: 31.308351, kind: 'panafrica' },
  { name: 'Maputo, Mozambique', lat: -25.966213, lng: 32.56745, kind: 'panafrica' },
  { name: 'Windhoek, Namibia', lat: -22.5198897, lng: 17.0744236, kind: 'panafrica' },
  { name: 'Harare, Zimbabwe', lat: -17.8614534, lng: 31.0230739, kind: 'panafrica' },
]
export const REACH = [
  { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
  { name: 'Accra, Ghana', lat: 5.6037, lng: -0.187 },
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
]

const ALL = [KOREA, PRIMARY, ...SECONDARY, ...REACH]
const PAD = 40
const lats = ALL.map((p) => p.lat)
const lngs = ALL.map((p) => p.lng)
const latMin = Math.min(...lats) - 6
const latMax = Math.max(...lats) + 6
const lngMin = Math.min(...lngs) - 6
const lngMax = Math.max(...lngs) + 6
const meanLatCos = Math.cos(((latMin + latMax) / 2 * Math.PI) / 180)

const W = 1600
const scale = (W - PAD * 2) / ((lngMax - lngMin) * meanLatCos)
const H = (latMax - latMin) * scale + PAD * 2

function project([lng, lat]) {
  return [
    Number(((lng - lngMin) * meanLatCos * scale + PAD).toFixed(2)),
    Number(((latMax - lat) * scale + PAD).toFixed(2)),
  ]
}
function ring(coords) {
  return coords.map(project).map(([x, y]) => `${x},${y}`).join(' L ')
}
function pathFor(geometry) {
  if (!geometry) return ''
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  return polys.map((poly) => poly.map((r) => `M ${ring(r)} Z`).join(' ')).join(' ')
}

const countryPaths = geo.features.map((f) => pathFor(f.geometry)).join(' ')
const koreaXY = project([KOREA.lng, KOREA.lat])
const primaryXY = project([PRIMARY.lng, PRIMARY.lat])
const secondaryXY = SECONDARY.map((p) => ({ name: p.name, kind: p.kind, xy: project([p.lng, p.lat]) }))
const reachXY = REACH.map((p) => ({ name: p.name, xy: project([p.lng, p.lat]) }))

const out = `// GENERATED FILE — do not hand-edit.
// Regenerate with: node scripts/generate-hero-map-data.mjs
// Source: real coordinates (Korea HQ + branches.ts network + major African
// cities) projected onto real world boundary data (world-atlas, Natural
// Earth-derived, ISC licensed). No hand-approximated geometry.

export const MAP_W = ${W}
export const MAP_H = ${Math.round(H)}
export const COUNTRY_PATHS = ${JSON.stringify(countryPaths)}
export const KOREA_XY: [number, number] = [${koreaXY[0]}, ${koreaXY[1]}]
export const PRIMARY_XY: [number, number] = [${primaryXY[0]}, ${primaryXY[1]}]
export const SECONDARY_POINTS: { name: string; kind: 'za' | 'panafrica'; xy: [number, number] }[] = ${JSON.stringify(
  secondaryXY.map((p) => ({ name: p.name, kind: p.kind, xy: p.xy })),
)}
export const REACH_POINTS: { name: string; xy: [number, number] }[] = ${JSON.stringify(
  reachXY.map((p) => ({ name: p.name, xy: p.xy })),
)}
`

writeFileSync(join(__dirname, '../src/lib/data/heroMap.generated.ts'), out)
console.log('wrote src/lib/data/heroMap.generated.ts —', W, 'x', Math.round(H))
