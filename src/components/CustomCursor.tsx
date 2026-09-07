'use client'

import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor-interactive]'

/**
 * A custom cursor, fine-pointer desktop only. Gated on `(pointer: fine)` and
 * `prefers-reduced-motion` at mount, with a fallback: if a touch pointerdown
 * ever fires (a touchscreen laptop with a mouse too, primary pointer
 * ambiguous), it switches off for the rest of the session rather than
 * fighting the OS cursor. Native cursor is otherwise left completely alone —
 * `cursor: none` is only applied once this component confirms it's active,
 * so a blocked or slow script never leaves the visitor without a cursor.
 */
export function CustomCursor() {
  const [active, setActive] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reducedMotion) return

    setActive(true)
    document.documentElement.classList.add('custom-cursor-active')

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: target.x, y: target.y }
    let raf = 0
    let hovering = false

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.x}px, ${target.y}px) translate(-50%, -50%)`
      }
      const el = e.target as Element | null
      const nowHovering = Boolean(el?.closest(INTERACTIVE_SELECTOR))
      if (nowHovering !== hovering) {
        hovering = nowHovering
        ringRef.current?.classList.toggle('is-hover', hovering)
        dotRef.current?.classList.toggle('is-hover', hovering)
      }
    }

    const onLeave = () => {
      dotRef.current?.classList.add('is-hidden')
      ringRef.current?.classList.add('is-hidden')
    }
    const onEnter = () => {
      dotRef.current?.classList.remove('is-hidden')
      ringRef.current?.classList.remove('is-hidden')
    }

    // A genuine touch interaction means we guessed wrong from matchMedia
    // alone — bail out and give the OS cursor back permanently.
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        document.documentElement.classList.remove('custom-cursor-active')
        setActive(false)
      }
    }

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.22
      ring.y += (target.y - ring.y) * 0.22
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    raf = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!active) return null

  return (
    <>
      <div ref={dotRef} className="hero-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="hero-cursor-ring" aria-hidden="true" />
    </>
  )
}
