import { getPayload } from 'payload'
import config from '@payload-config'

const DAY_MS = 24 * 60 * 60 * 1000

async function countSince(payload: Awaited<ReturnType<typeof getPayload>>, type: 'page_view' | 'form_submit' | 'whatsapp_click', sinceMs: number) {
  const result = await payload.count({
    collection: 'analytics-events',
    overrideAccess: true,
    where: { and: [{ type: { equals: type } }, { createdAt: { greater_than: new Date(sinceMs).toISOString() } }] },
  })
  return result.totalDocs
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{ flex: '1 1 140px', padding: '16px 18px', borderRadius: 6, background: 'var(--theme-elevation-50)', border: '1px solid var(--theme-elevation-150)' }}>
      <div style={{ fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--theme-elevation-500)' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4, color: accent ? 'var(--theme-success-500)' : 'var(--theme-text)' }}>{value.toLocaleString()}</div>
    </div>
  )
}

export async function AnalyticsDashboard() {
  const payload = await getPayload({ config })
  const now = Date.now()
  const [pv1d, pv7d, pv30d, enquiries1d, enquiries7d, enquiries30d, whatsapp1d, whatsapp7d, whatsapp30d] = await Promise.all([
    countSince(payload, 'page_view', now - DAY_MS), countSince(payload, 'page_view', now - 7 * DAY_MS), countSince(payload, 'page_view', now - 30 * DAY_MS),
    countSince(payload, 'form_submit', now - DAY_MS), countSince(payload, 'form_submit', now - 7 * DAY_MS), countSince(payload, 'form_submit', now - 30 * DAY_MS),
    countSince(payload, 'whatsapp_click', now - DAY_MS), countSince(payload, 'whatsapp_click', now - 7 * DAY_MS), countSince(payload, 'whatsapp_click', now - 30 * DAY_MS),
  ])
  const recent = await payload.find({
    collection: 'analytics-events', overrideAccess: true,
    where: { and: [{ type: { equals: 'page_view' } }, { createdAt: { greater_than: new Date(now - 30 * DAY_MS).toISOString() } }] },
    limit: 5000, depth: 0, select: { path: true, createdAt: true }, sort: '-createdAt',
  })
  const byPath = new Map<string, number>()
  const byDay = new Map<string, number>()
  for (const doc of recent.docs as Array<{ path?: string; createdAt: string }>) {
    const path = doc.path || '/'
    byPath.set(path, (byPath.get(path) ?? 0) + 1)
    const day = doc.createdAt.slice(0, 10)
    byDay.set(day, (byDay.get(day) ?? 0) + 1)
  }
  const topPaths = [...byPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now - (13 - i) * DAY_MS).toISOString().slice(0, 10)
    return { day, count: byDay.get(day) ?? 0 }
  })
  const maxDay = Math.max(1, ...last14.map((item) => item.count))

  return (
    <div style={{ marginBottom: 32, padding: '20px 24px', border: '1px solid var(--theme-elevation-150)', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ margin: '0 0 4px' }}>Analytics</h3>
        <a href="/admin/analytics" style={{ fontSize: 13, color: 'var(--theme-success-500)' }}>Bounce rate, engagement, page report, CSV export →</a>
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--theme-elevation-500)' }}>First-party and consent-gated. Rolling windows from now, not calendar days.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <Stat label="Page views · 24h" value={pv1d} /><Stat label="Page views · 7d" value={pv7d} /><Stat label="Page views · 30d" value={pv30d} />
        <Stat label="Enquiries · 24h" value={enquiries1d} accent /><Stat label="Enquiries · 7d" value={enquiries7d} accent /><Stat label="Enquiries · 30d" value={enquiries30d} accent />
        <Stat label="WhatsApp clicks · 24h" value={whatsapp1d} accent /><Stat label="WhatsApp clicks · 7d" value={whatsapp7d} accent /><Stat label="WhatsApp clicks · 30d" value={whatsapp30d} accent />
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px', minWidth: 280 }}>
          <h4 style={{ margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--theme-elevation-500)' }}>Top pages · 30d</h4>
          {topPaths.length === 0 ? <p style={{ fontSize: 13, color: 'var(--theme-elevation-500)' }}>No page views recorded yet.</p> : <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}><tbody>{topPaths.map(([path, count]) => <tr key={path} style={{ borderTop: '1px solid var(--theme-elevation-150)' }}><td style={{ padding: '6px 0', fontFamily: 'monospace' }}>{path}</td><td style={{ padding: '6px 0', textAlign: 'right', color: 'var(--theme-elevation-500)' }}>{count}</td></tr>)}</tbody></table>}
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 280 }}>
          <h4 style={{ margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--theme-elevation-500)' }}>Page views · last 14 days</h4>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>{last14.map(({ day, count }) => <div key={day} title={`${day}: ${count}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}><div style={{ width: '100%', height: `${Math.max(2, (count / maxDay) * 64)}px`, background: count > 0 ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)', borderRadius: 2 }} /></div>)}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--theme-elevation-500)' }}><span>{last14[0].day}</span><span>{last14.at(-1)?.day}</span></div>
        </div>
      </div>
    </div>
  )
}
