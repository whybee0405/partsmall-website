'use client'

import { useEffect, useState } from 'react'

/**
 * Cookie consent — the real integration seam, not a decorative banner.
 *
 * There is no analytics tool wired up yet (it isn't built), so nothing
 * actually reads `hasAnalyticsConsent()` today. When it ships, it should
 * check that function before initialising, and listen for `CONSENT_EVENT`
 * to start or stop if the visitor changes their choice later via the
 * "Cookie preferences" link in the footer — without needing a reload.
 */

const KEY = 'pm-cookie-consent'
export const CONSENT_EVENT = 'pm-consent-change'
export const OPEN_PREFERENCES_EVENT = 'pm-open-cookie-preferences'

export type ConsentStatus = 'accepted' | 'rejected'

export function getConsent(): ConsentStatus | null {
  if (typeof window === 'undefined') return null
  const v = window.localStorage.getItem(KEY)
  return v === 'accepted' || v === 'rejected' ? v : null
}

export function setConsent(status: ConsentStatus) {
  window.localStorage.setItem(KEY, status)
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: status }))
}

/** True only once the future analytics tool is allowed to run. */
export function hasAnalyticsConsent() {
  return getConsent() === 'accepted'
}

/** Lets the footer's "Cookie preferences" link reopen the banner. */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))
}

/**
 * True whenever the cookie banner is (or should be) on screen — no choice
 * made yet, or the visitor reopened it from the footer. The floating
 * WhatsApp and chat buttons read this to lift clear of the banner instead
 * of sitting underneath it.
 */
export function useCookieBannerOpen() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(getConsent() === null)

    const onConsent = () => setOpen(false)
    const onReopen = () => setOpen(true)
    window.addEventListener(CONSENT_EVENT, onConsent)
    window.addEventListener(OPEN_PREFERENCES_EVENT, onReopen)
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent)
      window.removeEventListener(OPEN_PREFERENCES_EVENT, onReopen)
    }
  }, [])

  return open
}
