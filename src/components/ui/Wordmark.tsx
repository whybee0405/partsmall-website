import Image from 'next/image'

/**
 * The wordmark.
 *
 * Real Parts-Mall logo artwork, sourced from the group's own distributor
 * sites (parts-mall.co.za, koreanautoparts.co.za) — not an invented mark.
 * It ships full-colour only (no reversed/white variant exists), so on a navy
 * surface it sits on a small paper-coloured plate rather than being redrawn.
 */
const LOGO_SRC = '/images/brand/parts-mall-logo.png'
const LOGO_RATIO = 508 / 174

export function Wordmark({
  tone = 'ink',
  className = '',
}: {
  tone?: 'ink' | 'invert'
  className?: string
}) {
  const mark = (
    <Image
      src={LOGO_SRC}
      alt="Parts-Mall"
      width={508}
      height={174}
      priority
      className="h-full w-auto object-contain"
      style={{ aspectRatio: LOGO_RATIO }}
    />
  )

  if (tone === 'invert') {
    return (
      <span
        className={`inline-flex w-fit items-center rounded-[var(--radius-base)] bg-paper px-2 py-1 ${className}`}
      >
        {mark}
      </span>
    )
  }

  return <span className={`inline-flex w-fit items-center ${className}`}>{mark}</span>
}
