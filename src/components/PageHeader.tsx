import Image from 'next/image'
import Link from 'next/link'
import { CaretRight } from '@phosphor-icons/react/dist/ssr'
import type { ReactNode } from 'react'

/**
 * Shared page header.
 *
 * Breadcrumbs appear from the second level down, where orientation actually
 * helps. There is no eyebrow slot here by design: the site uses at most a
 * couple across a whole page, so they are placed deliberately in the sections
 * that need them rather than stamped above every heading.
 *
 * `backgroundImage` is opt-in — only the top-level section pages (Parts,
 * Vehicles, Branches, Wholesale, Blog, Company, Contact) pass one. Every
 * deeper page (a model, a part type, a single branch) keeps the plain paper
 * header, so a photo doesn't repeat at every level of a three-deep taxonomy.
 */
export function PageHeader({
  title,
  lead,
  breadcrumbs,
  children,
  backgroundImage,
  imageAlt = '',
}: {
  title: string
  lead?: string
  breadcrumbs?: { href: string; label: string }[]
  children?: ReactNode
  backgroundImage?: string
  imageAlt?: string
}) {
  const hasImage = Boolean(backgroundImage)

  return (
    <header
      className={`relative overflow-hidden border-b ${
        hasImage ? 'border-transparent' : 'border-hairline bg-paper-2'
      }`}
    >
      {hasImage && (
        <>
          <Image
            src={backgroundImage as string}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-navy-900/92 via-navy-900/72 to-navy-900/45"
            aria-hidden="true"
          />
        </>
      )}

      <div className="shell band-tight relative">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link
                  href="/"
                  className={`t-label transition-colors ${
                    hasImage
                      ? 'text-on-navy-muted hover:text-on-navy'
                      : 'text-steel hover:text-ink'
                  }`}
                >
                  Home
                </Link>
              </li>
              {breadcrumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <CaretRight
                    size={11}
                    weight="bold"
                    aria-hidden="true"
                    className={hasImage ? 'text-on-navy-rule' : 'text-hairline-strong'}
                  />
                  <Link
                    href={c.href}
                    className={`t-label transition-colors ${
                      hasImage
                        ? 'text-on-navy-muted hover:text-on-navy'
                        : 'text-steel hover:text-ink'
                    }`}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <h1 className={`t-h1 max-w-[20ch] ${hasImage ? 'text-on-navy' : 'text-navy-900'}`}>
          {title}
        </h1>
        {lead && (
          <p
            className="t-lead mt-5"
            style={hasImage ? { color: 'var(--color-on-navy-muted)' } : undefined}
          >
            {lead}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  )
}
