/**
 * Backfills Payload's Media library from the static image paths that were
 * never seeded (Categories.image, and — in their own later runs — Brands.mark
 * and Guides.image). Payload's fields are upload relationships; the static
 * data only ever had plain file paths into public/, so seed.ts always left
 * them blank. Safe to re-run: any collection doc that already has an image
 * is skipped rather than getting a duplicate upload.
 *
 * Run with: npx tsx src/scripts/backfill-media.ts
 */
import './load-env' // must stay first: populates env before the config loads
import { getPayload } from 'payload'
import fs from 'node:fs/promises'
import path from 'node:path'
import config from '../payload.config'
import { CATEGORIES, BRANDS } from '../lib/data/catalogue'
import { GUIDES } from '../lib/data/company'

type Payload = Awaited<ReturnType<typeof getPayload>>

const MIME_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

async function uploadImage(payload: Payload, publicPath: string, alt: string) {
  const absolutePath = path.join(process.cwd(), 'public', publicPath)
  const data = await fs.readFile(absolutePath)
  const ext = path.extname(publicPath).toLowerCase()
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: MIME_TYPES[ext] ?? 'application/octet-stream',
      name: path.basename(publicPath),
      size: data.length,
    },
  })
  return media.id
}

async function backfillCategories(payload: Payload) {
  console.log('Backfilling category images...')
  let uploaded = 0
  let skipped = 0

  for (const c of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: c.slug } },
      limit: 1,
    })
    const doc = existing.docs[0]
    if (!doc) {
      console.warn(`  skipped ${c.slug}: no matching category document in Payload`)
      continue
    }
    if (doc.image) {
      console.log(`  ${c.slug}: already has an image, skipping`)
      skipped++
      continue
    }

    const mediaId = await uploadImage(payload, c.image, `${c.label} parts`)
    await payload.update({ collection: 'categories', id: doc.id, data: { image: mediaId } })
    console.log(`  ${c.slug}: uploaded ${c.image} and linked`)
    uploaded++
  }

  console.log(`Categories done. ${uploaded} uploaded, ${skipped} already had an image.`)
}

async function backfillBrands(payload: Payload) {
  console.log('Backfilling brand marks...')
  let uploaded = 0
  let skipped = 0

  for (const b of BRANDS) {
    if (!b.logo) continue // most brands render as a typographic plate by design, not a gap

    const existing = await payload.find({
      collection: 'brands',
      where: { slug: { equals: b.slug } },
      depth: 1,
      limit: 1,
    })
    const doc = existing.docs[0]
    if (!doc) {
      console.warn(`  skipped ${b.slug}: no matching brand document in Payload`)
      continue
    }
    const currentFilename =
      typeof doc.mark === 'object' && doc.mark ? doc.mark.filename : undefined
    if (currentFilename === path.basename(b.logo)) {
      console.log(`  ${b.slug}: already has the current mark, skipping`)
      skipped++
      continue
    }

    const mediaId = await uploadImage(payload, b.logo, `${b.label} logo`)
    await payload.update({ collection: 'brands', id: doc.id, data: { mark: mediaId } })
    console.log(`  ${b.slug}: uploaded ${b.logo} and linked`)
    uploaded++
  }

  console.log(`Brands done. ${uploaded} uploaded, ${skipped} already had a mark.`)
}

async function backfillGuides(payload: Payload) {
  console.log('Backfilling guide images...')
  let uploaded = 0
  let skipped = 0

  for (const g of GUIDES) {
    const existing = await payload.find({
      collection: 'guides',
      where: { slug: { equals: g.slug } },
      limit: 1,
    })
    const doc = existing.docs[0]
    if (!doc) {
      console.warn(`  skipped ${g.slug}: no matching guide document in Payload`)
      continue
    }
    if (doc.image) {
      console.log(`  ${g.slug}: already has an image, skipping`)
      skipped++
      continue
    }

    const mediaId = await uploadImage(payload, g.image, g.imageAlt)
    await payload.update({ collection: 'guides', id: doc.id, data: { image: mediaId } })
    console.log(`  ${g.slug}: uploaded ${g.image} and linked`)
    uploaded++
  }

  console.log(`Guides done. ${uploaded} uploaded, ${skipped} already had an image.`)
}

async function main() {
  const payload = await getPayload({ config })
  await backfillCategories(payload)
  await backfillBrands(payload)
  await backfillGuides(payload)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
