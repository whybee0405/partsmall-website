/**
 * The branch directory: a static mirror of the branches registered in the CMS.
 *
 * 42 branches across 9 South African provinces, plus 5 pan-African country
 * points: 47 network points in total, matching the active branches in the
 * CloudIA CMS as of 2026-11-06. The site itself reads branches live from the
 * CMS (src/lib/cms/branches.ts); this copy only feeds the build-time map
 * generators in scripts/. Re-sync it from the CMS whenever branches are added
 * or removed there, then re-run those scripts.
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
  photo?: number | string | {
    url?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
}

const TRADE_HOURS = 'Mon to Fri 08:00 to 17:00, Sat 08:00 to 13:00'

export const BRANCHES: Branch[] = [
  // --- Gauteng (16) ----------------------------------------------------------
  { slug: 'alberton', name: 'Alberton', province: 'Gauteng', country: 'South Africa', address: 'Shop No 5, Nevada Centre, 68 Voortrekker Road, Alberton', phone: '011 869 0593', email: 'pmalberton1201@gmail.com', whatsapp: '27664246951', lat: -26.2669894, lng: 28.1220546, hours: TRADE_HOURS },
  { slug: 'benoni', name: 'Benoni', province: 'Gauteng', country: 'South Africa', address: '29 Tom Jones Street, Benoni', phone: '010 510 5060', email: 'koreanautopartsbenoni@gmail.com', whatsapp: '27751171690', lat: -26.1858654, lng: 28.3144663, hours: TRADE_HOURS },
  { slug: 'boksburg', name: 'Boksburg', province: 'Gauteng', country: 'South Africa', address: 'Venter Centre, Cnr Rietfontein Road & North Rand Road, Boksburg', phone: '011 823 1655', email: 'pmabok0429@gmail.com', whatsapp: '27660827417', lat: -26.2124639, lng: 28.2617471, hours: TRADE_HOURS },
  { slug: 'edenvale', name: 'Edenvale', province: 'Gauteng', country: 'South Africa', address: '123 Van Riebeeck Ave, Edenvale, Johannesburg, 1609', phone: '011 462 0332', email: 'partsmalledenvale@gmail.com', whatsapp: '27660030842', lat: -26.1258249, lng: 28.142812, hours: TRADE_HOURS },
  { slug: 'joburg-cbd-booysens', name: 'Joburg CBD, Booysens', province: 'Gauteng', country: 'South Africa', address: 'Shop 6, Retro City Centre, 21 Booysens Road, Booysens, Johannesburg', phone: '011 493 5924', email: 'Koreanparts2013@gmail.com', whatsapp: '27768645214', lat: -26.2304139, lng: 28.0281432, hours: TRADE_HOURS },
  { slug: 'joburg-cbd-main-str', name: 'Joburg CBD, Main Street', province: 'Gauteng', country: 'South Africa', address: '179 Main Street, City and Suburban, Johannesburg, 2094', phone: '010 020 5402', email: 'kapjhb@koreanautoparts.co.za', whatsapp: '27713515570', lat: -26.2074695, lng: 28.0424417, hours: TRADE_HOURS },
  { slug: 'lenasia', name: 'Lenasia', province: 'Gauteng', country: 'South Africa', address: '19 Rose Ave, C/O 3 Pelikaan Ave, Lenasia, 1831', phone: '011 854 1856', whatsapp: '27827644380', lat: -26.3212287, lng: 27.8320393, hours: TRADE_HOURS },
  { slug: 'pretoria-cbd', name: 'Pretoria CBD', province: 'Gauteng', country: 'South Africa', address: '384 Johannes Ramokhoase Street, Pretoria Central, Pretoria, 0002', phone: '012 326 1551', email: 'myungchasa@gmail.com', whatsapp: '27647571008', lat: -25.7518426, lng: 28.1899743, hours: TRADE_HOURS },
  { slug: 'pretoria-gezina', name: 'Pretoria Gezina', province: 'Gauteng', country: 'South Africa', address: '430 Steve Biko Road, Gezina, Pretoria', phone: '087 265 7622/8636', email: 'gezinapartsmall@gmail.com', whatsapp: '27662329056', lat: -25.7215085, lng: 28.2030066, hours: TRADE_HOURS },
  { slug: 'van-der-hoff', name: 'Pretoria Van Der Hoff', province: 'Gauteng', country: 'South Africa', address: '389 Van Der Hoff Rd, Pretoria Gardens, Tshwane, 0081', phone: '012 065 1074', email: 'partsmallvanderhoff@gmail.com', whatsapp: '27614940774', lat: -25.7227778, lng: 28.1488889, hours: TRADE_HOURS },
  { slug: 'randburg', name: 'Randburg', province: 'Gauteng', country: 'South Africa', address: '191 Bram Fischer Drive, Ferndale, Randburg, 2194', phone: '010 211 9539', email: 'partsmall.randburg@gmail.com', whatsapp: '27608448257', lat: -26.0897342, lng: 28.0068242, hours: TRADE_HOURS },
  { slug: 'randfontein', name: 'Randfontein', province: 'Gauteng', country: 'South Africa', address: '2 Potgieter Street, Westergloor, Randfontein, 1759', phone: '071 003 3880', email: 'fastlanemotorspares@gmail.com', whatsapp: '27710033880', lat: -26.173611, lng: 27.694167, hours: TRADE_HOURS },
  { slug: 'roodepoort', name: 'Roodepoort', province: 'Gauteng', country: 'South Africa', address: 'Shop 6 The Gordon Shopping Centre, 56 Hendrik Potgieter, Florida North, Roodepoort', phone: '011 674 0295', email: 'partsmallrp@gmail.com', whatsapp: '27767193696', lat: -26.1720806, lng: 27.94056, hours: TRADE_HOURS },
  { slug: 'soweto', name: 'Soweto', province: 'Gauteng', country: 'South Africa', address: '318/73 Chris Hani Road, Soweto', phone: '010 630 0406', email: 'Partsmallsoweto@gmail.com', whatsapp: '27822175993', lat: -26.2627829, lng: 27.9662671, hours: TRADE_HOURS },
  { slug: 'vereeniging', name: 'Vereeniging', province: 'Gauteng', country: 'South Africa', address: 'Shop 3, 36 Voortrekker St, Vereeniging, 1930', phone: '011 499 4004', email: 'partsmallvereeniging@gmail.com', whatsapp: '27782344444', lat: -26.6823837, lng: 27.9299449, hours: TRADE_HOURS },
  { slug: 'wynberg', name: 'Wynberg', province: 'Gauteng', country: 'South Africa', address: '593 Louis Botha Avenue, Bramley, Johannesburg, 2018', phone: '0644544500', email: 'koreanautopartswynberg@gmail.com', whatsapp: '27644544500', lat: -26.1243982, lng: 28.0854143, hours: TRADE_HOURS },

  // --- Limpopo (5) -----------------------------------------------------------
  { slug: 'bela-bela', name: 'Bela-Bela', province: 'Limpopo', country: 'South Africa', address: 'Potgieter Street, R101 Business Park, Unit E1A, Bela Bela, 0480', phone: '0846281745', email: 'vicent.mn101@gmail.com', whatsapp: '27846281745', lat: -24.8806014, lng: 28.2904774, hours: TRADE_HOURS },
  { slug: 'burgersfort', name: 'Burgersfort', province: 'Limpopo', country: 'South Africa', address: '1A Dirk Winterbach Street, Burgersfort, 1150', phone: '064 532 9037', email: 'segwata.infinity@gmail.com', whatsapp: '27767005650', lat: -24.673611, lng: 30.328333, hours: TRADE_HOURS },
  { slug: 'polokwane', name: 'Polokwane', province: 'Limpopo', country: 'South Africa', address: '67 Market St, Polokwane Central, Polokwane, 0700', phone: '015 230 0021', email: 'k.partsmall.polokwane@gmail.com', whatsapp: '27664488888', lat: -23.9058333, lng: 29.4613889, hours: TRADE_HOURS },
  { slug: 'thohoyandou', name: 'Thohoyandou', province: 'Limpopo', country: 'South Africa', address: 'Shop 16, Shoprite Checkers Sibasa, Erf Muliwani, Sibasa, Thohoyandou, 0970', phone: '064 524 2463', email: 'rulindetrading@outlook.com', whatsapp: '27782368819', lat: -22.9676429, lng: 30.4596582, hours: TRADE_HOURS },
  { slug: 'tzaneen', name: 'Tzaneen', province: 'Limpopo', country: 'South Africa', address: 'Shop 6, 5 Skirving Street, Tzaneen, 0850', phone: '084 235 2406', email: 'krp.parts1@gmail.com', whatsapp: '27842352406', lat: -23.8311529, lng: 30.1614004, hours: TRADE_HOURS },

  // --- Mpumalanga (4) --------------------------------------------------------
  { slug: 'ermelo', name: 'Ermelo', province: 'Mpumalanga', country: 'South Africa', address: '21B, 56 Kerk Street, Ermelo, 2351', phone: '061 110 6027', email: 'partsmallermelo@gmail.com', whatsapp: '27611106027', lat: -26.5110587, lng: 29.9825062, hours: TRADE_HOURS },
  { slug: 'nelspruit', name: 'Mbombela, Nelspruit', province: 'Mpumalanga', country: 'South Africa', address: '10 Cameroon Street, Nelspruit', phone: '013 752 2497', email: 'sakorea8249@gmail.com', whatsapp: '27721970834', lat: -25.4729094, lng: 30.9772719, hours: TRADE_HOURS },
  { slug: 'middelburg', name: 'Middelburg', province: 'Mpumalanga', country: 'South Africa', address: '23 Bhimy Damane Street, Middelburg, 1050', phone: '065 668 0053', email: 'partsmallmiddelburg@gmail.com', whatsapp: '27656680053', lat: -25.765014, lng: 29.4593145, hours: TRADE_HOURS },
  { slug: 'secunda', name: 'Secunda', province: 'Mpumalanga', country: 'South Africa', address: '2 Vaalrivier St, Secunda, 2302', phone: '017 634 9160', email: 'partsmall@gatsby1.com', whatsapp: '27791525398', lat: -26.5217512, lng: 29.2223494, hours: TRADE_HOURS },

  // --- North West (4) --------------------------------------------------------
  { slug: 'brits', name: 'Brits', province: 'North West', country: 'South Africa', address: '107 Ludorf Street, Brits, 0250', phone: '072 282 8763', email: 'nwkoreanparts2@gmail.com', whatsapp: '27722828763', lat: -25.6351161, lng: 27.7765963, hours: TRADE_HOURS },
  { slug: 'mahikeng', name: 'Mahikeng', province: 'North West', country: 'South Africa', address: '5 First Street, Industrial Site, Mahikeng, 2735', phone: '082 591 0439', email: 'nwkmahikeng@gmail.com', whatsapp: '27825910439', lat: -25.863611, lng: 25.658611, hours: TRADE_HOURS },
  { slug: 'potchefstroom', name: 'Potchefstroom', province: 'North West', country: 'South Africa', address: 'Shop No. 1, Owens Ave, 22 Auto Ave, Potchefstroom, 2530', phone: '072 982 1016', email: 'koreanpartspotch@gmail.com', whatsapp: '27604726532', lat: -26.7126603, lng: 27.0961757, hours: TRADE_HOURS },
  { slug: 'rustenburg', name: 'Rustenburg', province: 'North West', country: 'South Africa', address: '38 Loop St, Rustenburg, 2999', phone: '014 592 0459', email: 'sales1.nwkorean@gmail.com', whatsapp: '27810653784', lat: -25.6722318, lng: 27.2357257, hours: TRADE_HOURS },

  // --- Free State (4) --------------------------------------------------------
  { slug: 'bethlehem', name: 'Bethlehem', province: 'Free State', country: 'South Africa', address: '67 Commissioner Street, Bethlehem, 9701', phone: '058 303 0659', email: 'sales@bhmpartsmall.co.za', whatsapp: '27796052161', lat: -28.2278868, lng: 28.3059434, hours: TRADE_HOURS },
  { slug: 'bloemfontein', name: 'Bloemfontein', province: 'Free State', country: 'South Africa', address: 'Shop No. 5, Medi Inn Centre, 79 Harvey Rd, Oranjesig, Bloemfontein, 9301', phone: '071 502 6694', email: 'nwkbloem@gmail.com', whatsapp: '27715026694', lat: -29.1360303, lng: 26.2173483, hours: TRADE_HOURS },
  { slug: 'new-bloemfontein', name: 'New Bloemfontein', province: 'Free State', country: 'South Africa', address: '120A Nelson Mandela Drive, Westdene, Bloemfontein, 9300', phone: '063 817 2473', email: 'Sales3@koreanautopartsbfn.co.za', whatsapp: '27638172473', lat: -29.1114587, lng: 26.2081688, hours: TRADE_HOURS },
  { slug: 'welkom', name: 'Welkom', province: 'Free State', country: 'South Africa', address: '145 Jan Hofmeyr Road, Industrial Area, Voorspoed, Welkom, 9459', phone: '084 786 5152', email: 'pma.sales1@parts-mall.com', whatsapp: '27847865152', lat: -27.982298, lng: 26.737969, hours: TRADE_HOURS },

  // --- KwaZulu-Natal (4) -----------------------------------------------------
  { slug: 'durban-north', name: 'Durban North (Balito)', province: 'KwaZulu-Natal', country: 'South Africa', address: 'Ballito Business Park, 13 Douglas Crowe Dr, Ballito, 4420', phone: '031 100 1121', email: 'ushaka.spares@gmail.com', whatsapp: '27615304071', lat: -29.7554339, lng: 31.0482992, hours: TRADE_HOURS },
  { slug: 'pietermaritzburg', name: 'Pietermaritzburg', province: 'KwaZulu-Natal', country: 'South Africa', address: '146 Greyling Street, Pietermaritzburg, KwaZulu-Natal', phone: '27 33 032 0137', email: 'admin@infinityautomotive.co.za', whatsapp: '27330320137', lat: -29.59632225611067, lng: 30.375335939036347, hours: TRADE_HOURS },
  { slug: 'port-shepstone', name: 'Port Shepstone', province: 'KwaZulu-Natal', country: 'South Africa', address: 'Shop 8 Fairways Business Park, Marburg, Port Shepstone', phone: '039 032 0008', email: 'partsmallpssales1@gmail.com', whatsapp: '27839946420', lat: -30.742778, lng: 30.450556, hours: TRADE_HOURS },
  { slug: 'richards-bay', name: 'Richards Bay', province: 'KwaZulu-Natal', country: 'South Africa', address: '7 Rupee Rif, Unit 8, Richards Bay Central', phone: '061 517 5974', email: 'Sales@ncks.co.za', whatsapp: '27713675957', lat: -28.7707857, lng: 32.0577775, hours: TRADE_HOURS },

  // --- Eastern Cape (2) ------------------------------------------------------
  { slug: 'port-elizabeth', name: 'Gqeberha, Port Elizabeth', province: 'Eastern Cape', country: 'South Africa', address: '1 Wynne Street, Sydenham, Port Elizabeth', phone: '041 484 2896', email: 'sales1@shamama.co.za', whatsapp: '27760209557', lat: -33.9339794, lng: 25.6005443, hours: TRADE_HOURS },
  { slug: 'mthata', name: 'Mthatha', province: 'Eastern Cape', country: 'South Africa', address: 'Parts Mall Mthatha North Crest SuperSpar Hill Crest Shopping Centre 16 Durban Road Mthatha 5100', phone: '079 956 9718', lat: -31.573389, lng: 28.796077, hours: TRADE_HOURS },

  // --- Western Cape (2) ------------------------------------------------------
  { slug: 'cape-town', name: 'Cape Town', province: 'Western Cape', country: 'South Africa', address: '400 Voortrekker Road, Parow, Cape Town', phone: '021 911 2156', email: 'koreancarparts2014@gmail.com', whatsapp: '27613536109', lat: -33.9114112, lng: 18.553955, hours: TRADE_HOURS },
  { slug: 'cape-town-diep-river', name: 'Cape Town, Diep River', province: 'Western Cape', country: 'South Africa', address: '194 Main Road, Diep River, Cape Town, 7800', phone: '021 879 2685', email: 'koreancarparts2022@gmail.com', whatsapp: '27676013410', lat: -34.0438569, lng: 18.4633588, hours: TRADE_HOURS },

  // --- Northern Cape (1) -----------------------------------------------------
  { slug: 'kuruman', name: 'Kuruman', province: 'Northern Cape', country: 'South Africa', address: '615 Tlhabane Road, Mothibistad, Kuruman, 8474', phone: '061 509 6941', email: 'sbeg.auto@gmail.com', whatsapp: '2761 509 6941', lat: -27.4601585, lng: 23.4347857, hours: TRADE_HOURS },

  // --- Pan-Africa (5) --------------------------------------------------------
  { slug: 'botswana', name: 'Gaborone', province: 'Pan-Africa', country: 'Botswana', address: 'Plot 1239, Unit 3, Haile Selassie Road, Gaborone West, Gaborone', phone: '+267 75 694 644', email: 'sales1@partsmall.co.bw', whatsapp: '+267 75 868 848', lat: -24.6581357, lng: 25.9088474, hours: TRADE_HOURS },
  { slug: 'zimbabwe', name: 'Harare', province: 'Pan-Africa', country: 'Zimbabwe', address: '81 Belvedere Road, Fatima House, Belvedere, Harare', phone: '024 2576903', email: 'sales@partsmallzim.co.zw', whatsapp: '263774813345', lat: -17.8363176, lng: 31.0333081, hours: TRADE_HOURS },
  { slug: 'eswatini', name: 'Manzini', province: 'Pan-Africa', country: 'Eswatini', address: 'Nkoseluhlazi Street, Manzini, M200', phone: '+268 7829 9060', email: 'eswatinipartsmall@gmail.com', whatsapp: '+268 7829 9060', lat: -26.4976444, lng: 31.3750815, hours: TRADE_HOURS },
  { slug: 'mozambique', name: 'Maputo', province: 'Pan-Africa', country: 'Mozambique', address: 'Avenida Samora Machel Nr. 1206, Matola, Maputo 1102', phone: '+258 84 301 0935', email: 'Info@parts-mall.co.mz', whatsapp: '258 84 301 0945', lat: -25.966917, lng: 32.466956, hours: TRADE_HOURS },
  { slug: 'namibia', name: 'Windhoek', province: 'Pan-Africa', country: 'Namibia', address: '133 Sam Nujoma Drive, Windhoek West', phone: '+264 61 303 116', email: 'korean@iway.na', whatsapp: '27812482246', lat: -22.5700284, lng: 17.0725706, hours: TRADE_HOURS },
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
 * Network counts derived from a branch list. Every count shown on the site
 * goes through this with the live CMS branch list, via getNetworkStats() in
 * src/lib/cms/branches.ts, so nothing on a page is typed in by hand.
 */
