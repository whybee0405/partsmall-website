import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'tier', 'order'],
    group: 'Catalogue',
    description:
      'The eight Parts-Mall brands currently carried. Upload an official vector mark to replace the typographic plate the site renders by default.',
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
          admin: { width: '40%' },
        },
      ],
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'private',
      options: [
        { label: 'Parts-Mall private brand', value: 'private' },
        { label: 'OEM and genuine', value: 'oem' },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      required: true,
      admin: { description: 'One line describing what the line covers.' },
    },
    {
      name: 'mark',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Official SVG or PNG logo. Until one is supplied the site renders a typographic plate rather than inventing a mark.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
