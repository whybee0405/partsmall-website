/**
 * Corporate reference data.
 *
 * Every figure here is cross-checked against Parts-Mall Corporation's own
 * published material. Nothing on this site is an invented statistic.
 */

export const COMPANY = {
  name: 'Parts-Mall Africa',
  legalName: 'Parts-Mall Africa (Pty) Ltd',
  tagline: 'Korean vehicle parts, supplied from a branch near you.',
  headOffice: {
    name: 'Parts-Mall Meadowdale',
    email: 'pma.sales1@parts-mall.com',
    whatsappPhone: '076 311 7593',
    address: [
      '50 Herman Street',
      'R24 Business Park, Building G, Unit 1',
      'Meadowdale',
      'Germiston 1401',
      'South Africa',
    ],
    mapQuery:
      '50 Herman Street, R24 Business Park Building G Unit 1, Meadowdale, Germiston, 1401, South Africa',
    hours: 'Monday to Friday, 08:00 to 17:00 SAST',
  },
  socials: [
    { label: 'Facebook', url: 'https://www.facebook.com/partsMallSA/' },
    { label: 'Instagram', url: 'https://www.instagram.com/partsmallafrica' },
    { label: 'YouTube', url: 'https://www.youtube.com/@PartsMall/' },
  ],
}

export function headOfficeMapUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    COMPANY.headOffice.mapQuery,
  )}`
}

/** Group figures, as published by Parts-Mall Corporation. */
export const CORPORATE_FACTS = [
  { value: '63', label: 'countries supplied', note: 'The group export network.' },
  { value: '189', label: 'buyers worldwide', note: 'Across the 63-country export network.' },
  { value: '20+', label: 'official agents globally', note: 'Across 10 major markets.' },
  { value: '1998', label: 'group founded', note: 'Over 25 years in parts systems and logistics.' },
]

export const TIMELINE = [
  { year: '1998', event: 'Parts-Mall founded in South Korea.' },
  { year: '2002', event: 'ERP-based B2B parts distribution launched.' },
  { year: '2003', event: 'The PMC private brand is introduced.' },
  { year: '2005', event: 'South Africa and Malaysia entities established.' },
  { year: '2006', event: 'Shanghai entity established.' },
  { year: '2013', event: 'First domestic TecDoc Data Supplier membership secured.' },
  { year: '2016', event: 'Group revenue passes KRW 100 billion. Russia entity launched.' },
  { year: '2023', event: 'Eco-friendly parts business direction formally launched.' },
]

export const GLOBAL_ENTITIES = [
  { label: 'Parts-Mall HQ', place: 'Goyang, South Korea', role: 'Group head office' },
  { label: 'Parts-Mall ATZ', place: 'Seoul, South Korea', role: 'Import car parts distribution' },
  { label: 'PartZone', place: 'Goyang, South Korea', role: 'Platform and parts-matching business' },
  { label: 'PMC Logis', place: 'Paju, South Korea', role: 'Automotive logistics infrastructure' },
  { label: 'Parts-Mall Africa', place: 'Meadowdale, Germiston', role: 'African sales and distribution hub' },
  { label: 'Parts-Mall Shanghai', place: 'Songjiang, Shanghai', role: 'Purchasing and brand development' },
  { label: 'Parts-Mall CIS', place: 'Moscow, Russia', role: 'CIS sales and distribution hub' },
]

/** Quoted verbatim from Parts-Mall Corporation's description of the Africa entity. */
export const PARENT_QUOTE = {
  text: 'Parts-Mall Africa, located in Johannesburg, South Africa, serves as Parts-Mall’s sales subsidiary and a hub for sales and distribution across the African continent. We have secured over 30 dealerships within South Africa and are expanding our business into various African countries.',
  cite: 'Parts-Mall Corporation, global headquarters, Goyang',
}

export const FAQS = [
  {
    q: 'How do I check whether a branch has a part in stock?',
    a: 'Call the branch directly with the part name, the vehicle, and the OEM reference if you have one. The counter team checks stock, offers alternatives, or confirms an order-in lead time while you are on the line. Every branch page carries a direct call and WhatsApp button.',
  },
  {
    q: 'Do you only supply Parts-Mall branded parts?',
    a: 'No. Parts-Mall carries nine private-brand lines, PMC, NT, Car-Dex, Pomax, MX, Ex-Trim, Vichura, Pro-Tec and Dashi, alongside OEM and genuine options where the application calls for them.',
  },
  {
    q: 'Can I become a Parts-Mall distributor or franchisee?',
    a: 'Regional distribution and franchise territories are handled directly by head office. Contact head office with your business, region and the volumes you already move, and a named person will discuss territory and terms.',
  },
  {
    q: 'Which vehicle makes do you support?',
    a: 'Supply is led by Korean and related applications: Kia, Hyundai, Chevrolet, Ssangyong, Suzuki, Daewoo, GWM and Haval. Confirm exact fitment with your branch.',
  },
  {
    q: 'Can I buy online and have parts delivered?',
    a: 'No. Parts-Mall Africa is a wholesale branch and agent network, not a retail webshop. Stock checks, quoting and supply all run through your nearest branch or through head office.',
  },
  {
    q: 'Do you supply outside South Africa?',
    a: 'Yes. There are country points in Botswana, Eswatini, Mozambique, Namibia and Zimbabwe, and the group exports to 63 countries. Cross-border trade enquiries go to head office.',
  },
]

export type Guide = {
  slug: string
  title: string
  excerpt: string
  category: string
  readMinutes: number
  date: string
  image: string
  /** Describes what the photo actually shows, for the full-size hero on the
   * article page. Card thumbnails elsewhere stay alt="" deliberately — the
   * heading right next to them already says what the post is about. */
  imageAlt: string
  body: string[]
}

/** No articles are published until the client provides approved content. */
export const GUIDES: Guide[] = []

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}
