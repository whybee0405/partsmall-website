import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { MAKES, MODELS, modelsForMake } from '@/lib/data/vehicles'
import { breadcrumbLd, collectionLd, JsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Car parts by make and model',
  description: `Find replacement parts for ${MODELS.length} models across ${MAKES.length} makes, including Kia, Hyundai, Chevrolet, Ssangyong, Suzuki, Ford, Nissan and Toyota, and what each needs.`,
  alternates: { canonical: '/vehicles' },
}

export default function VehiclesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: 'Vehicles', path: '/vehicles' }]),
          collectionLd({
            name: 'Car parts by make',
            description: 'Vehicle makes supported by the Parts-Mall branch network.',
            path: '/vehicles',
            items: MAKES.map((mk) => ({ name: mk.label, path: `/vehicles/${mk.slug}` })),
          }),
        ]}
      />

      <PageHeader
        title="Start with your vehicle."
        lead={`${MODELS.length} models across ${MAKES.length} makes. Each model page lists the years and engines covered and the components most often replaced on that vehicle.`}
        breadcrumbs={[{ href: '/vehicles', label: 'Vehicles' }]}
        backgroundImage="/images/vehicles-bg.webp"
        imageAlt=""
      />

      <section className="band">
        <div className="shell">
          {MAKES.map((mk) => {
            const models = modelsForMake(mk.slug)
            return (
              <div key={mk.slug} className="mt-12 first:mt-0">
                <div className="flex items-baseline justify-between gap-4 border-t-2 border-ink pt-3">
                  <h2 className="t-h3 text-ink">
                    <Link
                      href={`/vehicles/${mk.slug}`}
                      className="hover:text-navy-700 max-sm:inline-flex max-sm:min-h-11 max-sm:items-center"
                    >
                      {mk.label}
                    </Link>
                  </h2>
                  <span className="t-data text-[0.76rem] text-steel">
                    {models.length} {models.length === 1 ? 'model' : 'models'}
                  </span>
                </div>

                <ul className="mt-1 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                  {models.map((mo) => (
                    <li key={mo.slug} className="border-b border-hairline">
                      <Link
                        href={`/vehicles/${mk.slug}/${mo.slug}`}
                        className="group flex items-center justify-between gap-4 py-3.5"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[0.98rem] font-semibold text-ink group-hover:text-navy-700">
                            {mo.label}
                          </span>
                          <span className="t-data block text-[0.74rem] text-steel">
                            {mo.body}
                          </span>
                        </span>
                        <ArrowRight
                          size={16}
                          weight="bold"
                          aria-hidden="true"
                          className="shrink-0 text-hairline-strong transition-all duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-1 group-hover:text-navy-700"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-hairline bg-paper-2">
        <div className="shell band-tight">
          <div className="max-w-[64ch]">
            <h2 className="t-h2 text-navy-900">Vehicle not listed?</h2>
            <p className="t-lead mt-4">
              These are the models we are asked about most often, not the limit of what
              the branch network supplies. Call your nearest branch with the make, model
              and year and they will confirm what is available.
            </p>
            <Link
              href="/branches"
              className="group mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-navy-700 transition-colors hover:text-navy-800 max-sm:min-h-11"
            >
              Find your nearest branch
              <ArrowRight
                size={17}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
