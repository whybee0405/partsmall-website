import { CLOUDIA_URL } from './client'

/**
 * Recorded views per blog post, from CloudIA analytics.
 *
 * Read through a read-only analytics share link (CloudIA: Analytics → Share), whose token stays on
 * this server in CLOUDIA_ANALYTICS_SHARE_TOKEN. One `pages` report filtered to /blog/ answers every
 * post, so it is fetched at most once a minute (share links allow 60 requests a minute) and shared
 * by all requests in that window. A report covers at most 366 days, so all-time totals are summed
 * year by year from the first recorded analytics (September 2026).
 *
 * Counts page views of the article itself (with or without a trailing slash), not the blog index,
 * as the Payload-era count did. Returns null when analytics cannot be read, so the page can leave
 * the count out instead of showing a wrong number.
 */
const FIRST_DAY = '2026-09-01'
const DAY_MS = 24 * 60 * 60 * 1000
const TTL_MS = 60 * 1000

type PagesReport = { pages: { path: string; views: number }[] }

let cached: { at: number; views: Map<string, number> } | null = null
let pending: Promise<Map<string, number> | null> | null = null

function yearRanges(today: string) {
  const ranges: { from: string; to: string }[] = []
  for (let start = Date.parse(FIRST_DAY); start <= Date.parse(today); start += 366 * DAY_MS) {
    const end = Math.min(start + 365 * DAY_MS, Date.parse(today))
    ranges.push({
      from: new Date(start).toISOString().slice(0, 10),
      to: new Date(end).toISOString().slice(0, 10),
    })
  }
  return ranges
}

async function load(): Promise<Map<string, number> | null> {
  const token = process.env.CLOUDIA_ANALYTICS_SHARE_TOKEN
  if (!token) return null
  const views = new Map<string, number>()
  for (const { from, to } of yearRanges(new Date().toISOString().slice(0, 10))) {
    const query = new URLSearchParams({ from, to, search: '/blog/', limit: '200' })
    const response = await fetch(
      `${CLOUDIA_URL}/api/public/v1/analytics/share/${encodeURIComponent(token)}/pages?${query}`,
      { cache: 'no-store', signal: AbortSignal.timeout(4000) },
    )
    if (!response.ok) throw new Error(`analytics share returned ${response.status}`)
    const report = (await response.json()) as PagesReport
    for (const page of report.pages) {
      const path = page.path.replace(/\/$/, '')
      views.set(path, (views.get(path) ?? 0) + page.views)
    }
  }
  return views
}

async function blogViewTable(): Promise<Map<string, number> | null> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.views
  pending ??= load()
    .then((views) => {
      if (views) cached = { at: Date.now(), views }
      return views
    })
    .catch((error) => {
      console.error('Blog view counts unavailable:', error)
      // Serve the last good numbers rather than none while CloudIA is unreachable.
      return cached?.views ?? null
    })
    .finally(() => {
      pending = null
    })
  return pending
}

export async function countBlogViews(slug: string): Promise<number | null> {
  const table = await blogViewTable()
  return table ? (table.get(`/blog/${slug}`) ?? 0) : null
}
