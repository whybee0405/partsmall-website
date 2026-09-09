/**
 * The vehicle taxonomy.
 *
 * Three levels: make, model, and the model-by-part-type intersection that
 * search queries actually take the shape of. "kia rio 2011 clutch kit" is a
 * make, a model, a year and a part type, and only a page whose subject is that
 * combination will rank for it.
 *
 * Year is handled in page content rather than in the URL. A year tier would
 * multiply these pages by fifteen and produce near-identical text, which is a
 * doorway pattern rather than an SEO strategy. Google reads the year from the
 * generation table on the page.
 *
 * IMPORTANT, FOR PARTS-MALL:
 * Generation year ranges and engine descriptions below are broad and
 * South-Africa oriented. They are here so the pages are useful and indexable,
 * not as fitment data. No page claims that a given part number fits a given
 * vehicle, because that mapping belongs to TecDoc, of which Parts-Mall
 * Corporation is a verified data supplier. Load that data into the CMS and
 * these pages become fitment-accurate. Until then every page routes the buyer
 * to a branch to confirm.
 */

export type Generation = {
  /** Broad market years, e.g. "2011 to 2017". */
  years: string
  /** Plain-language engine description. Deliberately not an engine code. */
  engines: string
  /** Optional note for this generation. */
  note?: string
}

export type Model = {
  slug: string
  make: string
  label: string
  /** Body style, used in copy and in the Vehicle schema. */
  body: string
  /** Answer-first line for the model page. */
  summary: string
  generations: Generation[]
  /** Part types that get their own intersection page for this model. */
  parts: string[]
  /**
   * A general observation about the vehicle, true regardless of which part is
   * being bought. Shown on the model page and on every intersection page.
   */
  note?: string
  /**
   * Observations tied to one part type, keyed by part-type slug. These only
   * appear on the matching intersection page. Keeping these separate from
   * `note` matters: a remark about calliper variants is useful on the brake
   * pad page and actively confusing on the clutch kit page.
   */
  partNotes?: Record<string, string>
}

export type Make = {
  slug: string
  label: string
  summary: string
  intro: string[]
}

