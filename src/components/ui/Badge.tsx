import type { ReactNode } from 'react'

type Tone = 'signal' | 'navy' | 'neutral' | 'invert'

const tones: Record<Tone, string> = {
  // Dark text on the soft tint, so the bright green never sits under type.
  signal: 'bg-signal-soft text-[oklch(0.42_0.11_155)] border-[oklch(0.86_0.06_155)]',
  navy: 'bg-navy-100 text-navy-800 border-[oklch(0.87_0.04_262)]',
  neutral: 'bg-paper-2 text-ink-soft border-hairline',
  invert: 'bg-white/10 text-on-navy border-white/20',
}

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: Tone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`t-label inline-flex h-[1.75rem] items-center rounded-[var(--radius-base)] border px-2 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
