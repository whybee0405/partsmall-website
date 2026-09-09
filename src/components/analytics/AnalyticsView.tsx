import type { CSSProperties } from 'react'
import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { getAllBranches } from '@/lib/payload/branches'

type EventType = 'page_view' | 'page_exit' | 'form_submit' | 'whatsapp_click'
type Row = { type: EventType; path: string; sessionId?: string; duration?: number | null; createdAt: string; visitorHash?: string; referrer?: string | null; whatsappTopic?: 'part_inquiry' | 'distributor_franchise_inquiry' | 'general_inquiry'; branchSlug?: string | null }
type Params = Record<string, string | string[] | undefined>
const DAY = 86_400_000

function value(params: Params | undefined, key: string) { const item = params?.[key]; return typeof item === 'string' ? item : '' }
function dateInput(date: Date) { return date.toISOString().slice(0, 10) }
function validDate(text: string) { return /^\d{4}-\d{2}-\d{2}$/.test(text) && Number.isFinite(Date.parse(`${text}T00:00:00.000Z`)) }
function startOfDay(text: string) { return new Date(`${text}T00:00:00.000Z`) }
function endOfDay(text: string) { return new Date(`${text}T23:59:59.999Z`) }
function fmtPct(value: number) { return Number.isFinite(value) ? `${Math.round(value * 100)}%` : '—' }
function fmtDuration(seconds: number) { return !Number.isFinite(seconds) || seconds <= 0 ? '—' : seconds < 60 ? `${Math.round(seconds)}s` : `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s` }
function labelFor(topic: string) { return ({ part_inquiry: 'Part inquiry', distributor_franchise_inquiry: 'Distributor / franchise', general_inquiry: 'General inquiry' } as Record<string, string>)[topic] ?? topic }

