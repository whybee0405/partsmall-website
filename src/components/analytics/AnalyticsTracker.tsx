'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_EVENT, hasAnalyticsConsent } from '@/lib/consent'

const SESSION_KEY = 'pm-analytics-session'
const ENQUIRY_EVENT = 'pm-analytics-enquiry'
const WHATSAPP_EVENT = 'pm-analytics-whatsapp'
type AnalyticsEventType = 'page_view' | 'page_exit' | 'form_submit' | 'whatsapp_click'
type WhatsAppTopic = 'part_inquiry' | 'distributor_franchise_inquiry' | 'general_inquiry'

function sessionId() {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    if (!id) { id = crypto.randomUUID(); window.sessionStorage.setItem(SESSION_KEY, id) }
    return id
  } catch { return crypto.randomUUID() }
}

function eventBody(type: AnalyticsEventType, path: string, duration?: number, whatsapp?: { topic: WhatsAppTopic; branchSlug: string }) {
  return JSON.stringify({ type, path, sessionId: sessionId(), referrer: document.referrer ? new URL(document.referrer).origin : '', ...(duration === undefined ? {} : { duration }), ...(whatsapp ? { whatsappTopic: whatsapp.topic, branchSlug: whatsapp.branchSlug } : {}) })
}

function post(type: AnalyticsEventType, path: string, duration?: number, beacon = false, whatsapp?: { topic: WhatsAppTopic; branchSlug: string }) {
  const body = eventBody(type, path, duration, whatsapp)
  if (beacon && navigator.sendBeacon?.('/api/analytics-events', new Blob([body], { type: 'application/json' }))) return
  fetch('/api/analytics-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
}

/** Consent-gated client tracker. It stores only a tab-lifetime random session ID. */
export function AnalyticsTracker() {
  const pathname = usePathname()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const update = () => setEnabled(hasAnalyticsConsent())
    update()
    window.addEventListener(CONSENT_EVENT, update)
    return () => window.removeEventListener(CONSENT_EVENT, update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const loadedAt = Date.now()
    let exited = false
    const exit = () => { if (!exited) { exited = true; post('page_exit', pathname, Math.round((Date.now() - loadedAt) / 1000), true) } }
    const onVisibility = () => { if (document.visibilityState === 'hidden') exit() }
    const onEnquiry = () => post('form_submit', pathname)
    const onWhatsApp = (event: Event) => {
      const detail = (event as CustomEvent<{ topic: WhatsAppTopic; branchSlug: string }>).detail
      if (detail?.topic && detail?.branchSlug) post('whatsapp_click', pathname, undefined, false, detail)
    }
    post('page_view', pathname)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', exit)
    window.addEventListener(ENQUIRY_EVENT, onEnquiry)
    window.addEventListener(WHATSAPP_EVENT, onWhatsApp)
    return () => { exit(); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pagehide', exit); window.removeEventListener(ENQUIRY_EVENT, onEnquiry); window.removeEventListener(WHATSAPP_EVENT, onWhatsApp) }
  }, [enabled, pathname])

  return null
}

export function trackEnquiryAnalytics() {
  window.dispatchEvent(new Event(ENQUIRY_EVENT))
}

export function trackWhatsAppAnalytics(topic: WhatsAppTopic, branchSlug: string) {
  window.dispatchEvent(new CustomEvent(WHATSAPP_EVENT, { detail: { topic, branchSlug } }))
}
