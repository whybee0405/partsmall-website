'use client'

import { useEffect, useRef, useState } from 'react'
import {
  COUNTRY_PATHS,
  MAP_W,
  MAP_H,
  KOREA_XY,
  PRIMARY_XY,
  SECONDARY_POINTS,
  REACH_POINTS,
} from '@/lib/data/heroMap.generated'

/**
 * The hero background: a real, coordinate-accurate map (see
 * heroMap.generated.ts — never hand-approximated, never AI-guessed) driving
 * a flight-tracker camera, with five story clips playing in sync with the
 * camera's phases. The map, camera and pulses are cheap SVG/SMIL and run on
 * every device. The video layer also runs on every device — see the chained
 * loading in StoryVideoLayer, which starts each clip only once the previous
 * one has buffered, so mobile connections never get five simultaneous
 * fetches. Reduced-motion is the only thing that turns either layer off.
 */

const CAM_ASPECT = 16 / 9
const EASE = '0.42 0 0.58 1'

type Box = { x: number; y: number; w: number; h: number }

function fitBox(cx: number, cy: number, w: number, h: number): Box {
  if (w / h > CAM_ASPECT) h = w / CAM_ASPECT
  else w = h * CAM_ASPECT
  return { x: cx - w / 2, y: cy - h / 2, w, h }
}
function vb(b: Box) {
  return `${b.x.toFixed(1)} ${b.y.toFixed(1)} ${b.w.toFixed(1)} ${b.h.toFixed(1)}`
}
function arcPath(x1: number, y1: number, x2: number, y2: number, bend: number) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  const nx = -dy / len
  const ny = dx / len
  const cx = mx + nx * len * bend
  const cy = my + ny * len * bend
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`
}

// --- Timeline: one shared clock drives the camera, the pulses and the video
// beats below. Change a duration here and everything re-syncs. ---
const BEATS = [
  { name: 'port', label: 'Port loading — shipped from Korea', dur: 2.4, src: '/videos/story-port.mp4' },
  { name: 'ship', label: 'Aerial — on route', dur: 5.2, src: '/videos/story-ship.mp4' },
  { name: 'warehouse', label: 'Warehouse — offloaded in SA', dur: 2.8, src: '/videos/story-warehouse.mp4' },
  { name: 'truck', label: 'Truck leaving the warehouse', dur: 2.6, src: '/videos/story-truck.mp4' },
  { name: 'box', label: 'Box handoff at the branch', dur: 2.6, src: '/videos/story-box.mp4' },
] as const

let cursor = 0
const TIMED_BEATS = BEATS.map((b) => {
  const start = cursor
  cursor += b.dur
  return { ...b, start, end: cursor }
})
const LOOP = cursor // 15.6s

// --- Camera keyframes -------------------------------------------------
const camKorea = fitBox(KOREA_XY[0], KOREA_XY[1], 300, 300 / CAM_ASPECT)
const secXY = SECONDARY_POINTS.map((p) => p.xy)
const bxMin = Math.min(...secXY.map((p) => p[0])) - 70
const bxMax = Math.max(...secXY.map((p) => p[0])) + 70
const byMin = Math.min(...secXY.map((p) => p[1])) - 70
const byMax = Math.max(...secXY.map((p) => p[1])) + 70
const camSA = fitBox((bxMin + bxMax) / 2, (byMin + byMax) / 2, bxMax - bxMin, byMax - byMin)
const camWide = fitBox(MAP_W / 2, MAP_H * 0.46, MAP_W * 1.02, (MAP_W * 1.02) / CAM_ASPECT)

const camKeyTimesSec = [
  0,
  TIMED_BEATS[0].end,
  TIMED_BEATS[0].end + 1.8,
  TIMED_BEATS[1].end,
  TIMED_BEATS[1].end + 1.8,
  LOOP,
]
const camKeyTimes = camKeyTimesSec.map((s) => (s / LOOP).toFixed(4)).join(';')
const camValues = [camKorea, camKorea, camWide, camWide, camSA, camSA].map(vb).join(';')
const camSplines = ['0 0 1 1', EASE, '0 0 1 1', EASE, '0 0 1 1'].join(';')

// --- Primary shipment pulse: dwells at Korea, travels the full "ship" beat,
// arrives exactly as the warehouse beat starts, dwells at the hub. ---
const pulseMotionKeyTimes = [0, TIMED_BEATS[0].end, TIMED_BEATS[1].end, LOOP]
  .map((s) => (s / LOOP).toFixed(4))
  .join(';')
const pulseOpacityKeyTimes = [0, TIMED_BEATS[0].end - 0.2, TIMED_BEATS[0].end, LOOP - 0.6, LOOP]
  .map((s) => (s / LOOP).toFixed(4))
  .join(';')

// --- Secondary dispersal: once the shipment lands, it fans out to the rest
// of the branch network along curved arcs, staggered so it reads as
// separate deliveries rather than one synchronized burst. ---
const secondaryArcs = SECONDARY_POINTS.map((p, i) => {
  const side = i % 2 === 0 ? 1 : -1
  const bend = side * (0.14 + (i % 3) * 0.045)
  return { ...p, d: arcPath(PRIMARY_XY[0], PRIMARY_XY[1], p.xy[0], p.xy[1], bend) }
})
const dispersalStart = TIMED_BEATS[1].end
const dispersalWindow = LOOP - dispersalStart - 0.8
const dispersalPulses = secondaryArcs.map((a, i) => {
  const jitter = ((i * 47) % 100) / 100
  const begin = dispersalStart + 0.4 + jitter * (dispersalWindow * 0.55)
  const dur = 1.7 + (((i * 31) % 100) / 100) * 1.6
  const fadeInEnd = begin + dur * 0.12
  const fadeOutStart = Math.min(begin + dur + 0.5, LOOP - 0.3)
  const ease = i % 2 === 0 ? '0.33 0 0.2 1' : '0.55 0 0.15 1'
  const kt = [0, begin, begin + dur, LOOP].map((s) => (s / LOOP).toFixed(4)).join(';')
  const okt = [0, begin, fadeInEnd, fadeOutStart, LOOP].map((s) => (s / LOOP).toFixed(4)).join(';')
  return { d: a.d, kt, okt, ease }
})

// --- Reach dispersal: the SA hub also reaches further into Africa. Dimmer,
// slower, and — since the camera stays zoomed on SA — visibly exits the
// frame edge rather than resolving at a point on screen. ---
const reachArcs = REACH_POINTS.map((p, i) => {
  const side = i % 2 === 0 ? -1 : 1
  const bend = side * (0.1 + (i % 2) * 0.04)
  return { ...p, d: arcPath(PRIMARY_XY[0], PRIMARY_XY[1], p.xy[0], p.xy[1], bend) }
})
const reachDispersalStart = dispersalStart + 1.2
const reachDispersalWindow = LOOP - reachDispersalStart - 0.6
const reachPulses = reachArcs.map((a, i) => {
  const jitter = ((i * 61) % 100) / 100
  const begin = reachDispersalStart + jitter * (reachDispersalWindow * 0.7)
  const dur = 2.6 + (((i * 37) % 100) / 100) * 1.8
  const fadeInEnd = begin + dur * 0.1
  const fadeOutStart = Math.min(begin + dur + 0.4, LOOP - 0.2)
  const ease = i % 2 === 0 ? '0.3 0 0.15 1' : '0.5 0 0.2 1'
  const kt = [0, begin, begin + dur, LOOP].map((s) => (s / LOOP).toFixed(4)).join(';')
  const okt = [0, begin, fadeInEnd, fadeOutStart, LOOP].map((s) => (s / LOOP).toFixed(4)).join(';')
  return { d: a.d, kt, okt, ease }
})

function HeroMapSvg({ animated }: { animated: boolean }) {
  const initialViewBox = animated ? vb(camKorea) : vb(camWide)

  return (
    <svg
      viewBox={initialViewBox}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {animated && (
        <animate
          attributeName="viewBox"
          dur={`${LOOP}s`}
          repeatCount="indefinite"
          keyTimes={camKeyTimes}
          values={camValues}
          calcMode="spline"
          keySplines={camSplines}
        />
      )}
      <defs>
        <radialGradient id="heroMapVignette" cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="#0d1c3d" />
          <stop offset="100%" stopColor="#060b1a" />
        </radialGradient>
        <filter id="heroMapGlowSoft" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="heroMapGlowMed" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="heroMapGlowStrong" x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x={-MAP_W} y={-MAP_H} width={MAP_W * 3} height={MAP_H * 3} fill="url(#heroMapVignette)" />
      <path d={COUNTRY_PATHS} fill="#131f42" stroke="#2c477e" strokeWidth={0.55} opacity={0.9} />

      {/* Reach — illustrative broader-Africa routes, dim and static-first */}
      <g>
        {reachArcs.map((a) => (
          <path key={a.name} d={a.d} fill="none" stroke="#4c7a68" strokeWidth={0.8} opacity={0.25} strokeDasharray="1 3.5" />
        ))}
      </g>
      {reachArcs.map((a) => (
        <circle key={a.name} cx={a.xy[0]} cy={a.xy[1]} r={3} fill="#4c7a68" opacity={0.5} />
      ))}
      {animated &&
        reachPulses.map((p, i) => (
          <g key={i} opacity={0}>
            <animateMotion
              dur={`${LOOP}s`}
              repeatCount="indefinite"
              keyTimes={p.kt}
              keyPoints="0;0;1;1"
              calcMode="spline"
              keySplines={`0 0 1 1;${p.ease};0 0 1 1`}
              path={p.d}
            />
            <animate attributeName="opacity" dur={`${LOOP}s`} repeatCount="indefinite" keyTimes={p.okt} values="0;0;0.8;0.8;0" />
            <circle r={3.2} fill="#7fae9a" filter="url(#heroMapGlowSoft)" />
            <circle r={1.3} fill="#cfe9df" />
          </g>
        ))}

      {/* Secondary — the real branch network */}
      <g>
        {secondaryArcs.map((a) => (
          <path key={a.name} d={a.d} fill="none" stroke="#2f6b52" strokeWidth={1} opacity={0.35} />
        ))}
      </g>
      <g>
        {secondaryArcs.map((a) => (
          <path
            key={a.name}
            d={a.d}
            className={animated ? 'hero-map-flow-secondary' : undefined}
            fill="none"
            stroke="#8ef2c0"
            strokeWidth={0.7}
            opacity={0.4}
            strokeDasharray="2 11"
          />
        ))}
      </g>
      {secondaryArcs.map((a) => {
        const r = a.kind === 'panafrica' ? 5.5 : 4.5
        return (
          <g key={a.name}>
            <circle cx={a.xy[0]} cy={a.xy[1]} r={r * 2} fill="#21a05f" opacity={0.18} filter="url(#heroMapGlowSoft)" />
            <circle cx={a.xy[0]} cy={a.xy[1]} r={r} fill="#bfe9d4" stroke="#0a3323" strokeWidth={1.1} opacity={0.85} />
          </g>
        )
      })}
      {animated &&
        dispersalPulses.map((p, i) => (
          <g key={i} opacity={0}>
            <animateMotion
              dur={`${LOOP}s`}
              repeatCount="indefinite"
              keyTimes={p.kt}
              keyPoints="0;0;1;1"
              calcMode="spline"
              keySplines={`0 0 1 1;${p.ease};0 0 1 1`}
              path={p.d}
            />
            <animate attributeName="opacity" dur={`${LOOP}s`} repeatCount="indefinite" keyTimes={p.okt} values="0;0;1;1;0" />
            <circle r={4.5} fill="#8ef2c0" filter="url(#heroMapGlowMed)" />
            <circle r={1.8} fill="#ffffff" />
          </g>
        ))}

      {/* Primary — the shipment itself, Korea to the SA hub */}
      <path
        d={`M ${KOREA_XY[0]} ${KOREA_XY[1]} L ${PRIMARY_XY[0]} ${PRIMARY_XY[1]}`}
        fill="none"
        stroke="#3cf29a"
        strokeWidth={2.4}
        opacity={0.75}
        filter="url(#heroMapGlowMed)"
      />
      <path
        d={`M ${KOREA_XY[0]} ${KOREA_XY[1]} L ${PRIMARY_XY[0]} ${PRIMARY_XY[1]}`}
        className={animated ? 'hero-map-flow-primary' : undefined}
        fill="none"
        stroke="#eafff2"
        strokeWidth={1}
        opacity={0.85}
        strokeDasharray="3 7"
        filter="url(#heroMapGlowSoft)"
      />
      <circle cx={PRIMARY_XY[0]} cy={PRIMARY_XY[1]} r={16} fill="#21a05f" opacity={0.35} filter="url(#heroMapGlowSoft)" />
      <circle cx={PRIMARY_XY[0]} cy={PRIMARY_XY[1]} r={7} fill="#eafff2" stroke="#0a3323" strokeWidth={1.6} filter="url(#heroMapGlowMed)" />

      {animated && (
        <g opacity={0}>
          <animateMotion
            dur={`${LOOP}s`}
            repeatCount="indefinite"
            keyTimes={pulseMotionKeyTimes}
            keyPoints="0;0;1;1"
            calcMode="spline"
            keySplines={`0 0 1 1;${EASE};0 0 1 1`}
            path={`M ${KOREA_XY[0]} ${KOREA_XY[1]} L ${PRIMARY_XY[0]} ${PRIMARY_XY[1]}`}
          />
          <animate attributeName="opacity" dur={`${LOOP}s`} repeatCount="indefinite" keyTimes={pulseOpacityKeyTimes} values="0;0;1;1;0" />
          <circle r={9} fill="#3cf29a" filter="url(#heroMapGlowStrong)" />
          <circle r={3.4} fill="#ffffff" filter="url(#heroMapGlowMed)" />
        </g>
      )}

      <circle cx={KOREA_XY[0]} cy={KOREA_XY[1]} r={16} fill="none" stroke="#3cf29a" strokeWidth={1.3} opacity={0.45} filter="url(#heroMapGlowMed)">
        {animated && (
          <>
            <animate attributeName="r" values="10;28;10" dur="3.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines={`${EASE};${EASE}`} />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="3.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines={`${EASE};${EASE}`} />
          </>
        )}
      </circle>
      <circle cx={KOREA_XY[0]} cy={KOREA_XY[1]} r={7.5} fill="#ffffff" stroke="#21a05f" strokeWidth={3} filter="url(#heroMapGlowStrong)" />
    </svg>
  )
}

function StoryVideoLayer() {
  const videosRef = useRef<(HTMLVideoElement | null)[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Chained loading: each clip only starts fetching once the previous one
    // has buffered far enough to play through (or a fallback timer gives up
    // waiting), so all five never fight for the same bandwidth at once —
    // that simultaneous fetch was the actual cause of mobile buffering, not
    // the video layer itself. A stalled or errored clip can't block the
    // rest of the sequence: the fallback always advances the chain.
    let cancelled = false
    const FALLBACK_MS = 4000

    function startNext(i: number) {
      if (cancelled || i >= videosRef.current.length) return
      const v = videosRef.current[i]
      if (!v) return
      v.play().catch(() => {})

      let advanced = false
      const timer = setTimeout(() => {
        advanced = true
        startNext(i + 1)
      }, FALLBACK_MS)
      v.addEventListener(
        'canplaythrough',
        () => {
          if (advanced) return
          advanced = true
          clearTimeout(timer)
          startNext(i + 1)
        },
        { once: true },
      )
    }
    startNext(0)

    const start = performance.now()
    let raf: number
    const tick = () => {
      const t = ((performance.now() - start) / 1000) % LOOP
      videosRef.current.forEach((v, i) => {
        const b = TIMED_BEATS[i]
        const on = t >= b.start && t < b.end
        if (v) v.style.opacity = on ? '0.4' : '0'
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    setReady(true)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="absolute inset-0 mix-blend-screen" aria-hidden="true">
      {TIMED_BEATS.map((b, i) => (
        <video
          key={b.name}
          ref={(el) => {
            videosRef.current[i] = el
          }}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500"
          style={{ opacity: ready ? undefined : 0 }}
        >
          <source src={b.src} type="video/mp4" />
        </video>
      ))}
    </div>
  )
}

export function HeroStory() {
  const [motionOK, setMotionOK] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMotionOK(!reducedMotion)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-900">
      <HeroMapSvg animated={motionOK} />
      {motionOK && <StoryVideoLayer />}
    </div>
  )
}
