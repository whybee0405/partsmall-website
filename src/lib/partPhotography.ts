/**
 * Real Parts-Mall product photography used across the parts catalogue.
 *
 * The CMS category image can be changed independently by editors, but these
 * paths ensure the public catalogue never falls back to the earlier generated
 * product renders while those records are being updated.
 */
const ROOT = '/images/parts/product-photography'

export const categoryPhotography: Record<string, string> = {
  braking: `${ROOT}/braking-brake-pads-set.webp`,
  engine: `${ROOT}/engine-gasket-kits.webp`,
  'electrical-sensors': `${ROOT}/electrical-alternators-and-starters.webp`,
  'suspension-steering': `${ROOT}/suspension-and-steering-components.webp`,
  filters: `${ROOT}/filters-service-filters.webp`,
  'transmission-clutch': `${ROOT}/transmission-clutch-kits.webp`,
  'cooling-system': `${ROOT}/cooling-radiators-and-fans.webp`,
  'fuel-system': `${ROOT}/filters-service-filters.webp`,
  'body-trim': `${ROOT}/body-bumpers-and-trim.webp`,
  bearings: `${ROOT}/suspension-tie-rods-ball-joints.webp`,
  'gaskets-seals': `${ROOT}/engine-gasket-kits.webp`,
  'belts-chains': `${ROOT}/engine-accessories-compressors-cylinder-head.webp`,
  accessories: `${ROOT}/product-range-overview.webp`,
}

const typePhotography: Record<string, string> = {
  'brake-pads': `${ROOT}/braking-brake-pads-set.webp`,
  'brake-shoes': `${ROOT}/braking-brake-shoes-set.webp`,
  'discs-rotors': `${ROOT}/braking-brake-discs-and-rotors.webp`,
  callipers: `${ROOT}/engine-accessories-compressors-cylinder-head.webp`,
  bushings: `${ROOT}/suspension-and-steering-components.webp`,
  'ball-joints': `${ROOT}/suspension-tie-rods-ball-joints.webp`,
  alternators: `${ROOT}/electrical-alternators-and-starters.webp`,
  'air-filters': `${ROOT}/filters-service-filters.webp`,
  'oil-filters': `${ROOT}/filters-service-filters.webp`,
  'fuel-filters': `${ROOT}/filters-service-filters.webp`,
  'clutch-kits': `${ROOT}/transmission-clutch-kits.webp`,
  radiators: `${ROOT}/cooling-radiators-and-fans.webp`,
  'fans-motors': `${ROOT}/cooling-radiators-and-fans.webp`,
  bumpers: `${ROOT}/body-bumpers-and-trim.webp`,
  'gasket-kits': `${ROOT}/engine-gasket-kits.webp`,
}

export function categoryPhoto(categorySlug: string) {
  return categoryPhotography[categorySlug] ?? `${ROOT}/product-range-overview.webp`
}

export function partTypePhoto(typeSlug: string, categorySlug: string) {
  return typePhotography[typeSlug] ?? categoryPhoto(categorySlug)
}
