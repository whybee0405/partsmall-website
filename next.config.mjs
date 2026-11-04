/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emits .next/standalone so the container ships a self-contained server
  // instead of the whole node_modules tree.
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    // CMS images (/api/media/file/*) are local paths: the site proxies them
    // from CloudIA CMS, see src/app/(frontend)/api/media/file/[filename]/route.ts.
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

export default nextConfig
