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
