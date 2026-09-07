/**
 * The comprehensive FAQ set — one source of truth for the /faq page, the
 * chat assistant (rules engine and AI system prompt alike), and the FAQPage
 * structured data that goes with it.
 *
 * Every answer is built from facts already established elsewhere on this
 * site (branches.ts, catalogue.ts, vehicles.ts, company.ts). Nothing here is
 * invented — where the real policy isn't published anywhere (payment terms,
 * a specific returns window), the answer says who to ask rather than
 * guessing a number.
 */

import { BRANCHES, NETWORK, PROVINCE_ORDER } from './branches'
import { CATEGORIES, PART_TYPES, BRANDS } from './catalogue'
import { MAKES, MODELS } from './vehicles'
import { COMPANY, CORPORATE_FACTS } from './company'

export type FaqCategorySlug =
  | 'ordering'
  | 'branches'
  | 'vehicles'
  | 'brands-warranty'
  | 'trade'
  | 'company'

export type Faq = {
  q: string
  a: string
  category: FaqCategorySlug
  /** Optional deep link to the page that covers this in full. */
  href?: string
}

export const FAQ_CATEGORIES: { slug: FaqCategorySlug; label: string }[] = [
  { slug: 'ordering', label: 'Ordering and fitment' },
  { slug: 'branches', label: 'Branches and stock' },
  { slug: 'vehicles', label: 'Vehicles and parts we supply' },
  { slug: 'brands-warranty', label: 'Private brands and warranty' },
  { slug: 'trade', label: 'Trade, distributors and franchise' },
  { slug: 'company', label: 'Company and policies' },
]

const provinceList = PROVINCE_ORDER.filter((p) => p !== 'Pan-Africa').join(', ')
const panAfricanCountries = [
  ...new Set(BRANCHES.filter((b) => b.province === 'Pan-Africa').map((b) => b.country)),
].join(', ')
const brandNames = BRANDS.map((b) => b.label).join(', ')
const makeNames = MAKES.map((m) => m.label).join(', ')

