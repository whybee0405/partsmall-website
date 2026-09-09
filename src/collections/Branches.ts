import type { CollectionConfig } from 'payload'

export const Branches: CollectionConfig = {
  slug: 'branches',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'province', 'phone', 'active'],
    group: 'Network',
    description:
      'The branch directory. Adding a record here creates its page, adds it to the finder and plots it on the network map. Nothing else needs changing.',
  },
  access: { read: () => true },
  defaultSort: 'name',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { width: '40%', description: 'Used in the URL: /branches/your-slug' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'province',
          type: 'select',
          required: true,
          admin: { width: '50%' },
          options: [
            'Gauteng',
            'Limpopo',
            'Mpumalanga',
            'North West',
            'Free State',
            'KwaZulu-Natal',
            'Eastern Cape',
            'Western Cape',
            'Northern Cape',
            'Pan-Africa',
          ].map((p) => ({ label: p, value: p })),
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          defaultValue: 'South Africa',
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'address', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'whatsapp',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Leave blank to reuse the phone number.',
          },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      admin: { description: 'Leave blank if this branch has no public email yet.' },
    },
    {
      name: 'hours',
      type: 'text',
      defaultValue: 'Mon to Fri 08:00 to 17:00, Sat 08:00 to 13:00',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'lat',
          type: 'number',
          required: true,
          admin: { width: '50%', description: 'Decimal latitude, e.g. -26.2124' },
        },
        {
          name: 'lng',
          type: 'number',
          required: true,
          admin: { width: '50%', description: 'Decimal longitude, e.g. 28.2617' },
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide the branch without deleting its record.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar', description: 'Optional branch photograph.' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description:
          'Optional line shown on the branch page, e.g. "Counter and trade desk. Bulk collections by arrangement."',
      },
    },
  ],
}
