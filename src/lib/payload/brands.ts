import { cache } from 'react'
import { getPayloadClient } from './client'
import type { Brand } from '@/lib/data/catalogue'

type BrandDoc = {
  slug: string
  label: string
  tier: 'private' | 'oem'
  note: string
  mark?: string | { url?: string | null } | null
}

/** Reshaped back to the static shape — `mark` (Payload's field name) becomes `logo` (the static field name). */
function toBrand(doc: BrandDoc): Brand {
  const logo = typeof doc.mark === 'object' ? (doc.mark?.url ?? undefined) : (doc.mark ?? undefined)
  return {
    slug: doc.slug,
    label: doc.label,
    tier: doc.tier,
    note: doc.note,
    logo,
  }
}

export const getAllBrands = cache(async (): Promise<Brand[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'brands',
    sort: 'order',
    depth: 1,
    limit: 0,
  })
  return res.docs.map((d) => toBrand(d as unknown as BrandDoc))
})
