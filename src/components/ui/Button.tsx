import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/**
 * Contrast is checked, not assumed:
 *   signal   paper on signal-deep   4.84:1
 *   navy     on-navy on navy-700    9.36:1
 *   outline  ink on paper          15.1:1
 *   invert   navy-900 on paper     13.2:1  (for use on slabs)
 * The bright --color-signal is never used behind text.
 */
type Variant = 'signal' | 'navy' | 'outline' | 'invert' | 'ghost'
type Size = 'md' | 'sm'

const base =
  'group inline-flex items-center justify-center gap-2 rounded-[var(--radius-base)] font-semibold ' +
  'whitespace-nowrap transition-[transform,background-color,border-color,box-shadow] duration-150 ' +
  'ease-[var(--ease-out-quart)] hover:-translate-y-px active:translate-y-0 active:scale-[0.97] ' +
  'disabled:pointer-events-none disabled:opacity-45 disabled:hover:translate-y-0'

const variants: Record<Variant, string> = {
  signal:
    'bg-signal-deep text-paper border border-signal-deep hover:bg-[oklch(0.44_0.14_155)] hover:border-signal hover:shadow-[var(--shadow-lift)]',
  navy: 'bg-navy-700 text-on-navy border border-navy-700 hover:bg-navy-900 hover:border-signal hover:shadow-[var(--shadow-lift)]',
  outline:
    'bg-transparent text-ink border border-hairline-strong hover:border-navy-700 hover:bg-paper-2 hover:text-navy-700',
  invert:
    'bg-paper text-navy-900 border border-paper hover:bg-white hover:shadow-[var(--shadow-lift)]',
  ghost:
    'bg-transparent text-navy-700 border border-transparent hover:bg-navy-100/60 hover:text-navy-800',
}

/** Drop into a Button/ButtonLink's trailing icon so it nudges forward on
 * hover — the button itself carries `group`, this just opts the icon in. */
export const buttonArrowClass =
  'transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1'

// md is 48px everywhere. sm is 40px at desktop pointer sizes but grows to
// the 44px touch-target floor below the sm breakpoint, where every sm
// button is being tapped rather than clicked.
const sizes: Record<Size, string> = {
  md: 'h-12 px-5 text-[0.95rem]',
  sm: 'h-10 max-sm:h-11 px-4 text-[0.875rem]',
}

type BaseProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode }

export function Button({
  variant = 'signal',
  size = 'md',
  className = '',
  children,
  ...rest
}: BaseProps & ComponentProps<'button'>) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'signal',
  size = 'md',
  className = '',
  children,
  href,
  ...rest
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  )
}
