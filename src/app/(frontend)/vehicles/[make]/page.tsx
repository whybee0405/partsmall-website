import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { MAKES, getMake, modelsForMake, modelYearSpan } from '@/lib/data/vehicles'
import { CATEGORIES } from '@/lib/data/catalogue'
import { breadcrumbLd, collectionLd, JsonLd, metaDescription } from '@/lib/seo'

export function generateStaticParams() {
  return MAKES.map((mk) => ({ make: mk.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string }>
}): Promise<Metadata> {
  const { make } = await params
  const mk = getMake(make)
  if (!mk) return { title: 'Not found' }

  const models = modelsForMake(mk.slug)
  return {
    title: `${mk.label} parts`,
    description: metaDescription(
      `${mk.label} replacement parts in South Africa across ${models.length} models including the ${models
        .slice(0, 3)
        .map((x) => x.label)
        .join(', ')}. Supplied through 33 branches.`,
    ),
    alternates: { canonical: `/vehicles/${mk.slug}` },
  }
}

export default async function MakePage({
  params,
}: {
  params: Promise<{ make: string }>
}) {
  const { make } = await params
  const mk = getMake(make)
  if (!mk) notFound()

  const models = modelsForMake(mk.slug)

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Vehicles', path: '/vehicles' },
            { name: mk.label, path: `/vehicles/${mk.slug}` },
          ]),
          collectionLd({
            name: `${mk.label} parts`,
            description: mk.summary,
            path: `/vehicles/${mk.slug}`,
            items: models.map((mo) => ({
              name: `${mk.label} ${mo.label}`,
              path: `/vehicles/${mk.slug}/${mo.slug}`,
            })),
          }),
        ]}
      />

      <PageHeader
        title={`${mk.label} parts`}
        breadcrumbs={[
          { href: '/vehicles', label: 'Vehicles' },
          { href: `/vehicles/${mk.slug}`, label: mk.label },
        ]}
      >
        <p className="t-lead max-w-[66ch] border-t-2 border-signal pt-5 text-ink">
          {mk.summary}
        </p>
      </PageHeader>

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-16">
          <div>
            <div className="max-w-[68ch] space-y-5">
              {mk.intro.map((para, i) => (
                <p key={i} className="text-[1.05rem] leading-[1.72] text-ink-soft">
                  {para}
                </p>
              ))}
            </div>

            <h2 className="t-h2 mt-14 text-navy-900">{mk.label} models</h2>
            <ul className="mt-7 border-t-2 border-ink">
              {models.map((mo) => (
                <li key={mo.slug} className="border-b border-hairline">
                  <Link
                    href={`/vehicles/${mk.slug}/${mo.slug}`}
                    className="group flex items-start justify-between gap-6 py-5"
                  >
                    <span className="min-w-0">
                      <span className="t-h3 block text-ink group-hover:text-navy-700">
                        {mk.label} {mo.label}
                      </span>
                      <span className="t-data mt-1 block text-[0.76rem] text-steel">
                        {mo.body} · {modelYearSpan(mo)}
                      </span>
                      <span className="mt-2 block max-w-[60ch] text-[0.92rem] leading-relaxed text-steel">
                        {mo.summary}
                      </span>
                    </span>
                    <ArrowRight
                      size={18}
                      weight="bold"
                      aria-hidden="true"
                      className="mt-1.5 shrink-0 text-hairline-strong transition-all duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-1 group-hover:text-navy-700"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-base)] border border-hairline bg-card p-6">
              <h2 className="t-h3 text-ink">Not sure which model?</h2>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-steel">
                Your registration document carries the exact model and build year. The
                counter can work from that.
              </p>
              <ButtonLink href="/branches" variant="signal" size="sm" className="mt-4 w-full">
                <MapPin size={16} weight="fill" aria-hidden="true" />
                Find a branch
              </ButtonLink>
            </div>

            <div className="mt-8">
              <h2 className="t-label border-t-2 border-ink pt-3 text-ink">
                Browse by system
              </h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/parts/${c.slug}`}
                      className="t-label inline-flex h-8 items-center rounded-[var(--radius-base)] border border-hairline bg-card px-2.5 text-steel transition-colors hover:border-ink-soft hover:text-ink"
                    >
                      {c.label}
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
