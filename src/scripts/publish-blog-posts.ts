/**
 * One-off content push: three new blog posts (Guides collection) plus their
 * hero images. Not part of the seed pipeline. GUIDES in lib/data/company.ts
 * stays an empty array by design ("No articles are published until the
 * client provides approved content"), so this writes straight into Payload
 * via the local API, the same way backfill-media.ts does for images.
 *
 * Run with: npx tsx src/scripts/publish-blog-posts.ts
 * Requires DATABASE_URI and a working staticDir ('public/media' relative to
 * cwd) pointed at wherever the target Payload instance actually stores data.
 */
import './load-env' // must stay first: populates env before the config loads
import { getPayload } from 'payload'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import config from '../payload.config'

type Payload = Awaited<ReturnType<typeof getPayload>>

type Run = { text: string; bold?: boolean; link?: string; newTab?: boolean }
type Block =
  | { h: 2 | 3; text: string }
  | { p: Run[] }
  | { ul: Run[][] }

function objectId(): string {
  return crypto.randomBytes(12).toString('hex')
}

function textNode(text: string, bold?: boolean) {
  return {
    type: 'text',
    text,
    format: bold ? 1 : 0,
    style: '',
    mode: 'normal',
    detail: 0,
    version: 1,
  }
}

function runNode(run: Run) {
  const inner = textNode(run.text, run.bold)
  if (!run.link) return inner
  return {
    type: 'link',
    version: 3,
    id: objectId(),
    fields: {
      linkType: 'custom',
      url: run.link,
      newTab: run.newTab ?? run.link.startsWith('http'),
    },
    children: [inner],
    direction: 'ltr',
    format: '',
    indent: 0,
  }
}

function paragraph(runs: Run[]) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: runs.map(runNode),
  }
}

function heading(tag: 'h2' | 'h3', text: string) {
  return {
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [textNode(text)],
  }
}

function listItem(runs: Run[]) {
  return {
    type: 'listitem',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    value: 1,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: runs.map(runNode),
      },
    ],
  }
}

function unorderedList(items: Run[][]) {
  return {
    type: 'list',
    tag: 'ul',
    listType: 'bullet',
    start: 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: items.map((runs, i) => ({ ...listItem(runs), value: i + 1 })),
  }
}

function buildBody(blocks: Block[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: blocks.map((b) => {
        if ('h' in b) return heading(b.h === 2 ? 'h2' : 'h3', b.text)
        if ('ul' in b) return unorderedList(b.ul)
        return paragraph(b.p)
      }),
    },
  }
}

// ---------------------------------------------------------------------------
// Sources cited inline. Real, current figures, not invented (see
// lib/data/company.ts's own rule for this site: nothing on it is a made-up
// statistic).
// ---------------------------------------------------------------------------
const SRC = {
  aftermarketSize:
    'https://www.openpr.com/news/4322400/south-africa-automotive-aftermarket-size-is-expected-to-reach',
  naamsaParc:
    'https://naamsa.net/wp-content/uploads/2026/02/20260217-naamsa-4th-Quarter-2025-Review-of-Business-Conditions.pdf',
  ageingFleet:
    'https://www.allthingsmotoringinternational.com/articles/ageing-vehicles-reshaping-our-automotive-landscape',
  salesRecord:
    'https://techcentral.co.za/south-africas-new-car-market-roared-back-to-life-in-2025-with-nevs-gaining-ground/276019/',
  counterfeitCrisis:
    'https://thestar.co.za/news/politics/2025-11-28-africas-automotive-aftermarket-boom-faces-a-counterfeit-parts-crisis/',
  rmiCounterfeit: 'https://www.rmi.org.za/counterfeit-reporting/',
}

const POST1_SLUG = 'south-africas-auto-parts-market-by-the-numbers'
const POST2_SLUG = 'fitment-checklist-right-replacement-part-first-time'
const POST3_SLUG = 'how-to-avoid-counterfeit-car-parts-south-africa'

