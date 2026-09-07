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
}

export default withPayload(nextConfig)