export const MAKES: Make[] = [
  {
    slug: 'kia',
    label: 'Kia',
    summary:
      'Parts-Mall supplies replacement parts for the full Kia range sold in South Africa, from the Picanto and Rio through to the Sportage, Sorento and the K2700 workhorse.',
    intro: [
      'Kia is the single highest-volume make across the Parts-Mall branch network, which is unsurprising given the group’s Korean heritage. Branches carry deeper stock on Kia service lines than on almost anything else.',
      'The Rio and Picanto dominate counter volume on braking and service items, while the K2700 drives steady demand for clutch and suspension components from operators who cannot afford downtime.',
    ],
  },
  {
    slug: 'hyundai',
    label: 'Hyundai',
    summary:
      'Parts-Mall supplies replacement parts across the Hyundai range in South Africa, including the i10, i20, Accent, Tucson, and the H100 and H-1 commercial models.',
    intro: [
      'Hyundai and Kia share a great deal of engineering, which works in the buyer’s favour: parts availability across both makes is deeper than for most brands in this market.',
      'The H100 is a particular focus for the branch network. It is a working vehicle, its owners lose money when it stands, and branches stock its clutch, brake and suspension lines accordingly.',
    ],
  },
  {
    slug: 'chevrolet',
    label: 'Chevrolet',
    summary:
      'Parts-Mall continues to supply replacement parts for Chevrolet models in South Africa, including the Spark, Aveo, Cruze, Utility and Trailblazer.',
    intro: [
      'Chevrolet withdrew from the South African market, which makes parts availability the deciding factor for owners keeping these vehicles on the road. There are a great many of them still running.',
      'The branch network carries Chevrolet lines specifically because franchised support has thinned. For Spark, Aveo and Utility owners in particular, an independent supply chain is now the only practical route.',
    ],
  },
  {
    slug: 'ssangyong',
    label: 'Ssangyong',
    summary:
      'Parts-Mall supplies replacement parts for Ssangyong models in South Africa, with the Korando and Rexton the most commonly requested applications.',
    intro: [
      'Ssangyong parts are harder to find through general factors, which makes the Korean supply relationship behind Parts-Mall genuinely useful rather than merely a marketing point.',
      'Most Ssangyong demand at the counter is diesel engine, timing and suspension work on higher-mileage vehicles.',
    ],
  },
  {
    slug: 'suzuki',
    label: 'Suzuki',
    summary:
      'Parts-Mall supplies replacement parts for Suzuki models in South Africa, including the Swift and the Carry light commercial.',
    intro: [
      'Suzuki volumes have grown steadily in South Africa, and the Swift is now a common sight at the trade counter for routine braking and service items.',
      'The Carry is a working vehicle in the same category as the H100 and K2700, and generates the same pattern of clutch and suspension demand.',
    ],
  },
  {
    slug: 'daewoo',
    label: 'Daewoo',
    summary:
      'Parts-Mall supplies replacement parts for older Daewoo models still in service in South Africa, principally the Matiz and Cielo.',
    intro: [
      'Daewoo has not been sold new in South Africa for many years, but a surprising number remain in daily use, particularly in the informal transport sector.',
      'These are exactly the vehicles franchised networks no longer support. Branch-held stock is often the only route to keeping them running.',
    ],
  },
  {
    slug: 'gwm-haval',
    label: 'GWM and Haval',
    summary:
      'Parts-Mall supplies replacement parts for GWM and Haval models in South Africa, including the Haval H6 and the GWM Steed.',
    intro: [
      'GWM and Haval have grown quickly in the South African market, and the aftermarket is still catching up with the parc.',
      'Demand at the counter is currently weighted toward service items and braking, which is what you would expect from a fleet that is still relatively young.',
    ],
  },
  {
    slug: 'haval',
    label: 'Haval',
    summary:
      'Parts-Mall supplies replacement parts for Haval models sold in South Africa, from the earlier H1 and H2 through to the Jolion, H6, H6 GT, H9, Dargo and H7.',
    intro: [
      'Haval has established a substantial South African vehicle parc since its local introduction. The range spans compact crossovers, family SUVs and body-on-frame vehicles.',
      'Because specification and powertrain changed quickly between generations, branches confirm the VIN, engine and build year before supplying a replacement part.',
    ],
  },
]

/** The part types every model page carries, chosen as the highest-intent lines. */
const CORE = [
  'brake-pads',
  'discs-rotors',
  'clutch-kits',
  'oil-filters',
  'air-filters',
  'wheel-bearings',
  'cv-joints',
  'alternators',
]

/** Light commercials: clutch and suspension dominate. */
const COMMERCIAL = [
  'brake-pads',
  'brake-shoes',
  'clutch-kits',
  'clutch-release-bearings',
  'oil-filters',
  'fuel-filters',
  'wheel-bearings',
  'ball-joints',
  'radiators',
]

const m = (
  slug: string,
  make: string,
  label: string,
  body: string,
  summary: string,
  generations: Generation[],
  parts: string[],
  note?: string,
  partNotes?: Record<string, string>,
): Model => ({ slug, make, label, body, summary, generations, parts, note, partNotes })

/**
 * South-African-market model entries that have a confirmed nameplate history
 * but not yet a TecDoc-level local derivative map. The broad powertrain text
 * makes the page useful without pretending that a particular part fits every
 * engine within a badge.
 */
const marketModel = (
  slug: string,
  make: string,
  label: string,
  body: string,
  years: string,
  parts = CORE,
): Model =>
  m(
    slug,
    make,
    label,
    body,
    `The ${label} is a ${body.toLowerCase()} sold in South Africa and remains an application for routine service, braking and suspension parts. Confirm the build year and engine with the supplying branch before ordering.`,
    [{ years, engines: 'Petrol and diesel variants according to generation' }],
    parts,
  )

