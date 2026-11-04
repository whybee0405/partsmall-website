import { cache } from 'react'
import { getCmsClient } from './client'
import type { Make } from '@/lib/data/vehicles'

function toMake(doc: { slug: string; label: string; summary: string; intro?: { text: string }[] | null }): Make {
  return {
    slug: doc.slug,
    label: doc.label,
    summary: doc.summary,
    intro: (doc.intro ?? []).map((row) => row.text),
  }
}

export const getAllMakes = cache(async (): Promise<Make[]> => {
  const cms = getCmsClient()
  const res = await cms.find({
    collection: 'makes',
    sort: 'order',
    depth: 0,
    limit: 0,
  })
  return res.docs.map((d) => toMake(d as never))
})

export async function getMake(slug: string): Promise<Make | undefined> {
  const makes = await getAllMakes()
  return makes.find((m) => m.slug === slug)
}
