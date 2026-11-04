'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createCloudiaTracker, type CloudiaTracker } from '@cloudia-cms/client/tracker'

const ENQUIRY_EVENT = 'pm-analytics-enquiry'
const WHATSAPP_EVENT = 'pm-analytics-whatsapp'
type WhatsAppTopic = 'part_inquiry' | 'distributor_franchise_inquiry' | 'general_inquiry'

/**
 * First-party, cookieless analytics through CloudIA CMS.
 *
 * Events go to /api/analytics-events, the same address the Payload-era tracker
 * used, which the CMS now answers. Beyond page views, exits and time on page
 * the CloudIA tracker also records campaign (UTM) parameters, scroll depth,
 * Core Web Vitals, outbound links, downloads, 404s and WhatsApp/phone/email
 * link clicks (`contact_click`). It keeps only a tab-lifetime session id in
 * sessionStorage, and honours Do Not Track and Global Privacy Control.
 *
 * WhatsApp enquiries keep their own `whatsapp_click` event with the topic and
 * destination as metadata ({ topic, branch }), continuing the Payload history.
 */
let tracker: CloudiaTracker | null = null

function getTracker() {
  if (typeof window === 'undefined') return null
  tracker ??= createCloudiaTracker({
    endpoint: '/api/analytics-events',
    autoStart: false,
    // not-found.tsx marks its page, so 404s show up under Analytics → Pages.
    notFound: () => Boolean(document.querySelector('[data-page-not-found]')),
  })
  return tracker
}

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const instance = getTracker()
    if (!instance) return
    instance.start()
    const onEnquiry = () => instance.track('form_submit')
    const onWhatsApp = (event: Event) => {
      const detail = (event as CustomEvent<{ topic: WhatsAppTopic; branchSlug: string }>).detail
      if (detail?.topic && detail?.branchSlug)
        instance.track('whatsapp_click', { topic: detail.topic, branch: detail.branchSlug })
    }
    window.addEventListener(ENQUIRY_EVENT, onEnquiry)
    window.addEventListener(WHATSAPP_EVENT, onWhatsApp)
    return () => {
      window.removeEventListener(ENQUIRY_EVENT, onEnquiry)
      window.removeEventListener(WHATSAPP_EVENT, onWhatsApp)
    }
  }, [])

  useEffect(() => {
    getTracker()?.pageChanged(pathname)
  }, [pathname])

  return null
}

/**
 * Headers that tie an enquiry to this visit (source, campaign, landing page)
 * in CloudIA's enquiry reports. Empty when the tracker is not running.
 */
export function analyticsEnquiryHeaders(): Record<string, string> {
  return getTracker()?.enquiryHeaders() ?? {}
}

export function trackEnquiryAnalytics() {
  window.dispatchEvent(new Event(ENQUIRY_EVENT))
}

export function trackWhatsAppAnalytics(topic: WhatsAppTopic, branchSlug: string) {
  window.dispatchEvent(new CustomEvent(WHATSAPP_EVENT, { detail: { topic, branchSlug } }))
}
