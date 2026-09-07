import type { CollectionConfig } from 'payload'

export const Makes: CollectionConfig = {
  slug: 'makes',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'order'],
    group: 'Vehicles',
    description: 'Vehicle makes. Each publishes a page at /vehicles/[slug].',
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { width: '40%', description: 'URL: /vehicles/your-slug' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Answer-first opening naming the make and the models covered. Used as the meta description.',
      },
    },
    {
      name: 'intro',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
