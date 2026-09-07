import type { Faq } from '@/lib/data/catalogue'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://partsmall.co.za'

/**
 * Truncates a meta description at a word boundary.
 *
 * A hard slice leaves descriptions ending mid-word ("...in a manual veh"),
 * which looks broken in a result listing. This trims back to the last sentence
 * end where one is close enough, otherwise to the last whole word.
 */
export function metaDescription(text: string, limit = 155) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= limit) return clean

  const window = clean.slice(0, limit)
  const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('? '))
  if (sentenceEnd > limit * 0.6) return window.slice(0, sentenceEnd + 1)

  const wordEnd = window.lastIndexOf(' ')
  return `${window.slice(0, wordEnd > 0 ? wordEnd : limit).replace(/[,;:]$/, '')}...`
}

/**
 * Structured data helpers.
 *
 * Breadcrumbs matter more than usual here because the taxonomy is three and
 * four levels deep. They give search engines the hierarchy explicitly and
 * produce the path display in results instead of a bare URL.
 *
 * FAQPage is the AEO lever: it is the format assistants and featured snippets
 * lift answers from. Every question on the page must be visible to the user,
 * never schema-only, or it is a guidelines violation.
 */

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function faqLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function collectionLd({
  name,
  description,
  path,
  items,
}: {
  name: string
  description: string
  path: string
  items: { name: string; path: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${SITE_URL}${path}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: `${SITE_URL}${it.path}`,
      })),
    },
  }
}

/**
 * The intersection page. `isAccessoryOrSparePartFor` is the correct vocabulary
 * for "this part is for this vehicle", and it is what ties the part type to the
 * vehicle entity for a query like "kia rio clutch kit".
 */
export function vehiclePartLd({
  partLabel,
  makeLabel,
  modelLabel,
  bodyType,
  description,
  path,
}: {
  partLabel: string
  makeLabel: string
  modelLabel: string
  bodyType: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${partLabel} for the ${makeLabel} ${modelLabel}`,
    description,
    category: partLabel,
    url: `${SITE_URL}${path}`,
    brand: { '@type': 'Brand', name: 'Parts-Mall' },
    isAccessoryOrSparePartFor: {
      '@type': 'Vehicle',
      name: `${makeLabel} ${modelLabel}`,
      manufacturer: { '@type': 'Organization', name: makeLabel },
      model: modelLabel,
      bodyType,
    },
  }
}

/** Renders one or more JSON-LD blocks. */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
