import type { MetadataRoute } from 'next'
import { getAllBranches } from '@/lib/payload/branches'
import { getAllMakes } from '@/lib/payload/makes'
import { getAllModels, allFitments } from '@/lib/payload/models'
import { getAllCategories } from '@/lib/payload/categories'
import { getAllPartTypes } from '@/lib/payload/partTypes'
import { getAllGuides } from '@/lib/payload/guides'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://partsmall.co.za'

export const dynamic = 'force-dynamic'

/**
 * Priorities reflect commercial intent rather than depth. The model-by-part
 * intersection pages are the deepest in the tree and among the most valuable,
 * because they match how people actually search: make, model, year, part.
 *
 * Every collection listed here is now sourced live from Payload — see the
 * migration plan at magical-dancing-turtle.md.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const [branches, makes, models, fitments, categories, partTypes, guides] = await Promise.all([
    getAllBranches(),
    getAllMakes(),
    getAllModels(),
    allFitments(),
    getAllCategories(),
    getAllPartTypes(),
    getAllGuides(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1, changeFrequency: 'weekly', lastModified: now },
    { url: `${base}/parts`, priority: 0.9, changeFrequency: 'weekly', lastModified: now },
    { url: `${base}/vehicles`, priority: 0.9, changeFrequency: 'weekly', lastModified: now },
    { url: `${base}/branches`, priority: 0.9, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/wholesale`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/faq`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/blog`, priority: 0.7, changeFrequency: 'weekly', lastModified: now },
    { url: `${base}/about`, priority: 0.6, changeFrequency: 'yearly', lastModified: now },
    { url: `${base}/contact`, priority: 0.6, changeFrequency: 'yearly', lastModified: now },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: 'yearly', lastModified: now },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: 'yearly', lastModified: now },
  ]

  return [
    ...staticRoutes,

    // Parts axis.
    ...categories.map((c) => ({
      url: `${base}/parts/${c.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),
    ...partTypes.map((t) => ({
      url: `${base}/parts/${t.category}/${t.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),

    // Vehicle axis.
    ...makes.map((mk) => ({
      url: `${base}/vehicles/${mk.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),
    ...models.map((mo) => ({
      url: `${base}/vehicles/${mo.make}/${mo.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),

    // The intersection pages. These carry the highest commercial intent.
    ...fitments.map((f) => ({
      url: `${base}/vehicles/${f.make}/${f.model}/${f.partType}`,
      priority: 0.9,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),

    // Branch pages rank locally.
    ...branches.map((b) => ({
      url: `${base}/branches/${b.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),

    ...guides.map((g) => ({
      url: `${base}/blog/${g.slug}`,
      priority: 0.6,
      changeFrequency: 'yearly' as const,
      lastModified: new Date(g.date),
    })),
  ]
}
