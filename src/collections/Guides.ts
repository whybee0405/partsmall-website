import type { CollectionConfig } from 'payload'

export const Guides: CollectionConfig = {
  slug: 'guides',
  labels: {
    singular: 'Blog Post',
    plural: 'Blog Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Content',
    description:
      'The site’s blog — trade guides and fitment notes. These are the pages that bring workshop searches in, so write them for the person at the car.',
  },
  access: { read: () => true },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Two sentences maximum. Used on the index card and as the search description.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          admin: { width: '50%' },
          options: ['Ordering', 'Fitment', 'Buying', 'Trade', 'Network'].map((c) => ({
            label: c,
            value: c,
          })),
        },
        {
          name: 'publishedAt',
          type: 'date',
          required: true,
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'relatedCategory',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
        description: 'Links the guide back to a catalogue system.',
      },
    },
  ],
}
