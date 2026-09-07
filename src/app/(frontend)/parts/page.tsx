import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { CategoryIcon } from '@/components/CategoryIcon'
import { Reveal } from '@/components/ui/Reveal'
import { CATEGORIES, PART_TYPES, typesInCategory } from '@/lib/data/catalogue'
import { MAKES } from '@/lib/data/vehicles'
import { breadcrumbLd, collectionLd, JsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Car parts by system',
  description: `Replacement car parts across ${CATEGORIES.length} systems and ${PART_TYPES.length} part types: Kia, Hyundai, Chevrolet, Ssangyong, Ford, Nissan and Toyota. What each part does, how it fails.`,
  alternates: { canonical: '/parts' },
}

export default function PartsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: 'Parts', path: '/parts' }]),
          collectionLd({
            name: 'Car parts by system',
            description: `The ${CATEGORIES.length} parts systems Parts-Mall supplies across South Africa.`,
            path: '/parts',
            items: CATEGORIES.map((c) => ({ name: c.label, path: `/parts/${c.slug}` })),
          }),
        ]}
      />

      <PageHeader
        title="Every system, explained."
        lead={`${CATEGORIES.length} systems and ${PART_TYPES.length} part types. Each page covers what the component does, how it fails, and exactly what the counter needs confirmed before an order goes through.`}
        breadcrumbs={[{ href: '/parts', label: 'Parts' }]}
        backgroundImage="/images/hero-counter.webp"
        imageAlt="A counter team member checking a part number at the trade counter."
      />

      <section className="band">
        <div className="shell">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => {
              const count = typesInCategory(c.slug).length
              return (
              <li key={c.slug} className="bg-paper ring-1 ring-inset ring-hairline">
                <Link
                  href={`/parts/${c.slug}`}
                  className="group flex h-full flex-col gap-4 p-6 transition-colors duration-200 hover:bg-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <CategoryIcon
                      name={c.icon}
                      size={24}
                      className="text-steel transition-colors duration-200 group-hover:text-signal-deep"
                    />
                    <span className="t-data text-[0.7rem] text-steel">
                      {count} {count === 1 ? 'type' : 'types'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="t-h3 text-ink group-hover:text-navy-700">{c.label}</h2>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-steel">
                      {c.blurb}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-navy-700">
                    View {c.label.toLowerCase()}
                    <ArrowRight
                      size={15}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* The second axis. Someone who knows their car but not the part name
          should be able to switch tracks here rather than bounce. */}
      <section className="slab">
        <div className="shell band-tight">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
            <div>
              <h2 className="t-h1 max-w-[16ch] text-on-navy">
                Or start from the vehicle.
              </h2>
              <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-on-navy-muted">
                If you know the car but not the part name, browse by make and model
                instead. Every model page lists the components most often replaced on
                it, with the years and engines covered.
              </p>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3">
              {MAKES.map((mk) => (
                <li key={mk.slug} className="bg-navy-900 ring-1 ring-inset ring-on-navy-rule">
                  <Link
                    href={`/vehicles/${mk.slug}`}
                    className="block px-4 py-4 text-[0.95rem] font-semibold text-on-navy transition-colors hover:bg-white/5"
                  >
                    {mk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* A visual break so the page is not three stacked lists. */}
      <section className="band-tight">
        <div className="shell">
          <Reveal className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <Image
              src="/images/warehouse-aisle.webp"
              alt="A long aisle of steel pallet racking stacked with boxed parts, a picker working mid-aisle."
              width={1920}
              height={1288}
              sizes="(max-width: 768px) 100vw, 46vw"
              className="w-full rounded-[var(--radius-base)] object-cover"
            />
            <div>
              <h2 className="t-h2 max-w-[18ch] text-navy-900">
                What is published here is not all we carry.
              </h2>
              <p className="t-lead mt-5">
                These pages cover the systems and part types we are asked about most.
                Branches carry and source considerably beyond them, including OEM and
                genuine lines. If you cannot find it, send the part number, the vehicle,
                or a photograph of the old part.
              </p>
              <Link
                href="/branches"
                className="group mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-navy-700 transition-colors hover:text-navy-800 max-sm:min-h-11"
              >
                Ask your nearest branch
                <ArrowRight
                  size={17}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
