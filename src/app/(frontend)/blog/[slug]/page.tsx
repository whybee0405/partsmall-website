import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { RichText } from '@/components/RichText'
import { ButtonLink } from '@/components/ui/Button'
import { COMPANY } from '@/lib/data/company'
import { FaqList } from '@/components/FaqList'
import { JsonLd, SITE_URL, breadcrumbLd, faqLd, metaDescription } from '@/lib/seo'
import { getAllGuides, getGuide, getGuidePreview, type LiveGuide } from '@/lib/cms/guides'
import { countBlogViews } from '@/lib/cms/blogViews'

export const dynamic = 'force-dynamic'

type Params = Promise<{ slug: string }>
type Search = Promise<Record<string, string | string[] | undefined>>

/** The published post, or the draft when the URL carries a valid CMS preview token. */
async function loadGuide(slug: string, searchParams: Search) {
  const raw = (await searchParams)['cloudia-preview']
  const preview = await getGuidePreview(slug, Array.isArray(raw) ? raw[0] : raw)
  if (preview) return { guide: preview, preview: true }
  return { guide: await getGuide(slug), preview: false }
}

const absolute = (url: string) => (url.startsWith('http') ? url : `${SITE_URL}${url}`)

/** 18 November 2026: the byline's date format. */
const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Johannesburg',
  })

function personLd(guide: LiveGuide) {
  const reviewer = guide.reviewer
  if (!reviewer) return undefined
  return {
    '@type': 'Person',
    name: reviewer.name,
    jobTitle: reviewer.role || undefined,
    image: reviewer.photo ? absolute(reviewer.photo) : undefined,
    url: reviewer.profileUrl || undefined,
    worksFor: { '@type': 'Organization', name: COMPANY.name, url: SITE_URL },
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params
  searchParams: Search
}): Promise<Metadata> {
  const { slug } = await params
  const { guide, preview } = await loadGuide(slug, searchParams)
  if (!guide) return { title: 'Post not found' }

  // Absolute title, not the templated one — the site suffix would push
  // several of these headlines past the 60-character budget.
  return {
    title: { absolute: guide.seoTitle },
    description: metaDescription(guide.seoDescription),
    alternates: { canonical: `/blog/${guide.slug}` },
    ...(preview ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: 'article',
      title: guide.seoTitle,
      description: metaDescription(guide.seoDescription),
      url: `/blog/${guide.slug}`,
      publishedTime: guide.date,
      modifiedTime: guide.updated,
      images: guide.ogImage ? [{ url: guide.ogImage, alt: guide.imageAlt }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: guide.seoTitle },
  }
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: Search
}) {
  const { slug } = await params
  const [{ guide, preview }, allGuides] = await Promise.all([
    loadGuide(slug, searchParams),
    getAllGuides(),
  ])
  if (!guide) notFound()

  const views = preview ? null : await countBlogViews(guide.slug)

  const more = allGuides.filter((g) => g.slug !== guide.slug).slice(0, 2)

  const url = `${SITE_URL}/blog/${guide.slug}`
  const organization = { '@type': 'Organization', name: COMPANY.name, url: SITE_URL }
  const reviewer = personLd(guide)
  const heroImage = guide.ogImage || guide.image
  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: guide.seoTitle,
      description: guide.seoDescription,
      datePublished: guide.date,
      dateModified: guide.updated,
      inLanguage: 'en-ZA',
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: heroImage ? [absolute(heroImage)] : undefined,
      author: reviewer ?? organization,
      ...(reviewer ? { reviewedBy: reviewer } : {}),
      publisher: organization,
    },
    breadcrumbLd([
      { name: 'Blog', path: '/blog' },
      { name: guide.title, path: `/blog/${guide.slug}` },
    ]),
  ]
  if (guide.faqs.length) jsonLd.push(faqLd(guide.faqs))

  return (
    <>
      <JsonLd data={jsonLd} />
      {preview && (
        <div
          role="status"
          className="bg-navy-900 px-4 py-2.5 text-center text-[0.9rem] font-semibold text-white"
        >
          Draft preview: this post is not published. Only people with this link can see it.
        </div>
      )}

      <PageHeader
        title={guide.title}
        breadcrumbs={[
          { href: '/blog', label: 'Blog' },
          { href: `/blog/${guide.slug}`, label: guide.category },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="t-label text-signal-deep">{guide.category}</span>
          <span className="t-data text-[0.76rem] text-steel">
            {guide.readMinutes} min read
          </span>
          <time dateTime={guide.date} className="t-data text-[0.76rem] text-steel">
            {longDate(guide.date)}
          </time>
          {views !== null && (
            <span className="t-data text-[0.76rem] text-steel" title="Recorded article views; refreshed on the next page load">
              {views.toLocaleString('en-ZA')} {views === 1 ? 'view' : 'views'}
            </span>
          )}
        </div>
      </PageHeader>

      <article className="band">
        <div className="shell">
          <Image
            src={guide.image}
            alt={guide.imageAlt}
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

            <p className="t-data mt-4 text-[0.8rem] text-steel">
              Last updated <time dateTime={guide.updated}>{longDate(guide.updated)}</time>
              {guide.reviewer && (
                <>
                  {' · '}Reviewed by {guide.reviewer.name}
                  {guide.reviewer.role ? `, ${guide.reviewer.role}` : ''}
                </>
              )}
            </p>

            <div className="guide-body mt-8">
              <RichText data={guide.body as never} />
            </div>

            {guide.faqs.length > 0 && (
              <div className="mt-14">
                <FaqList faqs={guide.faqs} headingId="post-faq-heading" />
              </div>
            )}

            {guide.reviewer && (
              <aside
                aria-label="About the reviewer"
                className="mt-14 flex items-start gap-5 border-t border-hairline pt-6"
              >
                {guide.reviewer.photo && (
                  <Image
                    src={guide.reviewer.photo}
                    alt=""
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] shrink-0 rounded-full bg-paper-2 object-cover"
                  />
                )}
                <div>
                  <p className="t-label text-steel">Reviewed by</p>
                  <p className="t-h3 mt-1 text-ink">
                    {guide.reviewer.profileUrl ? (
                      <a
                        href={guide.reviewer.profileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="hover:text-navy-700"
                      >
                        {guide.reviewer.name}
                      </a>
                    ) : (
                      guide.reviewer.name
                    )}
                  </p>
                  {guide.reviewer.role && (
                    <p className="text-[0.95rem] text-steel">
                      {guide.reviewer.role}, {COMPANY.name}
                    </p>
                  )}
                  {guide.reviewer.bio && (
                    <p className="mt-2.5 max-w-[60ch] text-[0.97rem] leading-relaxed text-ink-soft">
                      {guide.reviewer.bio}
                    </p>
                  )}
                </div>
              </aside>
            )}

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
