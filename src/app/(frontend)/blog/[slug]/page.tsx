import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { GUIDES, getGuide, COMPANY } from '@/lib/data/company'

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return { title: 'Post not found' }

  // Absolute title, not the templated one — the site suffix would push
  // several of these headlines past the 60-character budget.
  return {
    title: { absolute: guide.title },
    description: guide.excerpt,
    alternates: { canonical: `/blog/${guide.slug}` },
    openGraph: {
      type: 'article',
      title: guide.title,
      description: guide.excerpt,
      publishedTime: guide.date,
      images: [{ url: guide.image }],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const more = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.date,
    author: { '@type': 'Organization', name: COMPANY.name },
    publisher: { '@type': 'Organization', name: COMPANY.name },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        title={guide.title}
        breadcrumbs={[
          { href: '/blog', label: 'Blog' },
          { href: `/blog/${guide.slug}`, label: guide.category },
        ]}
      >
        <div className="flex items-center gap-4">
          <span className="t-label text-signal-deep">{guide.category}</span>
          <span className="t-data text-[0.76rem] text-steel">
            {guide.readMinutes} min read
          </span>
          <time dateTime={guide.date} className="t-data text-[0.76rem] text-steel">
            {new Date(guide.date).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>
      </PageHeader>

      <article className="band">
        <div className="shell">
          <Image
            src={guide.image}
            alt=""
            width={1600}
            height={1200}
            priority
            sizes="(max-width: 1024px) 100vw, 68rem"
            className="mx-auto w-full max-w-[68rem] rounded-[var(--radius-base)] bg-navy-900 object-cover"
          />

          {/* Measure capped at 68ch so a dense guide still reads comfortably. */}
          <div className="mx-auto mt-12 max-w-[68ch]">
            <p className="t-lead border-t-2 border-signal pt-6 text-ink">
              {guide.excerpt}
            </p>

            <div className="mt-8 space-y-6">
              {guide.body.map((para, i) => (
                <p key={i} className="text-[1.05rem] leading-[1.72] text-ink-soft">
                  {para}
                </p>
              ))}
            </div>

            <aside className="mt-14 border-t-2 border-ink pt-6">
              <h2 className="t-h3 text-ink">Need this checked against your vehicle?</h2>
              <p className="mt-2.5 text-[0.97rem] leading-relaxed text-steel">
                Your nearest branch will confirm fitment on the phone, and a WhatsApp photo
                of the old part usually settles it in one message.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href="/branches" variant="signal" size="sm">
                  <MapPin size={16} weight="fill" aria-hidden="true" />
                  Find a branch
                </ButtonLink>
                <ButtonLink href="/parts" variant="outline" size="sm">
                  Browse the catalogue
                </ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <section className="band-tight border-t border-hairline bg-paper-2">
        <div className="shell">
          <h2 className="t-h2 text-navy-900">Keep reading.</h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2">
            {more.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/blog/${g.slug}`}
                  className="group flex items-center justify-between gap-6 border-t-2 border-ink pt-4"
                >
                  <span>
                    <span className="t-label block text-signal-deep">{g.category}</span>
                    <span className="t-h3 mt-2 block text-ink group-hover:text-navy-700">
                      {g.title}
                    </span>
                  </span>
                  <ArrowRight
                    size={20}
                    weight="bold"
                    aria-hidden="true"
                    className="shrink-0 text-hairline-strong transition-all duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-1 group-hover:text-navy-700"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
