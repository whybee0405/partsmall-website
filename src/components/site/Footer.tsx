import Link from 'next/link'
import { ArrowUpRight, EnvelopeSimple, NavigationArrow } from '@phosphor-icons/react/dist/ssr'
import { Wordmark } from '@/components/ui/Wordmark'
import { COMPANY, headOfficeMapUrl } from '@/lib/data/company'
import { NETWORK } from '@/lib/data/branches'
import { CATEGORIES } from '@/lib/data/catalogue'
import { MAKES } from '@/lib/data/vehicles'

const columns = [
  {
    title: 'Parts by system',
    links: [
      { href: '/parts', label: 'All systems' },
      ...CATEGORIES.slice(0, 5).map((c) => ({
        href: `/parts/${c.slug}`,
        label: c.label,
      })),
    ],
  },
  {
    title: 'Parts by vehicle',
    links: [
      { href: '/vehicles', label: 'All makes' },
      ...MAKES.slice(0, 5).map((mk) => ({
        href: `/vehicles/${mk.slug}`,
        label: mk.label,
      })),
    ],
  },
  {
    title: 'Network',
    links: [
      { href: '/branches', label: 'Branch finder' },
      { href: '/branches#pan-africa', label: 'Pan-African points' },
      { href: '/about#network', label: 'The group network' },
      { href: '/about#timeline', label: 'Company history' },
      { href: '/faq', label: 'Frequently asked questions' },
    ],
  },
  {
    title: 'Trade',
    links: [
      { href: '/wholesale', label: 'Distributor and franchise enquiries' },
      { href: '/guides', label: 'Guides and fitment notes' },
      { href: '/contact', label: 'Contact head office' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="slab" role="contentinfo">
      <div className="shell band-tight">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,0.7fr))] lg:gap-7">
          <div>
            <Wordmark tone="invert" className="h-9" />
            <p className="mt-4 max-w-[34ch] text-[0.92rem] leading-relaxed text-on-navy-muted">
              The South African sales and distribution hub for Parts-Mall Corporation.
              Korean vehicle parts, supplied from a branch near you.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {COMPANY.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-label flex h-9 items-center gap-1 rounded-[var(--radius-base)] border border-on-navy-rule px-2.5 text-on-navy-muted transition-colors hover:border-on-navy hover:text-on-navy"
                >
                  {s.label}
                  <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="t-label border-t border-on-navy-rule pt-3 text-on-navy-muted">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.92rem] text-on-navy/85 transition-colors hover:text-on-navy"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Head office block. Kept as a real, actionable address rather than
            an atmospheric locale strip. */}
        <div className="mt-12 grid gap-6 border-t border-on-navy-rule pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h2 className="t-label text-on-navy-muted">Head office</h2>
            <p className="mt-3 t-h3 text-on-navy">{COMPANY.headOffice.name}</p>
            <address className="mt-2 not-italic text-[0.92rem] leading-relaxed text-on-navy-muted">
              {COMPANY.headOffice.address.join(', ')}
              <br />
              {COMPANY.headOffice.hours}
            </address>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${COMPANY.headOffice.email}`}
              className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-base)] border border-on-navy-rule px-4 text-[0.9rem] font-semibold text-on-navy transition-colors hover:border-on-navy"
            >
              <EnvelopeSimple size={17} weight="bold" aria-hidden="true" />
              {COMPANY.headOffice.email}
            </a>
            <a
              href={headOfficeMapUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-base)] border border-on-navy-rule px-4 text-[0.9rem] font-semibold text-on-navy transition-colors hover:border-on-navy"
            >
              <NavigationArrow size={17} weight="bold" aria-hidden="true" />
              Directions
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-on-navy-rule pt-6 text-[0.82rem] text-on-navy-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <p className="t-data text-[0.78rem]">
            {NETWORK.southAfrica} branches / {NETWORK.provinces} provinces /{' '}
            {NETWORK.countries} countries
          </p>
        </div>
      </div>
    </footer>
  )
}
