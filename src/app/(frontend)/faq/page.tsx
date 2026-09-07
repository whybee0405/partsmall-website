import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { FAQS, FAQ_CATEGORIES, faqsByCategory } from '@/lib/data/faqs'
import { breadcrumbLd, faqLd, JsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description:
    'Answers on ordering and fitment, branches and stock, the vehicles Parts-Mall Africa supplies, private brands, warranty, trade and distributor terms.',
  alternates: { canonical: '/faq' },
}

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: 'FAQ', path: '/faq' }]),
          faqLd(FAQS),
        ]}
      />

      <PageHeader
        title="Frequently asked questions."
        lead={`${FAQS.length} questions across ${FAQ_CATEGORIES.length} topics — ordering, branches, vehicles, warranty, trade and the company itself. Answered from the same facts published across the rest of the site, not a separate policy page.`}
        breadcrumbs={[{ href: '/faq', label: 'FAQ' }]}
      >
        <nav aria-label="Jump to topic" className="flex flex-wrap gap-2">
          {FAQ_CATEGORIES.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="t-label inline-flex h-9 items-center rounded-[var(--radius-base)] border border-hairline-strong bg-card px-3 text-steel transition-colors hover:border-ink-soft hover:text-ink"
            >
              {c.label}
            </a>
          ))}
        </nav>
      </PageHeader>

      {FAQ_CATEGORIES.map((cat, i) => {
        const items = faqsByCategory(cat.slug)
        if (items.length === 0) return null
        return (
          <section
            key={cat.slug}
            id={cat.slug}
            className={`scroll-mt-24 band-tight ${i % 2 === 1 ? 'bg-paper-2' : ''} ${
              i > 0 ? 'border-t border-hairline' : ''
            }`}
          >
            <div className="shell">
              <Reveal>
                <h2 className="t-h2 text-navy-900">{cat.label}</h2>
                <div className="mt-7 max-w-[74ch] border-t-2 border-ink">
                  {items.map((f) => (
                    <details key={f.q} className="group border-b border-hairline">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.02rem] font-semibold text-ink marker:hidden hover:text-navy-700">
                        {f.q}
                        <span
                          aria-hidden="true"
                          className="relative h-4 w-4 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-[2px] before:w-4 before:-translate-y-1/2 before:bg-steel after:absolute after:left-1/2 after:top-0 after:h-4 after:w-[2px] after:-translate-x-1/2 after:bg-steel after:transition-transform after:duration-200 group-open:after:scale-y-0"
                        />
                      </summary>
                      <div className="max-w-[64ch] pb-5">
                        <p className="text-[0.95rem] leading-relaxed text-ink-soft">{f.a}</p>
                        {f.href && (
                          <Link
                            href={f.href}
                            className="group/link mt-2.5 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-navy-700 transition-colors hover:text-navy-800"
                          >
                            Read more
                            <ArrowRight
                              size={14}
                              weight="bold"
                              aria-hidden="true"
                              className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover/link:translate-x-1"
                            />
                          </Link>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )
      })}

      <section className="band border-t border-hairline">
        <div className="shell flex flex-wrap items-end justify-between gap-8">
          <div>
            <h2 className="t-h1 max-w-[20ch] text-navy-900">Still have a question?</h2>
            <p className="t-lead mt-4 max-w-[52ch]">
              Your nearest branch answers stock and fitment questions faster than head
              office can. Anything else goes to head office directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/branches" variant="signal">
              Find a branch
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Contact head office
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
