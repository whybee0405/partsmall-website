import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emits .next/standalone so the container ships a self-contained server
  // instead of the whole node_modules tree.
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    // Branch photography is served from the local /media upload dir in dev.
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  // The section was renamed from Guides to Blog; keep old links working.
  async redirects() {
    return [
      { source: '/guides', destination: '/blog', permanent: true },
      { source: '/guides/:slug', destination: '/blog/:slug', permanent: true },
    ]
  },
}

export default withPayload(nextConfig)
