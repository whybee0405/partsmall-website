'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatCircleDots, X, PaperPlaneRight, Phone, WhatsappLogo, NavigationArrow } from '@phosphor-icons/react'
import { telHref, mapsHref, whatsappNumber, type Branch } from '@/lib/data/branches'
import { usePathname } from 'next/navigation'
import { useCookieBannerOpen } from '@/lib/consent'
import { stickyCtaHidden } from '@/components/MobileStickyCta'

type Message = {
  role: 'user' | 'assistant'
  text: string
  branches?: (Branch & { km?: number })[]
  quickReplies?: string[]
}

const WELCOME: Message = {
  role: 'assistant',
  text: `Hi, I'm the Parts-Mall Africa assistant. I can help you find a branch, check what we cover, or answer a question about ordering, warranty or distributor terms. What do you need?`,
  quickReplies: ['Find a branch', 'Check part availability', 'Distributor enquiries', 'Vehicle makes you support'],
}

/**
 * The chat assistant. Rule-based by default (see /api/chat and
 * lib/chat/engine.ts) — genuinely useful with zero configuration, and
 * upgrades transparently to a real model the moment ANTHROPIC_API_KEY is set
 * server-side. The widget itself doesn't know or care which mode answered.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bannerOpen = useCookieBannerOpen()
  const pathname = usePathname()
  const hasCta = !stickyCtaHidden(pathname)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  async function send(text: string, location?: { lat: number; lng: number }) {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setMessages((m) => [...m, { role: 'user', text: trimmed }])
    setInput('')
    setSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-8).map((m) => ({ role: m.role, text: m.text })),
          location,
        }),
      })
      const data = await res.json()
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: data.text || `Something went wrong on my end — try a branch's WhatsApp directly.`,
          branches: data.branches,
          quickReplies: data.quickReplies,
        },
      ])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: `I couldn't reach the server just now. Please try again in a moment.` },
      ])
    } finally {
      setSending(false)
    }
  }

  function handleQuickReply(reply: string) {
    if (reply === 'Share my location') {
      if (!('geolocation' in navigator)) {
        setMessages((m) => [
          ...m,
          { role: 'assistant', text: `This browser can't share location. Try typing your town instead.` },
        ])
        return
      }
      setSending(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSending(false)
          send('Find the branch nearest to me', { lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {
          setSending(false)
          setMessages((m) => [
            ...m,
            { role: 'assistant', text: `Couldn't get your location — try typing your town or province instead.` },
          ])
        },
        { timeout: 8000, maximumAge: 300000 },
      )
      return
    }
    send(reply)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        className={`fixed left-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-navy-700 text-on-navy shadow-[var(--shadow-panel)] transition-[bottom,transform] duration-200 hover:scale-105 active:scale-95 ${
          hasCta
            ? open
              ? 'bottom-44 sm:bottom-6'
              : bannerOpen
                ? 'bottom-52 sm:bottom-24'
                : 'bottom-24 sm:bottom-6'
            : bannerOpen && !open
              ? 'bottom-28 sm:bottom-24'
              : 'bottom-6'
        }`}
      >
        {!open && (
          <span aria-hidden="true" className="fab-pulse-ring absolute inset-0 rounded-full bg-navy-700" />
        )}
        {open ? (
          <X size={24} weight="bold" aria-hidden="true" className="relative" />
        ) : (
          <ChatCircleDots size={26} weight="fill" aria-hidden="true" className="relative" />
        )}
      </button>

      {open && (
        <div
          className={`fixed left-6 z-[95] flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-[var(--radius-base)] border border-hairline-strong bg-card shadow-[var(--shadow-panel)] ${
            hasCta ? 'bottom-44 sm:bottom-24' : 'bottom-24'
          }`}
        >
          <div className="flex items-center justify-between border-b border-hairline bg-navy-900 px-4 py-3">
            <div>
              <p className="text-[0.95rem] font-semibold text-on-navy">Parts-Mall Assistant</p>
              <p className="t-label text-on-navy-muted">Usually replies instantly</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-[var(--radius-base)] p-1.5 text-on-navy-muted transition-colors hover:bg-white/10 hover:text-on-navy"
            >
              <X size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[85%] rounded-[var(--radius-base)] px-3.5 py-2.5 text-[0.88rem] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-navy-700 text-on-navy'
                      : 'border border-hairline bg-paper text-ink'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.branches && m.branches.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {m.branches.map((b) => (
                        <li key={b.slug} className="rounded-[var(--radius-base)] border border-hairline-strong bg-card p-2.5">
                          <p className="text-[0.85rem] font-semibold text-ink">
                            {b.name}
                            {typeof b.km === 'number' && (
                              <span className="ml-1.5 font-normal text-signal-deep">
                                · {b.km < 10 ? b.km.toFixed(1) : Math.round(b.km)} km
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 text-[0.78rem] text-steel">{b.address}</p>
                          <div className="mt-2 flex gap-1.5">
                            <a
                              href={telHref(b.phone)}
                              aria-label={`Call ${b.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-base)] border border-hairline-strong text-ink transition-colors hover:border-ink"
                            >
                              <Phone size={14} weight="fill" aria-hidden="true" />
                            </a>
                            <a
                              href={`https://wa.me/${whatsappNumber(b.phone)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`WhatsApp ${b.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-base)] border border-hairline-strong text-ink transition-colors hover:border-signal-deep hover:text-signal-deep"
                            >
                              <WhatsappLogo size={14} weight="fill" aria-hidden="true" />
                            </a>
                            <a
                              href={mapsHref(b)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Directions to ${b.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-base)] border border-hairline-strong text-ink transition-colors hover:border-ink"
                            >
                              <NavigationArrow size={13} weight="bold" aria-hidden="true" />
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {m.quickReplies && m.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.quickReplies.map((qr) => (
                        <button
                          key={qr}
                          type="button"
                          onClick={() => handleQuickReply(qr)}
                          disabled={sending}
                          className="t-label rounded-[var(--radius-base)] border border-hairline-strong bg-card px-2.5 py-1.5 text-ink transition-colors hover:border-navy-700 hover:text-navy-700 disabled:opacity-50"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-[var(--radius-base)] border border-hairline bg-paper px-3.5 py-2.5 text-[0.85rem] text-steel">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-hairline p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Message the assistant
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a branch, part or account…"
              disabled={sending}
              className="h-10 flex-1 rounded-[var(--radius-base)] border border-hairline-strong bg-paper px-3 text-[0.88rem] text-ink placeholder:text-steel focus:border-ink-soft"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-base)] bg-signal-deep text-paper transition-colors hover:bg-[oklch(0.48_0.135_155)] disabled:opacity-50"
            >
              <PaperPlaneRight size={17} weight="fill" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
