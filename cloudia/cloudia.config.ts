// CloudIA CMS config for Parts-Mall Africa (content moved here from Payload CMS on 2026-11-04).
// The source of truth for the CMS's models: edit it here, then restart the cms service.
import type { CloudiaConfig } from '@cloudia-cms/client/config'

const config: CloudiaConfig = {
  site: {
    name: 'Parts-Mall Africa',
    slug: 'partsmall',
    domains: [
      'parts-mall.co.za',
      'www.parts-mall.co.za'
    ]
  },
  dashboard: {
    theme: 'classic',
    mode: 'system',
    // Signal deep green from DESIGN.md (the accessible CTA green)
    accent: '#12804a',
  },
  payloadCompat: {
    analytics: 'analytics-events',
    media: 'media',
    shape: './payload-shape.json'
  },
  collections: [
    {
      slug: 'branches',
      titleField: 'name',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'province',
          type: 'text',
          required: true
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          default: 'South Africa'
        },
        {
          name: 'address',
          type: 'textarea',
          required: true
        },
        {
          name: 'phone',
          type: 'text',
          required: true
        },
        {
          name: 'whatsapp',
          type: 'text',
          help: 'Leave blank to reuse the phone number.'
        },
        {
          name: 'email',
          type: 'email',
          help: 'Leave blank if this branch has no public email yet.'
        },
        {
          name: 'hours',
          type: 'text',
          default: 'Mon to Fri 08:00 to 17:00, Sat 08:00 to 13:00'
        },
        {
          name: 'lat',
          type: 'number',
          required: true,
          help: 'Decimal latitude, e.g. -26.2124'
        },
        {
          name: 'lng',
          type: 'number',
          required: true,
          help: 'Decimal longitude, e.g. 28.2617'
        },
        {
          name: 'active',
          type: 'boolean',
          help: 'Uncheck to hide the branch without deleting its record.',
          default: true
        },
        {
          name: 'photo',
          type: 'image',
          help: 'Shown on the branch page. Leave blank to display the Parts-Mall logo.'
        },
        {
          name: 'notes',
          type: 'textarea',
          help: 'Optional line shown on the branch page, e.g. "Counter and trade desk. Bulk collections by arrangement."'
        }
      ]
    },
    {
      slug: 'categories',
      titleField: 'label',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true
        },
        {
          name: 'blurb',
          type: 'textarea',
          required: true,
          help: 'One line. Used on the homepage tile and the parts index.'
        },
        {
          name: 'summary',
          type: 'textarea',
          required: true,
          help: 'The answer-first opening, one or two sentences. Written so it makes sense quoted on its own, because this is what an answer engine lifts. Also used as the meta description.'
        },
        {
          name: 'intro',
          type: 'array',
          help: 'Two or three paragraphs of genuine editorial.',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true
            }
          ]
        },
        {
          name: 'faqs',
          type: 'array',
          help: 'These publish as FAQ structured data, which is how assistants and featured snippets quote the site. Write the answer as a complete sentence that stands on its own.',
          fields: [
            {
              name: 'q',
              type: 'text',
              label: 'Question',
              required: true
            },
            {
              name: 'a',
              type: 'textarea',
              label: 'Answer',
              required: true
            }
          ]
        },
        {
          name: 'icon',
          type: 'text',
          required: true,
          help: 'Phosphor icon name, e.g. Disc, Engine, Funnel. See phosphoricons.com.',
          default: 'Gear'
        },
        {
          name: 'image',
          type: 'image'
        },
        {
          name: 'order',
          type: 'number',
          help: 'Lower numbers appear first.',
          default: 0
        }
      ]
    },
    {
      slug: 'part-types',
      titleField: 'label',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true
        },
        {
          name: 'category',
          type: 'relation',
          required: true,
          relation: 'categories',
          multiple: false
        },
        {
          name: 'singular',
          type: 'text',
          required: true,
          help: 'The form that reads naturally mid-sentence: "needs a new clutch kit", "needs a new set of brake pads". Used to build headings on the vehicle pages, so getting it right is what stops those pages sounding machine-written.'
        },
        {
          name: 'summary',
          type: 'textarea',
          required: true,
          help: 'Answer-first definition, one or two sentences. Start with the part name: "Brake pads are the replaceable friction blocks that...". This is the sentence an assistant will quote and the meta description.'
        },
        {
          name: 'role',
          type: 'textarea',
          required: true,
          help: 'What the component does within its system.'
        },
        {
          name: 'symptoms',
          type: 'array',
          help: 'Signs it is failing, written the way a driver would notice them rather than in workshop terms. Lists are the format snippets lift.',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true
            }
          ]
        },
        {
          name: 'interval',
          type: 'textarea',
          required: true,
          help: 'When it is normally replaced. Be honest where there is no fixed interval.'
        },
        {
          name: 'checks',
          type: 'array',
          help: 'What the counter needs confirmed before the order is placed.',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true
            }
          ]
        },
        {
          name: 'faqs',
          type: 'array',
          help: 'Publishes as FAQ structured data. Every question here is also shown on the page, which Google requires.',
          fields: [
            {
              name: 'q',
              type: 'text',
              label: 'Question',
              required: true
            },
            {
              name: 'a',
              type: 'textarea',
              label: 'Answer',
              required: true
            }
          ]
        }
      ]
    },
    {
      slug: 'makes',
      titleField: 'label',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true
        },
        {
          name: 'summary',
          type: 'textarea',
          required: true,
          help: 'Answer-first opening naming the make and the models covered. Used as the meta description.'
        },
        {
          name: 'intro',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true
            }
          ]
        },
        {
          name: 'order',
          type: 'number',
          help: 'Lower numbers appear first.',
          default: 0
        }
      ]
    },
    {
      slug: 'models',
      titleField: 'label',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true
        },
        {
          // Model slugs are only unique within a make (Hyundai H-1 and Haval H1 are both /h1), but
          // CloudIA slugs are unique per model. A clashing model gets a unique slug such as
          // haval-h1 and keeps its page address here.
          name: 'urlSlug',
          type: 'text',
          label: 'URL segment',
          help: 'Only needed when another make already uses this model slug: give the model a unique slug (e.g. haval-h1) and put the address segment here (e.g. h1). Otherwise leave blank.'
        },
        {
          name: 'make',
          type: 'relation',
          required: true,
          relation: 'makes',
          multiple: false
        },
        {
          name: 'body',
          type: 'text',
          required: true,
          help: 'e.g. Hatchback, Pickup, Panel van'
        },
        {
          name: 'summary',
          type: 'textarea',
          required: true,
          help: 'Answer-first opening naming the make, model and what it is. Used as the meta description.'
        },
        {
          name: 'generations',
          type: 'array',
          required: true,
          help: 'The year and engine table. This is how a search including a model year is matched without needing a separate page for every year.',
          fields: [
            {
              name: 'years',
              type: 'text',
              required: true,
              help: 'e.g. 2011 to 2017, or 2017 onward'
            },
            {
              name: 'engines',
              type: 'text',
              required: true,
              help: 'e.g. 1.2, 1.4 and 1.6 petrol'
            },
            {
              name: 'note',
              type: 'text',
              help: 'Optional note for this generation.'
            }
          ]
        },
        {
          name: 'parts',
          type: 'relation',
          required: true,
          help: 'Each part type linked here publishes a page at /vehicles/[make]/[model]/[part-type]. Add the components genuinely replaced on this vehicle, not everything in the catalogue.',
          relation: 'part-types',
          multiple: true
        },
        {
          name: 'note',
          type: 'textarea',
          help: 'A general observation about this vehicle, true no matter which part is being bought. Shown on the model page and on every part page for it. Keep anything part-specific out of here and use the field below.'
        },
        {
          name: 'partNotes',
          type: 'array',
          help: 'Observations tied to one specific part on this vehicle, shown only on that part page. This is the highest-value field on the site: it is the one sentence a competitor cannot template, and it is what makes each page genuinely worth ranking.',
          fields: [
            {
              name: 'partType',
              type: 'relation',
              required: true,
              relation: 'part-types',
              multiple: false
            },
            {
              name: 'note',
              type: 'textarea',
              required: true
            }
          ]
        }
      ]
    },
    {
      slug: 'brands',
      titleField: 'label',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true
        },
        {
          name: 'tier',
          type: 'select',
          required: true,
          default: 'private',
          options: [
            {
              label: 'Parts-Mall private brand',
              value: 'private'
            },
            {
              label: 'OEM and genuine',
              value: 'oem'
            }
          ]
        },
        {
          name: 'note',
          type: 'textarea',
          required: true,
          help: 'One line describing what the line covers.'
        },
        {
          name: 'mark',
          type: 'image',
          help: 'Official SVG or PNG logo. Until one is supplied the site renders a typographic plate rather than inventing a mark.'
        },
        {
          name: 'order',
          type: 'number',
          default: 0
        }
      ]
    },
    {
      slug: 'guides',
      name: 'Blog Posts',
      titleField: 'title',
      // Analytics -> Content lists views per post at this address
      url: '/blog/{slug}',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'excerpt',
          type: 'textarea',
          required: true,
          help: 'Two sentences maximum. Used on the index card and as the search description.'
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          options: [
            'Ordering',
            'Fitment',
            'Buying',
            'Trade',
            'Network'
          ]
        },
        {
          name: 'publishedAt',
          type: 'date',
          required: true
        },
        {
          name: 'image',
          type: 'image'
        },
        {
          name: 'body',
          type: 'json',
          required: true,
          help: 'The post body as rich-text (Lexical) JSON, rendered by the site. Lists and links included.'
        },
        {
          name: 'relatedCategory',
          type: 'relation',
          help: 'Links the guide back to a catalogue system.',
          relation: 'categories',
          multiple: false
        }
      ]
    },
    {
      slug: 'enquiries',
      titleField: 'name',
      kind: 'form',
      form: {
        accept: [
          'type',
          'name',
          'company',
          'email',
          'phone',
          'region',
          'monthlySpend',
          'message',
          'branch',
          'part',
          'sourcePath'
        ],
        rateLimit: {
          max: 5,
          windowMinutes: 10
        }
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Trade account or wholesale',
              value: 'wholesale'
            },
            {
              label: 'Branch or part enquiry',
              value: 'branch'
            },
            {
              label: 'General or head office',
              value: 'general'
            },
            {
              label: 'Distributor or investor',
              value: 'distributor'
            }
          ]
        },
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'company',
          type: 'text'
        },
        {
          name: 'email',
          type: 'email',
          required: true
        },
        {
          name: 'phone',
          type: 'text',
          required: true
        },
        {
          name: 'region',
          type: 'text',
          help: 'Province, country or territory.'
        },
        {
          name: 'monthlySpend',
          type: 'text',
          help: 'Rough monthly buying volume.'
        },
        {
          name: 'message',
          type: 'textarea',
          required: true
        },
        {
          name: 'branch',
          type: 'relation',
          help: 'Set when the enquiry came from a branch page.',
          relation: 'branches',
          multiple: false
        },
        {
          name: 'part',
          type: 'text',
          help: 'Part number, when the enquiry came from a part page.'
        },
        {
          name: 'status',
          type: 'select',
          default: 'new',
          options: [
            {
              label: 'New',
              value: 'new'
            },
            {
              label: 'Contacted',
              value: 'contacted'
            },
            {
              label: 'Routed to branch',
              value: 'routed'
            },
            {
              label: 'Closed',
              value: 'closed'
            }
          ]
        },
        {
          name: 'sourcePath',
          type: 'text',
          help: 'Page the form was on.'
        }
      ]
    }
  ],
  singletons: [
    {
      slug: 'site-settings',
      fields: [
        {
          name: 'headOfficeName',
          type: 'text',
          required: true,
          default: 'Parts-Mall Meadowdale'
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          default: 'pma.sales1@parts-mall.com'
        },
        {
          name: 'phone',
          type: 'text'
        },
        {
          name: 'address',
          type: 'textarea',
          required: true
        },
        {
          name: 'mapQuery',
          type: 'text',
          required: true,
          help: 'What gets sent to Google Maps for directions.'
        },
        {
          name: 'hours',
          type: 'text',
          default: 'Monday to Friday, 08:00 to 17:00 SAST'
        },
        {
          name: 'corporateFacts',
          type: 'array',
          help: 'Published Parts-Mall Corporation figures. Do not add a number that cannot be sourced.',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true
            },
            {
              name: 'label',
              type: 'text',
              required: true
            },
            {
              name: 'note',
              type: 'text'
            }
          ]
        },
        {
          name: 'timeline',
          type: 'array',
          fields: [
            {
              name: 'year',
              type: 'text',
              required: true
            },
            {
              name: 'event',
              type: 'text',
              required: true
            }
          ]
        },
        {
          name: 'socials',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true
            },
            {
              name: 'url',
              type: 'text',
              required: true
            }
          ]
        },
        {
          name: 'enquiryEmail',
          type: 'email',
          help: 'Where new site enquiries are notified.'
        }
      ]
    }
  ]
}

export default config
