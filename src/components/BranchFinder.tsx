'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  MagnifyingGlass,
  Phone,
  WhatsappLogo,
  NavigationArrow,
  CrosshairSimple,
  ArrowRight,
  Spinner,
} from '@phosphor-icons/react'
import {
  BRANCHES,
  PROVINCE_ORDER,
  mapsHref,
  telHref,
  whatsappNumber,
  searchBranches,
  type Branch,
} from '@/lib/data/branches'
import { BranchMapLeaflet } from '@/components/BranchMapLeaflet'

type Located = Branch & { km?: number }

/**
 * The branch finder.
 *
 * This is the highest-value interaction on the site. A workshop owner with a
 * car on the lift needs a phone number in under three taps, so call, WhatsApp
 * and directions are always visible on every row rather than hidden behind a
 * hover or a detail page. WhatsApp is first-class because in this market it
 * is how the trade actually sends a photo of the old part.
 */
export function BranchFinder({
  limit,
  showFilters = true,
  showMap = true,
}: {
  limit?: number
  showFilters?: boolean
  showMap?: boolean
}) {
  const [query, setQuery] = useState('')
  const [province, setProvince] = useState<string>('All')
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  const results = useMemo<Located[]>(
    () => searchBranches(query, province, origin, limit),
    [query, province, origin, limit],
  )
  // Unlimited, for the map — so "6 of 38" doesn't read as "everywhere else is
  // a non-match" when it's really just the list being capped for the page.
  const matchedSlugs = useMemo(
    () => searchBranches(query, province, origin).map((b) => b.slug),
    [query, province, origin],
  )

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeoError('This browser cannot share your location. Search by town instead.')
      return
    }
    setLocating(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setProvince('All')
        setLocating(false)
      },
      () => {
        setGeoError('We could not get your location. Search by town or province instead.')
        setLocating(false)
      },
      { timeout: 8000, maximumAge: 300000 },
    )
  }

  return (
    <div className={showMap ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-12' : undefined}>
      <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={20}
            weight="bold"
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-steel"
          />
          <label htmlFor="branch-search" className="sr-only">
            Search branches by town, province or country
          </label>
          <input
            id="branch-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by town, province or country"
            className="h-13 w-full rounded-[var(--radius-base)] border border-hairline-strong bg-card py-3.5 pl-11 pr-4 text-[1rem] text-ink placeholder:text-steel transition-colors hover:border-ink-soft focus:border-ink-soft"
          />
        </div>
        <button
          type="button"
          onClick={locate}
          disabled={locating}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-[var(--radius-base)] border border-hairline-strong bg-card px-4 py-3.5 text-[0.92rem] font-semibold text-ink transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-ink hover:bg-paper-2 active:translate-y-0 active:scale-[0.97] disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {locating ? (
            <Spinner size={18} weight="bold" aria-hidden="true" className="animate-spin" />
          ) : (
            <CrosshairSimple size={18} weight="bold" aria-hidden="true" />
          )}
          {locating ? 'Finding you' : 'Nearest to me'}
        </button>
      </div>

      {geoError && (
        <p role="status" className="mt-2.5 text-[0.85rem] text-[oklch(0.48_0.17_27)]">
          {geoError}
        </p>
      )}

      {showFilters && (
        <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter by province">
          {['All', ...PROVINCE_ORDER].map((p) => {
            const on = province === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => setProvince(p)}
                aria-pressed={on}
                className={`t-label h-9 rounded-[var(--radius-base)] border px-2.5 transition-colors ${
                  on
                    ? 'border-navy-900 bg-navy-900 text-on-navy'
                    : 'border-hairline bg-card text-steel hover:border-ink-soft hover:text-ink'
                }`}
              >
                {p === 'Pan-Africa' ? 'Pan-African' : p}
              </button>
            )
          })}
        </div>
      )}

      <p role="status" aria-live="polite" className="t-data mt-5 text-[0.82rem] text-steel">
        {results.length} {results.length === 1 ? 'branch' : 'branches'}
        {origin ? ', nearest first' : ''}
      </p>

      {results.length === 0 ? (
        <div className="mt-4 rounded-[var(--radius-base)] border border-dashed border-hairline-strong bg-card p-8 text-center">
          <p className="t-h3 text-ink">No branch matches that search</p>
          <p className="mx-auto mt-2 max-w-[46ch] text-[0.92rem] leading-relaxed text-steel">
            Try the province filter, or send the part you need to head office and the team
            will route you to the closest branch that carries it.
          </p>
          <Link
            href="/contact"
            className="group mt-5 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-navy-700 transition-colors hover:text-navy-800"
          >
            Ask head office
            <ArrowRight
              size={16}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      ) : (
        <ul className="mt-4 border-t-2 border-ink">
          {results.map((b) => (
            <li
              key={b.slug}
              className="group grid gap-3 border-b border-hairline py-4 transition-colors hover:bg-card md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {/* Padded out so the tap target clears 24px comfortably
                      without changing the row rhythm. */}
                  <Link
                    href={`/branches/${b.slug}`}
                    className="t-h3 -my-1 inline-block py-1 text-ink transition-colors hover:text-navy-700"
                  >
                    {b.name}
                  </Link>
                  <span className="t-label text-steel">
                    {b.province === 'Pan-Africa' ? b.country : b.province}
                  </span>
                  {typeof b.km === 'number' && (
                    <span className="t-data text-[0.78rem] font-semibold text-signal-deep">
                      {b.km < 10 ? b.km.toFixed(1) : Math.round(b.km)} km away
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-[0.9rem] text-steel">{b.address}</p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <a
                  href={telHref(b.phone)}
                  aria-label={`Call the ${b.name} branch on ${b.phone}`}
                  className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-base)] border border-hairline-strong bg-card px-3 text-[0.85rem] font-semibold text-ink transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-ink hover:bg-paper-2 active:translate-y-0 active:scale-[0.97]"
                >
                  <Phone size={16} weight="fill" aria-hidden="true" />
                  <span className="t-data">{b.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber(b.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Message the ${b.name} branch on WhatsApp`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-base)] border border-hairline-strong bg-card text-ink transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-signal-deep hover:bg-signal-soft hover:text-signal-deep active:translate-y-0 active:scale-[0.97]"
                >
                  <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
                </a>
                <a
                  href={mapsHref(b)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Directions to the ${b.name} branch`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-base)] border border-hairline-strong bg-card text-ink transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-ink hover:bg-paper-2 active:translate-y-0 active:scale-[0.97]"
                >
                  <NavigationArrow size={17} weight="bold" aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>

      {showMap && (
        <div className="lg:sticky lg:top-24 lg:self-start">
          <BranchMapLeaflet branches={BRANCHES} highlightSlugs={matchedSlugs} />
        </div>
      )}
    </div>
  )
}
