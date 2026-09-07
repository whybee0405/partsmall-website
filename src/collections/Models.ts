import type { CollectionConfig } from 'payload'

/**
 * Models drive the highest-intent pages on the site.
 *
 * The `parts` relationship is what generates the intersection pages at
 * /vehicles/[make]/[model]/[part-type]. Adding a part type to a model creates
 * that page; removing it takes the page down. Add deliberately, because a page
 * with nothing specific to say about that combination is worse than no page.
 */
export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'make', 'body', 'slug'],
    group: 'Vehicles',
    description:
      'Vehicle models. Each publishes a page at /vehicles/[make]/[slug], plus one page per linked part type.',
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
          index: true,
          admin: { width: '45%', description: 'URL: /vehicles/[make]/your-slug' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'make',
          type: 'relationship',
          relationTo: 'makes',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'body',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'e.g. Hatchback, Pickup, Panel van' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Answer-first opening naming the make, model and what it is. Used as the meta description.',
      },
    },
    {
      name: 'generations',
      type: 'array',
      required: true,
      labels: { singular: 'Generation', plural: 'Generations' },
      admin: {
        description:
          'The year and engine table. This is how a search including a model year is matched without needing a separate page for every year.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'years',
              type: 'text',
              required: true,
              admin: { width: '40%', description: 'e.g. 2011 to 2017, or 2017 onward' },
            },
            {
              name: 'engines',
              type: 'text',
              required: true,
              admin: { width: '60%', description: 'e.g. 1.2, 1.4 and 1.6 petrol' },
            },
          ],
        },
        { name: 'note', type: 'text', admin: { description: 'Optional note for this generation.' } },
      ],
    },
    {
      name: 'parts',
      type: 'relationship',
      relationTo: 'part-types',
      hasMany: true,
      required: true,
      admin: {
        description:
          'Each part type linked here publishes a page at /vehicles/[make]/[model]/[part-type]. Add the components genuinely replaced on this vehicle, not everything in the catalogue.',
      },
    },
    {
      name: 'note',
      type: 'textarea',
      admin: {
        description:
          'A general observation about this vehicle, true no matter which part is being bought. Shown on the model page and on every part page for it. Keep anything part-specific out of here and use the field below.',
      },
    },
    {
      name: 'partNotes',
      type: 'array',
      labels: { singular: 'Part note', plural: 'Part notes' },
      admin: {
        description:
          'Observations tied to one specific part on this vehicle, shown only on that part page. This is the highest-value field on the site: it is the one sentence a competitor cannot template, and it is what makes each page genuinely worth ranking.',
      },
      fields: [
        {
          name: 'partType',
          type: 'relationship',
          relationTo: 'part-types',
          required: true,
        },
        { name: 'note', type: 'textarea', required: true },
      ],
    },
  ],
}
