'use client'

import { usePathname } from 'next/navigation'
import { MapPin } from '@phosphor-icons/react'
import { ButtonLink } from '@/components/ui/Button'

/**
 * The one action a mechanic thumbing through this site on a phone is most
 * likely to need: the nearest branch. Mobile only — desktop already has the
 * header's "Find a branch" button in easy reach of a mouse. Hidden on the
 * branch pages themselves, where it would just repeat the page's own CTA.
 *
 * Exported so FloatingWhatsApp and ChatWidget can check it too — both need
 * to lift clear of this bar when it's showing.
 */
const HIDDEN_ON = ['/branches']

export function stickyCtaHidden(pathname: string | null) {
  return HIDDEN_ON.some((p) => pathname === p || pathname?.startsWith(`${p}/`))
}

export function MobileStickyCta() {
  const pathname = usePathname()
  if (stickyCtaHidden(pathname)) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[95] border-t border-hairline-strong bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:hidden">
      <ButtonLink href="/branches" variant="signal" className="w-full">
        <MapPin size={18} weight="bold" aria-hidden="true" />
        Find a branch
      </ButtonLink>
    </div>
  )
}
