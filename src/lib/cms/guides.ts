import { cache } from 'react'
import { CLOUDIA_URL, getCmsClient } from './client'
import type { Faq } from '@/lib/data/catalogue'

/**
 * `body` is Lexical JSON (the CMS's rich text format, the same one Payload stored), rendered by
 * components/RichText.tsx (see blog/[slug]/page.tsx) — unlike every other migrated collection, this
 * one is NOT reshaped back into the static Guide type's `body: string[]` shape, because that would
 * mean flattening real rich text back into plain paragraphs. `date` is the CMS's `publishedAt`
 * renamed to match the static Guide shape.
 */
export type Author = {
  slug: string
  name: string
  role: string
  bio: string
  photo: string
  profileUrl: string
}

export type LiveGuide = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  /** `lastUpdated`, or the publish date when the post was never revised. */
  updated: string
  image: string
  imageAlt: string
  body: unknown
  /** No CMS field for this — estimated from body word count at read time. */
  readMinutes: number
  reviewer: Author | null
  faqs: Faq[]
  /** Search title and description with their fallbacks applied (title, excerpt). */
  seoTitle: string
  seoDescription: string
  /** Social preview image: `ogImage`, else the post image. */
  ogImage: string
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

type MediaValue = string | { url?: string | null; alt?: string | null } | null | undefined
type AuthorDoc = {
  slug?: string
  name?: string
  role?: string
  bio?: string | null
  photo?: MediaValue
  profileUrl?: string | null
}
type GuideDoc = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt?: string | null
  lastUpdated?: string | null
  updatedAt?: string
  image?: MediaValue
  ogImage?: MediaValue
  body: unknown
  reviewer?: AuthorDoc | string | number | null
  faqs?: { q?: string; a?: string }[] | null
  seoTitle?: string | null
  metaDescription?: string | null
}

const mediaUrl = (value: MediaValue) =>
  typeof value === 'object' && value ? (value.url ?? '') : (value ?? '')
const mediaAlt = (value: MediaValue) =>
  typeof value === 'object' && value ? (value.alt ?? '') : ''

function toAuthor(doc: GuideDoc['reviewer']): Author | null {
  // At depth 0 a relation is only an id; the byline needs the resolved document.
  if (!doc || typeof doc !== 'object' || !doc.name) return null
  return {
    slug: doc.slug ?? '',
    name: doc.name,
    role: doc.role ?? '',
    bio: doc.bio ?? '',
    photo: mediaUrl(doc.photo),
    profileUrl: doc.profileUrl ?? '',
  }
}

function toGuide(doc: GuideDoc): LiveGuide {
  const image = mediaUrl(doc.image)
  // A draft may not have a publish date yet; it gets one when it goes live.
  const date = doc.publishedAt || doc.updatedAt || new Date().toISOString()
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    date,
    updated: doc.lastUpdated || date,
    image,
    imageAlt: mediaAlt(doc.image),
    body: doc.body,
    readMinutes: estimateReadMinutes(doc.body),
    reviewer: toAuthor(doc.reviewer),
    faqs: (doc.faqs ?? [])
      .filter((f): f is Faq => Boolean(f?.q && f?.a))
      .map(({ q, a }) => ({ q, a })),
    seoTitle: doc.seoTitle?.trim() || doc.title,
    seoDescription: doc.metaDescription?.trim() || doc.excerpt,
    ogImage: mediaUrl(doc.ogImage) || image,
  }
}

export const getAllGuides = cache(async (): Promise<LiveGuide[]> => {
  const cms = getCmsClient()
  const res = await cms.find({
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

/**
 * The current draft behind a CMS preview link (`/blog/<slug>?cloudia-preview=<token>`), or
 * undefined when the token is missing, expired or belongs to another post.
 */
export const getGuidePreview = cache(
  async (slug: string, token: string | undefined): Promise<LiveGuide | undefined> => {
    if (!token || !/^cld_prv_[\w-]+$/.test(token)) return undefined
    try {
      const response = await fetch(`${CLOUDIA_URL}/api/preview/${encodeURIComponent(token)}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
      })
      if (!response.ok) return undefined
      const preview = (await response.json()) as { collection: string; slug: string; doc?: GuideDoc }
      if (preview.collection !== 'guides' || preview.slug !== slug || !preview.doc) return undefined
      return toGuide(preview.doc)
    } catch {
      return undefined
    }
  },
)
