/**
 * Seeds the CMS from the canonical data files.
 *
 * Safe to re-run: every record is matched on its slug and updated rather than
 * duplicated, so this doubles as a way to push corrections.
 *
 * Run with: npm run seed
 */
import './load-env' // must stay first: populates env before the config loads
import { getPayload } from 'payload'
import config from '../payload.config'
import { BRANCHES } from '../lib/data/branches'
import { CATEGORIES, PART_TYPES, BRANDS } from '../lib/data/catalogue'
import { MAKES, MODELS } from '../lib/data/vehicles'
import { COMPANY, CORPORATE_FACTS, TIMELINE, GUIDES } from '../lib/data/company'

type Payload = Awaited<ReturnType<typeof getPayload>>
type Slugged =
  | 'branches'
  | 'categories'
  | 'part-types'
  | 'makes'
  | 'models'
  | 'brands'
  | 'guides'

async function upsert(
  payload: Payload,
  collection: Slugged,
  slug: string,
  data: Record<string, unknown>,
  extraWhere: Record<string, unknown> = {},
) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug }, ...extraWhere },
    limit: 1,
  })

  if (existing.docs.length) {
    await payload.update({ collection, id: existing.docs[0].id, data: data as never })
    return { result: 'updated' as const, id: existing.docs[0].id }
  }

  const created = await payload.create({ collection, data: data as never })
  return { result: 'created' as const, id: created.id }
}

async function main() {
  const payload = await getPayload({ config })
  const tally = { created: 0, updated: 0 }
  const count = (r: 'created' | 'updated') => {
    if (r === 'created') tally.created++
    else tally.updated++
  }

  console.log('Seeding branches...')
  for (const b of BRANCHES) {
    const { result } = await upsert(payload, 'branches', b.slug, {
      name: b.name,
      slug: b.slug,
      province: b.province,
      country: b.country,
      address: b.address,
      phone: b.phone,
      email: b.email,
      hours: b.hours,
      lat: b.lat,
      lng: b.lng,
      active: true,
    })
    count(result)
  }

  console.log('Seeding categories...')
  const categoryIds = new Map<string, number | string>()
  for (const [i, c] of CATEGORIES.entries()) {
    const { result, id } = await upsert(payload, 'categories', c.slug, {
      label: c.label,
      slug: c.slug,
      blurb: c.blurb,
      summary: c.summary,
      intro: c.intro.map((text) => ({ text })),
      faqs: c.faqs.map((f) => ({ q: f.q, a: f.a })),
      icon: c.icon,
      order: i,
    })
    count(result)
    categoryIds.set(c.slug, id)
  }

  console.log('Seeding part types...')
  const partTypeIds = new Map<string, number | string>()
  for (const t of PART_TYPES) {
    const categoryId = categoryIds.get(t.category)
    if (!categoryId) {
      console.warn(`  skipped ${t.slug}: category ${t.category} missing`)
      continue
    }
    const { result, id } = await upsert(payload, 'part-types', t.slug, {
      label: t.label,
      slug: t.slug,
      category: categoryId,
      singular: t.singular,
      summary: t.summary,
      role: t.role,
      symptoms: t.symptoms.map((text) => ({ text })),
      interval: t.interval,
      checks: t.checks.map((text) => ({ text })),
      faqs: t.faqs.map((f) => ({ q: f.q, a: f.a })),
    })
    count(result)
    partTypeIds.set(t.slug, id)
  }

  console.log('Seeding makes...')
  const makeIds = new Map<string, number | string>()
  for (const [i, mk] of MAKES.entries()) {
    const { result, id } = await upsert(payload, 'makes', mk.slug, {
      label: mk.label,
      slug: mk.slug,
      summary: mk.summary,
      intro: mk.intro.map((text) => ({ text })),
      order: i,
    })
    count(result)
    makeIds.set(mk.slug, id)
  }

  console.log('Seeding models...')
  for (const mo of MODELS) {
    const makeId = makeIds.get(mo.make)
    if (!makeId) {
      console.warn(`  skipped ${mo.slug}: make ${mo.make} missing`)
      continue
    }
    const parts = mo.parts
      .map((s) => partTypeIds.get(s))
      .filter((x): x is number | string => x !== undefined)

    // Model slugs are only unique within a make, so match on both.
    const { result } = await upsert(
      payload,
      'models',
      mo.slug,
      {
        label: mo.label,
        slug: mo.slug,
        make: makeId,
        body: mo.body,
        summary: mo.summary,
        generations: mo.generations.map((g) => ({
          years: g.years,
          engines: g.engines,
          note: g.note,
        })),
        parts,
        note: mo.note,
        partNotes: Object.entries(mo.partNotes ?? {})
          .map(([slug, note]) => ({ partType: partTypeIds.get(slug), note }))
          .filter((x) => x.partType !== undefined),
      },
      { make: { equals: makeId } },
    )
    count(result)
  }

  console.log('Seeding brands...')
  for (const [i, b] of BRANDS.entries()) {
    const { result } = await upsert(payload, 'brands', b.slug, {
      label: b.label,
      slug: b.slug,
      tier: b.tier,
      note: b.note,
      order: i,
    })
    count(result)
  }

  console.log('Seeding guides...')
  for (const g of GUIDES) {
    const { result } = await upsert(payload, 'guides', g.slug, {
      title: g.title,
      slug: g.slug,
      excerpt: g.excerpt,
      category: g.category,
      publishedAt: g.date,
      // Lexical expects a document shape, so paragraphs are wrapped here.
      body: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: g.body.map((text) => ({
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr' as const,
            children: [
              { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
            ],
          })),
        },
      },
    })
    count(result)
  }

  console.log('Seeding site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      headOfficeName: COMPANY.headOffice.name,
      email: COMPANY.headOffice.email,
      address: COMPANY.headOffice.address.join('\n'),
      mapQuery: COMPANY.headOffice.mapQuery,
      hours: COMPANY.headOffice.hours,
      corporateFacts: CORPORATE_FACTS.map((f) => ({
        value: f.value,
        label: f.label,
        note: f.note,
      })),
      timeline: TIMELINE.map((t) => ({ year: t.year, event: t.event })),
      socials: COMPANY.socials.map((s) => ({ label: s.label, url: s.url })),
      enquiryEmail: process.env.ENQUIRY_TO_EMAIL || COMPANY.headOffice.email,
    } as never,
  })

  console.log(
    `\nDone. ${tally.created} records created, ${tally.updated} updated.\n` +
      `Open http://localhost:3000/admin to add photography and edit copy.`,
  )
  process.exit(0)
}

main().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
