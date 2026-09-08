import { cache } from 'react'
import { getPayloadClient } from './client'

/**
 * `body` is Lexical JSON, rendered with @payloadcms/richtext-lexical/react's
 * <RichText> component (see blog/[slug]/page.tsx) — unlike every other
 * migrated collection, this one is NOT reshaped back into the static Guide
 * type's `body: string[]` shape, because that would mean flattening real
 * rich text back into plain paragraphs. Everything else on this type still
 * matches the static Guide shape field-for-field (aside from `date`, which
 * is Payload's `publishedAt` renamed to match).
 */
export type LiveGuide = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
  imageAlt: string
  body: unknown
  /** No Payload field for this — estimated from body word count at read time. */
  readMinutes: number
}

type LexicalNode = { text?: string; children?: LexicalNode[]; root?: LexicalNode }

function extractText(node: LexicalNode | null | undefined): string {
  if (!node) return ''
  if (node.root) return extractText(node.root)
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) return node.children.map(extractText).join(' ')
  return ''
}

/** Average adult reading speed, rounded up so a 30-second note doesn't read as "0 min". */
function estimateReadMinutes(body: unknown): number {
  const words = extractText(body as LexicalNode)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

type GuideDoc = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  image?: string | { url?: string | null; alt?: string | null } | null
  body: unknown
}

function toGuide(doc: GuideDoc): LiveGuide {
  const image = typeof doc.image === 'object' ? (doc.image?.url ?? '') : (doc.image ?? '')
  const imageAlt = typeof doc.image === 'object' ? (doc.image?.alt ?? '') : ''
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    date: doc.publishedAt,
    image,
    imageAlt,
    body: doc.body,
    readMinutes: estimateReadMinutes(doc.body),
  }
}

export const getAllGuides = cache(async (): Promise<LiveGuide[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'guides',
    sort: '-publishedAt',
    depth: 1,
    limit: 0,
  })
  return res.docs.map((d) => toGuide(d as unknown as GuideDoc))
})

export async function getGuide(slug: string): Promise<LiveGuide | undefined> {
  const guides = await getAllGuides()
  return guides.find((g) => g.slug === slug)
}
