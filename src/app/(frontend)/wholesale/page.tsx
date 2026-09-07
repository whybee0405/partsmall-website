import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, EnvelopeSimple, WhatsappLogo, NavigationArrow } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { NETWORK, whatsappNumber } from '@/lib/data/branches'
import { COMPANY, CORPORATE_FACTS, headOfficeMapUrl } from '@/lib/data/company'

export const metadata: Metadata = {
  title: 'Distributor and franchise opportunities',
  description:
    'Parts-Mall is expanding its distributor and franchise network across Southern Africa. Distributors and franchise partners talk directly to head office.',
  alternates: { canonical: '/wholesale' },
}

/** Named by what happens, not "Stage 1, Stage 2" — and by what's actually
 * true now that this runs through head office rather than a form + branch
 * handoff. */
const PROCESS = [
  {
    title: 'You contact head office',
    body: 'Call, WhatsApp or email with your business, your region, and the volumes you already move.',
  },
  {
    title: 'We talk territory and fit',
    body: 'A named person at head office discusses distributor or franchise terms directly — not a reseller application form.',
  },
  {
    title: 'Terms and onboarding',
    body: 'Once territory and terms are agreed, account setup and stock planning begin.',
  },
]

export default function WholesalePage() {
  return (
    <>
      <PageHeader
        title="Distributor and franchise opportunities."
        lead="Parts-Mall is expanding its distributor and franchise network across Southern Africa. If your business already moves volume in vehicle parts, head office is where that conversation starts."
        breadcrumbs={[{ href: '/wholesale', label: 'Wholesale' }]}
        backgroundImage="/images/ph-fleet-yard.webp"
        imageAlt="A fleet yard of vehicles awaiting service."
      />

      {/* Who this is for. Three buyer types, stated plainly, so a visitor
          self-selects instead of reading a generic pitch. */}
      <section className="band">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="t-h2 max-w-[18ch] text-navy-900">
                Three ways bigger buyers work with us.
              </h2>
              <dl className="mt-8">
                {[
                  {
                    t: 'Regional distributors and resellers',
                    d: 'Territory-based bulk supply for parts retailers and importers moving volume across a defined region, including cross-border markets.',
                  },
                  {
                    t: 'Franchise partners',
                    d: 'Operate under the Parts-Mall name in your market, backed by group stock, brand systems and corporation warranty terms.',
                  },
                  {
                    t: 'Fleet and procurement',
                    d: 'Consistent supply across multiple sites, consolidated invoicing, and a single point of contact at head office.',
                  },
                ].map((row) => (
                  <div key={row.t} className="border-t-2 border-ink py-5">
                    <dt className="t-h3 text-ink">{row.t}</dt>
                    <dd className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-steel">
                      {row.d}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.08}>
              <Image
                src="/images/warehouse-aisle.webp"
                alt="A long aisle of steel pallet racking in the distribution warehouse, stacked with boxed parts, a picker working mid-aisle."
                width={1920}
                height={1288}
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="w-full rounded-[var(--radius-base)] object-cover"
              />
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { v: NETWORK.southAfrica, l: 'branches to draw stock from' },
                  { v: NETWORK.countries, l: 'countries in the local network' },
                  ...CORPORATE_FACTS.slice(0, 2).map((f) => ({ v: f.value, l: f.label })),
                ].map((s) => (
                  <div key={s.l} className="border-t-2 border-signal pt-3">
                    <span className="t-data block text-[1.75rem] font-bold leading-none text-navy-900">
                      {s.v}
                    </span>
                    <span className="mt-2 block text-[0.85rem] leading-snug text-steel">
                      {s.l}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What happens next, told honestly: this now runs through head office
          directly rather than a form that gets routed to a branch. */}
      <section className="slab">
        <div className="shell band">
          <h2 className="t-h1 max-w-[16ch] text-on-navy">How it works.</h2>

          <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-3">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="border-t-2 border-signal pt-4">
                <span className="t-data block text-[0.78rem] font-bold text-signal">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="t-h3 mt-2.5 text-on-navy">{step.title}</h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-on-navy-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing: straight to head office. No form, no branch handoff — a
          distributor or franchise conversation is qualified enough that it
          deserves a person, not a queue. */}
      <section className="band" id="contact-head-office">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 className="t-h1 max-w-[14ch] text-navy-900">Talk to head office.</h2>
            <p className="t-lead mt-5">
              Distributor and franchise conversations are handled directly by head office,
              not routed through a branch. Lead with your business, your region and the
              volumes you already move.
            </p>

            <div className="mt-10 border-t-2 border-ink pt-5">
              <h3 className="t-h3 text-ink">Running a workshop, not a distributorship?</h3>
              <p className="mt-2.5 max-w-[48ch] text-[0.95rem] leading-relaxed text-steel">
                Standard trade pricing is handled at branch level. Speak to your nearest
                branch directly rather than head office.
              </p>
              <Link
                href="/branches"
                className="group mt-3 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-navy-700 transition-colors hover:text-navy-800 max-sm:min-h-11"
              >
                Find your nearest branch
                <ArrowRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div className="rounded-[var(--radius-base)] border border-hairline bg-card p-6 sm:p-8">
            <h3 className="t-h3 text-ink">{COMPANY.headOffice.name}</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-steel">
              {COMPANY.headOffice.address.join(', ')}
            </p>
            <p className="mt-1 text-[0.85rem] text-steel">{COMPANY.headOffice.hours}</p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`https://wa.me/${whatsappNumber(COMPANY.headOffice.whatsappPhone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-base)] bg-[#25D366] px-5 text-[0.95rem] font-semibold text-white transition-[transform,background-color] duration-150 ease-[var(--ease-out-quart)] hover:-translate-y-px hover:bg-[#1fbd5a] active:translate-y-0 active:scale-[0.97]"
              >
                <WhatsappLogo size={19} weight="fill" aria-hidden="true" />
                WhatsApp head office
              </a>
              <a
                href={`mailto:${COMPANY.headOffice.email}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-base)] border border-hairline-strong bg-paper px-5 text-[0.95rem] font-semibold text-ink transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-ink hover:bg-paper-2 active:translate-y-0 active:scale-[0.97]"
              >
                <EnvelopeSimple size={19} weight="bold" aria-hidden="true" />
                {COMPANY.headOffice.email}
              </a>
              <a
                href={headOfficeMapUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-base)] border border-hairline-strong bg-paper px-5 text-[0.95rem] font-semibold text-ink transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-ink hover:bg-paper-2 active:translate-y-0 active:scale-[0.97]"
              >
                <NavigationArrow size={18} weight="bold" aria-hidden="true" />
                Directions to head office
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
