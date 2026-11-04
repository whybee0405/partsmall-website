import { cache } from 'react'
import { getCmsClient } from './client'
import type { Model } from '@/lib/data/vehicles'

type PopulatedModelDoc = {
  slug: string
  /**
   * The page address segment when it differs from `slug`. Model slugs are only unique within a
   * make (Hyundai H-1 and Haval H1 are both /h1) but CMS slugs are unique per model, so a clashing
   * model has a unique slug (haval-h1) and keeps its address here.
   */
  urlSlug?: string | null
  label: string
  body: string
  summary: string
  make: string | { slug: string }
  generations?: { years: string; engines: string; note?: string | null }[] | null
  parts?: (string | { slug: string })[] | null
  note?: string | null
  partNotes?: { partType: string | { slug: string } | null; note: string }[] | null
}

/**
 * Categories/PartTypes are still static data until their own migration
 * phase (see the plan). So a live Model is reshaped back into the exact
 * same slug-keyed shape the static Model type already used — `make` and
 * `parts` as slug strings, `partNotes` as a slug-keyed record — meaning
 * every page that resolves parts via the static getPartType/getCategory
 * needs zero changes beyond "await this instead of the static const."
 */
function toModel(doc: PopulatedModelDoc): Model {
  const make = typeof doc.make === 'object' ? doc.make.slug : doc.make
  const parts = (doc.parts ?? [])
    .map((p) => (typeof p === 'object' ? p.slug : p))
    .filter((slug): slug is string => Boolean(slug))

  const partNoteEntries = (doc.partNotes ?? [])
    .map((pn) => {
      const slug = typeof pn.partType === 'object' ? pn.partType?.slug : pn.partType
      return slug ? ([slug, pn.note] as const) : null
    })
    .filter((entry): entry is readonly [string, string] => entry !== null)

  return {
    slug: doc.urlSlug || doc.slug,
    make,
    label: doc.label,
    body: doc.body,
    summary: doc.summary,
    generations: (doc.generations ?? []).map((g) => ({
      years: g.years,
      engines: g.engines,
      note: g.note ?? undefined,
    })),
    parts,
    note: doc.note ?? undefined,
    partNotes: partNoteEntries.length ? Object.fromEntries(partNoteEntries) : undefined,
  }
}

/**
 * Fetches every model once per request (depth: 1 so make/parts/partNotes
 * relationships come back populated), then every other lookup below filters
 * this same cached array in memory rather than issuing its own query —
 * simplest correct approach at this scale (a few dozen models).
 */
export const getAllModels = cache(async (): Promise<Model[]> => {
  const cms = getCmsClient()
  const res = await cms.find({
    collection: 'models',
    // Payload's Models collection had defaultSort 'label'; the order is stated here so pages list
    // models exactly as before.
    sort: 'label',
    depth: 1,
    limit: 0,
  })
  return res.docs.map((d) => toModel(d as unknown as PopulatedModelDoc))
})

export async function getModel(makeSlug: string, modelSlug: string): Promise<Model | undefined> {
  const models = await getAllModels()
  return models.find((m) => m.make === makeSlug && m.slug === modelSlug)
}

export async function modelsForMake(makeSlug: string): Promise<Model[]> {
  const models = await getAllModels()
  return models.filter((m) => m.make === makeSlug)
}

/** Every model + part-type page that should exist. */
export async function allFitments() {
  const models = await getAllModels()
  return models.flatMap((model) =>
    model.parts.map((partType) => ({
      make: model.make,
      model: model.slug,
      partType,
    })),
  )
}

/** Models that carry a page for a given part type, for cross-linking. */
export async function modelsWithPartType(partTypeSlug: string): Promise<Model[]> {
  const models = await getAllModels()
  return models.filter((m) => m.parts.includes(partTypeSlug))
}
