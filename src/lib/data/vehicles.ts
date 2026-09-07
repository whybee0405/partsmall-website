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
    slug: 'ford',
    label: 'Ford',
    summary:
      'Parts-Mall supplies replacement parts for Ford models in South Africa, including the Ranger, Everest, Fiesta and EcoSport.',
    intro: [
      'The Ranger is one of the highest-volume vehicles in the country, and clutch and suspension work on higher-mileage examples is steady business for the branch network.',
      'Ford applications are variant-sensitive, particularly across Ranger model years and drivetrains. The counter will ask more questions here than on most makes, and that is deliberate.',
    ],
  },
  {
    slug: 'daihatsu',
    label: 'Daihatsu',
    summary:
      'Parts-Mall supplies replacement parts for Daihatsu models in South Africa, principally the Gran Max and the Sirion.',
    intro: [
      'The Gran Max is a working panel van, and its owners are among the most time-sensitive customers the branch network serves.',
      'Daihatsu shares engineering with Toyota in places, but parts are not broadly interchangeable. Confirm the application at the counter rather than assuming.',
    ],
  },
  {
    slug: 'nissan',
    label: 'Nissan',
    summary:
      'Parts-Mall supplies replacement parts for Nissan models in South Africa, including the NP200, NP300, Almera, Qashqai and Navara.',
    intro: [
      'The NP200 is close to ubiquitous in South African light commercial use, and it drives steady demand for clutch, brake and suspension components.',
      'Nissan light commercials tend to work hard and carry loads at the top of their rating, which shows up as suspension and clutch wear well before the mileage would suggest.',
    ],
  },
  {
    slug: 'toyota',
    label: 'Toyota',
    summary:
      'Parts-Mall supplies replacement parts for Toyota models in South Africa, including the Corolla, Hilux and Hiace.',
    intro: [
      'Toyota is the largest parc in the country, and the Hiace in particular is a commercial vehicle where downtime is measured directly in lost income.',
      'Toyota applications run across many model years and specifications. Bring the exact build year and engine to the counter, because the same model name covers a lot of ground.',
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
  m('h6', 'gwm-haval', 'Haval H6', 'SUV',
    'The Haval H6 is a compact SUV in the newer South African fleet, currently generating mainly service, filtration and braking demand.',
    [{ years: '2017 onward', engines: '1.5 and 2.0 petrol' }],
    ['oil-filters', 'air-filters', 'cabin-filters', 'brake-pads', 'discs-rotors', 'wheel-bearings', 'alternators'],
  ),
  m('steed', 'gwm-haval', 'GWM Steed', 'Light commercial',
    'The GWM Steed is a light commercial pickup used in South African trade work, with clutch, brake and suspension demand driven by load.',
    [{ years: '2010 onward', engines: '2.2 petrol and 2.0 diesel' }],
    COMMERCIAL,
  ),

  // ── Ford ──────────────────────────────────────────────────────────────────
  m('ranger', 'ford', 'Ranger', 'Pickup',
    'The Ford Ranger is one of the highest-volume vehicles in South Africa, and clutch, suspension and braking work on higher-mileage examples is steady branch business.',
    [
      { years: '2006 to 2011', engines: '2.5 and 3.0 diesel' },
      { years: '2011 to 2022', engines: '2.2 and 3.2 diesel' },
      { years: '2022 onward', engines: '2.0 and 3.0 diesel' },
    ],
    [...CORE, 'bushings', 'ball-joints', 'clutch-release-bearings', 'radiators'],
    'The Ranger is highly variant-sensitive across model years and drivetrains. Have the exact build year, engine and drivetrain ready for the counter.',
    { 'clutch-kits': 'Ranger clutch work varies by gearbox as well as by engine. Confirm the gearbox type before ordering, because the same engine ships behind more than one.' },
  ),
  m('everest', 'ford', 'Everest', 'SUV',
    'The Ford Everest is a body-on-frame diesel SUV sharing much of its engineering with the Ranger, and generating similar suspension and braking demand.',
    [{ years: '2015 onward', engines: '2.2 and 3.2 diesel' }],
    [...CORE, 'body-mouldings', 'bushings', 'ball-joints'],
  ),
  m('fiesta', 'ford', 'Fiesta', 'Hatchback',
    'The Ford Fiesta is a small hatchback with a substantial South African parc, commonly serviced for braking, cooling and clutch work.',
    [
      { years: '2008 to 2013', engines: '1.4 and 1.6 petrol' },
      { years: '2013 onward', engines: '1.0 and 1.6 petrol' },
    ],
    [...CORE, 'condensers', 'radiators', 'bushings'],
  ),
  m('ecosport', 'ford', 'EcoSport', 'Compact SUV',
    'The Ford EcoSport is a compact SUV in South African use, most often serviced for braking, timing and filtration components.',
    [{ years: '2013 onward', engines: '1.0 and 1.5 petrol, 1.5 diesel' }],
    [...CORE, 'timing-chains-assemblies', 'cabin-filters'],
  ),

  // ── Daihatsu ──────────────────────────────────────────────────────────────
  m('gran-max', 'daihatsu', 'Gran Max', 'Panel van',
    'The Daihatsu Gran Max is a compact panel van in South African delivery use, where downtime costs the operator directly and clutch and brake stock matters.',
    [{ years: '2008 onward', engines: '1.5 petrol' }],
    COMMERCIAL,
  ),
  m('sirion', 'daihatsu', 'Sirion', 'Hatchback',
    'The Daihatsu Sirion is a small hatchback still in South African service, commonly requested for braking, bearing and service items.',
    [{ years: '2005 to 2012', engines: '1.0 and 1.3 petrol' }],
    ['brake-pads', 'brake-shoes', 'clutch-kits', 'oil-filters', 'air-filters', 'wheel-bearings', 'starter-bearings', 'radiators'],
  ),

  // ── Nissan ────────────────────────────────────────────────────────────────
  m('np200', 'nissan', 'NP200', 'Light commercial',
    'The Nissan NP200 is close to ubiquitous in South African light commercial use, and generates steady clutch, brake and suspension demand at the counter.',
    [{ years: '2008 onward', engines: '1.6 petrol and 1.5 diesel' }],
    [...COMMERCIAL, 'bushings', 'cv-joints'],
    'The NP200 routinely carries at the top of its rating on poor surfaces, which brings undercar wear forward well before the mileage suggests.',
    { bushings: 'NP200 suspension bushes wear early for exactly that reason. Check the neighbouring joints while the arm is off.' },
  ),
  m('np300', 'nissan', 'NP300', 'Pickup',
    'The Nissan NP300 is a working pickup in South African trade and agricultural use, with clutch and suspension components the most frequent requests.',
    [{ years: '2008 onward', engines: '2.0 and 2.4 petrol, 2.5 diesel' }],
    [...COMMERCIAL, 'clutch-release-bearings', 'bushings'],
  ),
  m('almera', 'nissan', 'Almera', 'Sedan',
    'The Nissan Almera is a compact sedan in South African use, commonly serviced for filtration, braking and cooling components.',
    [{ years: '2013 onward', engines: '1.5 petrol' }],
    [...CORE, 'cabin-filters', 'radiators'],
  ),
  m('qashqai', 'nissan', 'Qashqai', 'Compact SUV',
    'The Nissan Qashqai is a compact SUV in South African use, with timing chain, braking and suspension work common at higher mileage.',
    [
      { years: '2007 to 2013', engines: '1.6 and 2.0 petrol, 1.5 diesel' },
      { years: '2014 onward', engines: '1.2 and 1.6 petrol, 1.5 diesel' },
    ],
    [...CORE, 'timing-chains-assemblies', 'bushings', 'condensers'],
  ),
  m('navara', 'nissan', 'Navara', 'Pickup',
    'The Nissan Navara is a diesel pickup in South African trade use, generating suspension, braking and cooling demand at higher mileage.',
    [{ years: '2006 onward', engines: '2.5 and 3.0 diesel' }],
    [...CORE, 'condensers', 'bushings', 'ball-joints'],
  ),

  // ── Toyota ────────────────────────────────────────────────────────────────
  m('corolla', 'toyota', 'Corolla', 'Sedan and hatchback',
    'The Toyota Corolla is among the most numerous vehicles on South African roads, and a constant application for filtration, braking and suspension parts.',
    [
      { years: '2002 to 2007', engines: '1.4, 1.6 and 1.8 petrol' },
      { years: '2007 to 2013', engines: '1.3, 1.6 and 2.0 petrol' },
      { years: '2014 onward', engines: '1.3, 1.6 and 1.8 petrol' },
    ],
    [...CORE, 'cabin-filters', 'ball-joints', 'radiators'],
  ),
  m('hilux', 'toyota', 'Hilux', 'Pickup',
    'The Toyota Hilux is a working pickup found across every sector of South African use, generating steady clutch, suspension and braking demand.',
    [
      { years: '2005 to 2015', engines: '2.5 and 3.0 diesel, 2.7 and 4.0 petrol' },
      { years: '2016 onward', engines: '2.4 and 2.8 diesel, 2.7 and 4.0 petrol' },
    ],
    [...CORE, 'fuel-senders', 'bushings', 'ball-joints'],
  ),
  m('hiace', 'toyota', 'Hiace', 'Panel van and bus',
    'The Toyota Hiace is a commercial van and minibus where downtime is measured directly in lost income, making branch stock depth the deciding factor.',
    [{ years: '2005 onward', engines: '2.5 diesel and 2.7 petrol' }],
    [...COMMERCIAL, 'wheel-bearings', 'hub-bearings'],
    'The Hiace carries weight constantly and is usually earning money while it does, so downtime matters more than parts price.',
    { 'wheel-bearings': 'Wheel bearings are the highest-turn Hiace line. Constant load is what wears them, and they are the first component to show it.' },
  ),
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
