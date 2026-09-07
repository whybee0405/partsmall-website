import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'System' },
  access: { read: () => true },
  upload: {
    staticDir: 'public/media',
    // Sized for the layouts this site actually uses, so the browser never
    // downloads more pixels than it paints.
    imageSizes: [
      { name: 'thumb', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800 },
      { name: 'wide', width: 1600 },
      { name: 'hero', width: 2560 },
    ],
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what is in the picture, for screen readers and for search. "Counter team checking a part number at the Boksburg branch", not "image".',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photographer credit, if one is required.' },
    },
  ],
}
