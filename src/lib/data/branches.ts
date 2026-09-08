/**
 * The branch directory.
 *
 * 39 branches across 9 South African provinces, plus 5 pan-African country
 * points. 44 network points in total. Re-synced from parts-mall.co.za's own
 * branch directory (the prior data had drifted — addresses, phone numbers,
 * and Brits' province were all stale). Coordinates are real and are what the
 * network map plots; a handful are town-level rather than street-level where
 * the exact address didn't geocode precisely — see git history for which.
 */

export type Branch = {
  slug: string
  name: string
  province: string
  country: string
  address: string
  phone: string
  /** Not every branch has a public email yet — optional, not every record has one. */
  email?: string | null
  lat: number
  lng: number
  hours: string
  /** CMS-only fields — not in the static seed data, optional until an admin fills them in. */
  whatsapp?: string | null
  notes?: string | null
}

const TRADE_HOURS = 'Mon to Fri 08:00 to 17:00, Sat 08:00 to 13:00'

export const BRANCHES: Branch[] = [
  // --- Gauteng (16) -----------------------------------------------------------
  { slug: 'alberton', name: 'Alberton', province: 'Gauteng', country: 'South Africa', address: 'Shop No 5, Nevada Centre, 68 Voortrekker Road, Alberton', phone: '011 869 0593', email: 'pmalberton1201@gmail.com', lat: -26.2669894, lng: 28.1220546, hours: TRADE_HOURS },
  { slug: 'benoni', name: 'Benoni', province: 'Gauteng', country: 'South Africa', address: '29 Tom Jones Street, Benoni', phone: '010 510 5060', email: 'pma.sales1@parts-mall.com', lat: -26.1858654, lng: 28.3144663, hours: TRADE_HOURS },
  { slug: 'boksburg', name: 'Boksburg', province: 'Gauteng', country: 'South Africa', address: 'Venter Centre, Cnr Rietfontein Road & North Rand Road, Boksburg', phone: '011 823 1655', email: 'pma.sales1@parts-mall.com', lat: -26.2124639, lng: 28.2617471, hours: TRADE_HOURS },
  { slug: 'edenvale', name: 'Edenvale', province: 'Gauteng', country: 'South Africa', address: '123 Van Riebeeck Ave, Edenvale, Johannesburg, 1609', phone: '011 462 0332', email: 'pma.sales1@parts-mall.com', lat: -26.1258249, lng: 28.142812, hours: TRADE_HOURS },
  { slug: 'joburg-cbd-booysens', name: 'Joburg CBD, Booysens', province: 'Gauteng', country: 'South Africa', address: 'Shop No. 6 Retro City Centre, 21 Booysens Road, Booysens', phone: '011 493 5924', email: 'pma.sales1@parts-mall.com', lat: -26.2304139, lng: 28.0281432, hours: TRADE_HOURS },
  { slug: 'joburg-cbd-main-str', name: 'Joburg CBD, Main Street', province: 'Gauteng', country: 'South Africa', address: '179 Main Street, City and Suburban, Johannesburg, 2094', phone: '010 020 5402', email: 'kapjhb@koreanautoparts.co.za', lat: -26.2074695, lng: 28.0424417, hours: TRADE_HOURS },
  { slug: 'pretoria-cbd', name: 'Pretoria CBD', province: 'Gauteng', country: 'South Africa', address: '384 Johannes Ramokhoase, Pretoria Central', phone: '012 326 1551', email: 'pma.sales1@parts-mall.com', lat: -25.7518426, lng: 28.1899743, hours: TRADE_HOURS },
  { slug: 'pretoria-gezina', name: 'Pretoria Gezina', province: 'Gauteng', country: 'South Africa', address: '430 Steve Biko Road, Gezina, Pretoria', phone: '087 265 7622', email: 'pma.sales1@parts-mall.com', lat: -25.7215085, lng: 28.2030066, hours: TRADE_HOURS },
  { slug: 'randburg', name: 'Randburg', province: 'Gauteng', country: 'South Africa', address: '191 Bram Fischer Drive, Ferndale, Randburg, 2194', phone: '010 211 9539', email: 'pma.sales1@parts-mall.com', lat: -26.0897342, lng: 28.0068242, hours: TRADE_HOURS },
  { slug: 'randfontein', name: 'Randfontein', province: 'Gauteng', country: 'South Africa', address: '2 Potgieter St, Westerloor, Randfontein, 1759', phone: '071 003 3880', email: 'fastlanemotorspares@gmail.com', lat: -26.173611, lng: 27.694167, hours: TRADE_HOURS },
  { slug: 'roodepoort', name: 'Roodepoort', province: 'Gauteng', country: 'South Africa', address: 'Shop 6 The Gordon Shopping Centre, 56 Hendrik Potgieter, Florida North, Roodepoort', phone: '011 674 0295', email: 'roodepoort@partsmall.co.za', lat: -26.1720806, lng: 27.94056, hours: TRADE_HOURS },
  { slug: 'soweto', name: 'Soweto', province: 'Gauteng', country: 'South Africa', address: '318/73 Chris Hani Road, Soweto', phone: '010 630 0406', email: 'partsmallsoweto@gmail.com', lat: -26.2627829, lng: 27.9662671, hours: TRADE_HOURS },
  { slug: 'wynberg', name: 'Wynberg', province: 'Gauteng', country: 'South Africa', address: '100 Forest Road, Bramley, Johannesburg, 2018', phone: '011 786 0039', email: 'wynberg@partsmall.co.za', lat: -26.1243982, lng: 28.0854143, hours: TRADE_HOURS },
  { slug: 'lenasia', name: 'Lenasia', province: 'Gauteng', country: 'South Africa', address: '19 Rose Ave, C/O 3 Pelikaan Ave, Lenasia, 1831', phone: '011 854 1856', lat: -26.3212287, lng: 27.8320393, hours: TRADE_HOURS },
  { slug: 'van-der-hoff', name: 'Van der Hoff', province: 'Gauteng', country: 'South Africa', address: '389 Van Der Hoff Rd, Pretoria Gardens, Tshwane, 0081', phone: '012 065 1074', lat: -25.7227778, lng: 28.1488889, hours: TRADE_HOURS },
  { slug: 'vereeniging', name: 'Vereeniging', province: 'Gauteng', country: 'South Africa', address: 'Shop 3, 36 Voortrekker St, Vereeniging, 1930', phone: '011 499 4004', lat: -26.6823837, lng: 27.9299449, hours: TRADE_HOURS },

  // --- Limpopo (6) --------------------------------------------------------------
  { slug: 'bela-bela', name: 'Bela-Bela', province: 'Limpopo', country: 'South Africa', address: 'Potgieter Street, R101 Business Park, Unit E1A, Bela Bela, 0480', phone: '082 686 3263', email: 'pma.sales1@parts-mall.com', lat: -24.8806014, lng: 28.2904774, hours: TRADE_HOURS },
  { slug: 'burgersfort', name: 'Burgersfort', province: 'Limpopo', country: 'South Africa', address: '5 Eddie Sedibe Street, Burgersfort, 1150', phone: '064 532 9037', email: 'segwata.infinity@gmail.com', lat: -24.673611, lng: 30.328333, hours: TRADE_HOURS },
  { slug: 'polokwane', name: 'Polokwane', province: 'Limpopo', country: 'South Africa', address: '67 Market St, Polokwane Central, Polokwane, 0700', phone: '015 230 0021', email: 'pma.sales1@parts-mall.com', lat: -23.9058333, lng: 29.4613889, hours: TRADE_HOURS },
  { slug: 'thohoyandou', name: 'Thohoyandou', province: 'Limpopo', country: 'South Africa', address: 'Shop No 16, Sibasa Shopping Centre, Sibasa, Thohoyandou, 0970', phone: '064 524 2463', email: 'partsmallthohoyandou@gmail.com', lat: -22.9676429, lng: 30.4596582, hours: TRADE_HOURS },
  { slug: 'tzaneen', name: 'Tzaneen', province: 'Limpopo', country: 'South Africa', address: '3 Skirving Street, Tzaneen', phone: '084 235 2406', email: 'krp.parts1@gmail.com', lat: -23.8311529, lng: 30.1614004, hours: TRADE_HOURS },
  { slug: 'marble-hall', name: 'Marble Hall', province: 'Limpopo', country: 'South Africa', address: 'Unit 1, 1 Ewoud Malan Street, Cnr N11, Marble Industrial Park, Marble Hall, 0450', phone: '064 519 3232', lat: -24.9739354, lng: 29.2867715, hours: TRADE_HOURS },

  // --- Mpumalanga (4) -------------------------------------------------------
  { slug: 'middelburg', name: 'Middelburg', province: 'Mpumalanga', country: 'South Africa', address: '23 Bhimy Damane Street, Middelburg, 1050', phone: '065 668 0053', email: 'partsmallmiddelburg@gmail.com', lat: -25.765014, lng: 29.4593145, hours: TRADE_HOURS },
  { slug: 'nelspruit', name: 'Mbombela, Nelspruit', province: 'Mpumalanga', country: 'South Africa', address: '10 Cameroon Street, Nelspruit', phone: '013 752 2497', email: 'pma.sales1@parts-mall.com', lat: -25.4729094, lng: 30.9772719, hours: TRADE_HOURS },
  { slug: 'ermelo', name: 'Ermelo', province: 'Mpumalanga', country: 'South Africa', address: '21B, 56 Kerk Street, Ermelo, 2351', phone: '061 110 6027', email: 'pma.sales1@parts-mall.com', lat: -26.5110587, lng: 29.9825062, hours: TRADE_HOURS },
  { slug: 'secunda', name: 'Secunda', province: 'Mpumalanga', country: 'South Africa', address: '2 Vaalrivier St, Secunda, 2302', phone: '017 634 9160', lat: -26.5217512, lng: 29.2223494, hours: TRADE_HOURS },

  // --- North West (4) -------------------------------------------------------
  { slug: 'brits', name: 'Brits', province: 'North West', country: 'South Africa', address: '107 Ludorf Street, Brits, 0250', phone: '072 282 8763', email: 'nwkoreanparts@gmail.com', lat: -25.6351161, lng: 27.7765963, hours: TRADE_HOURS },
  { slug: 'mahikeng', name: 'Mahikeng', province: 'North West', country: 'South Africa', address: 'No 5 First Industrial, Mahikeng, 2735', phone: '082 591 0439', email: 'mahikeng@partsmall.co.za', lat: -25.863611, lng: 25.658611, hours: TRADE_HOURS },
  { slug: 'potchefstroom', name: 'Potchefstroom', province: 'North West', country: 'South Africa', address: 'Shop No. 1, Owens Ave, 22 Auto Ave, Potchefstroom, 2530', phone: '072 982 1016', email: 'potchefstroom@partsmall.co.za', lat: -26.7126603, lng: 27.0961757, hours: TRADE_HOURS },
  { slug: 'rustenburg', name: 'Rustenburg', province: 'North West', country: 'South Africa', address: '31 Von Wielligh Street, Rustenburg', phone: '014 592 0459', email: 'nwkoreanparts@gmail.com', lat: -25.6722318, lng: 27.2357257, hours: TRADE_HOURS },

  // --- Free State (3) -------------------------------------------------------
  { slug: 'bethlehem', name: 'Bethlehem', province: 'Free State', country: 'South Africa', address: '67 Commissioner Street, Bethlehem, 9701', phone: '058 303 0659', email: 'bethlehem@partsmall.co.za', lat: -28.2278868, lng: 28.3059434, hours: TRADE_HOURS },
  { slug: 'bloemfontein', name: 'Bloemfontein', province: 'Free State', country: 'South Africa', address: 'Shop No. 5, Medi Inn Centre, 79 Harvey Rd, Oranjesig, Bloemfontein, 9301', phone: '071 502 6694', email: 'pma.sales1@parts-mall.com', lat: -29.1360303, lng: 26.2173483, hours: TRADE_HOURS },
  { slug: 'welkom', name: 'Welkom', province: 'Free State', country: 'South Africa', address: '145 Jan Hofmeyer Street, Welkom', phone: '084 786 5152', email: 'pma.sales1@parts-mall.com', lat: -27.982298, lng: 26.737969, hours: TRADE_HOURS },

  // --- KwaZulu-Natal (3) ----------------------------------------------------
  { slug: 'durban-north', name: 'Durban North', province: 'KwaZulu-Natal', country: 'South Africa', address: '87 Umhlanga Rocks Drive, Durban North, Arcadia Centre', phone: '031 100 1121', email: 'ushaka.spares@gmail.com', lat: -29.7554339, lng: 31.0482992, hours: TRADE_HOURS },
  { slug: 'port-shepstone', name: 'Port Shepstone', province: 'KwaZulu-Natal', country: 'South Africa', address: 'Shop 8 Fairways Business Park, Marburg, Port Shepstone', phone: '039 032 0008', email: 'partsmallpssales1@gmail.com', lat: -30.742778, lng: 30.450556, hours: TRADE_HOURS },
  { slug: 'richards-bay', name: 'Richards Bay', province: 'KwaZulu-Natal', country: 'South Africa', address: '7 Rupee Rif, Unit 8, Richards Bay Central', phone: '061 517 5974', email: 'pma.sales1@parts-mall.com', lat: -28.7707857, lng: 32.0577775, hours: TRADE_HOURS },

  // --- Eastern Cape (1) -----------------------------------------------------
  { slug: 'port-elizabeth', name: 'Gqeberha, Port Elizabeth', province: 'Eastern Cape', country: 'South Africa', address: '1 Wynne Street, Sydenham, Port Elizabeth', phone: '041 484 2896', email: 'pma.sales1@parts-mall.com', lat: -33.9339794, lng: 25.6005443, hours: TRADE_HOURS },

  // --- Western Cape (1) -----------------------------------------------------
  { slug: 'cape-town', name: 'Cape Town', province: 'Western Cape', country: 'South Africa', address: '400 Voortrekker Road, Parow, Cape Town', phone: '021 911 2156', email: 'koreancarparts2014@gmail.com', lat: -33.9114112, lng: 18.553955, hours: TRADE_HOURS },

  // --- Northern Cape (1) ----------------------------------------------------
  { slug: 'kuruman', name: 'Kuruman', province: 'Northern Cape', country: 'South Africa', address: '615 Tlhabane Road, Mothibistad, Kuruman, 8474', phone: '061 509 6941', email: 'sbeg.auto@gmail.com', lat: -27.4601585, lng: 23.4347857, hours: TRADE_HOURS },

  // --- Pan-Africa (5) -------------------------------------------------------
  { slug: 'botswana', name: 'Gaborone', province: 'Pan-Africa', country: 'Botswana', address: 'Plot 1239, Unit 3, Haile Selassie Road, Gaborone', phone: '+267 75 694 644', email: 'partsjunctionbw@gmail.com', lat: -24.6581357, lng: 25.9088474, hours: TRADE_HOURS },
  { slug: 'eswatini', name: 'Matsapha', province: 'Pan-Africa', country: 'Eswatini', address: 'Nkoseluhlazi Street, Manzini, M200', phone: '+268 7829 9060', email: 'pma.sales1@parts-mall.com', lat: -26.4976444, lng: 31.3750815, hours: TRADE_HOURS },
  { slug: 'mozambique', name: 'Maputo', province: 'Pan-Africa', country: 'Mozambique', address: 'Avenida Samora Machel Nr. 1206, Matola, Maputo 1102', phone: '+258 84 301 0935', email: 'mozambique@partsmall.co.za', lat: -25.966917, lng: 32.466956, hours: TRADE_HOURS },
  { slug: 'namibia', name: 'Windhoek', province: 'Pan-Africa', country: 'Namibia', address: '133 Sam Nujoma Drive, Windhoek West', phone: '+264 61 303 116', email: 'pma.sales1@parts-mall.com', lat: -22.5700284, lng: 17.0725706, hours: TRADE_HOURS },
  { slug: 'zimbabwe', name: 'Harare', province: 'Pan-Africa', country: 'Zimbabwe', address: '81 Belvedere Road, Fatima House, Belvedere, Harare', phone: '024 2576903', email: 'zimbabwe@partsmall.co.za', lat: -17.8363176, lng: 31.0333081, hours: TRADE_HOURS },
]

