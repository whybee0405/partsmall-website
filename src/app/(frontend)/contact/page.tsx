import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  EnvelopeSimple,
  NavigationArrow,
  Clock,
  MapPin,
  ArrowRight,
} from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { EnquiryForm } from '@/components/EnquiryForm'
import { COMPANY, headOfficeMapUrl } from '@/lib/data/company'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Parts-Mall Africa head office in Meadowdale, Germiston. For stock checks and fitment, contact your nearest of 40+ network points directly.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Talk to head office."
        lead="Head office handles distributor and franchise conversations and anything that needs routing beyond a single branch. For stock and fitment, your branch is faster."
        breadcrumbs={[{ href: '/contact', label: 'Contact' }]}
        backgroundImage="/images/ph-delivery-van.webp"
        imageAlt="A Parts-Mall delivery van."
      />

      {/* Route people correctly before they fill anything in. A mechanic who
          needs a part today should not be sitting in a head-office queue. */}
      <section className="band-tight border-b border-hairline">
        <div className="shell">
          <div className="grid gap-px bg-hairline md:grid-cols-3">
            {[
              {
                title: 'Need a part today?',
                body: 'Call the counter directly. Branches check stock while you are on the line.',
                href: '/branches',
                cta: 'Find a branch',
              },
              {
                title: 'A distributor or franchisee?',
                body: 'Regional distribution, franchise territories and fleet supply start here.',
                href: '/wholesale',
                cta: 'Distributor and franchise enquiries',
              },
              {
                title: 'Something else?',
                body: 'Campaigns, supplier approaches, careers and general head office matters.',
                href: '#enquiry',
                cta: 'Send an enquiry',
              },
            ].map((c) => (
              <div key={c.title} className="bg-paper p-6">
                <h2 className="t-h3 text-ink">{c.title}</h2>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-steel">{c.body}</p>
                <Link
                  href={c.href}
                  className="group mt-4 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-navy-700 transition-colors hover:text-navy-800 max-sm:min-h-11"
                >
                  {c.cta}
                  <ArrowRight
                    size={16}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band" id="enquiry">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Image
              src="/images/head-office.webp"
              alt="The Parts-Mall head office and distribution building in the R24 Business Park, Meadowdale, in late afternoon light."
              width={1920}
              height={1288}
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
              className="w-full rounded-[var(--radius-base)] object-cover"
            />

            <h2 className="t-h2 mt-10 text-navy-900">{COMPANY.headOffice.name}</h2>

            <dl className="mt-7 space-y-6">
              <div className="border-t-2 border-ink pt-3">
                <dt className="t-label flex items-center gap-1.5 text-steel">
                  <MapPin size={13} weight="bold" aria-hidden="true" />
                  Address
                </dt>
                <dd className="mt-2">
                  <address className="not-italic leading-relaxed text-ink">
                    {COMPANY.headOffice.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>

              <div className="border-t-2 border-ink pt-3">
                <dt className="t-label flex items-center gap-1.5 text-steel">
                  <EnvelopeSimple size={13} weight="bold" aria-hidden="true" />
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${COMPANY.headOffice.email}`}
                    className="inline-flex text-[1rem] font-semibold text-navy-700 hover:text-navy-800 max-sm:min-h-11 max-sm:items-center"
                  >
                    {COMPANY.headOffice.email}
                  </a>
                </dd>
              </div>

              <div className="border-t-2 border-ink pt-3">
                <dt className="t-label flex items-center gap-1.5 text-steel">
                  <Clock size={13} weight="bold" aria-hidden="true" />
                  Office hours
                </dt>
                <dd className="mt-2 text-ink">{COMPANY.headOffice.hours}</dd>
              </div>
            </dl>

            <a
              href={headOfficeMapUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-base)] border border-hairline-strong bg-card px-5 font-semibold text-ink transition-colors hover:border-ink"
            >
              <NavigationArrow size={18} weight="bold" aria-hidden="true" />
              Directions to Meadowdale
            </a>
          </div>

          <div className="rounded-[var(--radius-base)] border border-hairline bg-card p-6 sm:p-8">
            <h2 className="t-h2 text-navy-900">Send an enquiry.</h2>
            <p className="mt-3 max-w-[52ch] text-[0.95rem] leading-relaxed text-steel">
              We answer with a named person. If the vehicle is on the lift, call your
              branch instead, it will be quicker.
            </p>
            <div className="mt-8">
              <EnquiryForm type="general" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
