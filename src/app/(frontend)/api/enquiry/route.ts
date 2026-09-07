import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Enquiry intake.
 *
 * Validated again on the server, because client validation is a convenience
 * and never a control. Every submission is stored in Payload so a lead cannot
 * be lost to a mail rule.
 */
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

  try {
    const payload = await getPayload({ config })

    // Resolve the branch relationship when the enquiry came from a branch page.
    // Relationship IDs are numeric on this adapter, so coerce rather than pass
    // the union straight through.
    let branchId: number | undefined
    if (body.branchSlug) {
      const found = await payload.find({
        collection: 'branches',
        where: { slug: { equals: body.branchSlug } },
        limit: 1,
      })
      const id = found.docs[0]?.id
      if (id !== undefined && id !== null) branchId = Number(id)
    }

    await payload.create({
      collection: 'enquiries',
      data: {
        type: type as 'wholesale' | 'branch' | 'general' | 'distributor',
        name,
        email,
        phone,
        message,
        company: body.company?.trim() || undefined,
        region: body.region?.trim() || undefined,
        monthlySpend: body.monthlySpend || undefined,
        part: body.part || undefined,
        branch: branchId,
        sourcePath: body.sourcePath || undefined,
        status: 'new',
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Enquiry could not be stored:', error)
    return NextResponse.json({ error: 'Could not store the enquiry.' }, { status: 500 })
  }
}