export const FAQS: Faq[] = [
  // ── Ordering and fitment ────────────────────────────────────────────────
  {
    category: 'ordering',
    q: 'What do I need to give the counter to order a part?',
    a: 'Lead with the vehicle: make, model and year, then the engine code or capacity, then the specific component described the way it appears on the car. An OEM number off the old part narrows the search fastest, even if it looks worn or partial. Say up front whether you need it today.',
    href: '/blog/what-your-branch-needs-to-find-a-part',
  },
  {
    category: 'ordering',
    q: 'How do I read a Parts-Mall part number?',
    a: 'Every reference follows PM, a three-letter system code, then a numeric block. PM-BRK-1001 is braking, PM-ENG is engine, PM-ELS is electrical and sensors, and so on across all 13 catalogue systems. The numeric block groups by family, not by vehicle, so the number alone does not confirm fitment — the branch still checks that against your vehicle.',
    href: '/blog/reading-a-parts-mall-part-number',
  },
  {
    category: 'ordering',
    q: 'Can I send a photo of the old part instead of describing it?',
    a: 'Yes. Every branch page has a WhatsApp button that opens a chat with that specific branch, and a photo of the old part usually settles a fitment question faster than a description.',
    href: '/branches',
  },
  {
    category: 'ordering',
    q: 'Why does the branch ask which calliper or engine code my vehicle has?',
    a: 'Because the same model in the same year can leave the factory with two different suppliers for a given component, and fitment follows the actual part on the car, not the badge or the capacity alone. The casting mark on a calliper or the code stamped on the engine block settles it in seconds.',
  },
  {
    category: 'ordering',
    q: "What's the difference between OEM, private-brand and aftermarket parts?",
    a: 'Safety-critical or hard-to-reach components favour OEM or the strongest private-brand line, since redoing the labour costs more than the parts saving. Routine service items — filters, pads, cables — suit a certified private brand built to the same ISO 9001 and TS 16949 standard as original equipment. Cosmetic and trim parts are usually a budget decision. Every Parts-Mall private-brand line carries corporation warranty backing regardless of tier.',
    href: '/blog/oem-private-brand-or-aftermarket',
  },
  {
    category: 'ordering',
    q: 'Does a fault code always mean that part has failed?',
    a: "No. A fault code identifies the circuit reporting a problem, which includes the wiring, the connector and the ECU input as well as the sensor or component itself. Check the connector and loom for corrosion or chafing before replacing the part the code names.",
  },
  {
    category: 'ordering',
    q: 'Do I need the exact OEM number to place an order?',
    a: 'It helps but is not required. The counter can usually confirm the right part from the vehicle make, model, year and engine alone — an OEM number, even a partial or worn one, just narrows the search further.',
  },

  // ── Branches and stock ──────────────────────────────────────────────────
  {
    category: 'branches',
    q: 'How do I check whether a branch has a part in stock?',
    a: 'Call or WhatsApp the branch directly with the part name, the vehicle, and the OEM reference if you have one. The counter team checks stock, offers alternatives, or confirms an order-in lead time while you are on the line.',
    href: '/branches',
  },
  {
    category: 'branches',
    q: 'How many Parts-Mall branches are there?',
    a: `${NETWORK.southAfrica} branches across ${NETWORK.provinces} South African provinces, plus ${NETWORK.panAfrican} pan-African country points — ${NETWORK.total} points in total.`,
    href: '/branches',
  },
  {
    category: 'branches',
    q: 'Which provinces do you have branches in?',
    a: `Branches across all nine South African provinces: ${provinceList}.`,
    href: '/branches',
  },
  {
    category: 'branches',
    q: 'Do you supply outside South Africa?',
    a: `Yes. There are country points in ${panAfricanCountries}, and the wider Parts-Mall group exports to 63 countries. Cross-border trade enquiries go to head office rather than a single branch.`,
    href: '/branches#pan-africa',
  },
  {
    category: 'branches',
    q: 'What are your branch trading hours?',
    a: `Most branches trade Monday to Friday, 08:00 to 17:00, and Saturday 08:00 to 13:00. Head office (${COMPANY.headOffice.name}) trades ${COMPANY.headOffice.hours}. Exact hours are confirmed on each branch's own page, since a small number vary.`,
    href: '/branches',
  },
  {
    category: 'branches',
    q: 'How do I find my nearest branch?',
    a: 'Use the branch finder to search by town, province or country, or share your location to sort by distance. Every result carries a direct call button, a WhatsApp button, and directions.',
    href: '/branches',
  },
  {
    category: 'branches',
    q: 'Can I get directions to a specific branch?',
    a: 'Yes — every branch page has a directions button that opens Google Maps with that exact address.',
    href: '/branches',
  },

  // ── Vehicles and parts we supply ────────────────────────────────────────
  {
    category: 'vehicles',
    q: 'Which vehicle makes do you support?',
    a: `Supply is led by Korean and related applications: ${makeNames}. Confirm exact fitment with your branch, since the same model name can span several generations and engines.`,
    href: '/vehicles',
  },
  {
    category: 'vehicles',
    q: 'How many models and part types do you cover?',
    a: `${MODELS.length} models across ${MAKES.length} makes, and ${PART_TYPES.length} part types across ${CATEGORIES.length} systems. Each vehicle page lists the years and engines covered and the components most often replaced on it.`,
    href: '/vehicles',
  },
  {
    category: 'vehicles',
    q: "What if my vehicle isn't listed on the site?",
    a: "The vehicle and parts pages cover the models and systems branches are asked about most, not the limit of what the network supplies. Call your nearest branch with the make, model and year and they will confirm what's available.",
    href: '/vehicles',
  },
  {
    category: 'vehicles',
    q: 'What part systems do you carry?',
    a: `${CATEGORIES.length} systems: ${CATEGORIES.map((c) => c.label).join(', ')}.`,
    href: '/parts',
  },

  // ── Private brands and warranty ─────────────────────────────────────────
  {
    category: 'brands-warranty',
    q: 'Do you only supply Parts-Mall branded parts?',
    a: `No. Parts-Mall carries private-brand lines — ${brandNames} — alongside OEM and genuine options where the application calls for them.`,
    href: '/parts',
  },
  {
    category: 'brands-warranty',
    q: 'Is there a warranty on the parts you supply?',
    a: 'Every Parts-Mall private-brand line carries corporation warranty backing, and the supplying branch confirms the terms in writing at dispatch. Get that confirmation on the invoice.',
  },
  {
    category: 'brands-warranty',
    q: 'Are private-brand parts built to the same standard as OEM?',
    a: 'Parts-Mall private-brand lines are certified to ISO 9001 and TS 16949, the same automotive quality standard used in original equipment production.',
    href: '/blog/oem-private-brand-or-aftermarket',
  },

  // ── Trade, distributors and franchise ───────────────────────────────────
  {
    category: 'trade',
    q: 'Can I become a Parts-Mall distributor or franchisee?',
    a: 'Regional distribution and franchise territories are handled directly by head office. Contact head office with your business, region and the volumes you already move, and a named person will discuss territory and terms.',
    href: '/wholesale',
  },
  {
    category: 'trade',
    q: 'I run a workshop — can I get trade pricing?',
    a: 'Standard trade pricing for individual workshops is handled at branch level, not through head office. Speak to your nearest branch directly.',
    href: '/branches',
  },
  {
    category: 'trade',
    q: 'Do you supply fleet or procurement buyers?',
    a: 'Yes. Fleet and procurement buyers get consistent supply across multiple sites, consolidated invoicing, and a single point of contact at head office.',
    href: '/wholesale',
  },
  {
    category: 'trade',
    q: 'Can I buy online and have parts delivered?',
    a: 'No. Parts-Mall Africa is a wholesale branch and agent network, not a retail webshop. Stock checks, quoting and supply all run through your nearest branch or through head office.',
  },

  // ── Company and policies ────────────────────────────────────────────────
  {
    category: 'company',
    q: 'Who is Parts-Mall Corporation?',
    a: `A South Korean automotive parts group founded in ${CORPORATE_FACTS.find((f) => f.label === 'group founded')?.value ?? '1998'}, exporting to ${CORPORATE_FACTS.find((f) => f.label === 'countries supplied')?.value ?? '63'} countries. Parts-Mall Africa is its South African sales and distribution subsidiary.`,
    href: '/about',
  },
  {
    category: 'company',
    q: 'Where is Parts-Mall Africa head office?',
    a: `${COMPANY.headOffice.name}, ${COMPANY.headOffice.address.join(', ')}.`,
    href: '/contact',
  },
  {
    category: 'company',
    q: 'How do I contact head office?',
    a: `Email ${COMPANY.headOffice.email}, or use the contact form on the Contact page. Head office trades ${COMPANY.headOffice.hours}.`,
    href: '/contact',
  },
  {
    category: 'company',
    q: 'What is your returns policy?',
    a: 'Returns are handled at branch level, since the branch that supplied the part is the one that confirmed fitment against your vehicle. Speak to your branch directly with the invoice.',
  },
  {
    category: 'company',
    q: 'What payment methods do you accept?',
    a: 'Payment terms are agreed directly with your branch, or with head office for a trade or distributor account. Ask your branch counter for the options they offer.',
  },
]

export function faqsByCategory(slug: FaqCategorySlug) {
  return FAQS.filter((f) => f.category === slug)
}
