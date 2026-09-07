'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MAP_W, MAP_H, COUNTRY_PATHS, NETWORK_POINTS } from '@/lib/data/networkMap.generated'

/**
 * The network map.
 *
 * Real coastlines this time, not a hand-approximated outline — the country
 * boundary data comes from world-atlas (Natural Earth-derived), the same
 * source and technique used for the hero. Every point is a real branch at
 * its real coordinate; nothing here is invented or eyeballed.
 */
export function NetworkMap({
  className = '',
  highlightSlugs,
  tone = 'dark',
}: {
  className?: string
  /** When given, points outside this set render dimmed rather than active —
   * used by the branch finder to reflect the current search on the map. */
  highlightSlugs?: string[]
  /** 'dark' sits on the navy slab; 'light' sits on paper. */
  tone?: 'dark' | 'light'
}) {
  const [active, setActive] = useState<string | null>(null)
  const activeBranch = NETWORK_POINTS.find((p) => p.slug === active)
  const highlightSet = highlightSlugs ? new Set(highlightSlugs) : null

  return (
    <figure className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Map of ${NETWORK_POINTS.length} Parts-Mall network points across southern Africa. A full text list of every branch follows below.`}
      >
        <defs>
          <filter id="networkGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={COUNTRY_PATHS}
          className={tone === 'dark' ? 'fill-white/[0.06] stroke-on-navy-rule' : 'fill-navy-900/[0.04] stroke-hairline-strong'}
          strokeWidth={1}
        />

        {NETWORK_POINTS.map((p) => {
          const isPan = p.kind === 'panafrica'
          const isActive = active === p.slug
          const dimmed = highlightSet ? !highlightSet.has(p.slug) : false
          return (
            <Link key={p.slug} href={`/branches/${p.slug}`} className="outline-none">
              <g
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: dimmed ? 0.22 : 1 }}
                onMouseEnter={() => setActive(p.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(p.slug)}
                onBlur={() => setActive(null)}
              >
                {/* Generous invisible hit area, roughly 44px at render size. */}
                <circle cx={p.xy[0]} cy={p.xy[1]} r={13} fill="transparent" />
                {isActive && (
                  <circle cx={p.xy[0]} cy={p.xy[1]} r={11} className="fill-signal/20 stroke-signal" strokeWidth={1.3} />
                )}
                <circle
                  cx={p.xy[0]}
                  cy={p.xy[1]}
                  r={isPan ? 5.5 : 4.5}
                  filter="url(#networkGlow)"
                  className={
                    isPan
                      ? 'fill-navy-900 stroke-signal transition-all duration-150'
                      : 'fill-signal stroke-navy-900 transition-all duration-150'
                  }
                  strokeWidth={isPan ? 2 : 1.3}
                />
                <title>{`${p.name}, ${p.province}`}</title>
              </g>
            </Link>
          )
        })}
      </svg>

      {activeBranch && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-[var(--radius-base)] bg-paper px-2.5 py-1.5 shadow-[var(--shadow-panel)]"
          style={{
            left: `${(activeBranch.xy[0] / MAP_W) * 100}%`,
            top: `${(activeBranch.xy[1] / MAP_H) * 100}%`,
          }}
        >
          <span className="block text-[0.82rem] font-semibold leading-tight text-ink">
            {activeBranch.name}
          </span>
          <span className="t-label block text-[0.6rem] text-steel">
            {activeBranch.province === 'Pan-Africa' ? activeBranch.country : activeBranch.province}
          </span>
        </div>
      )}

      <figcaption
        className={`mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem] ${tone === 'dark' ? 'text-on-navy-muted' : 'text-steel'}`}
      >
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-signal" aria-hidden="true" />
          South African branch
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-signal bg-navy-900" aria-hidden="true" />
          Pan-African country point
        </span>
      </figcaption>
    </figure>
  )
}
