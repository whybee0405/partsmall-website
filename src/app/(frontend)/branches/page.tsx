import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '@/components/PageHeader'
import { BranchFinder } from '@/components/BranchFinder'
import { NetworkMap } from '@/components/NetworkMap'
import { getAllBranches, branchesByProvince, getNetworkStats } from '@/lib/payload/branches'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const network = await getNetworkStats()
  return {
    title: 'Branch finder',
    description: `Find your nearest Parts-Mall branch. 40+ branches across ${network.provinces} South African provinces, plus points in Botswana, Eswatini, Mozambique, Namibia and Zimbabwe.`,
    alternates: { canonical: '/branches' },
  }
}

export default async function BranchesPage() {
  const [branches, groups] = await Promise.all([getAllBranches(), branchesByProvince()])

  return (
    <>
      <PageHeader
        title="Find your nearest branch."
        lead="Search by town, filter by province, or share your location and we will sort the network by distance. Every branch takes calls and WhatsApp directly."
        breadcrumbs={[{ href: '/branches', label: 'Branches' }]}
        backgroundImage="/images/branch-exterior.webp"
        imageAlt="The exterior of a Parts-Mall branch storefront."
      />

      <section className="band">
        <div className="shell">
          <BranchFinder branches={branches} showMap={false} />
        </div>
      </section>

      {/* The map is a second read of the same data, not a replacement for the
          list. The list stays authoritative and fully accessible. */}
      <section className="slab">
        <div className="shell band">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,33rem)] lg:gap-16">
            <div>
              <h2 className="t-h1 max-w-[15ch] text-on-navy">
                Where the network actually is.
              </h2>
              <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-on-navy-muted">
                Every point below is a real branch at its real coordinate. The density
                around Johannesburg and Pretoria is not a drawing decision, it is where
                the vehicle parc is.
              </p>

              <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7">
                {groups
                  .filter((g) => g.province !== 'Pan-Africa')
                  .map((g) => (
                    <div key={g.province} className="border-t border-on-navy-rule pt-3">
                      <dt className="text-[0.92rem] font-semibold text-on-navy">
                        {g.province}
                      </dt>
                      <dd className="t-data mt-1 text-[0.8rem] text-on-navy-muted">
                        {g.branches.length}{' '}
                        {g.branches.length === 1 ? 'branch' : 'branches'}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>

            <NetworkMap className="lg:pt-2" />
          </div>
        </div>
      </section>

      {/* Full directory, grouped. A trade buyer often wants the whole list to
          scan rather than a search box. */}
      <section className="band">
        <div className="shell">
          <h2 className="t-h1 text-navy-900">The full directory.</h2>

          {groups.map((group) => (
            <div
              key={group.province}
              id={group.province === 'Pan-Africa' ? 'pan-africa' : undefined}
              className="mt-12 scroll-mt-28"
            >
              <div className="flex items-baseline justify-between border-t-2 border-ink pt-3">
                <h3 className="t-h3 text-ink">
                  {group.province === 'Pan-Africa' ? 'Pan-African points' : group.province}
                </h3>
                <span className="t-data text-[0.78rem] text-steel">
                  {group.branches.length}
                </span>
              </div>

              <ul className="mt-1 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                {group.branches.map((b) => (
                  <li key={b.slug} className="border-b border-hairline">
                    <Link
                      href={`/branches/${b.slug}`}
                      className="group flex items-center justify-between gap-4 py-3.5"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[0.98rem] font-semibold text-ink group-hover:text-navy-700">
                          {b.name}
                        </span>
                        <span className="t-data block text-[0.76rem] text-steel">
                          {b.phone}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                        className="shrink-0 text-hairline-strong transition-all duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-1 group-hover:text-navy-700"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
