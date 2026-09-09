import { cache } from 'react'
import { getPayloadClient } from './client'
import type { Category } from '@/lib/data/catalogue'

type CategoryDoc = {
  slug: string
  label: string
  icon: string
  image?: string | { url?: string | null } | null
  blurb: string
  summary: string
  intro?: { text: string }[] | null
  faqs?: { q: string; a: string }[] | null
}

/**
 * PartTypes is still static until it migrates alongside this same phase (see
 * payload/partTypes.ts). A live Category is reshaped back into the same
 * shape the static Category type used — `image` as a plain URL string, not
 * the populated Media relationship — so nothing downstream needs to change
 * beyond "await this instead of the static const."
 */
function toCategory(doc: CategoryDoc): Category {
  const image = typeof doc.image === 'object' ? (doc.image?.url ?? '') : (doc.image ?? '')
  return {
    slug: doc.slug,
    label: doc.label,
    icon: doc.icon,
    image,
    blurb: doc.blurb,
    summary: doc.summary,
    intro: (doc.intro ?? []).map((row) => row.text),
    faqs: (doc.faqs ?? []).map((f) => ({ q: f.q, a: f.a })),
  }
}

export const getAllCategories = cache(async (): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'categories',
    sort: 'order',
    depth: 1,
    limit: 0,
  })
  return res.docs.map((d) => toCategory(d as unknown as CategoryDoc))
})

export async function getCategory(slug: string): Promise<Category | undefined> {
  const categories = await getAllCategories()
  return categories.find((c) => c.slug === slug)
}
