import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'System',
    description:
      'Head office contact details, social links and the group figures shown across the site.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Head Office',
          fields: [
            { name: 'headOfficeName', type: 'text', required: true, defaultValue: 'Parts-Mall Meadowdale' },
            { name: 'email', type: 'email', required: true, defaultValue: 'pma.sales1@parts-mall.com' },
            { name: 'phone', type: 'text' },
            { name: 'address', type: 'textarea', required: true },
            {
              name: 'mapQuery',
              type: 'text',
              required: true,
              admin: { description: 'What gets sent to Google Maps for directions.' },
            },
            {
              name: 'hours',
              type: 'text',
              defaultValue: 'Monday to Friday, 08:00 to 17:00 SAST',
            },
          ],
        },
        {
          label: 'Group Figures',
          fields: [
            {
              name: 'corporateFacts',
              type: 'array',
              maxRows: 4,
              admin: {
                description:
                  'Published Parts-Mall Corporation figures. Do not add a number that cannot be sourced.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, admin: { width: '25%' } },
                    { name: 'label', type: 'text', required: true, admin: { width: '75%' } },
                  ],
                },
                { name: 'note', type: 'text' },
              ],
            },
            {
              name: 'timeline',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'year', type: 'text', required: true, admin: { width: '20%' } },
                    { name: 'event', type: 'text', required: true, admin: { width: '80%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social and SEO',
          fields: [
            {
              name: 'socials',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '35%' } },
                    { name: 'url', type: 'text', required: true, admin: { width: '65%' } },
                  ],
                },
              ],
            },
            {
              name: 'enquiryEmail',
              type: 'email',
              admin: { description: 'Where new site enquiries are notified.' },
            },
          ],
        },
      ],
    },
  ],
}
