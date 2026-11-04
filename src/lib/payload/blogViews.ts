import type { Payload } from 'payload'

/** Count recorded article visits, excluding the blog index and other pages. */
export async function countBlogViews(payload: Payload, slug: string, since?: string) {
  const result = await payload.count({
    collection: 'analytics-events',
    overrideAccess: true,
    where: {
      and: [
        { type: { equals: 'page_view' } },
        { path: { in: [`/blog/${slug}`, `/blog/${slug}/`] } },
        ...(since ? [{ createdAt: { greater_than_equal: since } }] : []),
      ],
    },
  })
  return result.totalDocs
}