export const MODELS: Model[] = [
  // ── Kia ───────────────────────────────────────────────────────────────────
  m('rio', 'kia', 'Rio', 'Hatchback and sedan',
    'The Kia Rio is a small hatchback and sedan sold in South Africa across several generations, and one of the highest-volume applications at the Parts-Mall trade counter.',
    [
      { years: '2005 to 2011', engines: '1.4 and 1.6 petrol' },
      { years: '2011 to 2017', engines: '1.2, 1.4 and 1.6 petrol' },
      { years: '2017 onward', engines: '1.2 and 1.4 petrol' },
    ],
    [...CORE, 'brake-shoes', 'cabin-filters', 'radiators', 'fuel-pumps'],
    'The Rio spans three generations with overlapping engines, so the build year matters more than the model name when confirming a part.',
    { 'brake-pads': 'Front pads for the Rio are the single highest-turn braking line across the network. Confirm the calliper make before ordering, because the Rio has shipped with more than one.' },
  ),
  m('picanto', 'kia', 'Picanto', 'Hatchback',
    'The Kia Picanto is a city hatchback with a long South African history and a strong presence in the used market, making it a steady application for service and braking parts.',
    [
      { years: '2004 to 2011', engines: '1.0 and 1.1 petrol' },
      { years: '2011 to 2017', engines: '1.0 and 1.2 petrol' },
      { years: '2017 onward', engines: '1.0 and 1.2 petrol' },
    ],
    [...CORE, 'cabin-filters', 'sensors', 'radiators'],
    'The Picanto has a long South African history and a strong used market, so parts are needed across a wide span of build years.',
    { sensors: 'Crankshaft position sensors are the Picanto line branches most often need same-day, because the vehicle will not start without one.' },
  ),
  m('cerato', 'kia', 'Cerato', 'Sedan and hatchback',
    'The Kia Cerato is a compact sedan and hatchback sold in South Africa across three generations, commonly serviced for braking, clutch and suspension work.',
    [
      { years: '2004 to 2008', engines: '1.6 and 2.0 petrol' },
      { years: '2009 to 2013', engines: '1.6 and 2.0 petrol' },
      { years: '2013 onward', engines: '1.6 and 2.0 petrol' },
    ],
    [...CORE, 'ball-joints', 'bushings', 'steering-columns'],
  ),
  m('sportage', 'kia', 'Sportage', 'SUV',
    'The Kia Sportage is a compact SUV sold in South Africa in petrol and diesel form, with CV joints and braking among its most requested replacement lines.',
    [
      { years: '2005 to 2010', engines: '2.0 petrol and 2.0 diesel' },
      { years: '2010 to 2016', engines: '1.6 and 2.0 petrol, 2.0 diesel' },
      { years: '2016 onward', engines: '1.6 and 2.0 petrol, 2.0 diesel' },
    ],
    [...CORE, 'ball-joints', 'bushings', 'radiators', 'condensers'],
    'The Sportage runs in both petrol and diesel form across three generations, so confirm the engine as well as the year.',
    { 'cv-joints': 'Outer CV joints are a common Sportage request. Check the boot condition on both sides while the vehicle is raised.' },
  ),
  m('sorento', 'kia', 'Sorento', 'SUV',
    'The Kia Sorento is a larger SUV sold in South Africa mainly in diesel form, with braking, suspension and timing components the most frequent counter requests.',
    [
      { years: '2002 to 2009', engines: '2.5 diesel and 3.5 petrol' },
      { years: '2009 to 2015', engines: '2.2 diesel' },
      { years: '2015 onward', engines: '2.2 diesel' },
    ],
    [...CORE, 'door-handles', 'ball-joints', 'timing-chains-assemblies'],
  ),
  m('k2700', 'kia', 'K2700', 'Light commercial',
    'The Kia K2700 is a light commercial workhorse widely used in South African trade and delivery work, where clutch and brake wear is driven by load rather than mileage.',
    [{ years: '2003 onward', engines: '2.7 diesel' }],
    COMMERCIAL,
    'The K2700 is a working vehicle whose wear is driven by load rather than distance, so the odometer is a poor guide to what needs replacing.',
    { 'clutch-kits': 'K2700 clutch work is load-driven rather than mileage-driven. Owners carrying at the top of the rating replace clutches far earlier than the odometer suggests.' },
  ),
  m('sonet', 'kia', 'Sonet', 'Compact SUV',
    'The Kia Sonet is a compact SUV in the newer South African fleet, currently generating mostly routine service and filtration demand.',
    [{ years: '2020 onward', engines: '1.5 petrol' }],
    ['oil-filters', 'air-filters', 'cabin-filters', 'brake-pads', 'discs-rotors', 'wheel-bearings'],
  ),

  // ── Hyundai ───────────────────────────────────────────────────────────────
  m('i10', 'hyundai', 'i10', 'Hatchback',
    'The Hyundai i10 is a city hatchback closely related to the Kia Picanto, and shares much of its service and braking parts demand at the counter.',
    [
      { years: '2008 to 2013', engines: '1.1 and 1.2 petrol' },
      { years: '2014 onward', engines: '1.0 and 1.2 petrol' },
    ],
    [...CORE, 'sensors', 'cabin-filters'],
  ),
  m('i20', 'hyundai', 'i20', 'Hatchback',
    'The Hyundai i20 is a small hatchback with a substantial South African parc, commonly serviced for braking, filtration and suspension items.',
    [
      { years: '2009 to 2014', engines: '1.2 and 1.4 petrol' },
      { years: '2014 onward', engines: '1.2 and 1.4 petrol' },
    ],
    [...CORE, 'cabin-filters', 'radiators', 'bushings'],
  ),
  m('accent', 'hyundai', 'Accent', 'Sedan and hatchback',
    'The Hyundai Accent is a compact sedan and hatchback with a long South African history, frequently serviced for braking, clutch and cooling work.',
    [
      { years: '2000 to 2006', engines: '1.5 and 1.6 petrol' },
      { years: '2006 to 2011', engines: '1.6 petrol' },
      { years: '2011 onward', engines: '1.6 petrol' },
    ],
    [...CORE, 'radiators', 'fuel-pumps', 'ball-joints'],
  ),
  m('getz', 'hyundai', 'Getz', 'Hatchback',
    'The Hyundai Getz remains common on South African roads well after the end of its production run, and is a steady application for braking, fuel and suspension parts.',
    [{ years: '2002 to 2011', engines: '1.3, 1.4 and 1.6 petrol' }],
    [...CORE, 'fuel-pumps', 'radiators', 'ball-joints', 'bushings'],
    'The Getz is out of production but remains numerous, and branch-held stock is now the main supply route for it.',
    { 'fuel-pumps': 'Fuel pump modules are a frequent Getz request. Replace the fuel filter at the same time, because a blocked filter is usually what killed the original pump.' },
  ),
  m('elantra', 'hyundai', 'Elantra', 'Sedan',
    'The Hyundai Elantra is a compact sedan sold in South Africa across several generations, commonly serviced for braking, steering and suspension components.',
    [
      { years: '2000 to 2006', engines: '1.6 and 2.0 petrol' },
      { years: '2011 onward', engines: '1.6 and 1.8 petrol' },
    ],
    [...CORE, 'steering-columns', 'ball-joints'],
  ),
  m('tucson', 'hyundai', 'Tucson', 'SUV',
    'The Hyundai Tucson is a compact SUV sold in petrol and diesel form in South Africa, with CV joints, braking and cooling among the most requested lines.',
    [
      { years: '2004 to 2009', engines: '2.0 petrol and 2.0 diesel' },
      { years: '2015 onward', engines: '1.6 and 2.0 petrol, 2.0 diesel' },
    ],
    [...CORE, 'condensers', 'radiators', 'ball-joints'],
  ),
  m('santa-fe', 'hyundai', 'Santa Fe', 'SUV',
    'The Hyundai Santa Fe is a larger SUV sold mainly in diesel form in South Africa, with braking, suspension and trim components common at the counter.',
    [
      { years: '2006 to 2012', engines: '2.2 diesel and 2.7 petrol' },
      { years: '2012 onward', engines: '2.2 diesel' },
    ],
    [...CORE, 'door-handles', 'ball-joints', 'timing-chains-assemblies'],
  ),
  m('h100', 'hyundai', 'H100', 'Light commercial',
    'The Hyundai H100 is a light commercial drop-side and panel van in heavy South African trade use, where clutch, brake and radiator demand is driven by load.',
    [{ years: '2004 onward', engines: '2.6 diesel' }],
    COMMERCIAL,
    'The H100 is a vehicle whose owner loses income when it stands. Branches stock its clutch and brake lines deliberately deep for that reason.',
  ),
  m('h1', 'hyundai', 'H-1', 'Panel van and bus',
    'The Hyundai H-1 is a panel van and people carrier used widely in South African transport work, generating steady braking, bearing and cooling demand.',
    [{ years: '2008 onward', engines: '2.4 petrol and 2.5 diesel' }],
    [...COMMERCIAL, 'wheel-bearings', 'discs-rotors'],
  ),
  m('venue', 'hyundai', 'Venue', 'Compact SUV',
    'The Hyundai Venue is a compact SUV in the newer South African fleet, currently generating mainly routine service and filtration demand.',
    [{ years: '2019 onward', engines: '1.0 and 1.2 petrol' }],
    ['oil-filters', 'air-filters', 'cabin-filters', 'brake-pads', 'discs-rotors', 'wheel-bearings'],
  ),

  // ── Chevrolet ─────────────────────────────────────────────────────────────
  m('spark', 'chevrolet', 'Spark', 'Hatchback',
    'The Chevrolet Spark remains common on South African roads despite the brand’s market withdrawal, and independent parts supply is now the main route to keeping one running.',
    [
      { years: '2005 to 2010', engines: '0.8 and 1.0 petrol' },
      { years: '2010 onward', engines: '1.0 and 1.2 petrol' },
    ],
    [...CORE, 'brake-shoes', 'distributors', 'radiators'],
  ),
  m('aveo', 'chevrolet', 'Aveo', 'Sedan and hatchback',
    'The Chevrolet Aveo is a compact sedan and hatchback still widely used in South Africa, with braking, sensor and cooling components the most requested lines.',
    [{ years: '2006 to 2015', engines: '1.5 and 1.6 petrol' }],
    [...CORE, 'brake-shoes', 'sensors', 'radiators'],
  ),
  m('cruze', 'chevrolet', 'Cruze', 'Sedan and hatchback',
    'The Chevrolet Cruze is a compact sedan and hatchback in continued South African use, commonly serviced for braking, gasket and suspension work.',
    [{ years: '2009 to 2016', engines: '1.6 and 1.8 petrol, 2.0 diesel' }],
    [...CORE, 'cylinder-head-gaskets', 'ball-joints', 'radiators'],
  ),
  m('utility', 'chevrolet', 'Utility', 'Light commercial',
    'The Chevrolet Utility is a half-tonne pickup used widely in South African trade work, where clutch and suspension wear is load-driven.',
    [{ years: '2011 to 2017', engines: '1.4 petrol and 1.3 diesel' }],
    COMMERCIAL,
  ),
  m('trailblazer', 'chevrolet', 'Trailblazer', 'SUV',
    'The Chevrolet Trailblazer is a body-on-frame diesel SUV in continued South African use, generating braking, suspension and body-part demand.',
    [{ years: '2012 to 2017', engines: '2.5 and 2.8 diesel' }],
    [...CORE, 'body-mouldings', 'ball-joints', 'bushings'],
  ),

  // ── Ssangyong ─────────────────────────────────────────────────────────────
  m('korando', 'ssangyong', 'Korando', 'SUV',
    'The Ssangyong Korando is a compact SUV sold in South Africa in petrol and diesel form, with filtration and timing components the most common requests.',
    [{ years: '2011 onward', engines: '2.0 petrol and 2.0 diesel' }],
    [...CORE, 'oil-filters', 'timing-chains-assemblies', 'cylinder-head-gaskets'],
  ),
  m('rexton', 'ssangyong', 'Rexton', 'SUV',
    'The Ssangyong Rexton is a large diesel SUV in South African use, most often serviced for engine gasket, timing and braking work at higher mileage.',
    [{ years: '2003 onward', engines: '2.7 and 2.2 diesel' }],
    [...CORE, 'cylinder-head-gaskets', 'gasket-kits', 'timing-chains-assemblies'],
  ),

  // ── Suzuki ────────────────────────────────────────────────────────────────
  m('swift', 'suzuki', 'Swift', 'Hatchback',
    'The Suzuki Swift is a small hatchback with a growing South African parc, commonly serviced for braking, clutch and filtration items.',
    [
      { years: '2005 to 2010', engines: '1.3 and 1.5 petrol' },
      { years: '2011 onward', engines: '1.2 and 1.4 petrol' },
    ],
    [...CORE, 'clutch-cables', 'cabin-filters', 'alternators'],
  ),
  m('carry', 'suzuki', 'Carry', 'Light commercial',
    'The Suzuki Carry is a compact light commercial used in South African delivery and trade work, with clutch and brake demand driven by load and stop-start use.',
    [{ years: '2007 onward', engines: '1.0 and 1.5 petrol' }],
    COMMERCIAL,
  ),

  // ── Daewoo ────────────────────────────────────────────────────────────────
  m('matiz', 'daewoo', 'Matiz', 'Hatchback',
    'The Daewoo Matiz remains in South African service long after the brand left the market, and branch-held stock is often the only practical supply route.',
    [{ years: '1998 to 2005', engines: '0.8 and 1.0 petrol' }],
    ['brake-pads', 'brake-shoes', 'clutch-kits', 'oil-filters', 'air-filters', 'distributors', 'belt-covers', 'radiators'],
  ),
  m('cielo', 'daewoo', 'Cielo', 'Sedan and hatchback',
    'The Daewoo Cielo is an older sedan and hatchback still in South African use, most often serviced for ignition, clutch and braking components.',
    [{ years: '1995 to 2001', engines: '1.5 petrol' }],
    ['brake-pads', 'brake-shoes', 'clutch-kits', 'clutch-cables', 'distributors', 'oil-filters', 'air-filters', 'radiators'],
  ),

  // ── GWM and Haval ─────────────────────────────────────────────────────────
  m('h6', 'haval', 'Haval H6', 'SUV',
    'The Haval H6 is a compact SUV in the newer South African fleet, currently generating mainly service, filtration and braking demand.',
    [{ years: '2017 onward', engines: '1.5 and 2.0 petrol' }],
    ['oil-filters', 'air-filters', 'cabin-filters', 'brake-pads', 'discs-rotors', 'wheel-bearings', 'alternators'],
  ),
  m('steed', 'gwm-haval', 'GWM Steed', 'Light commercial',
    'The GWM Steed is a light commercial pickup used in South African trade work, with clutch, brake and suspension demand driven by load.',
    [{ years: '2010 onward', engines: '2.2 petrol and 2.0 diesel' }],
    COMMERCIAL,
  ),

  // ── Expanded South African model history ────────────────────────────────
  marketModel('pride', 'kia', 'Pride', 'Hatchback and sedan', '1994 to 2005'),
  marketModel('sephia', 'kia', 'Sephia', 'Sedan', '1994 to 2003'),
  marketModel('shuma', 'kia', 'Shuma', 'Hatchback and sedan', '1998 to 2004'),
  marketModel('spectra', 'kia', 'Spectra', 'Sedan and hatchback', '2000 to 2009'),
  marketModel('magentis', 'kia', 'Magentis', 'Sedan', '2001 to 2011'),
  marketModel('optima', 'kia', 'Optima', 'Sedan', '2011 to 2016'),
  marketModel('soul', 'kia', 'Soul', 'Compact crossover', '2009 to 2019'),
  marketModel('seltos', 'kia', 'Seltos', 'Compact SUV', '2020 onward'),
  marketModel('pegas', 'kia', 'Pegas', 'Sedan', '2024 onward'),
  marketModel('carens', 'kia', 'Carens', 'MPV', '2000 to 2014 and 2024 onward'),
  marketModel('carnival', 'kia', 'Carnival', 'MPV', '1999 onward'),
  marketModel('pregio', 'kia', 'Pregio', 'Panel van and bus', '1995 to 2005', COMMERCIAL),
  marketModel('k2500', 'kia', 'K2500', 'Light commercial', '2024 onward', COMMERCIAL),
  marketModel('tasman', 'kia', 'Tasman', 'Bakkie', '2025 onward', COMMERCIAL),
  marketModel('ev6', 'kia', 'EV6', 'Electric crossover', '2023 onward'),
  marketModel('ev9', 'kia', 'EV9', 'Electric SUV', '2024 onward'),

  marketModel('atos', 'hyundai', 'Atos', 'Hatchback', '1999 to 2014 and 2019 to 2023'),
  marketModel('grand-i10', 'hyundai', 'Grand i10', 'Hatchback and sedan', '2014 onward'),
  marketModel('matrix', 'hyundai', 'Matrix', 'MPV', '2001 to 2010'),
  marketModel('trajet', 'hyundai', 'Trajet', 'MPV', '2000 to 2008'),
  marketModel('terracan', 'hyundai', 'Terracan', 'SUV', '2001 to 2007'),
  marketModel('sonata', 'hyundai', 'Sonata', 'Sedan', '1994 to 2015'),
  marketModel('i30', 'hyundai', 'i30', 'Hatchback', '2008 to 2017'),
  marketModel('ix35', 'hyundai', 'ix35', 'SUV', '2010 to 2015'),
  marketModel('veloster', 'hyundai', 'Veloster', 'Coupe', '2012 to 2016'),
  marketModel('creta', 'hyundai', 'Creta', 'Compact SUV', '2017 onward'),
  marketModel('kona', 'hyundai', 'Kona', 'Compact SUV', '2018 onward'),
  marketModel('palisade', 'hyundai', 'Palisade', 'SUV', '2021 onward'),
  marketModel('staria', 'hyundai', 'Staria', 'MPV and panel van', '2021 onward', COMMERCIAL),
  marketModel('exter', 'hyundai', 'Exter', 'Compact crossover', '2024 onward'),
  marketModel('alcazar', 'hyundai', 'Alcazar', 'SUV', '2025 onward'),

  marketModel('spark-lite', 'chevrolet', 'Spark Lite', 'Hatchback', '2010 to 2017'),
  marketModel('sonic', 'chevrolet', 'Sonic', 'Hatchback and sedan', '2012 to 2017'),
  marketModel('captiva', 'chevrolet', 'Captiva', 'SUV', '2007 to 2017'),
  marketModel('orlando', 'chevrolet', 'Orlando', 'MPV', '2012 to 2017'),
  marketModel('optra', 'chevrolet', 'Optra', 'Sedan and hatchback', '2004 to 2010'),
  marketModel('vivant', 'chevrolet', 'Vivant', 'MPV', '2005 to 2011'),
  marketModel('lumina', 'chevrolet', 'Lumina', 'Sedan and utility', '2006 to 2013'),
  marketModel('corsa-utility', 'chevrolet', 'Corsa Utility', 'Light commercial', '2003 to 2011', COMMERCIAL),
  marketModel('trax', 'chevrolet', 'Trax', 'Compact SUV', '2013 to 2017'),

  marketModel('musso', 'ssangyong', 'Musso', 'SUV and bakkie', '1994 to 2006', COMMERCIAL),
  marketModel('kyron', 'ssangyong', 'Kyron', 'SUV', '2006 to 2016'),
  marketModel('actyon', 'ssangyong', 'Actyon', 'SUV and bakkie', '2007 to 2018', COMMERCIAL),
  marketModel('rodius', 'ssangyong', 'Rodius', 'MPV', '2005 to 2013'),
  marketModel('turismo', 'ssangyong', 'Turismo', 'MPV', '2013 to 2019'),
  marketModel('tivoli', 'ssangyong', 'Tivoli', 'Compact SUV', '2015 onward'),
  marketModel('xlv', 'ssangyong', 'XLV', 'Compact SUV', '2017 onward'),
  marketModel('korando-sports', 'ssangyong', 'Korando Sports', 'Bakkie', '2012 to 2019', COMMERCIAL),

  marketModel('alto', 'suzuki', 'Alto', 'Hatchback', '2002 onward'),
  marketModel('s-presso', 'suzuki', 'S-Presso', 'Hatchback', '2019 onward'),
  marketModel('celerio', 'suzuki', 'Celerio', 'Hatchback', '2015 onward'),
  marketModel('baleno', 'suzuki', 'Baleno', 'Hatchback', '2016 onward'),
  marketModel('dzire', 'suzuki', 'Dzire', 'Sedan', '2018 onward'),
  marketModel('ignis', 'suzuki', 'Ignis', 'Compact crossover', '2017 onward'),
  marketModel('jimny', 'suzuki', 'Jimny', 'SUV', '1998 onward'),
  marketModel('vitara', 'suzuki', 'Vitara', 'SUV', '1990 to 2008 and 2015 onward'),
  marketModel('grand-vitara', 'suzuki', 'Grand Vitara', 'SUV', '1998 to 2015 and 2023 onward'),
  marketModel('sx4', 'suzuki', 'SX4', 'Hatchback and crossover', '2007 to 2014'),
  marketModel('s-cross', 'suzuki', 'S-Cross', 'Crossover', '2014 onward'),
  marketModel('ertiga', 'suzuki', 'Ertiga', 'MPV', '2019 onward'),
  marketModel('xl6', 'suzuki', 'XL6', 'MPV', '2022 onward'),
  marketModel('fronx', 'suzuki', 'Fronx', 'Compact crossover', '2023 onward'),
  marketModel('vitara-brezza', 'suzuki', 'Vitara Brezza', 'Compact SUV', '2016 to 2022'),
  marketModel('eeco', 'suzuki', 'Eeco', 'MPV and panel van', '2024 onward', COMMERCIAL),
  marketModel('super-carry', 'suzuki', 'Super Carry', 'Light commercial', '2017 onward', COMMERCIAL),
  marketModel('ciaz', 'suzuki', 'Ciaz', 'Sedan', '2015 to 2020'),

  marketModel('espero', 'daewoo', 'Espero', 'Sedan', '1992 to 1999'),
  marketModel('nexia', 'daewoo', 'Nexia', 'Sedan and hatchback', '1995 to 2004'),
  marketModel('lanos', 'daewoo', 'Lanos', 'Hatchback and sedan', '1998 to 2004'),
  marketModel('leganza', 'daewoo', 'Leganza', 'Sedan', '1998 to 2002'),
  marketModel('nubira', 'daewoo', 'Nubira', 'Sedan and hatchback', '1998 to 2004'),
  marketModel('tacuma', 'daewoo', 'Tacuma', 'MPV', '2001 to 2005'),
  marketModel('kalos', 'daewoo', 'Kalos', 'Hatchback and sedan', '2003 to 2005'),
  marketModel('lacetti', 'daewoo', 'Lacetti', 'Hatchback and sedan', '2004 to 2007'),

  marketModel('h1', 'haval', 'Haval H1', 'Compact crossover', '2015 to 2019'),
  marketModel('h2', 'haval', 'Haval H2', 'Compact SUV', '2015 to 2021'),
  marketModel('h5', 'haval', 'Haval H5', 'SUV', '2024 onward'),
  marketModel('jolion', 'haval', 'Haval Jolion', 'Compact SUV', '2021 onward'),
  marketModel('h6-gt', 'haval', 'Haval H6 GT', 'SUV coupe', '2022 onward'),
  marketModel('h9', 'haval', 'Haval H9', 'SUV', '2017 onward'),
  marketModel('dargo', 'haval', 'Haval Dargo', 'SUV', '2023 onward'),
  marketModel('h7', 'haval', 'Haval H7', 'SUV', '2025 onward'),
]

// ── Lookups ────────────────────────────────────────────────────────────────

export function getMake(slug: string) {
  return MAKES.find((x) => x.slug === slug)
}

export function getModel(makeSlug: string, modelSlug: string) {
  return MODELS.find((x) => x.make === makeSlug && x.slug === modelSlug)
}

export function modelsForMake(makeSlug: string) {
  return MODELS.filter((x) => x.make === makeSlug)
}

/** Every model + part-type page that should exist. */
export function allFitments() {
  return MODELS.flatMap((model) =>
    model.parts.map((partType) => ({
      make: model.make,
      model: model.slug,
      partType,
    })),
  )
}

/** Models that carry a page for a given part type, for cross-linking. */
export function modelsWithPartType(partTypeSlug: string) {
  return MODELS.filter((x) => x.parts.includes(partTypeSlug))
}

/** The full span of years a model covers, for copy and schema. */
export function modelYearSpan(model: Model) {
  const first = model.generations[0]?.years.split(' ')[0] ?? ''
  const last = model.generations[model.generations.length - 1]?.years ?? ''
  return last.includes('onward') ? `${first} onward` : `${first} to ${last.split(' ').pop()}`
}
