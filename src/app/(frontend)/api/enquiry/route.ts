import { NextResponse } from 'next/server'
import { CLOUDIA_URL, getCmsClient } from '@/lib/cms/client'

/**
 * Enquiry intake.
 *
 * Validated again on the server, because client validation is a convenience
 * and never a control. Every submission is stored in the CMS (CloudIA's private
 * `enquiries` form, readable only by staff in /admin) so a lead cannot be lost
 * to a mail rule, and only then is the notification email sent.
 */

type BranchDoc = { slug: string; email?: string | null }

/** Sends the notification through Resend's API, as Payload's Resend adapter did. */
async function sendEmail(message: { to: string; replyTo: string; subject: string; text: string }) {
  const address = process.env.EMAIL_FROM_ADDRESS || 'noreply@parts-mall.co.za'
  const name = process.env.EMAIL_FROM_NAME || 'Parts-Mall Africa'
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${name} <${address}>`,
      to: [message.to],
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
    }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`Resend returned ${response.status}: ${await response.text()}`)
}

export async function POST(request: Request) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const phone = String(body.phone || '').trim()
  const message = String(body.message || '').trim()

  if (
    name.length < 2 ||
    message.length < 10 ||
    phone.replace(/\D/g, '').length < 9 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  ) {
    return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 422 })
  }

  const allowedTypes = ['wholesale', 'branch', 'general', 'distributor']
  const type = allowedTypes.includes(body.type) ? body.type : 'general'
  const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined)

  try {
    // Resolve the branch when the enquiry came from a branch page. Only an
    // active branch counts, and the recipient comes from the CMS, never from a
    // submitted email field.
    let branch: BranchDoc | undefined
    let recipient = process.env.ENQUIRY_TO_EMAIL
    if (body.branchSlug) {
      const found = await getCmsClient().find({
        collection: 'branches',
        where: { slug: { equals: String(body.branchSlug) }, active: { equals: true } },
        limit: 1,
        depth: 0,
      })
      branch = found.docs[0] as unknown as BranchDoc | undefined
      recipient = branch?.email?.trim() || recipient
    }

    const enquiry = {
      type,
      name,
      email,
      phone,
      message,
      company: text(body.company),
      region: text(body.region),
      monthlySpend: text(body.monthlySpend),
      part: text(body.part),
      branch: branch?.slug,
      sourcePath: text(body.sourcePath),
    }

    // Forward who the visitor is to the CMS: its form throttle keys on their
    // address (never stored), and the analytics session ties the enquiry to
    // the visit's source and campaign.
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) headers['X-Forwarded-For'] = forwarded
    for (const name of ['user-agent', 'referer', 'x-cloudia-session']) {
      const value = request.headers.get(name)
      if (value) headers[name] = value
    }
    const stored = await fetch(`${CLOUDIA_URL}/api/enquiries`, {
      method: 'POST',
      headers,
      body: JSON.stringify(enquiry),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (stored.status === 429) {
      return NextResponse.json(
        { error: 'Too many enquiries from this connection. Please try again in a few minutes.' },
        { status: 429 },
      )
    }
    if (!stored.ok) {
      throw new Error(`CMS returned ${stored.status}: ${await stored.text()}`)
    }
    const { doc } = (await stored.json()) as { doc?: { id?: string | number } }
    const reference = String(doc?.id ?? '').slice(0, 8)

    if (process.env.RESEND_API_KEY && recipient) {
      try {
        await sendEmail({
          to: recipient,
          replyTo: email,
          subject: `New ${type} enquiry #${reference}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Company: ${enquiry.company || '-'}`,
            `Region: ${enquiry.region || '-'}`,
            `Monthly spend: ${enquiry.monthlySpend || '-'}`,
            `Branch: ${body.branchSlug || '-'}`,
            `Part: ${enquiry.part || '-'}`,
            `Source: ${enquiry.sourcePath || '-'}`,
            '',
            message,
          ].join('\n'),
        })
      } catch (error) {
        // The enquiry is already stored; a mail failure must never lose it.
        console.error(`Email notification failed for saved enquiry ${reference}:`, error)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Enquiry could not be stored:', error)
    return NextResponse.json({ error: 'Could not store the enquiry.' }, { status: 500 })
  }
}
