import type { Faq } from '@/lib/data/catalogue'

/**
 * Question and answer list.
 *
 * Rendered open-by-default in the markup rather than hidden behind JavaScript,
 * because an answer engine has to be able to read the answer, and because
 * FAQPage schema is only permitted when the content is visible to the user.
 * The <details> element gives the collapse behaviour without hiding anything
 * from a crawler.
 */
export function FaqList({
  faqs,
  heading = 'Common questions',
  headingId,
}: {
  faqs: Faq[]
  heading?: string
  headingId?: string
}) {
  if (!faqs.length) return null

  return (
    <section aria-labelledby={headingId ?? 'faq-heading'}>
      <h2 id={headingId ?? 'faq-heading'} className="t-h2 text-navy-900">
        {heading}
      </h2>
      <div className="mt-7 max-w-[70ch]">
        {faqs.map((f) => (
          <details key={f.q} className="group border-b border-hairline first:border-t" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.02rem] font-semibold text-ink marker:hidden hover:text-navy-700">
              <h3 className="font-semibold">{f.q}</h3>
              <span
                aria-hidden="true"
                className="relative h-4 w-4 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-[2px] before:w-4 before:-translate-y-1/2 before:bg-steel after:absolute after:left-1/2 after:top-0 after:h-4 after:w-[2px] after:-translate-x-1/2 after:bg-steel after:transition-transform after:duration-200 group-open:after:scale-y-0"
              />
            </summary>
            <p className="max-w-[64ch] pb-4 text-[0.97rem] leading-relaxed text-ink-soft">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
