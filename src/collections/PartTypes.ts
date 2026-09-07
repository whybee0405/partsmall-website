import type { CollectionConfig } from 'payload'

/**
 * Part types are the SEO workhorse of the site. Each publishes a page at
 * /parts/[category]/[slug] and feeds every vehicle intersection page that
 * references it, so writing one good part type improves dozens of pages.
 */
export const PartTypes: CollectionConfig = {
  slug: 'part-types',
  labels: { singular: 'Part Type', plural: 'Part Types' },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'category', 'slug'],
    group: 'Catalogue',
    description:
      'Individual part types, e.g. Brake Pads or Clutch Kits. Each publishes its own page and feeds every vehicle page that lists it.',
  },
  access: { read: () => true },
  defaultSort: 'label',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { width: '55%' } },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { width: '45%', description: 'URL: /parts/[category]/your-slug' },
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'singular',
      type: 'text',
      required: true,
      admin: {
        description:
          'The form that reads naturally mid-sentence: "needs a new clutch kit", "needs a new set of brake pads". Used to build headings on the vehicle pages, so getting it right is what stops those pages sounding machine-written.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Answer-first definition, one or two sentences. Start with the part name: "Brake pads are the replaceable friction blocks that...". This is the sentence an assistant will quote and the meta description.',
      },
    },
    {
      name: 'role',
      type: 'textarea',
      required: true,
      admin: { description: 'What the component does within its system.' },
    },
    {
      name: 'symptoms',
      type: 'array',
      labels: { singular: 'Symptom', plural: 'Symptoms' },
      admin: {
        description:
          'Signs it is failing, written the way a driver would notice them rather than in workshop terms. Lists are the format snippets lift.',
      },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'interval',
      type: 'textarea',
      required: true,
      admin: { description: 'When it is normally replaced. Be honest where there is no fixed interval.' },
    },
    {
      name: 'checks',
      type: 'array',
      labels: { singular: 'Check', plural: 'Checks' },
      admin: {
        description: 'What the counter needs confirmed before the order is placed.',
      },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'faqs',
      type: 'array',
      labels: { singular: 'Question', plural: 'Questions' },
      admin: {
        description:
          'Publishes as FAQ structured data. Every question here is also shown on the page, which Google requires.',
      },
      fields: [
        { name: 'q', type: 'text', required: true, label: 'Question' },
        { name: 'a', type: 'textarea', required: true, label: 'Answer' },
      ],
    },
  ],
}
