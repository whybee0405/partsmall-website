import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { getAllGuides } from '@/lib/payload/guides'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Fitment checks, ordering notes and buying guidance from the Parts-Mall counter. Written for the person standing at the car.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const GUIDES = await getAllGuides()
  const [lead, ...rest] = GUIDES

  return (
    <>
      <PageHeader
        title="Notes from the counter."
        lead="Fitment checks, ordering shortcuts and buying guidance, written for the person standing at the car rather than for a search engine."
        breadcrumbs={[{ href: '/blog', label: 'Blog' }]}
        backgroundImage="/images/ph-branch-interior.webp"
        imageAlt="Inside a Parts-Mall branch, shelving stocked with boxed parts."
      />

      <section className="band">
        <div className="shell">
          {/* Lead article gets a wide split. The rest run as a grid, so the
              page has hierarchy instead of nine identical cards. */}
          <Reveal>
            <Link
              href={`/blog/${lead.slug}`}
              className="group grid gap-8 md:grid-cols-2 md:items-center md:gap-12"
            >
              <div className="overflow-hidden rounded-[var(--radius-base)] bg-navy-900">
                <Image
                  src={lead.image}
                  alt=""
                  width={1600}
                  height={1200}
                  priority
                  sizes="(max-width: 768px) 100vw, 48vw"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
                />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="t-label text-signal-deep">{lead.category}</span>
                  <span className="t-data text-[0.72rem] text-steel">
                    {lead.readMinutes} min read
                  </span>
                </div>
                <h2 className="t-h1 mt-3 text-navy-900 group-hover:text-navy-700">
                  {lead.title}
                </h2>
                <p className="t-lead mt-4">{lead.excerpt}</p>
              </div>
            </Link>
          </Reveal>

          <ul className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((g, i) => (
              <Reveal as="li" key={g.slug} delay={(i % 3) * 0.07}>
                <Link href={`/blog/${g.slug}`} className="group block">
                  <div className="overflow-hidden rounded-[var(--radius-base)] bg-navy-900">
                    <Image
                      src={g.image}
                      alt=""
                      width={800}
                      height={600}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 48vw, 31vw"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="t-label text-signal-deep">{g.category}</span>
                    <span className="t-data text-[0.72rem] text-steel">
                      {g.readMinutes} min
                    </span>
                  </div>
                  <h2 className="t-h3 mt-2 text-ink group-hover:text-navy-700">
                    {g.title}
                  </h2>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-steel">
                    {g.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
