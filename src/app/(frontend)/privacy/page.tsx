import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { PRIVACY_SECTIONS, LEGAL_LAST_UPDATED } from '@/lib/data/legal'
import { breadcrumbLd, JsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Parts-Mall Africa collects, uses and protects your personal information, including site analytics and cookies, under South Africa\'s POPIA.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Privacy Policy', path: '/privacy' }])} />

      <PageHeader
        title="Privacy Policy."
        lead={`Last updated ${LEGAL_LAST_UPDATED}. This explains what personal information we collect through this site, why, and the rights you have over it under South Africa's Protection of Personal Information Act (POPIA).`}
        breadcrumbs={[{ href: '/privacy', label: 'Privacy Policy' }]}
      >
        <nav aria-label="Jump to section" className="flex flex-wrap gap-2">
          {PRIVACY_SECTIONS.map((s) => (
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
          {/* This is a drafted starting point, not a document a lawyer has
              reviewed. Bracketed text below marks facts this project cannot
              supply on its own. */}
          <div className="rounded-[var(--radius-base)] border border-dashed border-hairline-strong bg-paper-2 p-5">
            <p className="text-[0.88rem] leading-relaxed text-steel">
              This policy is a drafted starting point and has not yet been reviewed by a
              lawyer. Text in brackets marks a fact — a registration number, a named
              contact, a retention period — that needs to be filled in before this page
              goes live.
            </p>
          </div>

          {PRIVACY_SECTIONS.map((s) => (
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