export const PROVINCE_ORDER = [
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
] as const

/**
 * Static-derived counts, kept only for the parts of the site still on
 * static data (the chat assistant, src/lib/chat/ai.ts, and the FAQ page's
 * generated answers, src/lib/data/faqs.ts — both explicitly deferred, see
 * the migration plan). Pages read the live equivalent instead:
 * getNetworkStats() in src/lib/payload/branches.ts.
 */
export const NETWORK = {
  total: BRANCHES.length,
  southAfrica: BRANCHES.filter((b) => b.country === 'South Africa').length,
  provinces: new Set(
    BRANCHES.filter((b) => b.province !== 'Pan-Africa').map((b) => b.province),
  ).size,
  countries: new Set(BRANCHES.map((b) => b.country)).size,
  panAfrican: BRANCHES.filter((b) => b.province === 'Pan-Africa').length,
}

/**
 * The one branch-matching implementation, shared by BranchFinder, the
 * floating WhatsApp picker and the chat assistant, so "find my branch" means
 * the same thing everywhere. Text match is a plain case-insensitive
 * substring test against name/province/country/address; when an origin is
 * given, results are sorted by real distance rather than text relevance.
 *
 * Takes the branch list as its first argument rather than closing over a
 * module-level array, because callers now source that list live (from
 * Payload, server-side) or as a prop (client components, which can't query
 * Payload themselves) — see src/lib/payload/branches.ts and BranchFinder.
 */
export function searchBranches(
  branches: Branch[],
  query: string,
  province: string,
  origin?: { lat: number; lng: number } | null,
  limit?: number,
): (Branch & { km?: number })[] {
  const q = query.trim().toLowerCase()
  let list: (Branch & { km?: number })[] = branches.filter((b) => {
    const inProvince = province === 'All' || b.province === province
    if (!inProvince) return false
    if (!q) return true
    return `${b.name} ${b.province} ${b.country} ${b.address}`.toLowerCase().includes(q)
  })

  if (origin) {
    list = list
      .map((b) => ({ ...b, km: distanceKm(origin, b) }))
      .sort((a, b) => (a.km ?? 0) - (b.km ?? 0))
  }
  return limit ? list.slice(0, limit) : list
}

/** Strips a South African number to the E.164 form wa.me expects. */
export function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `27${digits.slice(1)}` : digits
}

export function telHref(phone: string) {
  return `tel:+${whatsappNumber(phone)}`
}

export function mapsHref(branch: Pick<Branch, 'address' | 'name'>) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Parts-Mall ${branch.name} ${branch.address}`,
  )}`
}

/** Great-circle distance in km. Used by the "nearest branch" flow. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}