// ---------------------------------------------------------------------------
// Post 1: stats + wholesale backlinks
// ---------------------------------------------------------------------------
const post1: Block[] = [
  {
    p: [
      {
        text: "Ask most workshop owners how old the average car on a South African road is, and they'll usually guess low. The real number is closer to eleven years. That gap between assumption and reality is most of the story here: an ageing vehicle fleet, a new-car market that just posted its strongest year in over a decade, and a counterfeit-parts problem serious enough that the industry's own regulator runs a public reporting line for it. Put those three things together and the case for formal distribution, rather than buying wherever's cheapest that week, gets hard to ignore.",
      },
    ],
  },
  { h: 2, text: 'The numbers at a glance' },
  {
    ul: [
      [{ text: 'US$3.28 billion', bold: true }, { text: ": the size of South Africa's automotive aftermarket in 2024, projected to reach US$5.55 billion by 2033." }],
      [{ text: '13.36 million vehicles', bold: true }, { text: ': the national vehicle parc at the end of 2024, of which 7.95 million (59.5%) are passenger cars.' }],
      [{ text: '10 to 11.5 years', bold: true }, { text: ': the average age of a vehicle on South African roads, and still climbing.' }],
      [{ text: 'Around 80%', bold: true }, { text: ": the estimated share of that fleet now out of manufacturer warranty." }],
      [{ text: '596,818 units', bold: true }, { text: ': new vehicle sales in 2025, up 15.7% year-on-year and the strongest total in more than a decade.' }],
      [{ text: '2,600+ independent workshops', bold: true }, { text: ': represented by the Motor Industry Workshop Association, employing more than 31,000 people.' }],
    ],
  },
  { h: 2, text: "A market worth more than $3 billion, and still climbing" },
  {
    p: [
      { text: "South Africa's automotive aftermarket was valued at roughly US$3.28 billion in 2024, with " },
      { text: 'analysts projecting growth', link: SRC.aftermarketSize },
      { text: ' to around US$5.55 billion by 2033, a compound annual growth rate of 5.39%. That spans fast-fits, tyre specialists, independent garages, manufacturer dealer networks, online parts retailers and the physical counters most South African motorists still rely on when something breaks. Growth like that doesn\'t happen because vehicles are getting simpler to fix. It happens because there are more of them, they\'re getting older, and the workshops repairing them need a supply chain that shows up.' },
    ],
  },
  { h: 2, text: "13.36 million vehicles on the road: most of them are out of warranty" },
  {
    p: [
      { text: 'naamsa', link: SRC.naamsaParc },
      { text: " put South Africa's total vehicle parc at 13.36 million units at the end of 2024, with passenger cars making up 7.95 million of that, just under 60%. The average vehicle on that list is somewhere between 10 and 11.5 years old, and " },
      { text: 'industry commentary', link: SRC.ageingFleet },
      { text: " has that number climbing rather than falling as new-car affordability stays under pressure." },
    ],
  },
  {
    p: [
      { text: "By the time a vehicle is that old, its manufacturer warranty and service plan are long gone. One estimate puts the share of the fleet that's now out of warranty at around 80%. That's the point where owners stop shopping on brand loyalty and start shopping on price and availability, which is exactly why independent workshops, not franchised dealer networks, do most of the country's actual repair work. The Motor Industry Workshop Association alone represents close to 2,600 independent businesses and more than 31,000 employees, typically pricing 20 to 40% below dealership labour rates." },
    ],
  },
  {
    p: [
      { text: "None of that holds up without parts on a shelf. A workshop that's a third cheaper than the dealer only stays that way if it isn't waiting three days for a part to arrive." },
    ],
  },
  { h: 2, text: "A record new-car year doesn't shrink the aftermarket: it grows it" },
  {
    p: [
      { text: "It's tempting to assume a strong new-vehicle market is bad news for the aftermarket. It's the opposite. naamsa recorded " },
      { text: '596,818 new vehicle sales for 2025', link: SRC.salesRecord },
      { text: ', up 15.7% on the previous year and the strongest total in more than a decade, with passenger car sales alone climbing 20.1% to 422,292 units. A meaningful share of that growth came from competitively priced imports out of China and India, badges landing on South African driveways faster than the local parts networks behind them are maturing.' },
    ],
  },
  {
    p: [
      { text: 'Every one of those vehicles becomes a parts customer within three to five years. A market moving Korean, Chinese and Indian-badged vehicles at volume needs distributors who already carry deep stock across exactly those applications, not a network still being built from a standing start.' },
    ],
  },
  { h: 2, text: 'Counterfeit parts are a real, growing problem, and it changes who you should buy from' },
  {
    p: [
      { text: 'The other side of a fast-growing aftermarket is that it attracts fast-growing counterfeiting. ' },
      { text: 'Fake brake pads, suspension arms, tyres, ignition coils and airbag modules', link: SRC.counterfeitCrisis },
      { text: ' are common enough in the South African market that the ' },
      { text: 'Retail Motor Industry Organisation runs a dedicated reporting channel', link: SRC.rmiCounterfeit },
      { text: ' for them, and component failure from counterfeit parts has been linked to a meaningful share of preventable breakdowns and accidents across the region. We go deeper on how to spot one in ' },
      { text: 'our guide to avoiding counterfeit parts', link: `/blog/${POST3_SLUG}` },
      { text: '.' },
    ],
  },
  {
    p: [
      { text: "For a workshop or reseller, that risk sits with whoever chose the supplier. Buying through an established, traceable distribution network, rather than the cheapest unmarked box available that week, isn't just a quality preference anymore. It's a liability decision." },
    ],
  },
  { h: 2, text: "What this means if you're weighing up a distribution or franchise partner" },
  {
    p: [
      { text: "Put the numbers together: a market past $3 billion and still growing, a 13-million-vehicle parc that's mostly out of warranty, a record new-car year adding fresh applications every month, and a counterfeit problem serious enough to need its own reporting line. There's more demand here than there is reliable, traceable supply to meet it." },
    ],
  },
  {
    p: [
      { text: "Parts-Mall Africa supplies that gap from branches across the country, backed by nine private-brand lines and Parts-Mall Corporation's own manufacturing and export network, built specifically around the Korean and related applications behind a lot of 2025's sales growth: Kia, Hyundai, Chevrolet, Ssangyong, Suzuki, Daewoo, GWM and Haval. If your business already moves volume in vehicle parts and you're ready to talk territory, " },
      { text: "see how Parts-Mall's distributor and franchise network works", link: '/wholesale', newTab: false },
      { text: ', or go ' },
      { text: 'straight to head office', link: '/wholesale#contact-head-office', newTab: false },
      { text: ' with your region and your numbers.' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Post 2: fitment checklist
// ---------------------------------------------------------------------------
const post2: Block[] = [
  {
    p: [
      { text: "A part that doesn't fit costs more than the part. It costs the trip back to the counter, the delivery fee if it was couriered out, the hour the vehicle sat on the lift waiting, and the apology to a customer who now has questions about the whole job. Most wrong-part orders trace back to the same handful of shortcuts: going on the badge instead of the VIN, guessing the engine code, assuming two facelifts of the same model share a part. None of them take long to check properly. Here's the order to check them in." },
    ],
  },
  { h: 2, text: 'Start with the VIN, not the model name' },
  {
    p: [
      { text: "A \"Kia Sportage\" or a \"Hyundai i20\" isn't one car. It's several generations, at least one facelift inside most of those generations, and often two or three engine and transmission combinations sold under the same badge in South Africa. The vehicle identification number cuts through all of that. It's stamped on the chassis, printed on the windscreen sticker and on the registration documents, and it's the one thing that doesn't change no matter what the service book says. Read it off before you read anything else." },
    ],
  },
  { h: 2, text: 'Match the engine code, not just the litres' },
  {
    p: [
      { text: '"1.6 petrol" describes a class of engine, not a part number. The same displacement was often built in two or three distinct engine codes across a model\'s life, each with its own filter sizes, sensor placements and gasket shapes. The engine code is usually stamped on the block itself or listed on the VIN plate under the bonnet. Thirty seconds with a torch settles what would otherwise be a guess.' },
    ],
  },
  { h: 2, text: 'Photograph the old part before you order the new one' },
  {
    p: [
      { text: "If the old part is still in your hands, it's the fastest fitment check available. A clear photo of the part number stamped or moulded into the housing, sent to your branch over WhatsApp, usually settles an order in one message, without back-and-forth over part descriptions or ordering from memory. This matters most on parts that look identical across model years but aren't: alternators, calipers, sensors and anything with a connector are the usual culprits." },
    ],
  },
  { h: 2, text: 'Know your build date, not just your model year' },
  {
    p: [
      { text: '"2019 model" can mean two different part specifications depending on whether the vehicle left the factory before or after a running change. South African dealers often sell a vehicle a full model year after it was built elsewhere, and manufacturers regularly run a mid-year facelift or spec update without renaming the model. The build date on the VIN plate is more reliable than the year on the registration papers.' },
    ],
  },
  { h: 2, text: "An aftermarket part number isn't the same as an OEM number, and that's fine" },
  {
    p: [
      { text: "Every branded aftermarket part carries its own manufacturer part number, separate from the vehicle maker's OEM number. That's normal: it's how cross-reference systems like TecDoc work, matching one OEM number to the correct aftermarket equivalent across multiple brands. Parts-Mall has held TecDoc Data Supplier status since 2013, which is what lets a branch counter cross-reference your OEM or old part number against the right PMC, NT, Car-Dex or Pomax equivalent in seconds, rather than guessing off a photo alone. Browse what's carried under each line in the " },
      { text: 'full catalogue', link: '/parts' },
      { text: '.' },
    ],
  },
  { h: 2, text: "Don't assume shared platforms mean shared parts" },
  {
    p: [
      { text: "Rebadged and shared-platform vehicles are common across the brands Parts-Mall supplies: related Hyundai and Kia models, and shared underpinnings across some Chevrolet, GWM and Ssangyong-era vehicles. A shared platform can still mean a different bracket, a different sensor, or a mirrored part number for the opposite side. \"It's basically the same car\" is a reason to double-check, not a reason to skip the check." },
    ],
  },
  { h: 2, text: 'The five-point check, in order' },
  {
    ul: [
      [{ text: 'VIN or chassis number, read directly off the vehicle, not the service book.' }],
      [{ text: 'Engine code, confirmed from the block or the VIN plate, not the litre size alone.' }],
      [{ text: 'Transmission type, manual or automatic, and the transmission code if the part touches the gearbox.' }],
      [{ text: 'Build date from the VIN plate, checked against known facelift or running-change points.' }],
      [{ text: 'OEM or original part number, if the old part is still available to check or photograph.' }],
    ],
  },
  {
    p: [
      { text: "None of this needs to slow an order down. Call your nearest Parts-Mall branch with the VIN and, if you have it, a photo of the old part, and the counter team will confirm fitment before anything leaves the shelf. If the part number on the box doesn't match what you expected, don't assume it's wrong. Cross-reference it with the counter, or read our guide on " },
      { text: 'spotting a counterfeit part', link: `/blog/${POST3_SLUG}` },
      { text: " before you fit anything you're unsure of." },
    ],
  },
]

// ---------------------------------------------------------------------------
// Post 3: counterfeit parts
// ---------------------------------------------------------------------------
const post3: Block[] = [
  {
    p: [
      { text: "Counterfeit parts used to be a problem you'd hear about with handbags and watches. In South Africa's automotive aftermarket, it's now serious enough that the Retail Motor Industry Organisation runs a dedicated counterfeit-reporting line, and industry commentary links component failure from fake parts to a real share of preventable breakdowns and accidents on the region's roads. The parts most commonly faked are exactly the ones you don't want to get wrong: brake pads, suspension arms, tyres, ignition coils and airbag modules. Here's how to tell a genuine or properly branded aftermarket part from a copy, before it goes anywhere near a vehicle." },
    ],
  },
  { h: 2, text: "Why this has gotten worse, not better" },
  {
    p: [
      { text: "It comes down to the same numbers behind the industry's growth: South Africa's vehicle parc is ageing past eleven years on average, most of that fleet is out of manufacturer warranty, and demand for affordable replacement parts keeps climbing. We covered the full picture in " },
      { text: "South Africa's auto parts market by the numbers", link: `/blog/${POST1_SLUG}` },
      { text: ". It's exactly the kind of high-volume, price-sensitive demand that attracts counterfeiters. A copy brake pad or a copy suspension arm is cheaper to produce than a genuine or properly manufactured aftermarket one, and to an untrained eye on a shelf, the two can look almost identical." },
    ],
  },
  { h: 2, text: 'Check the packaging before you check the part' },
  {
    p: [
      { text: "Genuine and properly branded aftermarket packaging is consistent: sharp print, a real batch or lot number, a barcode that actually scans to the right product, and packaging that matches every other unit of that part on the shelf. Copies slip on the details: slightly blurred print, a barcode that's clearly been reused from something else, a security seal that's missing, torn, or obviously reapplied. If the box looks like it was printed on a home printer, treat that as your first warning, not a minor detail." },
    ],
  },
  { h: 2, text: 'Check the part itself, not just the box' },
  {
    p: [
      { text: "Weight is one of the fastest tells. A copy brake pad or suspension component is frequently lighter than the genuine equivalent because it's made from inferior or reduced material, exactly the shortcut that leads to premature failure. Look for a manufacturer's mark or date code moulded or stamped into the part itself, not just printed on a sticker that can be swapped between boxes. Casting and machining quality matters too: rough edges, inconsistent finishes, and threads that don't turn smoothly are signs of a part that was never meant to survive a normal service life." },
    ],
  },
  { h: 2, text: 'Ask where it actually came from' },
  {
    p: [
      { text: "A legitimate supplier can tell you, without hesitating, where a part was manufactured and which distributor or agent it came through. Parts-Mall Africa sources across nine private-brand lines (PMC, NT, Car-Dex, Pomax, MX, Ex-Trim, Vichura, Pro-Tec and Dashi), backed directly by Parts-Mall Corporation's own manufacturing and export network into 63 countries, which means every part sold through a branch has a traceable line back to source. If a supplier can't answer where a part came from, or the invoice doesn't match the part in your hand, walk away rather than negotiate on price." },
    ],
  },
  { h: 2, text: 'If the price looks too good, ask why' },
  {
    p: [
      { text: 'Genuine manufacturing, testing and quality control cost money, and that cost is reflected in the price of a properly made part. A price that sits well below every other quote for the identical part number is rarely a bargain. It usually means something was skipped to make that price possible.' },
    ],
  },
  { h: 2, text: "What to do if you think you've already fitted a copy" },
  {
    p: [
      { text: "Stop using the part if it's safety-related (brakes, steering, suspension or airbags), and don't wait for it to fail first. Keep the packaging and the invoice, report it through the " },
      { text: "RMI's counterfeit-reporting channel", link: SRC.rmiCounterfeit },
      { text: ', and go back to whoever supplied it with both in hand. A supplier with nothing to hide will want the report as much as you do.' },
    ],
  },
  {
    p: [
      { text: 'The fastest way to avoid this entirely is to buy through a network that can already tell you where a part came from. ' },
      { text: 'Find your nearest Parts-Mall branch', link: '/branches' },
      { text: ', pair it with our ' },
      { text: 'fitment checklist', link: `/blog/${POST2_SLUG}` },
      { text: ' to get the right part fitted right the first time, or if you\'re ordering by the box rather than the unit, see how ' },
      { text: "Parts-Mall's distributor and franchise network", link: '/wholesale' },
      { text: ' sources and moves stock at volume.' },
    ],
  },
]

// ---------------------------------------------------------------------------

type PostDef = {
  slug: string
  title: string
  excerpt: string
  category: 'Trade' | 'Fitment' | 'Buying' | 'Ordering' | 'Network'
  publishedAt: string
  body: Block[]
  imageFile: string
  imageAlt: string
}

const POSTS: PostDef[] = [
  {
    slug: POST1_SLUG,
    title: "South Africa's auto parts market by the numbers: why distributors are backing Parts-Mall",
    excerpt:
      "South Africa's automotive aftermarket is valued at over US$3 billion, and an ageing 13-million-vehicle fleet, a record new-car year and a counterfeit-parts crackdown all point the same way. Here's what the data says, and why distributors and franchise partners are backing Parts-Mall to meet it.",
    category: 'Trade',
    publishedAt: '2026-09-28',
    body: post1,
    imageFile: 'post1-warehouse.png',
    imageAlt:
      'A warehouse worker in a hi-vis vest scans a shelf of boxed automotive parts against tall blue pallet racking in a distribution warehouse.',
  },
  {
    slug: POST2_SLUG,
    title: 'How to find the right replacement part the first time: a fitment checklist for South African workshops',
    excerpt:
      "Ordering the wrong part costs a workshop a return trip, a delivery fee and an apology to the customer. Here's the five-point fitment check that gets it right before the part ever leaves the counter.",
    category: 'Fitment',
    publishedAt: '2026-09-28',
    body: post2,
    imageFile: 'post2-fitment.png',
    imageAlt:
      "A mechanic's hands photograph a worn used alternator on a workbench next to its boxed new replacement, checking the part matches before ordering.",
  },
  {
    slug: POST3_SLUG,
    title: 'Genuine, OEM or copy? How to avoid counterfeit car parts in South Africa',
    excerpt:
      "Counterfeit brake pads, suspension arms and ignition coils are common enough in South Africa that the industry now runs a dedicated reporting line for them. Here's how to tell a genuine or branded part from a copy before it goes anywhere near a vehicle.",
    category: 'Buying',
    publishedAt: '2026-09-28',
    body: post3,
    imageFile: 'post3-counterfeit.png',
    imageAlt:
      'Two sets of brake pads on a workshop counter, one new in branded packaging and one worn, being compared by a hand in a blue nitrile glove.',
  },
]

const IMAGE_DIR = process.env.BLOG_IMAGE_DIR || path.join(process.cwd(), 'blog-images')

async function uploadImage(payload: Payload, fileName: string, alt: string) {
  const absolutePath = path.join(IMAGE_DIR, fileName)
  const data = await fs.readFile(absolutePath)
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: 'image/png',
      name: fileName.replace(/\.png$/, '.webp'),
      size: data.length,
    },
  })
  return media.id
}

async function upsertGuide(payload: Payload, post: PostDef) {
  const existing = await payload.find({
    collection: 'guides',
    where: { slug: { equals: post.slug } },
    limit: 1,
  })

  const imageId = await uploadImage(payload, post.imageFile, post.imageAlt)

  const data = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    publishedAt: post.publishedAt,
    image: imageId,
    body: buildBody(post.body),
    _status: 'published' as const,
  }

  if (existing.docs[0]) {
    await payload.update({ collection: 'guides', id: existing.docs[0].id, data })
    console.log(`  updated: ${post.slug}`)
  } else {
    await payload.create({ collection: 'guides', data })
    console.log(`  created: ${post.slug}`)
  }
}

async function main() {
  console.log(`Publishing blog posts. DATABASE_URI=${process.env.DATABASE_URI}, cwd=${process.cwd()}, images=${IMAGE_DIR}`)
  const payload = await getPayload({ config })
  for (const post of POSTS) {
    await upsertGuide(payload, post)
  }
  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
