import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Phone,
  WhatsappLogo,
  NavigationArrow,
  EnvelopeSimple,
  Clock,
  MapPin,
  ArrowRight,
} from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { EnquiryForm } from '@/components/EnquiryForm'
import {
  BRANCHES,
  getBranch,
  distanceKm,
  mapsHref,
  telHref,
  whatsappNumber,
} from '@/lib/data/branches'

export function generateStaticParams() {
  return BRANCHES.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const branch = getBranch(slug)
  if (!branch) return { title: 'Branch not found' }

  // A handful of branch names carry a second town in parentheses-free form
  // ("Gqeberha, Port Elizabeth") that pushes the description past 155
  // characters once the address and phone are added — fall back to the
  // first name in that case rather than truncating mid-sentence.
  const shortAddr = branch.address.split(',')[0]
  const loc = branch.province === 'Pan-Africa' ? branch.country : branch.province
  const buildDescription = (name: string) =>
    `Parts-Mall ${name} branch, ${shortAddr}, ${loc}. Call ${branch.phone} for stock, fitment and trade supply, or WhatsApp the branch.`
  const fullDescription = buildDescription(branch.name)

  return {
    title: `${branch.name} branch`,
    description:
      fullDescription.length <= 155 ? fullDescription : buildDescription(branch.name.split(',')[0]),
    alternates: { canonical: `/branches/${branch.slug}` },
  }
}

export default async function BranchPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const branch = getBranch(slug)
  if (!branch) notFound()

  const nearby = BRANCHES.filter((b) => b.slug !== branch.slug)
    .map((b) => ({ ...b, km: distanceKm(branch, b) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 4)

  // Structured data so the branch shows correctly in local search results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: `Parts-Mall ${branch.name}`,
    telephone: `+${whatsappNumber(branch.phone)}`,
    email: branch.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: branch.address,
      addressRegion: branch.province === 'Pan-Africa' ? branch.country : branch.province,
      addressCountry: branch.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: branch.lat, longitude: branch.lng },
    parentOrganization: { '@type': 'Organization', name: 'Parts-Mall Africa' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        title={`Parts-Mall ${branch.name}`}
        breadcrumbs={[
          { href: '/branches', label: 'Branches' },
          { href: `/branches/${branch.slug}`, label: branch.name },
        ]}
      >
        {/* Actions first. Someone opening a branch page almost always wants
            to make contact, not read. */}
        <div className="flex flex-wrap gap-2.5">
          <a
            href={telHref(branch.phone)}
            className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-base)] bg-signal-deep px-5 font-semibold text-paper transition-colors hover:bg-[oklch(0.48_0.135_155)]"
          >
            <Phone size={18} weight="fill" aria-hidden="true" />
            <span className="t-data">{branch.phone}</span>
          </a>
          <a
            href={`https://wa.me/${whatsappNumber(branch.phone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-base)] border border-hairline-strong bg-card px-5 font-semibold text-ink transition-colors hover:border-ink"
          >
            <WhatsappLogo size={19} weight="fill" aria-hidden="true" />
            WhatsApp this branch
          </a>
          <a
            href={mapsHref(branch)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-base)] border border-hairline-strong bg-card px-5 font-semibold text-ink transition-colors hover:border-ink"
          >
            <NavigationArrow size={18} weight="bold" aria-hidden="true" />
            Directions
          </a>
        </div>
      </PageHeader>

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div>
            <Image
              src="/images/branch-exterior.webp"
              alt={`The Parts-Mall ${branch.name} branch, roller door open onto the street.`}
              width={1920}
              height={1288}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="w-full rounded-[var(--radius-base)] object-cover"
              priority
            />

            <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {[
                { icon: MapPin, label: 'Address', value: branch.address },
                { icon: Clock, label: 'Trading hours', value: branch.hours },
                {
                  icon: EnvelopeSimple,
                  label: 'Email',
                  value: branch.email,
                  href: `mailto:${branch.email}`,
                },
                {
                  icon: MapPin,
                  label: branch.province === 'Pan-Africa' ? 'Country' : 'Province',
                  value: branch.province === 'Pan-Africa' ? branch.country : branch.province,
                },
              ].map((row) => (
                <div key={row.label} className="border-t-2 border-ink pt-3">
                  <dt className="t-label flex items-center gap-1.5 text-steel">
                    <row.icon size={13} weight="bold" aria-hidden="true" />
                    {row.label}
                  </dt>
                  <dd className="mt-2 text-[0.98rem] leading-relaxed text-ink">
                    {row.href ? (
                      <a href={row.href} className="text-navy-700 hover:text-navy-800">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 rounded-[var(--radius-base)] border border-hairline bg-card p-6 sm:p-8">
              <h2 className="t-h3 text-ink">Send this branch a part enquiry</h2>
              <p className="mt-2 max-w-[56ch] text-[0.92rem] leading-relaxed text-steel">
                Faster on the phone if the vehicle is on the lift. Use this if you would
                rather leave the details and have {branch.name} come back to you.
              </p>
              <div className="mt-7">
                <EnquiryForm
                  type="branch"
                  branchSlug={branch.slug}
                  submitLabel={`Send to ${branch.name}`}
                />
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="t-label border-t-2 border-ink pt-3 text-ink">
              Next closest branches
            </h2>
            <ul className="mt-2">
              {nearby.map((b) => (
                <li key={b.slug} className="border-b border-hairline">
                  <Link
                    href={`/branches/${b.slug}`}
                    className="group flex items-center justify-between gap-4 py-3.5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[0.95rem] font-semibold text-ink group-hover:text-navy-700">
                        {b.name}
                      </span>
                      <span className="t-data block text-[0.75rem] text-steel">
                        {Math.round(b.km)} km · {b.province === 'Pan-Africa' ? b.country : b.province}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className="shrink-0 text-hairline-strong transition-all duration-200 group-hover:translate-x-1 group-hover:text-navy-700"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t-2 border-signal pt-4">
              <h2 className="t-h3 text-ink">A distributor or franchise, not a workshop?</h2>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-steel">
                That conversation runs through head office directly, not this branch.
              </p>
              <Link
                href="/wholesale"
                className="group mt-3 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-navy-700 transition-colors hover:text-navy-800"
              >
                Distributor and franchise enquiries
                <ArrowRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
