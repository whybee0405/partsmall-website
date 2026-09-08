import { cache } from 'react'
import { getPayloadClient } from './client'
import { getCategory } from './categories'
import type { PartType } from '@/lib/data/catalogue'

type PartTypeDoc = {
  slug: string
  label: string
  category: string | { slug: string } | null
  singular: string
  summary: string
  role: string
  symptoms?: { text: string }[] | null
  interval: string
  checks?: { text: string }[] | null
  faqs?: { q: string; a: string }[] | null
}

/** Reshaped back to a slug-string `category`, matching the static PartType type. */
function toPartType(doc: PartTypeDoc): PartType {
  const category = typeof doc.category === 'object' ? (doc.category?.slug ?? '') : (doc.category ?? '')
  return {
    slug: doc.slug,
    label: doc.label,
    category,
    singular: doc.singular,
    summary: doc.summary,
    role: doc.role,
    symptoms: (doc.symptoms ?? []).map((row) => row.text),
    interval: doc.interval,
    checks: (doc.checks ?? []).map((row) => row.text),
    faqs: (doc.faqs ?? []).map((f) => ({ q: f.q, a: f.a })),
  }
}

export const getAllPartTypes = cache(async (): Promise<PartType[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'part-types',
    sort: 'label',
    depth: 1,
    limit: 0,
  })
  return res.docs.map((d) => toPartType(d as unknown as PartTypeDoc))
})

export async function getPartType(slug: string): Promise<PartType | undefined> {
  const types = await getAllPartTypes()
  return types.find((t) => t.slug === slug)
}

export async function typesInCategory(categorySlug: string): Promise<PartType[]> {
  const types = await getAllPartTypes()
  return types.filter((t) => t.category === categorySlug)
}

export async function categoryOfType(typeSlug: string) {
  const type = await getPartType(typeSlug)
  return type ? getCategory(type.category) : undefined
}
