import crypto from 'crypto'
import type { CollectionConfig, PayloadRequest } from 'payload'

const RATE_WINDOW_MS = 60 * 1000
const RATE_MAX = 80
const MAX_DURATION_SECONDS = 30 * 60
const RETENTION_MS = 14 * 30 * 24 * 60 * 60 * 1000

function dailyVisitorHash(req: { headers?: { get?: (key: string) => string | null } }): string {
  const forwarded = req.headers?.get?.('x-forwarded-for') ?? ''
  const ip = forwarded.split(',')[0].trim() || req.headers?.get?.('x-real-ip') || 'unknown'
  const userAgent = req.headers?.get?.('user-agent') ?? ''
  const day = new Date().toISOString().slice(0, 10)
  return crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}:${day}:${process.env.PAYLOAD_SECRET ?? ''}`)
    .digest('hex')
    .slice(0, 32)
}

function csvEscape(value: unknown): string {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

async function exportHandler(req: PayloadRequest): Promise<Response> {
  if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const days = Math.min(365, Math.max(1, Number(req.query?.days) || 30))
  const startValue = typeof req.query?.start === 'string' ? req.query.start : ''
  const endValue = typeof req.query?.end === 'string' ? req.query.end : ''
  const hasCustomRange = /^\d{4}-\d{2}-\d{2}$/.test(startValue) && /^\d{4}-\d{2}-\d{2}$/.test(endValue) && startValue <= endValue
  const since = hasCustomRange ? new Date(`${startValue}T00:00:00.000Z`).toISOString() : new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const until = hasCustomRange ? new Date(`${endValue}T23:59:59.999Z`).toISOString() : undefined
  const rows = ['type,path,referrer,session_id,duration_seconds,whatsapp_topic,branch_slug,created_at']
  let page = 1

  for (;;) {
    const result = await req.payload.find({
      collection: 'analytics-events',
      overrideAccess: true,
      where: { and: [{ createdAt: { greater_than_equal: since } }, ...(until ? [{ createdAt: { less_than_equal: until } }] : [])] },
      sort: '-createdAt',
      limit: 2000,
      page,
      depth: 0,
    })
    for (const doc of result.docs as unknown as Array<Record<string, unknown>>) {
      rows.push([doc.type, doc.path, doc.referrer, doc.sessionId, doc.duration ?? '', doc.whatsappTopic ?? '', doc.branchSlug ?? '', doc.createdAt].map(csvEscape).join(','))
    }
    if (!result.hasNextPage) break
    page += 1
  }

  return new Response(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="parts-mall-analytics-${hasCustomRange ? `${startValue}-to-${endValue}` : `${days}d`}.csv"`,
    },
  })
}

/**
 * Anonymous, first-party measurement. Raw IP addresses are never stored. The
 * hash rotates daily, while the browser session ID disappears when its tab
 * closes, so sessions cannot be linked across visits.
 */
export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  labels: { singular: 'Analytics event', plural: 'Analytics events' },
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['type', 'path', 'sessionId', 'duration', 'createdAt'],
    group: 'Admin',
    description: 'Anonymous first-party analytics. Use Analytics in the sidebar for the report.',
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  endpoints: [{ path: '/export', method: 'get', handler: exportHandler }],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation !== 'create' || !data) return data
        const visitorHash = dailyVisitorHash(req as never)
        const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString()
        const recent = await req.payload.count({
          collection: 'analytics-events',
          overrideAccess: true,
          where: { and: [{ visitorHash: { equals: visitorHash } }, { createdAt: { greater_than: since } }] },
        })
        if (recent.totalDocs >= RATE_MAX) throw new Error('Rate limited.')

        data.visitorHash = visitorHash
        data.path = String(data.path ?? '/').slice(0, 300)
        data.referrer = data.referrer ? String(data.referrer).slice(0, 300) : ''
        data.sessionId = data.sessionId ? String(data.sessionId).slice(0, 64) : ''
        if (data.duration != null) {
          const duration = Number(data.duration)
          data.duration = Number.isFinite(duration) ? Math.max(0, Math.min(MAX_DURATION_SECONDS, Math.round(duration))) : null
        }
        return data
      },
    ],
    afterChange: [
      async ({ req, operation }) => {
        if (operation !== 'create' || Math.random() > 0.002) return
        await req.payload.delete({
          collection: 'analytics-events',
          overrideAccess: true,
          where: { createdAt: { less_than: new Date(Date.now() - RETENTION_MS).toISOString() } },
        })
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'select', required: true, index: true, options: [
          { label: 'Page view', value: 'page_view' },
          { label: 'Page exit', value: 'page_exit' },
          { label: 'Form submit', value: 'form_submit' },
          { label: 'WhatsApp inquiry', value: 'whatsapp_click' },
        ] },
        { name: 'path', type: 'text', required: true, maxLength: 300, index: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'sessionId', type: 'text', maxLength: 64, index: true, admin: { description: 'Random sessionStorage ID for a single tab visit. Never a cookie.' } },
        { name: 'duration', type: 'number', min: 0, max: MAX_DURATION_SECONDS, admin: { description: 'Visible seconds before exit, capped at 30 minutes.' } },
      ],
    },
    { name: 'referrer', type: 'text', maxLength: 300, admin: { description: 'Origin only. Query strings and referring paths are not collected.' } },
    {
      type: 'row',
      fields: [
        { name: 'whatsappTopic', label: 'WhatsApp inquiry type', type: 'select', index: true, options: [
          { label: 'Part inquiry', value: 'part_inquiry' },
          { label: 'Distributor or franchise inquiry', value: 'distributor_franchise_inquiry' },
          { label: 'General inquiry', value: 'general_inquiry' },
        ] },
        { name: 'branchSlug', label: 'WhatsApp destination', type: 'text', maxLength: 80, index: true, admin: { description: 'head-office, or the branch slug when a branch WhatsApp option was selected.' } },
      ],
    },
    { name: 'visitorHash', type: 'text', index: true, admin: { readOnly: true, description: 'Daily SHA-256 hash of IP, browser and secret. Raw IP is never retained.' } },
  ],
  timestamps: true,
}
