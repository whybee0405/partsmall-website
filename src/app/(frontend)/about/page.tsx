import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import {
  TIMELINE,
  GLOBAL_ENTITIES,
  PARENT_QUOTE,
  CORPORATE_FACTS,
  FAQS,
} from '@/lib/data/company'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Company',
  description:
    'Parts-Mall Africa is the South African hub for Parts-Mall Corporation, a Korean parts group founded in 1998, exporting to 63 countries worldwide.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHeader
        title="A Korean parts group, run from Meadowdale."
        lead="Parts-Mall Africa is the group's sales subsidiary and distribution hub for the African continent. The stock is here, the counter staff are local, and the supply chain behind them has been running since 1998."
        breadcrumbs={[{ href: '/about', label: 'Company' }]}
        backgroundImage="/images/head-office.png"
        imageAlt="The Parts-Mall Corporation headquarters and distribution building in South Korea."
        imagePosition="center 30%"
      />

      {/* The parent's own words. Quoted rather than paraphrased, because a
          distributor evaluating the network wants the source. */}
      <section className="band">
        <div className="shell">
          <Reveal>
            <figure className="mx-auto max-w-[64ch] border-t-2 border-signal pt-8">
              <blockquote>
                <p className="t-h3 leading-[1.35] text-ink">{PARENT_QUOTE.text}</p>
              </blockquote>
              <figcaption className="t-label mt-6 text-steel">
                {PARENT_QUOTE.cite}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="band-tight">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Image
              src="/images/logistics-container.webp"
              alt="A container backed onto the loading bay with its doors open, pallets of boxed parts stacked inside and a forklift at the threshold."
              width={1920}
              height={1288}
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="w-full rounded-[var(--radius-base)] object-cover"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="t-h2 max-w-[18ch] text-navy-900">
              Global group, local execution.
            </h2>
            <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-ink-soft">
              <p>
                Parts-Mall Corporation was founded in South Korea in 1998 and now exports
                to 63 countries through 189 buyers worldwide. The South African entity
                was established in 2005.
              </p>
              <p>
                For a workshop in Polokwane or a fleet buyer in Cape Town, that history
                matters in one practical way: range and continuity. The lines you fit
                today are still supplied in three years, and the branch that sells them to
                you is drawing on a supply chain built for export volume rather than a
                container at a time.
              </p>
            </div>

            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6">
              {CORPORATE_FACTS.map((f) => (
                <div key={f.label} className="border-t-2 border-ink pt-3">
                  <dd className="t-data text-[1.7rem] font-bold leading-none text-navy-900">
                    {f.value}
                  </dd>
                  <dt className="mt-2 text-[0.85rem] leading-snug text-steel">{f.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Group entities. A plain two-column list, not a card grid. */}
      <section className="slab" id="network">
        <div className="shell band">
          <h2 className="t-h1 max-w-[16ch] text-on-navy">The wider group.</h2>
          <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-relaxed text-on-navy-muted">
            Seven entities across four countries. Parts-Mall Africa is the one that stocks
            and supplies this continent.
          </p>

          <ul className="mt-12 grid gap-x-12 md:grid-cols-2">
            {GLOBAL_ENTITIES.map((e) => (
              <li
                key={e.label}
                className="border-b border-on-navy-rule py-5 first:border-t md:[&:nth-child(2)]:border-t"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="t-h3 text-on-navy">{e.label}</h3>
                  <span className="t-data text-[0.76rem] text-on-navy-muted">
                    {e.place}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.9rem] text-on-navy-muted">{e.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline as a horizontal scroll rail on small screens, a grid on
          large. Not a vertical list of 8 hairline rows. */}
      <section className="band" id="timeline">
        <div className="shell">
          <h2 className="t-h1 max-w-[14ch] text-navy-900">Twenty-eight years.</h2>

          <ol className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10 lg:overflow-visible lg:pb-0">
            {TIMELINE.map((t) => (
              <li
                key={t.year}
                className="w-[15rem] shrink-0 snap-start border-t-2 border-ink pt-4 lg:w-auto"
              >
                <span className="t-data block text-[1.5rem] font-bold leading-none text-signal-deep">
                  {t.year}
                </span>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                  {t.event}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band-tight border-t border-hairline bg-paper-2">
        <div className="shell">
          <h2 className="t-h1 max-w-[16ch] text-navy-900">Common questions.</h2>

          <div className="mt-9 max-w-[70ch]">
            {FAQS.map((f) => (
              <details key={f.q} className="group border-b border-hairline first:border-t">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.05rem] font-semibold text-ink marker:hidden hover:text-navy-700">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="relative h-4 w-4 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-[2px] before:w-4 before:-translate-y-1/2 before:bg-steel after:absolute after:left-1/2 after:top-0 after:h-4 after:w-[2px] after:-translate-x-1/2 after:bg-steel after:transition-transform after:duration-200 group-open:after:scale-y-0"
                  />
                </summary>
                <p className="max-w-[62ch] pb-5 text-[0.97rem] leading-relaxed text-ink-soft">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="shell flex flex-wrap items-end justify-between gap-8">
          <div>
            <h2 className="t-h1 max-w-[18ch] text-navy-900">
              40+ points, and one of them is near you.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/branches" variant="signal">
              Find a branch
            </ButtonLink>
            <ButtonLink href="/wholesale" variant="outline">
              Distributor and franchise enquiries
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
