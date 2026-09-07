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
    whatsappPhone: '072 875 8042',
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
    a: 'Supply is led by Korean and related applications: Kia, Hyundai, Chevrolet, Ssangyong, Suzuki, Daewoo, GWM and Haval, Ford, Daihatsu, Nissan and Toyota. Confirm exact fitment with your branch.',
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
  body: string[]
}

/**
 * Editorial seeded here so the Guides section is live from day one. These
 * move into the CMS on first publish; the CMS wins whenever it has records.
 */
export const GUIDES: Guide[] = [
  {
    slug: 'reading-a-parts-mall-part-number',
    title: 'How to read a Parts-Mall part number',
    excerpt:
      'The prefix tells you the system, the block tells you the family. Once you can read it, you can order without a catalogue in front of you.',
    category: 'Ordering',
    readMinutes: 4,
    date: '2026-07-14',
    image: '/images/parts/pm-brk-1001.webp',
    body: [
      'Every Parts-Mall reference follows the same shape: PM, a three-letter system code, then a numeric block. PM-BRK-1001 is a braking part. PM-SUS-4002 is suspension and steering. PM-ELS-3001 is electrical and sensors.',
      'The three-letter code maps directly onto the thirteen catalogue systems. BRK braking, ENG engine, ELS electrical and sensors, SUS suspension and steering, FIL filters, TRN transmission and clutch, COO cooling, FUE fuel, BDY body and trim, BDG bearings, GSK gaskets and seals, BLT belts and chains, ACC accessories.',
      'The numeric block groups by family rather than by vehicle. Numbers in the same thousand belong to the same sub-category, so 1001, 1002 and 1003 are all braking parts, moving from pads to shoes to callipers.',
      'What the number does not tell you is fitment. Always confirm the application with the branch, because the same reference can supersede across model years. Give the counter the part number, the make, the model and the year, and the check takes under a minute.',
    ],
  },
  {
    slug: 'brake-pad-fitment-checks',
    title: 'Brake pad fitment: what to confirm before you order',
    excerpt:
      'Four checks that stop a return. Most brake pad returns come down to one of them, and all four take barely a minute at the car.',
    category: 'Fitment',
    readMinutes: 5,
    date: '2026-06-28',
    image: '/images/guide-brakes.webp',
    body: [
      'Brake pads are the single highest-volume line across the branch network, and they are also the line that comes back most often. Almost every return traces to one of four things.',
      'Check the calliper make first. The same vehicle in the same year can leave the factory with two different calliper suppliers, and the pad shape follows the calliper, not the badge. Look at the casting mark on the calliper body.',
      'Check the disc diameter. Measure it rather than trusting the spec sheet, because a previous owner may have fitted a different setup. A 280mm and a 300mm front disc on the same model take different pads.',
      'Check whether the vehicle has a wear sensor and which side it runs on. Ordering a set without the sensor lead, or with it on the wrong side, means a second trip.',
      'Finally, confirm whether you need the fitting kit. Some sets ship with shims and clips, some do not. Tell the counter which you want and it goes in the same box.',
    ],
  },
  {
    slug: 'oem-private-brand-or-aftermarket',
    title: 'OEM, private brand or aftermarket: choosing for the job',
    excerpt:
      'Not every repair needs an OEM part, and not every part should be the cheapest option on the shelf. Three rules help you decide.',
    category: 'Buying',
    readMinutes: 6,
    date: '2026-06-09',
    image: '/images/parts/pm-eng-2002.webp',
    body: [
      'The honest answer is that it depends on the component, the age of the vehicle and what the customer is paying for. Three rough rules cover most of it.',
      'Safety-critical and hard-to-access components favour OEM or the strongest private-brand line. Anything behind a timing cover, anything holding the car up, and anything you would need to strip the car twice to redo. The labour cost of doing it again dwarfs the parts saving.',
      'Routine service items favour a certified private brand. Filters, pads, cables and caps are replaced on a schedule anyway. Parts-Mall private-brand lines carrying ISO 9001 and TS 16949 are built to the same automotive quality standard as original equipment production.',
      'Cosmetic and trim items are where the customer decides. Show them the options and let the budget lead.',
      'What matters more than the tier is the warranty position. Every Parts-Mall private-brand line carries corporation warranty backing, and the supplying branch confirms the terms at dispatch. Get that in writing on the invoice.',
    ],
  },
  {
    slug: 'opening-a-trade-account',
    title: 'Opening a trade account with Parts-Mall',
    excerpt:
      'What the team needs from you, what happens after you send the enquiry, and how long it usually takes before you are trading.',
    category: 'Trade',
    readMinutes: 3,
    date: '2026-05-22',
    image: '/images/partner-portrait.webp',
    body: [
      'Trade accounts run through head office, and are then serviced by the branch closest to your workshop or yard.',
      'Send the enquiry with four things: your registered business name, the province or country you operate in, roughly what you buy in a month, and the vehicle makes you see most. Those four answers tell the team which branch to route you to and which lines to stock deeper.',
      'You will get a response from a named person, not a ticket number. Expect a call within two working days.',
      'From there it is a credit application and a branch introduction. Most accounts are trading within a week or two, depending on how quickly the paperwork comes back.',
    ],
  },
  {
    slug: 'korean-service-parts-by-model',
    title: 'The Korean service parts branches move most',
    excerpt:
      'Across 33 South African branches, a small group of references carries a disproportionate share of counter volume across the network.',
    category: 'Fitment',
    readMinutes: 5,
    date: '2026-04-30',
    image: '/images/warehouse-aisle.webp',
    body: [
      'Kia and Hyundai dominate the counter, which is what you would expect given the group heritage, but the specific movers are worth knowing if you carry your own shelf stock.',
      'Front pads for the Rio, Cerato, i20 and Accent are the highest-turn braking line. If you carry one braking reference, carry that one.',
      'Cabin and oil filters across the Sonet, Venue, Korando and H6 move steadily rather than in spikes, which makes them the easiest lines to hold without tying up cash.',
      'Crankshaft sensors for the Picanto, i10 and Aveo are the electrical line most often needed same-day, because the car does not run without one. Branches hold these deliberately.',
      'On the light commercial side, clutch kits for the Ranger 2.2 and NP300 and CV joints for the Sportage and Tucson are the two that most often decide whether a vehicle goes back on the road today or tomorrow.',
    ],
  },
  {
    slug: 'what-your-branch-needs-to-find-a-part',
    title: 'What your branch needs from you to find a part fast',
    excerpt:
      'The counter can work from very little, but five details turn a ten-minute search into a one-minute answer, even on a bad line.',
    category: 'Ordering',
    readMinutes: 3,
    date: '2026-04-11',
    image: '/images/hero-counter.webp',
    body: [
      'The fastest calls all sound the same. The caller leads with the vehicle, then the part, then the reference if they have one.',
      'Give the make, model and year first. Then the engine code or capacity, because that is what splits most applications. Then the specific component, described the way it appears on the car rather than the way it appears in a catalogue.',
      'If you have an OEM number off the old part, read it out even if it looks wrong or worn. A partial number narrows the search far more than a description does.',
      'Say up front whether you need it today. That changes the answer, because the counter can look at what is on the shelf now versus what comes on the next inter-branch run.',
      'If you can, send a photo on WhatsApp. Every branch page on this site has a WhatsApp button that opens a chat with that specific branch. A picture of the old part settles most fitment questions immediately.',
    ],
  },
]

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}
