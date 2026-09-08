import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin, Info } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { CategoryIcon } from '@/components/CategoryIcon'
import { modelYearSpan } from '@/lib/data/vehicles'
import { getMake } from '@/lib/payload/makes'
import { getAllModels, getModel } from '@/lib/payload/models'
import { getPartType } from '@/lib/payload/partTypes'
import { getCategory } from '@/lib/payload/categories'
import { breadcrumbLd, collectionLd, JsonLd, SITE_URL, metaDescription } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string; model: string }>
}): Promise<Metadata> {
  const { make, model } = await params
  const mk = await getMake(make)
  const mo = await getModel(make, model)
  if (!mk || !mo) return { title: 'Not found' }

  return {
    title: `${mk.label} ${mo.label} parts`,
    description: metaDescription(
      `${mk.label} ${mo.label} replacement parts, ${modelYearSpan(mo)}. Brakes, clutch, filters, bearings and more, supplied through 40+ South African branches.`,
    ),
    alternates: { canonical: `/vehicles/${mk.slug}/${mo.slug}` },
  }
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ make: string; model: string }>
}) {
  const { make, model } = await params
  const mk = await getMake(make)
  const mo = await getModel(make, model)
  if (!mk || !mo) notFound()

  const parts = (await Promise.all(mo.parts.map((slug) => getPartType(slug)))).filter(
    (x): x is NonNullable<typeof x> => Boolean(x),
  )
  const partCategories = new Map(
    (await Promise.all(parts.map((p) => getCategory(p.category)))).map((cat, i) => [
      parts[i].slug,
      cat,
    ]),
  )

  const siblingModels = (await getAllModels()).filter(
    (x) => x.make === mk.slug && x.slug !== mo.slug,
  )

  const vehicleLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${mk.label} ${mo.label}`,
    manufacturer: { '@type': 'Organization', name: mk.label },
    model: mo.label,
    bodyType: mo.body,
    url: `${SITE_URL}/vehicles/${mk.slug}/${mo.slug}`,
    description: mo.summary,
  }

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Vehicles', path: '/vehicles' },
            { name: mk.label, path: `/vehicles/${mk.slug}` },
            { name: mo.label, path: `/vehicles/${mk.slug}/${mo.slug}` },
          ]),
          vehicleLd,
          collectionLd({
            name: `${mk.label} ${mo.label} parts`,
            description: mo.summary,
            path: `/vehicles/${mk.slug}/${mo.slug}`,
            items: parts.map((p) => ({
              name: `${p.label} for the ${mk.label} ${mo.label}`,
              path: `/vehicles/${mk.slug}/${mo.slug}/${p.slug}`,
            })),
          }),
        ]}
      />

      <PageHeader
        title={`${mk.label} ${mo.label} parts`}
        breadcrumbs={[
          { href: '/vehicles', label: 'Vehicles' },
          { href: `/vehicles/${mk.slug}`, label: mk.label },
          { href: `/vehicles/${mk.slug}/${mo.slug}`, label: mo.label },
        ]}
      >
        <p className="t-lead max-w-[66ch] border-t-2 border-signal pt-5 text-ink">
          {mo.summary}
        </p>
      </PageHeader>

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-16">
          <div className="min-w-0">
            {/* The generation table. This is where a year query like
                "2011" is matched, without needing a URL tier per year. */}
            <h2 className="t-h2 text-navy-900">Years and engines covered</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse text-left">
                <thead>
                  <tr className="border-t-2 border-ink">
                    <th scope="col" className="t-label py-3 pr-6 text-steel">
                      Years
                    </th>
                    <th scope="col" className="t-label py-3 pr-6 text-steel">
                      Engines
                    </th>
                    <th scope="col" className="t-label py-3 text-steel">
                      Body
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mo.generations.map((g) => (
                    <tr key={g.years} className="border-b border-hairline">
                      <td className="t-data py-4 pr-6 align-top text-[0.9rem] font-semibold text-ink">
                        {g.years}
                      </td>
                      <td className="py-4 pr-6 align-top text-[0.95rem] text-ink-soft">
                        {g.engines}
                        {g.note && (
                          <span className="mt-1 block text-[0.85rem] text-steel">
                            {g.note}
                          </span>
                        )}
                      </td>
                      <td className="py-4 align-top text-[0.95rem] text-ink-soft">
                        {mo.body}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5 flex max-w-[64ch] gap-3 text-[0.88rem] leading-relaxed text-steel">
              <Info size={17} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0" />
              Years and engines are a guide to the South African market. Exact fitment is
              confirmed by the supplying branch against your vehicle before dispatch.
            </p>

            {mo.note && (
              <div className="mt-10 border-t-2 border-signal pt-4">
                <h2 className="t-h3 text-ink">From the counter</h2>
                <p className="mt-2 max-w-[64ch] text-[0.98rem] leading-relaxed text-ink-soft">
                  {mo.note}
                </p>
              </div>
            )}

            <h2 className="t-h2 mt-14 text-navy-900">
              Parts for the {mk.label} {mo.label}
            </h2>
            <p className="mt-4 max-w-[64ch] text-[0.98rem] leading-relaxed text-steel">
              The components most often replaced on this vehicle. Each page covers what
              the part does, how it fails, and what to confirm before ordering.
            </p>

            <ul className="mt-7 grid sm:grid-cols-2">
              {parts.map((p) => {
                const cat = partCategories.get(p.slug)
                return (
                  <li key={p.slug} className="bg-paper ring-1 ring-inset ring-hairline">
                    <Link
                      href={`/vehicles/${mk.slug}/${mo.slug}/${p.slug}`}
                      className="group flex h-full flex-col gap-3 p-5 transition-colors duration-200 hover:bg-card"
                    >
                      <div className="flex items-start justify-between gap-3">
                        {cat && (
                          <CategoryIcon
                            name={cat.icon}
                            size={20}
                            className="text-steel transition-colors group-hover:text-signal-deep"
                          />
                        )}
                        <ArrowRight
                          size={15}
                          weight="bold"
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-hairline-strong transition-all duration-200 group-hover:translate-x-1 group-hover:text-navy-700"
                        />
                      </div>
                      <div>
                        <h3 className="text-[0.98rem] font-bold leading-tight text-ink group-hover:text-navy-700">
                          {p.label}
                        </h3>
                        <span className="t-label mt-1.5 block text-steel">
                          {cat?.label}
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-base)] border border-hairline bg-card p-6">
              <span className="t-label block text-steel">
                {mk.label} {mo.label}
              </span>
              <p className="t-data mt-2 text-[1.1rem] font-bold text-navy-900">
                {modelYearSpan(mo)}
              </p>
              <p className="mt-4 text-[0.92rem] leading-relaxed text-steel">
                Give the counter the build year and engine and they will confirm the
                right part while you are on the line.
              </p>
              <div className="mt-5 space-y-2.5">
                <ButtonLink href="/branches" variant="signal" className="w-full">
                  <MapPin size={18} weight="fill" aria-hidden="true" />
                  Find a branch
                </ButtonLink>
                <ButtonLink href="/wholesale" variant="outline" className="w-full">
                  Trade pricing
                </ButtonLink>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="t-label border-t-2 border-ink pt-3 text-ink">
                Other {mk.label} models
              </h2>
              <ul className="mt-2">
                {siblingModels.map((x) => (
                  <li key={x.slug} className="border-b border-hairline">
                    <Link
                      href={`/vehicles/${mk.slug}/${x.slug}`}
                      className="group flex items-center justify-between gap-3 py-3 text-[0.92rem] font-semibold text-ink hover:text-navy-700"
                    >
                      {x.label}
                      <ArrowRight
                        size={14}
                        weight="bold"
                        aria-hidden="true"
                        className="shrink-0 text-hairline-strong transition-all duration-200 group-hover:translate-x-1 group-hover:text-navy-700"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
