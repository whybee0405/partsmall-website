import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Branches } from './collections/Branches'
import { Categories } from './collections/Categories'
import { PartTypes } from './collections/PartTypes'
import { Makes } from './collections/Makes'
import { Models } from './collections/Models'
import { Brands } from './collections/Brands'
import { Guides } from './collections/Guides'
import { Enquiries } from './collections/Enquiries'
import { AnalyticsEvents } from './collections/AnalyticsEvents'
import { SiteSettings } from './globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: '@/components/admin/PartsMallLogo#PartsMallLogo',
        Icon: '@/components/admin/PartsMallLogo#PartsMallIcon',
      },
      beforeDashboard: ['@/components/analytics/AnalyticsDashboard#AnalyticsDashboard'],
      afterNavLinks: ['@/components/analytics/AnalyticsNavLink#AnalyticsNavLink'],
      views: {
        analytics: {
          Component: '@/components/analytics/AnalyticsView#AnalyticsView',
          path: '/analytics',
        },
      },
    },
    meta: {
      titleSuffix: ' — Parts-Mall Africa',
    },
  },

  collections: [
    Branches,
    Categories,
    PartTypes,
    Makes,
    Models,
    Brands,
    Guides,
    Enquiries,
    AnalyticsEvents,
    Media,
    Users,
  ],
  globals: [SiteSettings],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // SQLite keeps local setup to zero external services. For production swap
  // this for postgresAdapter from @payloadcms/db-postgres and point
  // DATABASE_URI at your Postgres instance. No other change is required.
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./partsmall.db',
    },
  }),

  sharp,

  upload: {
    limits: { fileSize: 8_000_000 },
  },
})
