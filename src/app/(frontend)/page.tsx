import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Phone, ShieldCheck, Star, Quotes } from '@phosphor-icons/react/dist/ssr'
import { ButtonLink, buttonArrowClass } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { HeroStory } from '@/components/HeroStory'
import { BranchFinder } from '@/components/BranchFinder'
import { CategoryIcon } from '@/components/CategoryIcon'
import { CountUp } from '@/components/ui/CountUp'
import { getAllBranches, computeNetworkStats } from '@/lib/payload/branches'
import { REVIEWS, REVIEWS_SUMMARY } from '@/lib/data/reviews'
import { CERTIFICATIONS } from '@/lib/data/catalogue'
import { getAllCategories } from '@/lib/payload/categories'
import { getAllPartTypes } from '@/lib/payload/partTypes'
import { getAllMakes } from '@/lib/payload/makes'
import { getAllModels } from '@/lib/payload/models'
import { getAllBrands } from '@/lib/payload/brands'
import { getAllGuides } from '@/lib/payload/guides'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description:
    'Korean vehicle parts across 40+ South African branches. Kia, Hyundai, Chevrolet, Ssangyong, Suzuki, Daewoo, GWM and Haval, fitment confirmed by the counter.',
  alternates: { canonical: '/' },
}

/** Shared by the mobile ticker (duplicated, unrevealed) and the sm+ reveal grid. */
function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <div className="flex h-full flex-col rounded-[var(--radius-base)] border border-hairline-strong bg-card p-5">
      <Quotes size={22} weight="fill" aria-hidden="true" className="text-hairline-strong" />
      <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-ink-soft">{r.quote}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-hairline pt-3">
        <div className="min-w-0">
          <p className="truncate text-[0.9rem] font-semibold text-ink">{r.name}</p>
          {r.branchSlug ? (
            <Link
              href={`/branches/${r.branchSlug}`}
              className="t-label text-steel transition-colors hover:text-navy-700"
            >
              {r.branchLabel} branch
            </Link>
          ) : (
            <p className="t-label text-steel">{r.branchLabel} branch</p>
          )}
        </div>
        <div className="flex shrink-0" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={13} weight="fill" aria-hidden="true" className="text-signal-deep" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const [branches, MAKES, MODELS, CATEGORIES, PART_TYPES, BRANDS, GUIDES] = await Promise.all([
    getAllBranches(),
    getAllMakes(),
    getAllModels(),
    getAllCategories(),
    getAllPartTypes(),
    getAllBrands(),
    getAllGuides(),
  ])
  const [feature, ...rest] = CATEGORIES
  const network = computeNetworkStats(branches)

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────
          Full-bleed background: a real, coordinate-accurate map (see
          heroMap.generated.ts) driving a flight-tracker camera — Korea
          origin → transit → African branch hub → local delivery — with five
          synced video beats layered on top. The map runs on every device;
          the video layer is desktop-only and skipped for
          prefers-reduced-motion, see HeroStory. */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden border-b border-hairline lg:min-h-[85vh]">
        <HeroStory />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/70 to-navy-900/35"
          aria-hidden="true"
        />

        <div className="shell relative py-14 text-center lg:py-20">
          <p className="t-label text-signal">Korean Spares Southern Africa</p>
          <h1 className="t-display mx-auto mt-3 max-w-[20ch] text-on-navy">
            Korea's #1 Automotive Parts Supplier
          </h1>

          <p className="t-lead mx-auto mt-5 max-w-[54ch] text-on-navy-muted">
            Korean vehicle parts held across 40+ South African
            branches, with a counter team that confirms fitment before you drive.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2.5">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} weight="fill" className="text-signal" />
              ))}
            </div>
            <p className="text-[0.85rem] font-semibold text-on-navy-muted">
              {REVIEWS_SUMMARY.rating}/5 from {REVIEWS_SUMMARY.count} {REVIEWS_SUMMARY.source}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/branches" variant="signal">
              Find a branch
              <ArrowRight size={18} weight="bold" aria-hidden="true" className={buttonArrowClass} />
            </ButtonLink>
            <ButtonLink href="/parts" variant="invert">
              Browse the catalogue
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Trust strip ───────────────────────────────────────────────────
          Sits under the hero, never inside it. Real figures only. */}
      <section className="border-b border-hairline bg-paper">
        <div className="shell">
          <dl className="grid grid-cols-2 divide-hairline md:grid-cols-4 md:divide-x">
            {[
              { v: 40, suffix: '+', l: 'branches and country points across Southern Africa' },
              { v: 189, l: 'buyers across 63 countries worldwide' },
              { v: 20, suffix: '+', l: 'official agents across 10 countries' },
              { v: 1998, static: true, l: 'group founded in Korea' },
            ].map((s, i) => (
              <div
                key={s.l}
                className={`px-1 py-6 md:px-6 md:py-7 ${i < 2 ? 'border-b border-hairline md:border-b-0' : ''} ${i % 2 === 1 ? 'border-l border-hairline md:border-l-0' : ''}`}
              >
                <dt className="sr-only">{s.l}</dt>
                <dd>
                  <span className="t-data block text-[2rem] font-bold leading-none text-navy-900 md:text-[2.4rem]">
                    {s.static ? (
                      s.v
                    ) : (
                      <CountUp value={s.v} suffix={s.suffix} />
                    )}
                  </span>
                  <span className="mt-2 block text-[0.85rem] leading-snug text-steel">
                    {s.l}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Branch finder ─────────────────────────────────────────────────
          The fastest path for the mechanic with a car on the lift. Placed
          high deliberately: this is the page's primary conversion, and now
          also carries the page's one "network" authority moment — merged in
          from what used to be a separate slab further down that repeated the
          same trust-strip stats and rendered a second copy of the same map. */}
      <section className="band" id="network">
        <div className="shell">
          <Reveal className="max-w-[58ch]">
            <p className="t-label text-signal-deep">Real branches, real coordinates</p>
            <h2 className="t-h1 mt-3 text-navy-900">Find a Parts-Mall branch near you.</h2>
            <p className="t-lead mt-4">
              Search by town, province, or share your location, then call or WhatsApp
              your nearest branch for stock and fitment — 40+ branches
              across {network.provinces} provinces, plus country points in Botswana,
              Eswatini, Mozambique, Namibia and Zimbabwe.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-9">
            <BranchFinder branches={branches} limit={6} showFilters={false} />
          </Reveal>

          <Reveal delay={0.12} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/branches"
              className="group inline-flex items-center gap-2 text-[0.95rem] font-semibold text-navy-700 transition-colors hover:text-navy-800 max-sm:min-h-11"
            >
              See all 40+ branches and country points
              <ArrowRight
                size={17}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-[0.95rem] font-semibold text-steel transition-colors hover:text-navy-800 max-sm:min-h-11"
            >
              The group story, exporting since 1998
              <ArrowRight
                size={17}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────────────────────────
          Real, verbatim Google reviews for these branches — see
          lib/data/reviews.ts for sourcing. Sits right after the branch
          finder so the trust signal lands just after someone has looked up
          their nearest branch. */}
      <section className="border-t border-hairline bg-paper-2">
        <div className="shell band-tight">
          <Reveal className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[52ch]">
              <h2 className="t-h1 text-navy-900">What the branches hear.</h2>
              <p className="t-lead mt-4">
                Real reviews from customers at branches across the network.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-[var(--radius-base)] border border-hairline-strong bg-card px-4 py-3">
              <div className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} weight="fill" className="text-signal-deep" />
                ))}
              </div>
              <div>
                <p className="t-data text-[0.95rem] font-bold text-ink">
                  {REVIEWS_SUMMARY.rating} out of 5
                </p>
                <p className="text-[0.78rem] text-steel">
                  {REVIEWS_SUMMARY.count} {REVIEWS_SUMMARY.source}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Mobile: self-playing ticker, edges masked by a vignette so cards
              read as flowing past rather than getting clipped. Pauses on
              touch/hover, and sits still for prefers-reduced-motion — see
              .ticker-track in globals.css. Duplicated once for a seamless
              loop, so these cards skip the scroll-reveal the sm+ grid gets. */}
          <div className="relative mt-9 overflow-hidden sm:hidden">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-paper-2 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-paper-2 to-transparent"
              aria-hidden="true"
            />
            <ul className="ticker-track flex w-max gap-5">
              {[...REVIEWS, ...REVIEWS].map((r, i) => (
                <li key={`${r.name}-${i}`} className="h-full w-[78vw] max-w-[22rem] shrink-0">
                  <ReviewCard r={r} />
                </li>
              ))}
            </ul>
          </div>

          {/* sm+: static reveal grid. */}
          <ul className="mt-9 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal as="li" key={r.name} delay={Math.min(i * 0.05, 0.3)} className="h-full">
                <ReviewCard r={r} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Brands and certification ──────────────────────────────────────
          Typographic plates rather than invented logos, and the certifications
          that actually back the warranty claim. The page's first
          breathing-room slab — a genuine authority moment, positioned right
          after the reviews so the two trust signals land back to back. */}
      <section className="slab band-tight">
        <div className="shell">
          <Reveal className="max-w-[54ch]">
            <h2 className="t-h1 text-on-navy">The private-brand parts lines we carry.</h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-on-navy-muted">
              Eight private-brand lines carry Parts-Mall Corporation warranty backing,
              confirmed by the supplying branch at dispatch.
            </p>
          </Reveal>

          <ul className="mt-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {BRANDS.map((b, i) => (
              <Reveal
                as="li"
                key={b.slug}
                delay={Math.min(i * 0.05, 0.3)}
                className="bg-navy-900 ring-1 ring-inset ring-on-navy-rule"
              >
                <Link
                  href={`/parts?brand=${encodeURIComponent(b.label)}`}
                  className="group flex h-full flex-col justify-between gap-4 p-5 transition-colors duration-200 hover:bg-white/5"
                >
                  {b.logo ? (
                    <span className="inline-flex w-fit items-center rounded-[var(--radius-base)] bg-paper px-3 py-2 ring-1 ring-inset ring-hairline">
                      <Image
                        src={b.logo}
                        alt={`${b.label} logo`}
                        width={140}
                        height={56}
                        className="h-8 w-auto object-contain object-left"
                      />
                    </span>
                  ) : (
                    <span
                      className="font-display text-[1.35rem] font-extrabold leading-none tracking-[-0.02em] text-on-navy transition-colors group-hover:text-signal"
                      style={{ fontStretch: '118%' }}
                    >
                      {b.label}
                    </span>
                  )}
                  <span className="text-[0.8rem] leading-snug text-on-navy-muted">{b.note}</span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t-2 border-signal pt-6">
            {CERTIFICATIONS.map((c) => (
              <li key={c.label} className="flex items-start gap-2.5">
                <ShieldCheck
                  size={19}
                  weight="fill"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-signal"
                />
                <span>
                  <span className="t-data block text-[0.9rem] font-bold text-on-navy">
                    {c.label}
                  </span>
                  <span className="block text-[0.82rem] text-on-navy-muted">{c.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Catalogue ─────────────────────────────────────────────────────
          Bento with an exact cell count: one 2x2 feature plus twelve 1x1
          tiles fills a four-column grid completely, no empty cells. */}
      <section className="band-tight">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[46ch]">
              <h2
                className="t-h1 text-navy-900"
                style={{ fontSize: 'clamp(1.5rem, 6vw, var(--text-h1))' }}
              >
                Car parts by category.
              </h2>
              <p className="t-lead mt-4">
                {PART_TYPES.length} part types across {CATEGORIES.length} systems, from
                braking and engine to filters and electrical.
              </p>
            </div>
            <Link
              href="/parts"
              className="group inline-flex items-center gap-2 pb-1 text-[0.95rem] font-semibold text-navy-700 transition-colors hover:text-navy-800 max-sm:min-h-11"
            >
              All {PART_TYPES.length} part types
              <ArrowRight
                size={17}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <div className="mt-9 grid grid-cols-2 gap-px bg-hairline md:grid-cols-4">
            <Reveal as="div" className="col-span-2 row-span-2 h-full">
              <Link
                href={`/parts/${feature.slug}`}
                className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden bg-navy-900 p-6 md:min-h-[380px]"
              >
                <Image
                  src={feature.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-70 transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/55 to-transparent" />
                <div className="relative">
                  <CategoryIcon name={feature.icon} className="text-signal" size={26} />
                  <h3 className="t-h2 mt-3 text-on-navy">{feature.label}</h3>
                  <p className="mt-2 max-w-[38ch] text-[0.92rem] leading-relaxed text-on-navy-muted">
                    {feature.blurb}
                  </p>
                </div>
              </Link>
            </Reveal>

            {rest.map((c, i) => (
              <Reveal as="div" key={c.slug} delay={Math.min(i * 0.05, 0.3)} className="h-full">
              <Link
                href={`/parts/${c.slug}`}
                className="group relative flex h-full min-h-[132px] flex-col justify-between overflow-hidden p-4 md:min-h-[160px] md:p-5"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-[0.16] transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-paper/90 transition-colors duration-300 group-hover:bg-navy-900/78" />
                <CategoryIcon
                  name={c.icon}
                  size={22}
                  className="relative text-steel transition-colors duration-200 group-hover:text-signal"
                />
                <div className="relative">
                  <h3 className="text-[0.98rem] font-bold leading-tight text-ink transition-colors group-hover:text-on-navy">
                    {c.label}
                  </h3>
                  <span className="t-data mt-1.5 block text-[0.7rem] text-steel transition-colors group-hover:text-on-navy-muted">
                    {PART_TYPES.filter((t) => t.category === c.slug)
                      .slice(0, 3)
                      .map((t) => t.label)
                      .join(', ')}
                  </span>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── By vehicle ────────────────────────────────────────────────────
          The second route into the catalogue. Most people know their car
          rather than the name of the component, and this is also the axis
          that captures make-and-model searches. */}
      <section className="band-tight relative overflow-hidden border-t border-hairline">
        <Image
          src="/images/vehicles-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-paper/90" aria-hidden="true" />

        <div className="shell relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="t-h1 text-navy-900">Or parts by vehicle make and model.</h2>
            <p className="t-lead mx-auto mt-4 max-w-[54ch]">
              {MODELS.length} models across {MAKES.length} makes, with the years, engines
              and most commonly replaced parts for each.
            </p>
            <Link
              href="/vehicles"
              className="group mt-4 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-navy-700 transition-colors hover:text-navy-800 max-sm:min-h-11"
            >
              All makes and models
              <ArrowRight
                size={17}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <ul className="mt-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {MAKES.map((mk, i) => (
              <Reveal
                as="li"
                key={mk.slug}
                delay={Math.min(i * 0.04, 0.24)}
                className="bg-card ring-1 ring-inset ring-hairline"
              >
                <Link
                  href={`/vehicles/${mk.slug}`}
                  className="group flex h-full items-center justify-between gap-2 px-4 py-5 transition-colors duration-200 hover:bg-paper"
                >
                  <span
                    className="font-display text-[1.05rem] font-extrabold leading-none tracking-[-0.02em] text-navy-900 group-hover:text-navy-700"
                    style={{ fontStretch: '115%' }}
                  >
                    {mk.label}
                  </span>
                  <ArrowRight
                    size={14}
                    weight="bold"
                    aria-hidden="true"
                    className="shrink-0 text-hairline-strong transition-all duration-200 group-hover:translate-x-1 group-hover:text-navy-700"
                  />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Wholesale ─────────────────────────────────────────────────────
          Image-led split, and the page's second breathing-room slab — "the
          partner pitch" the .slab utility was written for. Placed after the
          discovery sections so it reads as a deliberate pivot to a different
          audience (distributors, not retail workshops), not an interruption
          mid-browse. */}
      <section className="slab band">
        <div className="shell">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="order-2 lg:order-1">
              <p className="t-label text-signal">Distributors and franchisees</p>
              <h2 className="t-h1 mt-4 max-w-[16ch] text-on-navy">
                Grow the network in your market.
              </h2>
              <p className="mt-5 text-[1.05rem] leading-relaxed text-on-navy-muted">
                Parts-Mall is expanding its distributor and franchise network across
                Southern Africa. If your business already moves volume in vehicle parts,
                head office is where that conversation starts directly.
              </p>

              <ul className="mt-8 space-y-0 border-t-2 border-signal">
                {[
                  'Territory-based supply for regional distributors and resellers',
                  'Franchise partnerships backed by group stock and brand systems',
                  'A named person at head office, not a general enquiries inbox',
                  'Warranty terms confirmed in writing on every invoice',
                ].map((item) => (
                  <li
                    key={item}
                    className="border-b border-on-navy-rule py-3.5 text-[0.95rem] text-on-navy-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/wholesale" variant="signal">
                  Distributor and franchise enquiries
                  <ArrowRight size={18} weight="bold" aria-hidden="true" className={buttonArrowClass} />
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="order-1 lg:order-2">
              <Image
                src="/images/warehouse-aisle.webp"
                alt="A long aisle of steel pallet racking in the distribution warehouse, stacked with boxed parts, a picker working mid-aisle."
                width={1920}
                height={1288}
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="w-full rounded-[var(--radius-base)] object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Blog ──────────────────────────────────────────────────────────
          Editorial row. Written for the person at the car, which is also what
          brings workshop searches in. */}
      <section className="band-tight bg-paper">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="t-h1 max-w-[20ch] text-navy-900">From the parts counter.</h2>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 pb-1 text-[0.95rem] font-semibold text-navy-700 transition-colors hover:text-navy-800 max-sm:min-h-11"
            >
              Visit the blog
              <ArrowRight
                size={17}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <ul className="mt-9 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
            {GUIDES.slice(0, 3).map((g, i) => (
              <Reveal
                as="li"
                key={g.slug}
                delay={i * 0.07}
                className="w-[82%] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none"
              >
                <Link href={`/blog/${g.slug}`} className="group block">
                  <div className="overflow-hidden rounded-[var(--radius-base)] bg-navy-900">
                    <Image
                      src={g.image}
                      alt=""
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 100vw, 32vw"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="t-label text-signal-deep">{g.category}</span>
                    <span className="t-data text-[0.72rem] text-steel">
                      {g.readMinutes} min
                    </span>
                  </div>
                  <h3 className="t-h3 mt-2 text-ink group-hover:text-navy-700">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-steel">
                    {g.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Closing ───────────────────────────────────────────────────────
          One decision to make, stated plainly. Centered and image-led, a
          deliberate close after a page of left-aligned sections. */}
      <section className="relative flex min-h-[65vh] flex-col overflow-hidden border-t border-hairline">
        <Image
          src="/images/closing-cta-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/85 to-navy-900/55"
          aria-hidden="true"
        />

        <Reveal className="shell relative flex flex-1 flex-col items-center justify-center py-16 text-center">
          <h2 className="t-h1 max-w-[20ch] text-on-navy">
            Still holding the old part in your hand?
          </h2>
          <p className="t-lead mt-4 max-w-[52ch] text-on-navy-muted">
            Send a photo to your nearest branch on WhatsApp. A picture settles most
            fitment questions faster than any part number.
          </p>
        </Reveal>

        <div className="shell relative flex flex-wrap justify-center gap-3 pb-14">
          <ButtonLink href="/branches" variant="signal">
            <Phone size={18} weight="fill" aria-hidden="true" />
            Find a branch
          </ButtonLink>
          <ButtonLink
            href="/contact"
            variant="outline"
            className="border-on-navy-rule text-on-navy hover:border-on-navy hover:bg-white/5"
          >
            Contact head office
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
