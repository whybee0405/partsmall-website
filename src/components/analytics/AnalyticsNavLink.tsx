'use client'

import { useEffect, useRef } from 'react'

/** Places the report shortcut directly beneath Analytics events in the Admin group. */
export function AnalyticsNavLink() {
  const linkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reportLink = linkRef.current
    const eventsLink = document.querySelector<HTMLAnchorElement>('a[href="/admin/collections/analytics-events"]')
    if (!reportLink || !eventsLink) return

    const eventsItem = eventsLink.closest('li') ?? eventsLink.parentElement
    eventsItem?.insertAdjacentElement('afterend', reportLink)
  }, [])

  return (
    <div ref={linkRef} style={{ padding: '0 var(--gutter-h, 32px) 8px' }}>
      <a
        href="/admin/analytics"
        style={{ display: 'block', padding: '10px 12px', borderRadius: 5, fontSize: 13, fontWeight: 700, color: 'var(--theme-text)', textDecoration: 'none', background: 'var(--theme-elevation-50)' }}
      >
        Detailed analytics reports
      </a>
    </div>
  )
}
