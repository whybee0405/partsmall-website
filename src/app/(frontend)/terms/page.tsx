import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { TERMS_SECTIONS, LEGAL_LAST_UPDATED } from '@/lib/data/legal'
import { breadcrumbLd, JsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern your use of the Parts-Mall Africa website, including what this site is, enquiries, and liability.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Terms of Service', path: '/terms' }])} />

      <PageHeader
        title="Terms of Service."
        lead={`Last updated ${LEGAL_LAST_UPDATED}. These terms govern your use of this website. They do not cover the separate agreement you enter into with a branch or head office if you open a trade account.`}
        breadcrumbs={[{ href: '/terms', label: 'Terms of Service' }]}
      >
        <nav aria-label="Jump to section" className="flex flex-wrap gap-2">
          {TERMS_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="t-label inline-flex h-9 max-sm:h-11 items-center rounded-[var(--radius-base)] border border-hairline-strong bg-card px-3 text-steel transition-colors hover:border-ink-soft hover:text-ink"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      <section className="band">
        <div className="shell max-w-[74ch]">
          <div className="rounded-[var(--radius-base)] border border-dashed border-hairline-strong bg-paper-2 p-5">
            <p className="text-[0.88rem] leading-relaxed text-steel">
              This is a drafted starting point and has not yet been reviewed by a lawyer,
              particularly the liability and disclaimer sections. Text in brackets marks a
              fact that needs to be filled in before this page goes live.
            </p>
          </div>

          {TERMS_SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 mt-12 first:mt-10">
              <Reveal>
                <h2 className="t-h3 text-navy-900">{s.title}</h2>
                <div className="mt-3 space-y-4">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-[0.97rem] leading-relaxed text-ink-soft">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
