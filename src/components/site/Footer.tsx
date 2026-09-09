import Link from 'next/link'
import { ArrowUpRight, EnvelopeSimple, NavigationArrow } from '@phosphor-icons/react/dist/ssr'
import { Wordmark } from '@/components/ui/Wordmark'
import { CookiePreferencesButton } from '@/components/CookiePreferencesButton'
import { COMPANY, headOfficeMapUrl } from '@/lib/data/company'
import { getNetworkStats } from '@/lib/payload/branches'
import type { Make } from '@/lib/data/vehicles'
import { getAllMakes } from '@/lib/payload/makes'
import type { Category } from '@/lib/data/catalogue'
import { getAllCategories } from '@/lib/payload/categories'

const footerTextLink =
  'group relative inline-flex text-on-navy/85 transition-colors duration-200 hover:text-on-navy focus-visible:text-on-navy after:absolute after:bottom-[-0.22rem] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-300 after:ease-[var(--ease-out-quart)] hover:after:scale-x-100 focus-visible:after:scale-x-100 max-sm:min-h-11 max-sm:items-center'

const footerActionLink =
  'group inline-flex h-11 items-center gap-2 rounded-[var(--radius-base)] border border-on-navy-rule px-4 text-[0.9rem] font-semibold text-on-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-on-navy hover:bg-white/5 focus-visible:-translate-y-0.5 focus-visible:border-on-navy focus-visible:bg-white/5'

function buildColumns(makes: Make[], categories: Category[]) {
  return [
  {
    title: 'Parts by system',
    links: [
      { href: '/parts', label: 'All systems' },
      ...categories.slice(0, 5).map((c) => ({
        href: `/parts/${c.slug}`,
        label: c.label,
      })),
    ],
  },
  {
    title: 'Parts by vehicle',
    links: [
      { href: '/vehicles', label: 'All makes' },
      ...makes.slice(0, 5).map((mk) => ({
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
      { href: '/blog', label: 'Blog and fitment notes' },
      { href: '/contact', label: 'Contact head office' },
    ],
  },
  ]
}

export async function Footer() {
  const [network, makes, categories] = await Promise.all([
    getNetworkStats(),
    getAllMakes(),
    getAllCategories(),
  ])
  const columns = buildColumns(makes, categories)

  return (
    <footer className="slab max-sm:pb-20" role="contentinfo">
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
                  className="group t-label flex h-9 max-sm:h-11 items-center gap-1 rounded-[var(--radius-base)] border border-on-navy-rule px-2.5 text-on-navy-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-on-navy hover:bg-white/5 hover:text-on-navy focus-visible:-translate-y-0.5 focus-visible:border-on-navy focus-visible:bg-white/5 focus-visible:text-on-navy"
                >
                  {s.label}
                  <ArrowUpRight
                    size={12}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5"
                  />
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
                      className={`${footerTextLink} text-[0.92rem]`}
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
              className={footerActionLink}
            >
              <EnvelopeSimple
                size={17}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
              />
              {COMPANY.headOffice.email}
            </a>
            <a
              href={headOfficeMapUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={footerActionLink}
            >
              <NavigationArrow
                size={17}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5"
              />
              Directions
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-on-navy-rule pt-6 text-[0.82rem] text-on-navy-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className={footerTextLink}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={footerTextLink}
            >
              Terms of Service
            </Link>
          <CookiePreferencesButton className={footerTextLink} />
          </nav>
          <p className="t-data text-[0.78rem]">
            40+ branches / {network.provinces} provinces /{' '}
            {network.countries} countries
          </p>
        </div>
      </div>
    </footer>
  )
}
