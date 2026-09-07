import type { MetadataRoute } from 'next'
import { BRANCHES } from '@/lib/data/branches'
import { CATEGORIES, PART_TYPES } from '@/lib/data/catalogue'
import { MAKES, MODELS, allFitments } from '@/lib/data/vehicles'
import { GUIDES } from '@/lib/data/company'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://partsmall.co.za'

/**
 * Priorities reflect commercial intent rather than depth. The model-by-part
 * intersection pages are the deepest in the tree and among the most valuable,
 * because they match how people actually search: make, model, year, part.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

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
  ]

  return [
    ...staticRoutes,

    // Parts axis.
    ...CATEGORIES.map((c) => ({
      url: `${base}/parts/${c.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),
    ...PART_TYPES.map((t) => ({
      url: `${base}/parts/${t.category}/${t.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),

    // Vehicle axis.
    ...MAKES.map((mk) => ({
      url: `${base}/vehicles/${mk.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),
    ...MODELS.map((mo) => ({
      url: `${base}/vehicles/${mo.make}/${mo.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),

    // The intersection pages. These carry the highest commercial intent.
    ...allFitments().map((f) => ({
      url: `${base}/vehicles/${f.make}/${f.model}/${f.partType}`,
      priority: 0.9,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),

    // Branch pages rank locally.
    ...BRANCHES.map((b) => ({
      url: `${base}/branches/${b.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),

    ...GUIDES.map((g) => ({
      url: `${base}/blog/${g.slug}`,
      priority: 0.6,
      changeFrequency: 'yearly' as const,
      lastModified: new Date(g.date),
    })),
  ]
}
