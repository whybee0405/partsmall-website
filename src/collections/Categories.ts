import type { CollectionConfig } from 'payload'

const faqField = {
  name: 'faqs',
  type: 'array' as const,
  labels: { singular: 'Question', plural: 'Questions' },
  admin: {
    description:
      'These publish as FAQ structured data, which is how assistants and featured snippets quote the site. Write the answer as a complete sentence that stands on its own.',
  },
  fields: [
    { name: 'q', type: 'text' as const, required: true, label: 'Question' },
    { name: 'a', type: 'textarea' as const, required: true, label: 'Answer' },
  ],
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'order'],
    group: 'Catalogue',
    description:
      'The 13 parts systems. Each one publishes a page at /parts/[slug] listing its part types.',
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
          admin: { width: '40%', description: 'URL: /parts/your-slug' },
        },
      ],
    },
    {
      name: 'blurb',
      type: 'textarea',
      required: true,
      admin: { description: 'One line. Used on the homepage tile and the parts index.' },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'The answer-first opening, one or two sentences. Written so it makes sense quoted on its own, because this is what an answer engine lifts. Also used as the meta description.',
      },
    },
    {
      name: 'intro',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      admin: { description: 'Two or three paragraphs of genuine editorial.' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    faqField,
    {
      name: 'icon',
      type: 'text',
      required: true,
      defaultValue: 'Gear',
      admin: {
        position: 'sidebar',
        description: 'Phosphor icon name, e.g. Disc, Engine, Funnel. See phosphoricons.com.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
