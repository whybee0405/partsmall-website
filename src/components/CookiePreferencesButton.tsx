'use client'

import { openCookiePreferences } from '@/lib/consent'

/** Reopens the cookie banner so a visitor can change an earlier choice. */
export function CookiePreferencesButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      Cookie preferences
    </button>
  )
}
