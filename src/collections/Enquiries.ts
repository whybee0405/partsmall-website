import type { CollectionConfig } from 'payload'

/**
 * Every enquiry the site captures lands here, so nothing depends on an inbox
 * rule surviving. Records are create-only from the public form.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'company', 'branch', 'status', 'createdAt'],
    group: 'Enquiries',
    description: 'Trade, branch and part enquiries submitted through the site.',
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Trade account or wholesale', value: 'wholesale' },
        { label: 'Branch or part enquiry', value: 'branch' },
        { label: 'General or head office', value: 'general' },
        { label: 'Distributor or investor', value: 'distributor' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'company', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
        { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'region',
          type: 'text',
          admin: { width: '50%', description: 'Province, country or territory.' },
        },
        {
          name: 'monthlySpend',
          type: 'text',
          admin: { width: '50%', description: 'Rough monthly buying volume.' },
        },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      admin: { description: 'Set when the enquiry came from a branch page.' },
    },
    {
      name: 'part',
      type: 'text',
      admin: { description: 'Part number, when the enquiry came from a part page.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Routed to branch', value: 'routed' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'sourcePath',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true, description: 'Page the form was on.' },
    },
  ],
}
