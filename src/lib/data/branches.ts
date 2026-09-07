/**
 * The branch directory.
 *
 * 33 branches across 9 South African provinces, plus 5 pan-African country
 * points. 38 network points in total. Coordinates are real and are what the
 * network map plots.
 *
 * NOTE FOR THE CLIENT: the source records group Brits under Limpopo. Brits is
 * in North West. The grouping is preserved here rather than silently corrected,
 * because it is business data. Confirm and we will move it.
 */

export type Branch = {
  slug: string
  name: string
  province: string
  country: string
  address: string
  phone: string
  email: string
  lat: number
  lng: number
  hours: string
}

const TRADE_HOURS = 'Mon to Fri 08:00 to 17:00, Sat 08:00 to 13:00'

export const BRANCHES: Branch[] = [
  // --- Gauteng (13) ---------------------------------------------------------
  { slug: 'alberton', name: 'Alberton', province: 'Gauteng', country: 'South Africa', address: '34 Heidelberg Road, New Redruth, Alberton', phone: '011 869 2044', email: 'alberton@partsmall.co.za', lat: -26.2669894, lng: 28.1220546, hours: TRADE_HOURS },
  { slug: 'benoni', name: 'Benoni', province: 'Gauteng', country: 'South Africa', address: '101 Tom Jones Street, Benoni CBD, Benoni', phone: '011 421 8740', email: 'benoni@partsmall.co.za', lat: -26.1930356, lng: 28.3082376, hours: TRADE_HOURS },
  { slug: 'boksburg', name: 'Boksburg', province: 'Gauteng', country: 'South Africa', address: '18 Trichardts Road, Boksburg North, Boksburg', phone: '011 826 5512', email: 'boksburg@partsmall.co.za', lat: -26.2124639, lng: 28.2617471, hours: TRADE_HOURS },
  { slug: 'edenvale', name: 'Edenvale', province: 'Gauteng', country: 'South Africa', address: '52 Van Riebeeck Avenue, Edenvale Central, Edenvale', phone: '011 452 1036', email: 'edenvale@partsmall.co.za', lat: -26.1366667, lng: 28.1511111, hours: TRADE_HOURS },
  { slug: 'joburg-cbd-booysens', name: 'Joburg CBD, Booysens', province: 'Gauteng', country: 'South Africa', address: '211 Booysens Road, Selby South, Johannesburg', phone: '011 493 1182', email: 'booysens@partsmall.co.za', lat: -26.2291667, lng: 28.0247222, hours: TRADE_HOURS },
  { slug: 'joburg-cbd-main-str', name: 'Joburg CBD, Main Street', province: 'Gauteng', country: 'South Africa', address: '147 Main Street, Marshalltown, Johannesburg', phone: '011 838 4496', email: 'mainstreet@partsmall.co.za', lat: -26.2054009, lng: 28.054305, hours: TRADE_HOURS },
  { slug: 'pretoria-cbd', name: 'Pretoria CBD', province: 'Gauteng', country: 'South Africa', address: '278 Paul Kruger Street, Pretoria Central, Pretoria', phone: '012 323 0471', email: 'pretoriacbd@partsmall.co.za', lat: -25.751642, lng: 28.1884978, hours: TRADE_HOURS },
  { slug: 'pretoria-gezina', name: 'Pretoria Gezina', province: 'Gauteng', country: 'South Africa', address: '651 Steve Biko Road, Gezina, Pretoria', phone: '012 335 7050', email: 'gezina@partsmall.co.za', lat: -25.7215085, lng: 28.2030066, hours: TRADE_HOURS },
  { slug: 'randburg', name: 'Randburg', province: 'Gauteng', country: 'South Africa', address: '43 Bram Fischer Drive, Ferndale, Randburg', phone: '011 781 4625', email: 'randburg@partsmall.co.za', lat: -26.0897342, lng: 28.0068242, hours: TRADE_HOURS },
  { slug: 'randfontein', name: 'Randfontein', province: 'Gauteng', country: 'South Africa', address: '16 Main Reef Road, Randfontein CBD, Randfontein', phone: '011 692 3184', email: 'randfontein@partsmall.co.za', lat: -26.173611, lng: 27.694167, hours: TRADE_HOURS },
  { slug: 'roodepoort', name: 'Roodepoort', province: 'Gauteng', country: 'South Africa', address: '118 Ontdekkers Road, Horizon View, Roodepoort', phone: '011 760 2857', email: 'roodepoort@partsmall.co.za', lat: -26.1438628, lng: 27.8768199, hours: TRADE_HOURS },
  { slug: 'soweto', name: 'Soweto', province: 'Gauteng', country: 'South Africa', address: '8527 Chris Hani Road, Rockville, Soweto', phone: '011 938 6402', email: 'soweto@partsmall.co.za', lat: -26.2227778, lng: 27.89, hours: TRADE_HOURS },
  { slug: 'wynberg', name: 'Wynberg', province: 'Gauteng', country: 'South Africa', address: '24 5th Street, Wynberg, Sandton', phone: '011 440 9308', email: 'wynberg@partsmall.co.za', lat: -26.1069723, lng: 28.0816219, hours: TRADE_HOURS },

  // --- Limpopo (6) ----------------------------------------------------------
  { slug: 'bela-bela', name: 'Bela-Bela', province: 'Limpopo', country: 'South Africa', address: '73 Potgieter Road, Bela-Bela Central, Bela-Bela', phone: '014 736 1940', email: 'belabela@partsmall.co.za', lat: -24.8806014, lng: 28.2904774, hours: TRADE_HOURS },
  { slug: 'brits', name: 'Brits', province: 'Limpopo', country: 'South Africa', address: '28 De Winton Street, Elandsrand, Brits', phone: '012 252 1187', email: 'brits@partsmall.co.za', lat: -25.6297222, lng: 27.7841667, hours: TRADE_HOURS },
  { slug: 'burgersfort', name: 'Burgersfort', province: 'Limpopo', country: 'South Africa', address: '16 Dirk Winterbach Street, Burgersfort CBD, Burgersfort', phone: '013 231 0246', email: 'burgersfort@partsmall.co.za', lat: -24.673611, lng: 30.328333, hours: TRADE_HOURS },
  { slug: 'polokwane', name: 'Polokwane', province: 'Limpopo', country: 'South Africa', address: '35 Biccard Street, Polokwane Central, Polokwane', phone: '015 295 6384', email: 'polokwane@partsmall.co.za', lat: -23.9058333, lng: 29.4613889, hours: TRADE_HOURS },
  { slug: 'thohoyandou', name: 'Thohoyandou', province: 'Limpopo', country: 'South Africa', address: '12 Mphephu Drive, Thohoyandou Block F, Thohoyandou', phone: '015 962 4551', email: 'thohoyandou@partsmall.co.za', lat: -22.9676429, lng: 30.4596582, hours: TRADE_HOURS },
  { slug: 'tzaneen', name: 'Tzaneen', province: 'Limpopo', country: 'South Africa', address: '49 Agatha Street, Aqua Park, Tzaneen', phone: '015 307 7092', email: 'tzaneen@partsmall.co.za', lat: -23.8319444, lng: 30.1611111, hours: TRADE_HOURS },

  // --- Free State (3) -------------------------------------------------------
  { slug: 'bethlehem', name: 'Bethlehem', province: 'Free State', country: 'South Africa', address: '10 Muller Street, Bethlehem Central, Bethlehem', phone: '058 303 5176', email: 'bethlehem@partsmall.co.za', lat: -28.2308333, lng: 28.3088889, hours: TRADE_HOURS },
  { slug: 'bloemfontein', name: 'Bloemfontein', province: 'Free State', country: 'South Africa', address: '76 Nelson Mandela Drive, Westdene, Bloemfontein', phone: '051 430 1188', email: 'bloemfontein@partsmall.co.za', lat: -29.111302, lng: 26.207401, hours: TRADE_HOURS },
  { slug: 'welkom', name: 'Welkom', province: 'Free State', country: 'South Africa', address: '14 Jan Hofmeyr Road, Bedelia, Welkom', phone: '057 352 4107', email: 'welkom@partsmall.co.za', lat: -27.982298, lng: 26.737969, hours: TRADE_HOURS },

  // --- North West (3) -------------------------------------------------------
  { slug: 'mahikeng', name: 'Mahikeng', province: 'North West', country: 'South Africa', address: '27 Shippard Street, Mmabatho Unit 2, Mahikeng', phone: '018 381 7440', email: 'mahikeng@partsmall.co.za', lat: -25.863611, lng: 25.658611, hours: TRADE_HOURS },
  { slug: 'potchefstroom', name: 'Potchefstroom', province: 'North West', country: 'South Africa', address: '55 Nelson Mandela Drive, Potchefstroom Central, Potchefstroom', phone: '018 293 6802', email: 'potchefstroom@partsmall.co.za', lat: -26.707778, lng: 27.095833, hours: TRADE_HOURS },
  { slug: 'rustenburg', name: 'Rustenburg', province: 'North West', country: 'South Africa', address: '112 Beyers Naude Drive, Rustenburg CBD, Rustenburg', phone: '014 592 2145', email: 'rustenburg@partsmall.co.za', lat: -25.665655, lng: 27.241448, hours: TRADE_HOURS },

  // --- Mpumalanga (2) -------------------------------------------------------
  { slug: 'middelburg', name: 'Middelburg', province: 'Mpumalanga', country: 'South Africa', address: '24 Cowen Ntuli Street, Middelburg Central, Middelburg', phone: '013 243 2180', email: 'middelburg@partsmall.co.za', lat: -25.7678012, lng: 29.4555234, hours: TRADE_HOURS },
  { slug: 'nelspruit', name: 'Mbombela, Nelspruit', province: 'Mpumalanga', country: 'South Africa', address: '18 Samora Machel Drive, Mbombela Central, Mbombela', phone: '013 752 8041', email: 'mbombela@partsmall.co.za', lat: -25.4729094, lng: 30.9772719, hours: TRADE_HOURS },

  // --- Western Cape (1) -----------------------------------------------------
  { slug: 'cape-town', name: 'Cape Town', province: 'Western Cape', country: 'South Africa', address: '400 Voortrekker Road, Parow, Cape Town', phone: '021 911 2156', email: 'capetown@partsmall.co.za', lat: -33.9114112, lng: 18.553955, hours: TRADE_HOURS },

  // --- KwaZulu-Natal (3) ----------------------------------------------------
  { slug: 'durban-north', name: 'Durban North', province: 'KwaZulu-Natal', country: 'South Africa', address: '37 Chris Hani Road, Briardene, Durban North', phone: '031 569 4032', email: 'durbannorth@partsmall.co.za', lat: -29.7965216, lng: 31.0154196, hours: TRADE_HOURS },
  { slug: 'port-shepstone', name: 'Port Shepstone', province: 'KwaZulu-Natal', country: 'South Africa', address: '1 Commercial Road, Marburg, Port Shepstone', phone: '039 682 1067', email: 'portshepstone@partsmall.co.za', lat: -30.742778, lng: 30.450556, hours: TRADE_HOURS },
  { slug: 'richards-bay', name: 'Richards Bay', province: 'KwaZulu-Natal', country: 'South Africa', address: '65 Dollar Drive, CBD, Richards Bay', phone: '035 789 4420', email: 'richardsbay@partsmall.co.za', lat: -28.7707857, lng: 32.0577775, hours: TRADE_HOURS },

  // --- Eastern Cape (1) -----------------------------------------------------
  { slug: 'port-elizabeth', name: 'Gqeberha, Port Elizabeth', province: 'Eastern Cape', country: 'South Africa', address: '142 Govan Mbeki Avenue, North End, Gqeberha', phone: '041 487 3018', email: 'gqeberha@partsmall.co.za', lat: -33.9400604, lng: 25.605493, hours: TRADE_HOURS },

  // --- Northern Cape (1) ----------------------------------------------------
  { slug: 'kuruman', name: 'Kuruman', province: 'Northern Cape', country: 'South Africa', address: '7 Main Road, Kuruman CBD, Kuruman', phone: '053 712 4805', email: 'kuruman@partsmall.co.za', lat: -27.4601585, lng: 23.4347857, hours: TRADE_HOURS },

  // --- Pan-Africa (5) -------------------------------------------------------
  { slug: 'botswana', name: 'Gaborone', province: 'Pan-Africa', country: 'Botswana', address: 'Plot 54125, Gaborone West Industrial, Gaborone', phone: '071 845 2201', email: 'botswana@partsmall.co.za', lat: -24.6581357, lng: 25.9088474, hours: TRADE_HOURS },
  { slug: 'eswatini', name: 'Matsapha', province: 'Pan-Africa', country: 'Eswatini', address: 'Mhlambanyatsi Road, Matsapha Industrial, Matsapha', phone: '072 336 4810', email: 'eswatini@partsmall.co.za', lat: -26.494482, lng: 31.308351, hours: TRADE_HOURS },
  { slug: 'mozambique', name: 'Maputo', province: 'Pan-Africa', country: 'Mozambique', address: 'Avenida de Angola 127, Baixa, Maputo', phone: '073 550 2846', email: 'mozambique@partsmall.co.za', lat: -25.966213, lng: 32.56745, hours: TRADE_HOURS },
  { slug: 'namibia', name: 'Windhoek', province: 'Pan-Africa', country: 'Namibia', address: '28 Newcastle Street, Northern Industrial, Windhoek', phone: '074 266 1904', email: 'namibia@partsmall.co.za', lat: -22.5198897, lng: 17.0744236, hours: TRADE_HOURS },
  { slug: 'zimbabwe', name: 'Harare', province: 'Pan-Africa', country: 'Zimbabwe', address: '17 Plymouth Road, Southerton, Harare', phone: '078 441 9042', email: 'zimbabwe@partsmall.co.za', lat: -17.8614534, lng: 31.0230739, hours: TRADE_HOURS },
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

/** Counts used across the site. Derived, never hand-typed, so they cannot drift. */
export const NETWORK = {
  total: BRANCHES.length,
  southAfrica: BRANCHES.filter((b) => b.country === 'South Africa').length,
  provinces: new Set(
    BRANCHES.filter((b) => b.province !== 'Pan-Africa').map((b) => b.province),
  ).size,
  countries: new Set(BRANCHES.map((b) => b.country)).size,
  panAfrican: BRANCHES.filter((b) => b.province === 'Pan-Africa').length,
}

export function branchesByProvince() {
  return PROVINCE_ORDER.map((province) => ({
    province,
    branches: BRANCHES.filter((b) => b.province === province),
  })).filter((g) => g.branches.length > 0)
}

export function getBranch(slug: string) {
  return BRANCHES.find((b) => b.slug === slug)
}

/**
 * The one branch-matching implementation, shared by BranchFinder, the
 * floating WhatsApp picker and the chat assistant, so "find my branch" means
 * the same thing everywhere. Text match is a plain case-insensitive
 * substring test against name/province/country/address; when an origin is
 * given, results are sorted by real distance rather than text relevance.
 */
export function searchBranches(
  query: string,
  province: string,
  origin?: { lat: number; lng: number } | null,
  limit?: number,
): (Branch & { km?: number })[] {
  const q = query.trim().toLowerCase()
  let list: (Branch & { km?: number })[] = BRANCHES.filter((b) => {
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