function Stat({ label, value, change }: { label: string; value: string; change?: number }) {
  const delta = change == null ? null : `${change > 0 ? '+' : ''}${change.toFixed(0)}% vs prior period`
  return <div style={{ flex: '1 1 158px', padding: '16px 18px', borderRadius: 6, background: 'var(--theme-elevation-50)', border: '1px solid var(--theme-elevation-150)' }}><div style={{ fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--theme-elevation-500)' }}>{label}</div><div style={{ fontSize: 27, fontWeight: 650, marginTop: 4 }}>{value}</div>{delta && <div style={{ marginTop: 3, fontSize: 12, color: (change ?? 0) >= 0 ? 'var(--theme-success-500)' : 'var(--theme-error-500)' }}>{delta}</div>}</div>
}

function countBy<T extends string>(rows: Row[], key: (row: Row) => T) { const result = new Map<T, number>(); for (const row of rows) result.set(key(row), (result.get(key(row)) ?? 0) + 1); return [...result.entries()].sort((a, b) => b[1] - a[1]) }

export async function AnalyticsView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, locale, permissions, visibleEntities } = initPageResult
  const templateProps = {
    i18n: req.i18n,
    locale,
    params,
    payload: req.payload,
    permissions,
    searchParams,
    user: req.user || undefined,
    visibleEntities,
  }

  if (!req.user) {
    return <DefaultTemplate {...templateProps}><Gutter><div style={{ padding: '24px 0 32px' }}>You must be logged in to view analytics reports.</div></Gutter></DefaultTemplate>
  }

  const payload = req.payload
  const now = new Date()
  const branches = await getAllBranches()
  const branchName = (slug: string) => branches.find((branch) => branch.slug === slug)?.name ?? slug
  const preset = value(searchParams, 'preset')
  const presetDays = preset === 'daily' ? 1 : preset === 'weekly' ? 7 : preset === 'monthly' ? 30 : 30
  const defaultEnd = dateInput(now)
  const defaultStart = dateInput(new Date(now.getTime() - (presetDays - 1) * DAY))
  const start = validDate(value(searchParams, 'start')) ? value(searchParams, 'start') : defaultStart
  const end = validDate(value(searchParams, 'end')) && value(searchParams, 'end') >= start ? value(searchParams, 'end') : defaultEnd
  const periodStart = startOfDay(start)
  const periodEnd = endOfDay(end)
  const periodMs = periodEnd.getTime() - periodStart.getTime() + 1
  const previousStart = new Date(periodStart.getTime() - periodMs)
  const pathFilter = value(searchParams, 'path').trim()
  const sourceFilter = value(searchParams, 'source').trim()
  const destinationFilter = value(searchParams, 'destination').trim()
  const grouping = ['day', 'week', 'month'].includes(value(searchParams, 'group')) ? value(searchParams, 'group') : 'day'
  const queryStart = previousStart.toISOString()
  const all: Row[] = []
  let page = 1
  for (;;) {
    const result = await payload.find({ collection: 'analytics-events', overrideAccess: true, where: { createdAt: { greater_than_equal: queryStart } }, sort: 'createdAt', limit: 2000, page, depth: 0 })
    all.push(...(result.docs as Row[]))
    if (!result.hasNextPage || all.length >= 20000) break
    page += 1
  }
  const matches = (row: Row) => (!pathFilter || row.path.includes(pathFilter)) && (!sourceFilter || (row.referrer || 'Direct / unknown') === sourceFilter) && (!destinationFilter || (row.branchSlug || 'head-office') === destinationFilter)
  const current = all.filter((row) => new Date(row.createdAt) >= periodStart && new Date(row.createdAt) <= periodEnd && matches(row))
  const prior = all.filter((row) => new Date(row.createdAt) >= previousStart && new Date(row.createdAt) < periodStart && matches(row))
  const views = current.filter((row) => row.type === 'page_view')
  const priorViews = prior.filter((row) => row.type === 'page_view')
  const sessions = new Set(views.map((row) => row.sessionId || `${row.path}-${row.createdAt}`))
  const priorSessions = new Set(priorViews.map((row) => row.sessionId || `${row.path}-${row.createdAt}`))
  const enquiries = current.filter((row) => row.type === 'form_submit')
  const priorEnquiries = prior.filter((row) => row.type === 'form_submit')
  const whatsapp = current.filter((row) => row.type === 'whatsapp_click')
  const priorWhatsApp = prior.filter((row) => row.type === 'whatsapp_click')
  const exits = current.filter((row) => row.type === 'page_exit' && (row.duration ?? 0) > 0).map((row) => row.duration!)
  const averageTime = exits.length ? exits.reduce((sum, duration) => sum + duration, 0) / exits.length : NaN
  const pctChange = (next: number, before: number) => before ? ((next - before) / before) * 100 : undefined
  const destinationOptions = [...new Set(all.filter((row) => row.type === 'whatsapp_click').map((row) => row.branchSlug || 'head-office'))].sort()
  const sourceOptions = [...new Set(all.map((row) => row.referrer || 'Direct / unknown'))].sort()
  const byPath = countBy(views, (row) => row.path).slice(0, 50)
  const bySource = countBy(views, (row) => row.referrer || 'Direct / unknown').slice(0, 12)
  const byWhatsAppTopic = countBy(whatsapp, (row) => row.whatsappTopic || 'unknown')
  const bucket = (date: string) => {
    const item = new Date(date)
    if (grouping === 'month') return item.toISOString().slice(0, 7)
    if (grouping === 'week') { const monday = new Date(Date.UTC(item.getUTCFullYear(), item.getUTCMonth(), item.getUTCDate() - ((item.getUTCDay() + 6) % 7))); return monday.toISOString().slice(0, 10) }
    return item.toISOString().slice(0, 10)
  }
  const timeSeries = countBy(views, (row) => bucket(row.createdAt)).sort((a, b) => a[0].localeCompare(b[0]))
  const qs = (overrides: Record<string, string>) => `?${new URLSearchParams({ start, end, group: grouping, ...(pathFilter ? { path: pathFilter } : {}), ...(sourceFilter ? { source: sourceFilter } : {}), ...(destinationFilter ? { destination: destinationFilter } : {}), ...overrides }).toString()}`
  const exportHref = `/api/analytics-events/export?${new URLSearchParams({ start, end }).toString()}`
  const control: CSSProperties = { padding: '7px 9px', borderRadius: 4, border: '1px solid var(--theme-elevation-150)', background: 'var(--theme-input-bg)', color: 'var(--theme-text)', fontSize: 13 }
  const reportLink: CSSProperties = { ...control, textDecoration: 'none', display: 'inline-block', background: 'var(--theme-elevation-50)' }

  return <DefaultTemplate {...templateProps}><Gutter><div style={{ padding: '24px 0 32px' }}>
    <h1 style={{ marginBottom: 4 }}>Analytics workspace</h1><p style={{ color: 'var(--theme-elevation-500)', marginTop: 0, marginBottom: 20 }}>Flexible first-party reporting. Visitor identifiers rotate daily and never identify a person across visits.</p>
    <div style={{ border: '1px solid var(--theme-elevation-150)', borderRadius: 6, padding: 16, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}><strong>Automatic report views</strong><span style={{ color: 'var(--theme-elevation-500)', fontSize: 13 }}>Always recalculated when opened</span></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}><a href="?preset=daily" style={reportLink}>Daily operations</a><a href="?preset=weekly" style={reportLink}>Weekly pipeline</a><a href="?preset=monthly" style={reportLink}>Monthly executive</a></div>
    </div>
    <form method="get" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end', marginBottom: 22 }}>
      <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>Start date<input name="start" type="date" defaultValue={start} style={control} /></label>
      <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>End date<input name="end" type="date" defaultValue={end} style={control} /></label>
      <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>Group data<select name="group" defaultValue={grouping} style={control}><option value="day">Daily</option><option value="week">Weekly</option><option value="month">Monthly</option></select></label>
      <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>Path<input name="path" defaultValue={pathFilter} placeholder="contains…" style={control} /></label>
      <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>Traffic source<select name="source" defaultValue={sourceFilter} style={control}><option value="">All sources</option>{sourceOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>WhatsApp destination<select name="destination" defaultValue={destinationFilter} style={control}><option value="">All destinations</option>{destinationOptions.map((option) => <option key={option} value={option}>{option === 'head-office' ? 'Head office' : branchName(option)}</option>)}</select></label>
      <button type="submit" style={{ ...control, background: 'var(--theme-success-500)', color: 'var(--theme-elevation-0)', fontWeight: 600 }}>Apply report</button><a href={exportHref} style={{ ...reportLink, fontWeight: 600 }}>Export selected range</a>
    </form>
    <p style={{ fontSize: 13, color: 'var(--theme-elevation-500)', marginTop: -8, marginBottom: 18 }}>{start} to {end}, compared with the immediately preceding {Math.round(periodMs / DAY)} day period.</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 30 }}>
      <Stat label="Page views" value={views.length.toLocaleString()} change={pctChange(views.length, priorViews.length)} /><Stat label="Sessions" value={sessions.size.toLocaleString()} change={pctChange(sessions.size, priorSessions.size)} /><Stat label="Unique visitors" value={new Set(current.map((row) => row.visitorHash).filter(Boolean)).size.toLocaleString()} /><Stat label="Enquiries" value={enquiries.length.toLocaleString()} change={pctChange(enquiries.length, priorEnquiries.length)} /><Stat label="WhatsApp clicks" value={whatsapp.length.toLocaleString()} change={pctChange(whatsapp.length, priorWhatsApp.length)} /><Stat label="Conversion" value={fmtPct(sessions.size ? (enquiries.length + whatsapp.length) / sessions.size : NaN)} /><Stat label="Avg time on page" value={fmtDuration(averageTime)} />
    </div>
    <h2 style={{ fontSize: 17, marginBottom: 10 }}>Traffic over time</h2>
    {timeSeries.length ? <DataTable headings={[grouping === 'day' ? 'Day' : grouping === 'week' ? 'Week starting' : 'Month', 'Page views']} rows={timeSeries.map(([period, count]) => [period, count.toLocaleString()])} /> : <Empty />}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, marginTop: 28 }}>
      <section><h2 style={{ fontSize: 17, marginBottom: 10 }}>Top pages</h2>{byPath.length ? <DataTable headings={['Path', 'Views']} rows={byPath.map(([path, count]) => [path, count.toLocaleString()])} monoFirst /> : <Empty />}</section>
      <section><h2 style={{ fontSize: 17, marginBottom: 10 }}>Traffic sources</h2>{bySource.length ? <DataTable headings={['Source', 'Views']} rows={bySource.map(([source, count]) => [source, count.toLocaleString()])} /> : <Empty />}</section>
    </div>
    <section style={{ marginTop: 28 }}><h2 style={{ fontSize: 17, marginBottom: 10 }}>WhatsApp inquiry mix</h2>{byWhatsAppTopic.length ? <DataTable headings={['Inquiry type', 'Clicks']} rows={byWhatsAppTopic.map(([topic, count]) => [labelFor(topic), count.toLocaleString()])} /> : <Empty message="No WhatsApp inquiry selections in this range." />}</section>
  </div></Gutter></DefaultTemplate>
}

function Empty({ message = 'No matching events in this range.' }: { message?: string }) { return <p style={{ color: 'var(--theme-elevation-500)', fontSize: 13 }}>{message}</p> }
function DataTable({ headings, rows, monoFirst = false }: { headings: string[]; rows: string[][]; monoFirst?: boolean }) { return <div style={{ overflowX: 'auto', border: '1px solid var(--theme-elevation-150)', borderRadius: 6 }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}><thead><tr style={{ background: 'var(--theme-elevation-50)' }}>{headings.map((heading, index) => <th key={heading} style={{ textAlign: index ? 'right' : 'left', padding: '8px 12px', fontSize: 11, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--theme-elevation-500)' }}>{heading}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.join('|')} style={{ borderTop: '1px solid var(--theme-elevation-150)' }}>{row.map((cell, index) => <td key={index} style={{ padding: '8px 12px', textAlign: index ? 'right' : 'left', fontFamily: monoFirst && index === 0 ? 'monospace' : undefined }}>{cell}</td>)}</tr>)}</tbody></table></div> }
