'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Buildings, CaretDown, Package, Question, WhatsappLogo } from '@phosphor-icons/react'
import { whatsappNumber, type Branch } from '@/lib/data/branches'
import { COMPANY } from '@/lib/data/company'
import { useCookieBannerOpen } from '@/lib/consent'
import { trackWhatsAppAnalytics } from '@/components/analytics/AnalyticsTracker'

type InquiryTopic = 'part_inquiry' | 'distributor_franchise_inquiry' | 'general_inquiry'
type InquiryOption = { topic: InquiryTopic; label: string; message: string; icon: typeof Package }

/** Fixed WhatsApp control, using the live branch list supplied by the layout. */
export function FloatingWhatsApp({ branches }: { branches: Branch[] }) {
  const pathname = usePathname()
  const bannerOpen = useCookieBannerOpen()
  const [open, setOpen] = useState(false)
  const shelfRef = useRef<HTMLDivElement>(null)
  const branchSlug = pathname?.match(/^\/branches\/([^/]+)$/)?.[1]
  const branch = branchSlug ? branches.find((item) => item.slug === branchSlug) : undefined
  const destination = branch?.slug ?? 'head-office'
  const destinationLabel = branch ? `${branch.name} branch` : 'head office'
  const number = whatsappNumber(branch?.phone ?? COMPANY.headOffice.whatsappPhone)
  const bottomClass = bannerOpen ? 'bottom-52 sm:bottom-24' : 'bottom-6'

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => { if (!shelfRef.current?.contains(event.target as Node)) setOpen(false) }
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('mousedown', closeOnOutside); document.removeEventListener('keydown', closeOnEscape) }
  }, [open])

  const options: InquiryOption[] = [
    { topic: 'part_inquiry', label: 'Part inquiry', message: `Hello Parts-Mall ${destinationLabel}, I would like to enquire about a part. Vehicle make, model, year and the part I need:`, icon: Package },
    ...(!branch ? [{ topic: 'distributor_franchise_inquiry' as const, label: 'Distributor / franchise inquiry', message: 'Hello Parts-Mall head office, I would like to enquire about becoming a distributor or franchise partner. My business, location and current volumes:', icon: Buildings }] : []),
    { topic: 'general_inquiry', label: 'General inquiry', message: `Hello Parts-Mall ${destinationLabel}, I have a general inquiry:`, icon: Question },
  ]
  const label = `Message Parts-Mall ${destinationLabel} on WhatsApp`

  return <div ref={shelfRef} className={`fixed right-6 z-[90] ${bottomClass} transition-[bottom] duration-200`}>
    <div id="whatsapp-inquiry-shelf" aria-hidden={!open} className={`absolute bottom-[calc(100%+0.75rem)] right-0 w-[min(19rem,calc(100vw-3rem))] origin-bottom-right transition-[opacity,transform] duration-200 ease-[var(--ease-out-expo)] ${open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}>
      <div className="overflow-hidden rounded-[var(--radius-base)] border border-hairline bg-card shadow-[var(--shadow-panel)]"><div className="border-b border-hairline bg-paper-2 px-4 py-3"><p className="t-label text-steel">WhatsApp {branch ? 'branch desk' : 'head office'}</p><p className="mt-1 text-sm font-semibold text-ink">What can we help with?</p></div><div className="p-1.5">{options.map(({ topic, label: optionLabel, message, icon: Icon }) => <a key={topic} href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" onClick={() => { trackWhatsAppAnalytics(topic, destination); setOpen(false) }} className="group flex items-center gap-3 rounded-[3px] px-3 py-3 text-left transition-colors duration-150 hover:bg-signal-soft focus:bg-signal-soft"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[3px] bg-navy-100 text-navy-700 group-hover:bg-signal group-hover:text-ink"><Icon size={18} weight="bold" aria-hidden="true" /></span><span className="text-sm font-semibold text-ink">{optionLabel}</span></a>)}</div></div>
    </div>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="whatsapp-inquiry-shelf" aria-label={open ? 'Close WhatsApp inquiry options' : label} title={label} className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-panel)] transition-transform duration-200 hover:scale-105 active:scale-95">{!open && <span aria-hidden="true" className="fab-pulse-ring absolute inset-0 rounded-full bg-[#25D366]" />}{open ? <CaretDown size={25} weight="bold" aria-hidden="true" className="relative" /> : <WhatsappLogo size={28} weight="fill" aria-hidden="true" className="relative" />}</button>
  </div>
}
