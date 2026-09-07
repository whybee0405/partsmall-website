'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * Scroll reveal.
 *
 * MOTION_INTENSITY is 4 on this project, deliberately. The audience is a
 * workshop buyer on a patchy connection who needs an answer, so motion does
 * exactly one job: signalling that a section has arrived. No parallax, no
 * scroll hijacking, no infinite loops.
 *
 * The hidden state lives in CSS behind an `html.js` gate rather than in an
 * inline style, which matters here. If it were inline, the server would ship
 * `opacity: 0` and a blocked or failed JS bundle would leave whole sections
 * invisible. Instead the markup renders visible, a tiny head script adds the
 * gate before first paint, and this observer animates it in. Fail the script
 * and the page is merely static, never blank.
 *
 * IntersectionObserver, never a scroll listener: no per-frame main-thread work.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section'
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already in view on load, or the user asked for reduced motion: show it
    // immediately and skip the observer entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }

    // threshold 0 rather than a ratio, deliberately. A ratio can never be met
    // by an element taller than viewportHeight / threshold, which would leave
    // a long section permanently invisible. The negative bottom margin gives
    // the same "has properly entered" feel without that failure mode.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -80px 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal=""
      className={className}
      style={delay ? ({ '--reveal-delay': `${Math.round(delay * 1000)}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
