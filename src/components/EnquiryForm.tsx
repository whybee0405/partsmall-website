'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CheckCircle, Spinner, WarningCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Field, Input, Textarea, Select } from '@/components/ui/Field'
import { trackEnquiryAnalytics } from '@/components/analytics/AnalyticsTracker'

type EnquiryType = 'wholesale' | 'branch' | 'general' | 'distributor'

type Errors = Partial<Record<string, string>>

/**
 * Enquiry form.
 *
 * Every state is built, not just the happy path: idle, submitting, field-level
 * errors surfaced below the offending input and focused on failure, a server
 * error with a real recovery path, and a success state that tells the buyer
 * what happens next rather than just saying "thanks".
 */
export function EnquiryForm({
  type = 'general',
  branchSlug,
  partNumber,
  trade = false,
  submitLabel = 'Send enquiry',
}: {
  type?: EnquiryType
  branchSlug?: string
  partNumber?: string
  trade?: boolean
  submitLabel?: string
}) {
  const pathname = usePathname()
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (state === 'done') confirmationRef.current?.focus()
  }, [state])

  const validate = (data: FormData): Errors => {
    const e: Errors = {}
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const message = String(data.get('message') || '').trim()

    if (name.length < 2) e.name = 'Please give us a name we can use when we call.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      e.email = 'That email address does not look complete.'
    if (phone.replace(/\D/g, '').length < 9)
      e.phone = 'A contact number gets you a faster answer than email alone.'
    if (message.length < 10)
      e.message = 'Tell us a little more so we can route this to the right person.'
    return e
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const found = validate(data)
    setErrors(found)
    if (Object.keys(found).length) {
      // Focus the first field that failed, per WCAG error handling.
      const first = Object.keys(found)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setState('sending')
    setServerError(null)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...Object.fromEntries(data.entries()),
          type,
          branchSlug,
          part: partNumber,
          sourcePath: pathname,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      trackEnquiryAnalytics()
      setState('done')
      form.reset()
    } catch {
      setState('error')
      setServerError(
        'We could not send that just now. Please try again, or call your nearest branch directly.',
      )
    }
  }

  if (state === 'done') {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-base)] border border-[oklch(0.86_0.06_155)] bg-signal-soft p-7"
      >
        <CheckCircle
          size={30}
          weight="fill"
          aria-hidden="true"
          className="text-signal-deep"
        />
        <h3 ref={confirmationRef} tabIndex={-1} className="t-h3 mt-3 text-ink outline-none">
          That is with the team
        </h3>
        <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-ink-soft">
          You will hear from a named person, not a ticket number. Expect a call or an
          email within two working days. If the vehicle cannot wait that long, call your
          nearest branch and they will pick it up immediately.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mt-4 text-[0.9rem] font-semibold text-signal-deep underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="flex gap-3 rounded-[var(--radius-base)] border border-[oklch(0.82_0.08_27)] bg-[oklch(0.96_0.03_27)] p-4"
        >
          <WarningCircle
            size={20}
            weight="fill"
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[oklch(0.52_0.17_27)]"
          />
          <p className="text-[0.9rem] leading-relaxed text-[oklch(0.4_0.13_27)]">
            {serverError}
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" required error={errors.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </Field>

        <Field label="Business name" htmlFor="company">
          <Input id="company" name="company" autoComplete="organization" />
        </Field>

        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </Field>

        <Field
          label="Contact number"
          htmlFor="phone"
          required
          error={errors.phone}
          helper="We call before we email."
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={
              errors.phone ? 'phone-error' : 'phone-help'
            }
          />
        </Field>

        {trade && (
          <>
            <Field
              label="Province or country"
              htmlFor="region"
              helper="Tells us which branch to route you to."
            >
              <Input id="region" name="region" aria-describedby="region-help" />
            </Field>

            <Field label="Rough monthly spend" htmlFor="monthlySpend">
              <Select id="monthlySpend" name="monthlySpend" defaultValue="">
                <option value="">Select a range</option>
                <option value="under-10k">Under R10 000</option>
                <option value="10k-50k">R10 000 to R50 000</option>
                <option value="50k-150k">R50 000 to R150 000</option>
                <option value="over-150k">Over R150 000</option>
                <option value="not-sure">Not sure yet</option>
              </Select>
            </Field>
          </>
        )}
      </div>

      <Field
        label={partNumber ? `About ${partNumber}` : 'What do you need?'}
        htmlFor="message"
        required
        error={errors.message}
        helper={
          trade
            ? 'The vehicle makes you see most, and roughly what you buy in a month.'
            : 'The vehicle make, model and year, and the part. An OEM number if you have one.'
        }
      >
        <Textarea
          id="message"
          name="message"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : 'message-help'}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" variant="signal" disabled={state === 'sending'}>
          {state === 'sending' && (
            <Spinner size={18} weight="bold" aria-hidden="true" className="animate-spin" />
          )}
          {state === 'sending' ? 'Sending' : submitLabel}
        </Button>
        <p className="text-[0.8rem] leading-snug text-steel">
          We use these details to answer your enquiry. Nothing else.
        </p>
      </div>
    </form>
  )
}
