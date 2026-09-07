import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { ButtonLink, buttonArrowClass } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="band-tall">
      <div className="shell max-w-[60ch]">
        <p className="t-data text-[0.85rem] font-bold text-signal-deep">404</p>
        <h1 className="t-h1 mt-4 text-navy-900">That page is not on the shelf.</h1>
        <p className="t-lead mt-5">
          The link may be old, or the part reference may have superseded. The catalogue
          search and the branch finder will both get you where you were going.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/parts" variant="signal">
            Search the catalogue
            <ArrowRight size={18} weight="bold" aria-hidden="true" className={buttonArrowClass} />
          </ButtonLink>
          <ButtonLink href="/branches" variant="outline">
            Find a branch
          </ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Back to homepage
          </ButtonLink>
        </div>

        <div className="mt-10 border-t border-hairline pt-6">
          <p className="t-label text-steel">Or go straight to a section</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: '/parts', label: 'Parts' },
              { href: '/vehicles', label: 'Vehicles' },
              { href: '/branches', label: 'Branches' },
              { href: '/wholesale', label: 'Wholesale' },
              { href: '/blog', label: 'Blog' },
              { href: '/about', label: 'Company' },
            ].map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="font-semibold text-navy-700 hover:text-navy-800 max-sm:flex max-sm:min-h-11 max-sm:items-center"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-[0.92rem] text-steel">
          Still stuck?{' '}
          <Link href="/contact" className="font-semibold text-navy-700 hover:text-navy-800">
            Ask head office
          </Link>{' '}
          and we will point you at the right branch.
        </p>
      </div>
    </section>
  )
}
