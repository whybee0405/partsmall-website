import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  MapPin,
  WhatsappLogo,
  WarningCircle,
  ClipboardText,
  Info,
} from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { FaqList } from '@/components/FaqList'
import { ButtonLink } from '@/components/ui/Button'
import {
  allFitments,
  getMake,
  getModel,
  modelYearSpan,
} from '@/lib/data/vehicles'
import { getPartType, getCategory, type Faq } from '@/lib/data/catalogue'
import { breadcrumbLd, faqLd, vehiclePartLd, JsonLd, metaDescription } from '@/lib/seo'

/**
 * The model-by-part-type page.
 *
 * This is the page a query like "kia rio 2011 clutch kit" is actually looking
 * for, and it is built to be the best answer to it: the make, model, part type
 * and covered years all appear in the title, the H1 and the opening sentence,
 * and the generation table gives the crawler the year match without needing a
 * separate URL for every model year.
 */

export function generateStaticParams() {
  return allFitments().map((f) => ({
    make: f.make,
    model: f.model,
    type: f.partType,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string; model: string; type: string }>
}): Promise<Metadata> {
  const { make, model, type } = await params
  const mk = getMake(make)
  const mo = getModel(make, model)
  const pt = getPartType(type)
  if (!mk || !mo || !pt) return { title: 'Not found' }

  const span = modelYearSpan(mo)
  return {
    title: `${mk.label} ${mo.label} ${pt.label} (${span})`,
    description: metaDescription(
      `${pt.label} for the ${mk.label} ${mo.label}, ${span}. Supplied and fitment-confirmed through 33 branches across South Africa. ${pt.summary}`,
    ),
    alternates: { canonical: `/vehicles/${mk.slug}/${mo.slug}/${pt.slug}` },
    openGraph: {
      title: `${mk.label} ${mo.label} ${pt.label}`,
      description: `${pt.label} for the ${mk.label} ${mo.label}, ${span}. Confirmed and supplied through 33 South African branches.`,
    },
  }
}

export default async function VehiclePartPage({
  params,
}: {
  params: Promise<{ make: string; model: string; type: string }>
}) {
  const { make, model, type } = await params
  const mk = getMake(make)
  const mo = getModel(make, model)
  const pt = getPartType(type)
  if (!mk || !mo || !pt || !mo.parts.includes(pt.slug)) notFound()

  const cat = getCategory(pt.category)
  const span = modelYearSpan(mo)
  const vehicle = `${mk.label} ${mo.label}`
  const path = `/vehicles/${mk.slug}/${mo.slug}/${pt.slug}`

  const partNote = mo.partNotes?.[pt.slug]

  const siblings = mo.parts
    .filter((s) => s !== pt.slug)
    .map((s) => getPartType(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .slice(0, 8)

  // A question specific to this exact combination, which is what people
  // actually type. Answered honestly rather than with a fake fitment claim.
  const combinationFaqs: Faq[] = [
    {
      q: `Which ${pt.singular} fits my ${vehicle}?`,
      a: `Parts-Mall supplies ${pt.label.toLowerCase()} for the ${vehicle} across the ${span} range. Because the same model name covers several engines and specifications, the exact part is confirmed by the supplying branch against your build year and engine before it is dispatched. Call your nearest branch with those details and they will confirm it while you are on the line.`,
    },
    {
      q: `What do I need to tell the branch to order a ${pt.singular} for a ${vehicle}?`,
      a: `The build year and the engine, plus ${pt.checks[0].toLowerCase()}. Those three details are enough for the counter to confirm the correct part in most cases.`,
    },
    ...pt.faqs,
  ]

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Vehicles', path: '/vehicles' },
            { name: mk.label, path: `/vehicles/${mk.slug}` },
            { name: mo.label, path: `/vehicles/${mk.slug}/${mo.slug}` },
            { name: pt.label, path },
          ]),
          vehiclePartLd({
            partLabel: pt.label,
            makeLabel: mk.label,
            modelLabel: mo.label,
            bodyType: mo.body,
            description: `${pt.label} for the ${vehicle}, ${span}. ${pt.summary}`,
            path,
          }),
          faqLd(combinationFaqs),
        ]}
      />

      <PageHeader
        title={`${pt.label} for the ${vehicle}`}
        breadcrumbs={[
          { href: '/vehicles', label: 'Vehicles' },
          { href: `/vehicles/${mk.slug}`, label: mk.label },
          { href: `/vehicles/${mk.slug}/${mo.slug}`, label: mo.label },
          { href: path, label: pt.label },
        ]}
      >
        {/* Answer-first. Names the make, model, years and part in one
            sentence so it can be lifted as a standalone answer. */}
        <p className="t-lead max-w-[68ch] border-t-2 border-signal pt-5 text-ink">
          Parts-Mall supplies {pt.label.toLowerCase()} for the {vehicle} across the{' '}
          {span} range, through {''}
          <Link href="/branches" className="font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-800">
            33 branches
          </Link>{' '}
          in South Africa. {pt.summary}
        </p>
      </PageHeader>

      <section className="band">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <div className="min-w-0">
            <h2 className="t-h2 text-navy-900">
              {vehicle} years and engines covered
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-left">
                <caption className="sr-only">
                  {vehicle} generations for which {pt.label.toLowerCase()} are supplied
                </caption>
                <thead>
                  <tr className="border-t-2 border-ink">
                    <th scope="col" className="t-label py-3 pr-6 text-steel">
                      Years
                    </th>
                    <th scope="col" className="t-label py-3 text-steel">
                      Engines
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mo.generations.map((g) => (
                    <tr key={g.years} className="border-b border-hairline">
                      <td className="t-data py-4 pr-6 align-top text-[0.9rem] font-semibold text-ink">
                        {g.years}
                      </td>
                      <td className="py-4 align-top text-[0.95rem] text-ink-soft">
                        {g.engines}
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

            <h2 className="t-h2 mt-14 text-navy-900">
              What {pt.label.toLowerCase()} do
            </h2>
            <p className="mt-4 max-w-[68ch] text-[1.05rem] leading-[1.72] text-ink-soft">
              {pt.role}
            </p>

            <h2 className="t-h2 mt-14 text-navy-900">
              Signs your {vehicle} needs a new {pt.singular}
            </h2>
            <ul className="mt-6 max-w-[68ch] border-t-2 border-ink">
              {pt.symptoms.map((s) => (
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
              {pt.interval}
            </p>

            <h2 className="t-h2 mt-14 text-navy-900">
              What to confirm before ordering
            </h2>
            <ul className="mt-6 max-w-[68ch] border-t-2 border-ink">
              <li className="flex gap-3.5 border-b border-hairline py-3.5 text-[0.98rem] leading-relaxed text-ink-soft">
                <ClipboardText
                  size={19}
                  weight="fill"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-navy-700"
                />
                Your {vehicle} build year and engine
              </li>
              {pt.checks.map((c) => (
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

            {(partNote || mo.note) && (
              <div className="mt-12 border-t-2 border-signal pt-4">
                <h2 className="t-h3 text-ink">On the {vehicle} specifically</h2>
                {/* The part-specific remark leads, because it is the one thing
                    on this page that exists nowhere else on the site. */}
                {partNote && (
                  <p className="mt-2 max-w-[64ch] text-[0.98rem] leading-relaxed text-ink-soft">
                    {partNote}
                  </p>
                )}
                {mo.note && (
                  <p
                    className={`max-w-[64ch] text-[0.98rem] leading-relaxed text-ink-soft ${
                      partNote ? 'mt-3' : 'mt-2'
                    }`}
                  >
                    {mo.note}
                  </p>
                )}
              </div>
            )}

            <div className="mt-16">
              <FaqList
                faqs={combinationFaqs}
                heading={`${vehicle} ${pt.singular} questions`}
                headingId="fitment-faq"
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-base)] border border-hairline bg-card p-6">
              {/* Not a repeat of the H1. A duplicate heading wastes the
                  outline and tells a crawler nothing new. */}
              <h2 className="t-h3 text-ink">Confirm fitment before you order</h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-steel">
                Call the counter with your build year and engine. A photograph of the old
                part on WhatsApp settles most fitment questions in one message.
              </p>
              <div className="mt-5 space-y-2.5">
                <ButtonLink href="/branches" variant="signal" className="w-full">
                  <MapPin size={18} weight="fill" aria-hidden="true" />
                  Find a branch
                </ButtonLink>
                <ButtonLink href="/branches" variant="outline" className="w-full">
                  <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
                  WhatsApp a branch
                </ButtonLink>
              </div>
              <p className="mt-5 border-t border-hairline pt-4 text-[0.8rem] leading-relaxed text-steel">
                Parts-Mall is a wholesale and distribution network. There is no online
                checkout; everything runs through your branch.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="t-label border-t-2 border-ink pt-3 text-ink">
                More for the {mo.label}
              </h2>
              <ul className="mt-2">
                {siblings.map((s) => (
                  <li key={s.slug} className="border-b border-hairline">
                    <Link
                      href={`/vehicles/${mk.slug}/${mo.slug}/${s.slug}`}
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

            {cat && (
              <p className="mt-6 text-[0.88rem] leading-relaxed text-steel">
                For {pt.label.toLowerCase()} across all vehicles, see the{' '}
                <Link
                  href={`/parts/${cat.slug}/${pt.slug}`}
                  className="font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-800"
                >
                  {pt.label.toLowerCase()} guide
                </Link>
                .
              </p>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
