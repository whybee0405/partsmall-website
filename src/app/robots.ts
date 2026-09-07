import type { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://partsmall.co.za'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The CMS and its API are not search surfaces.
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
