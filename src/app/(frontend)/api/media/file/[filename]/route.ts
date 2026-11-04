import { CLOUDIA_URL } from '@/lib/cms/client'

/**
 * CMS media through the site itself.
 *
 * Browsers load /api/media/file/* straight from CloudIA (the proxy sends /api
 * there). next/image, though, fetches local images from this Next server, so
 * branch photos, category images and brand logos reach the optimiser through
 * this route.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  const upstream = await fetch(`${CLOUDIA_URL}/api/media/file/${encodeURIComponent(filename)}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  })
  if (!upstream.ok || !upstream.body) return new Response('Not found', { status: upstream.status === 404 ? 404 : 502 })
  const headers = new Headers()
  for (const name of ['content-type', 'content-length', 'cache-control', 'etag', 'content-security-policy']) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }
  headers.set('X-Content-Type-Options', 'nosniff')
  return new Response(upstream.body, { status: 200, headers })
}