export function computeNetworkStats(branches: Branch[]) {
  const panAfrica = branches.filter((b) => b.province === 'Pan-Africa')
  return {
    total: branches.length,
    southAfrica: branches.filter((b) => b.country === 'South Africa').length,
    provinces: new Set(
      branches.filter((b) => b.province !== 'Pan-Africa').map((b) => b.province),
    ).size,
    countries: new Set(branches.map((b) => b.country)).size,
    panAfrican: panAfrica.length,
    /** South African provinces with at least one branch, in PROVINCE_ORDER. */
    provinceNames: PROVINCE_ORDER.filter(
      (p) => p !== 'Pan-Africa' && branches.some((b) => b.province === p),
    ).join(', '),
    /** "Botswana, Eswatini, Mozambique, Namibia and Zimbabwe" */
    panAfricanCountries: joinWithAnd([...new Set(panAfrica.map((b) => b.country))].sort()),
  }
}

export type NetworkStats = ReturnType<typeof computeNetworkStats>

function joinWithAnd(items: string[]) {
  return items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
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
 * the CMS, server-side) or as a prop (client components, which can't query
 * the CMS themselves) — see src/lib/cms/branches.ts and BranchFinder.
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

/**
 * Returns the branch's dedicated WhatsApp number when the CMS has one, or its
 * regular phone number otherwise. Whitespace-only CMS values count as blank.
 */
export function branchWhatsappNumber(branch: Pick<Branch, 'phone' | 'whatsapp'>) {
  return whatsappNumber(branch.whatsapp?.trim() || branch.phone)
}

export function telHref(phone: string) {
  return `tel:+${whatsappNumber(phone)}`
}

export function mapsHref(branch: Pick<Branch, 'address'> & { country?: string }) {
  // Search by the street address alone (plus the country when the address doesn't
  // already name it). A "Parts-Mall <name>" prefix sends Google looking for a
  // business listing, which is often missing or points at the wrong branch.
  const query =
    branch.country && !branch.address.toLowerCase().includes(branch.country.toLowerCase())
      ? `${branch.address}, ${branch.country}`
      : branch.address
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
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
