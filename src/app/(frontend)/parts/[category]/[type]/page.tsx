import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  MapPin,
  WarningCircle,
  ClipboardText,
  Wrench,
} from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { FaqList } from '@/components/FaqList'
import { ButtonLink } from '@/components/ui/Button'
import {
  PART_TYPES,
  getPartType,
  getCategory,
  typesInCategory,
} from '@/lib/data/catalogue'
import { modelsWithPartType, getMake } from '@/lib/data/vehicles'
import { breadcrumbLd, faqLd, JsonLd, metaDescription } from '@/lib/seo'

export function generateStaticParams() {
  return PART_TYPES.map((t) => ({ category: t.category, type: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; type: string }>
}): Promise<Metadata> {
  const { type } = await params
  const t = getPartType(type)
  if (!t) return { title: 'Not found' }

  return {
    title: t.label,
    description: metaDescription(t.summary),
    alternates: { canonical: `/parts/${t.category}/${t.slug}` },
    openGraph: { title: `${t.label} | Parts-Mall Africa`, description: t.summary },
  }
}

export default async function PartTypePage({
  params,
}: {
  params: Promise<{ category: string; type: string }>
}) {
  const { category, type } = await params
  const t = getPartType(type)
  const cat = getCategory(category)
  if (!t || !cat || t.category !== cat.slug) notFound()

  const siblings = typesInCategory(cat.slug).filter((x) => x.slug !== t.slug)
  // The vehicle pages that exist for this part type. This is the internal
  // linking that makes the model-level pages discoverable and pushes authority
  // down into them.
  const vehicles = modelsWithPartType(t.slug)

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Parts', path: '/parts' },
            { name: cat.label, path: `/parts/${cat.slug}` },
            { name: t.label, path: `/parts/${cat.slug}/${t.slug}` },
          ]),
          faqLd(t.faqs),
        ]}
      />

      <PageHeader
        title={t.label}
        breadcrumbs={[
          { href: '/parts', label: 'Parts' },
          { href: `/parts/${cat.slug}`, label: cat.label },
          { href: `/parts/${cat.slug}/${t.slug}`, label: t.label },
        ]}
      >
        <p className="t-lead max-w-[66ch] border-t-2 border-signal pt-5 text-ink">
          {t.summary}
        </p>
      </PageHeader>

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <div className="min-w-0">
            <h2 className="t-h2 text-navy-900">What it does</h2>
            <p className="mt-4 max-w-[68ch] text-[1.05rem] leading-[1.72] text-ink-soft">
              {t.role}
            </p>

            <h2 className="t-h2 mt-14 text-navy-900">
              Signs a {t.singular} is failing
            </h2>
            <ul className="mt-6 max-w-[68ch] border-t-2 border-ink">
              {t.symptoms.map((s) => (
                <li
                  key={s}
                  className="flex gap-3.5 border-b border-hairline py-3.5 text-[0.98rem] leading-relaxed text-ink-soft"
                >
                  <WarningCircle
                    size={19}
                    weight="fill"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-signal-deep"
                  />
                  {s}
                </li>
              ))}
            </ul>

            <h2 className="t-h2 mt-14 text-navy-900">When to replace them</h2>
            <p className="mt-4 max-w-[68ch] text-[1.05rem] leading-[1.72] text-ink-soft">
              {t.interval}
            </p>

            <h2 className="t-h2 mt-14 text-navy-900">What to confirm before ordering</h2>
            <p className="mt-4 max-w-[64ch] text-[0.98rem] leading-relaxed text-steel">
              Have these ready and the counter can usually confirm the part in under a
              minute.
            </p>
            <ul className="mt-6 max-w-[68ch] border-t-2 border-ink">
              {t.checks.map((c) => (
                <li
                  key={c}
                  className="flex gap-3.5 border-b border-hairline py-3.5 text-[0.98rem] leading-relaxed text-ink-soft"
                >
                  <ClipboardText
                    size={19}
                    weight="fill"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-navy-700"
                  />
                  {c}
                </li>
              ))}
            </ul>

            {vehicles.length > 0 && (
              <>
                <h2 className="t-h2 mt-16 text-navy-900">
                  {t.label} by vehicle
                </h2>
                <p className="mt-4 max-w-[64ch] text-[0.98rem] leading-relaxed text-steel">
                  Pick your vehicle for the years and engines covered, and what is
                  specific to that application.
                </p>
                <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                  {vehicles.map((v) => {
                    const mk = getMake(v.make)
                    return (
                      <li key={`${v.make}-${v.slug}`} className="border-b border-hairline">
                        <Link
                          href={`/vehicles/${v.make}/${v.slug}/${t.slug}`}
                          className="group flex items-center justify-between gap-4 py-3"
                        >
                          <span className="text-[0.95rem] font-semibold text-ink group-hover:text-navy-700">
                            {mk?.label} {v.label}
                          </span>
                          <ArrowRight
                            size={15}
                            weight="bold"
                            aria-hidden="true"
                            className="shrink-0 text-hairline-strong transition-all duration-200 group-hover:translate-x-1 group-hover:text-navy-700"
                          />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}

            <div className="mt-16">
              <FaqList faqs={t.faqs} heading={`${t.label} questions`} headingId="type-faq" />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-base)] border border-hairline bg-card p-6">
              <Wrench size={22} weight="fill" aria-hidden="true" className="text-signal-deep" />
              <h2 className="t-h3 mt-3 text-ink">Get it confirmed</h2>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-steel">
                Stock and fitment are confirmed branch by branch. Call the counter with
                your vehicle details and they will check it while you are on the line.
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
              <p className="mt-5 border-t border-hairline pt-4 text-[0.8rem] leading-relaxed text-steel">
                Parts-Mall is a wholesale and distribution network. There is no online
                checkout; everything runs through your branch.
              </p>
            </div>

            {siblings.length > 0 && (
              <div className="mt-8">
                <h2 className="t-label border-t-2 border-ink pt-3 text-ink">
                  Also in {cat.label}
                </h2>
                <ul className="mt-2">
                  {siblings.map((s) => (
                    <li key={s.slug} className="border-b border-hairline">
                      <Link
                        href={`/parts/${cat.slug}/${s.slug}`}
                        className="group flex items-center justify-between gap-3 py-3 text-[0.92rem] font-semibold text-ink hover:text-navy-700"
                      >
                        {s.label}
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
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
