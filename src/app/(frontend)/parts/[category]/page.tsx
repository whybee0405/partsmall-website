import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { FaqList } from '@/components/FaqList'
import { CategoryIcon } from '@/components/CategoryIcon'
import { ButtonLink } from '@/components/ui/Button'
import { CATEGORIES, getCategory, typesInCategory } from '@/lib/data/catalogue'
import { MAKES } from '@/lib/data/vehicles'
import { breadcrumbLd, collectionLd, faqLd, JsonLd, metaDescription } from '@/lib/seo'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return { title: 'Not found' }

  return {
    title: `${cat.label} parts`,
    description: metaDescription(cat.summary),
    alternates: { canonical: `/parts/${cat.slug}` },
    openGraph: { title: `${cat.label} parts | Parts-Mall Africa`, description: cat.summary },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const types = typesInCategory(cat.slug)

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Parts', path: '/parts' },
            { name: cat.label, path: `/parts/${cat.slug}` },
          ]),
          collectionLd({
            name: `${cat.label} parts`,
            description: cat.summary,
            path: `/parts/${cat.slug}`,
            items: types.map((t) => ({
              name: t.label,
              path: `/parts/${cat.slug}/${t.slug}`,
            })),
          }),
          faqLd(cat.faqs),
        ]}
      />

      <PageHeader
        title={`${cat.label} parts`}
        breadcrumbs={[
          { href: '/parts', label: 'Parts' },
          { href: `/parts/${cat.slug}`, label: cat.label },
        ]}
      >
        {/* Answer-first paragraph. Written to stand alone if an assistant
            quotes it without the rest of the page. */}
        <p className="t-lead max-w-[66ch] border-t-2 border-signal pt-5 text-ink">
          {cat.summary}
        </p>
      </PageHeader>

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <div>
            <div className="max-w-[68ch] space-y-5">
              {cat.intro.map((para, i) => (
                <p key={i} className="text-[1.05rem] leading-[1.72] text-ink-soft">
                  {para}
                </p>
              ))}
            </div>

            <h2 className="t-h2 mt-14 text-navy-900">
              {cat.label} parts we supply
            </h2>
            <ul className="mt-7 border-t-2 border-ink">
              {types.map((t) => (
                <li key={t.slug} className="border-b border-hairline">
                  <Link
                    href={`/parts/${cat.slug}/${t.slug}`}
                    className="group flex items-start justify-between gap-6 py-5"
                  >
                    <span className="min-w-0">
                      <span className="t-h3 block text-ink group-hover:text-navy-700">
                        {t.label}
                      </span>
                      <span className="mt-1.5 block max-w-[62ch] text-[0.92rem] leading-relaxed text-steel">
                        {t.summary}
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

            <div className="mt-14">
              <FaqList
                faqs={cat.faqs}
                heading={`${cat.label} questions`}
                headingId="category-faq"
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[var(--radius-base)] bg-navy-900">
              <Image
                src={cat.image}
                alt={`${cat.label} components photographed on a steel surface.`}
                width={1000}
                height={747}
                sizes="(max-width: 1024px) 100vw, 22rem"
                className="w-full object-cover"
              />
            </div>

            <div className="mt-6 border-t-2 border-signal pt-4">
              <CategoryIcon name={cat.icon} size={24} className="text-signal-deep" />
              <h2 className="t-h3 mt-3 text-ink">Confirm fitment first</h2>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-steel">
                Every {cat.label.toLowerCase()} order is confirmed against your vehicle
                by the supplying branch before it is dispatched.
              </p>
              <ButtonLink href="/branches" variant="signal" size="sm" className="mt-4 w-full">
                <MapPin size={16} weight="fill" aria-hidden="true" />
                Find a branch
              </ButtonLink>
            </div>

            <div className="mt-8">
              <h2 className="t-label border-t-2 border-ink pt-3 text-ink">
                Browse by vehicle
              </h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {MAKES.map((mk) => (
                  <li key={mk.slug}>
                    <Link
                      href={`/vehicles/${mk.slug}`}
                      className="t-label inline-flex h-8 items-center rounded-[var(--radius-base)] border border-hairline bg-card px-2.5 text-steel transition-colors hover:border-ink-soft hover:text-ink"
                    >
                      {mk.label}
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
