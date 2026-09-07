'use client'

import Link from 'next/link'
import { Cookie } from '@phosphor-icons/react'
import { setConsent, useCookieBannerOpen, type ConsentStatus } from '@/lib/consent'

/**
 * The consent gate for the analytics tool that doesn't exist yet. Reject
 * is a real, equal-weight choice here, not a smaller grey link next to a
 * bright "Accept" button — the point of asking is that no either answer
 * blocks you from using the site.
 */
export function CookieBanner() {
  const open = useCookieBannerOpen()

  const choose = (status: ConsentStatus) => {
    setConsent(status)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      aria-describedby="cookie-banner-text"
      className="fixed inset-x-0 bottom-0 z-[110] border-t border-hairline-strong bg-card shadow-[var(--shadow-panel)]"
    >
      <div className="shell flex flex-col items-start gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie
            size={22}
            weight="fill"
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-navy-700"
          />
          <p id="cookie-banner-text" className="max-w-[62ch] text-[0.9rem] leading-relaxed text-ink-soft">
            We use a first-party analytics cookie to understand how this site is used —
            nothing from a third-party ad network. Reject it and the site works exactly
            the same.{' '}
            <Link
              href="/privacy#cookies"
              className="font-semibold text-navy-700 underline underline-offset-2 hover:text-navy-800"
            >
              Read the cookie policy
            </Link>
            .
          </p>
        </div>

        <div className="flex w-full shrink-0 gap-2.5 sm:w-auto">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="h-11 flex-1 rounded-[var(--radius-base)] border border-hairline-strong bg-paper px-5 text-[0.9rem] font-semibold text-ink transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-ink hover:bg-paper-2 active:translate-y-0 active:scale-[0.97] sm:flex-none"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="h-11 flex-1 rounded-[var(--radius-base)] bg-signal-deep px-5 text-[0.9rem] font-semibold text-paper border border-signal-deep transition-[transform,background-color,border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)] hover:-translate-y-px hover:bg-[oklch(0.44_0.14_155)] hover:border-signal hover:shadow-[var(--shadow-lift)] active:translate-y-0 active:scale-[0.97] sm:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
