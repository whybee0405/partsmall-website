'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { List, X, MapPin } from '@phosphor-icons/react'
import { Wordmark } from '@/components/ui/Wordmark'
import { ButtonLink } from '@/components/ui/Button'

// Both routes into the catalogue sit at the top level: people either know the
// part they need or they know their car, and neither should have to guess.
const NAV = [
  { href: '/parts', label: 'Parts' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/branches', label: 'Branches' },
  { href: '/wholesale', label: 'Wholesale' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'Company' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  // A sentinel plus IntersectionObserver, not a scroll listener: no work on
  // the main thread per frame.
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      threshold: 1,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => setOpen(false), [pathname])

  // Lock the page, trap focus, and restore focus to the trigger on close.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const items = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    panel.current?.querySelector<HTMLElement>('a[href]')?.focus()
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-px w-full" />

      <header
        className={`sticky top-0 z-50 border-b bg-paper/92 backdrop-blur-md transition-shadow duration-200 ${
          stuck ? 'border-hairline shadow-[0_1px_0_oklch(0.885_0.006_85),0_8px_24px_oklch(0.25_0.07_262/0.05)]' : 'border-transparent'
        }`}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6 lg:h-[76px]">
          <Link
            href="/"
            aria-label="Parts-Mall Africa, home"
            className="flex shrink-0 items-center rounded-[var(--radius-base)] max-sm:min-h-11"
          >
            <Wordmark className="h-7 sm:h-8" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`group relative flex h-11 items-center rounded-[var(--radius-base)] px-3.5 text-[0.92rem] font-semibold transition-colors duration-150 ${
                      isActive(item.href)
                        ? 'text-navy-800'
                        : 'text-ink-soft hover:text-navy-700'
                    }`}
                  >
                    {item.label}
                    {/* Current page is marked by a static rule; every other
                        item gets the same rule animated in from the hover
                        state, so the active mark reads as "where this one
                        already landed" rather than a different treatment. */}
                    {isActive(item.href) ? (
                      <span className="absolute inset-x-3.5 bottom-1.5 h-[2px] bg-signal" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3.5 bottom-1.5 h-[2px] origin-left scale-x-0 bg-navy-500 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:scale-x-100"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Stays visible on phones, because at a workshop counter this is
                the whole point of the site. Below 640px it collapses to the
                pin alone and keeps its accessible name.
                Note: `max-sm:` and not `hidden sm:inline-flex`. The button's
                own base class sets inline-flex, which beats a plain `hidden`
                in the cascade; a media variant wins cleanly. */}
            <ButtonLink
              href="/branches"
              variant="signal"
              size="sm"
              className="max-sm:w-11 max-sm:gap-0 max-sm:px-0"
            >
              <MapPin size={17} weight="bold" aria-hidden="true" />
              <span className="max-sm:sr-only">Find a branch</span>
            </ButtonLink>

            <button
              ref={trigger}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-base)] text-ink transition-colors hover:bg-paper-2 lg:hidden"
            >
              <List size={24} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu. Full-bleed navy so it reads as a different surface, not
          a dropdown that can be half-missed on a small screen. */}
      {open && (
        <div
          id="mobile-nav"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[100] flex flex-col bg-navy-900 text-on-navy lg:hidden"
        >
          <div className="shell flex h-[68px] shrink-0 items-center justify-between">
            <Wordmark tone="invert" className="h-7 sm:h-8" />
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                trigger.current?.focus()
              }}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-base)] text-on-navy transition-colors hover:bg-white/10"
            >
              <X size={24} weight="bold" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="shell flex-1 overflow-y-auto py-4">
            <ul>
              {NAV.map((item) => (
                <li key={item.href} className="border-b border-on-navy-rule/50">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="t-h3 -mx-4 flex items-center justify-between px-4 py-4 text-on-navy transition-colors duration-150 active:bg-white/10"
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="h-2 w-2 shrink-0 bg-signal" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              ))}
              <li className="border-b border-on-navy-rule/50">
                <Link
                  href="/contact"
                  className="t-h3 -mx-4 block px-4 py-4 text-on-navy transition-colors duration-150 active:bg-white/10"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="shell shrink-0 space-y-3 border-t border-on-navy-rule pb-8 pt-5">
            <ButtonLink href="/branches" variant="signal" className="w-full">
              <MapPin size={18} weight="bold" aria-hidden="true" />
              Find your nearest branch
            </ButtonLink>
            <p className="text-[0.85rem] leading-relaxed text-on-navy-muted">
              33 branches across 9 provinces, plus 5 pan-African country points.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
