'use client'

import { usePathname } from 'next/navigation'
import { WhatsappLogo } from '@phosphor-icons/react'
import { getBranch, whatsappNumber } from '@/lib/data/branches'
import { COMPANY } from '@/lib/data/company'

/**
 * On a branch page this goes straight to that branch's real WhatsApp.
 * Everywhere else it goes to head office. No picker step — a workshop owner
 * with a part number ready should not have to search for their own branch
 * first, especially when the page they're already on has settled that.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname()

  const branchSlug = pathname?.match(/^\/branches\/([^/]+)$/)?.[1]
  const branch = branchSlug ? getBranch(branchSlug) : undefined

  const number = whatsappNumber(branch?.phone ?? COMPANY.headOffice.whatsappPhone)
  const label = branch
    ? `Message the ${branch.name} branch on WhatsApp`
    : 'Message Parts-Mall head office on WhatsApp'

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-24 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-panel)] transition-transform hover:scale-105 active:scale-95"
    >
      <span
        aria-hidden="true"
        className="fab-pulse-ring absolute inset-0 rounded-full bg-[#25D366]"
      />
      <WhatsappLogo size={28} weight="fill" aria-hidden="true" className="relative" />
    </a>
  )
}
