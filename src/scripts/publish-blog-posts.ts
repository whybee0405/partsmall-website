/**
 * One-off content push: three new blog posts (Guides collection) plus their
 * hero images. Not part of the seed pipeline. GUIDES in lib/data/company.ts
 * stays an empty array by design ("No articles are published until the
 * client provides approved content"), so this writes straight into Payload
 * via the local API, the same way backfill-media.ts does for images.
 *
 * Run with: npx tsx src/scripts/publish-blog-posts.ts [slug ...]
 * Posts dated in the future are skipped until that date (FORCE=1 overrides).
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
const POST4_SLUG = 'kia-hyundai-spare-parts-south-africa'
const POST5_SLUG = 'car-noises-explained-brakes-suspension-wheel-bearings'
const POST6_SLUG = 'timing-chain-rattle-cold-start-causes-replacement'

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
  {
    p: [
      { text: 'Working out which part is actually failing comes before ordering. Our guide to ' },
      { text: 'car noises and the parts behind them', link: `/blog/${POST5_SLUG}` },
      { text: ' covers brakes, suspension and wheel bearings. Ordering for a Korean-made car? See ' },
      { text: 'where to buy Kia and Hyundai spare parts in South Africa', link: `/blog/${POST4_SLUG}` },
      { text: '.' },
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
  {
    p: [
      { text: 'Buying for a Kia or Hyundai? Our guide to ' },
      { text: 'Kia and Hyundai spare parts in South Africa', link: `/blog/${POST4_SLUG}` },
      { text: ' covers the models and parts branches are asked for most. For a timing-related job, read ' },
      { text: 'timing chain rattle on cold start', link: `/blog/${POST6_SLUG}` },
      { text: ' first.' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Post 4: Kia and Hyundai spare parts (brand + model search terms)
// ---------------------------------------------------------------------------
const post4: Block[] = [
  {
    p: [
      { text: "If you're looking for Kia or Hyundai spare parts in South Africa, finding a part is rarely the hard bit. Finding the right one for your exact car, from a supplier who actually has it on the shelf, is where the time goes. Kia and Hyundai have sold in large numbers here, from the Picanto and i10 up to the Tucson, K2700 and H100, and the workshops that service them get asked for the same few dozen parts again and again. This guide covers which models and parts are in highest demand, how to avoid ordering the wrong version, and how to order through a Parts-Mall branch." },
    ],
  },
  { h: 2, text: 'Why Kia and Hyundai parts are easier to source than most brands' },
  {
    p: [
      { text: "The two makes share a great deal of engineering, which works in the buyer's favour. Parts availability across Kia and Hyundai is deeper than for most badges in this market, because the same supply chain feeds both. Parts-Mall started in South Korea in 1998, and the South African network was built around Korean applications from the start. Kia is the highest-volume make across our branches, and branches carry deeper stock on Kia service lines than on almost anything else." },
    ],
  },
  { h: 2, text: 'The Kia and Hyundai models workshops order parts for most' },
  {
    ul: [
      [{ text: 'Kia Rio and Picanto. ', bold: true }, { text: 'These dominate counter volume on braking and routine service items. Start at the ' }, { text: 'Kia Rio parts page', link: '/vehicles/kia/rio' }, { text: ' or the ' }, { text: 'Kia Picanto parts page', link: '/vehicles/kia/picanto' }, { text: '.' }],
      [{ text: 'Hyundai i10, i20 and Accent. ', bold: true }, { text: 'Everyday small cars with steady demand for pads, filters, bearings and suspension parts. See the ' }, { text: 'Hyundai i10', link: '/vehicles/hyundai/i10' }, { text: ' and ' }, { text: 'Hyundai Accent', link: '/vehicles/hyundai/accent' }, { text: ' pages.' }],
      [{ text: 'Kia Sportage and Hyundai Tucson. ', bold: true }, { text: 'Higher-mileage SUVs where wheel bearings, control arms and brake parts come up as the odometer climbs. Browse the ' }, { text: 'Kia Sportage', link: '/vehicles/kia/sportage' }, { text: ' and ' }, { text: 'Hyundai Tucson', link: '/vehicles/hyundai/tucson' }, { text: '.' }],
      [{ text: 'Kia K2700 and Hyundai H100. ', bold: true }, { text: 'Working vehicles. Their owners lose money when the vehicle stands, so clutch, brake and suspension lines are stocked accordingly. See the ' }, { text: 'K2700', link: '/vehicles/kia/k2700' }, { text: ' and ' }, { text: 'H100', link: '/vehicles/hyundai/h100' }, { text: ' pages.' }],
    ],
  },
  {
    p: [
      { text: 'Older and discontinued models are covered too, including the Kia Pride and Sephia and the Hyundai Getz. The full model lists are on the ' },
      { text: 'Kia', link: '/vehicles/kia' },
      { text: ' and ' },
      { text: 'Hyundai', link: '/vehicles/hyundai' },
      { text: ' pages.' },
    ],
  },
  { h: 2, text: 'Which Kia and Hyundai parts get ordered most' },
  {
    p: [
      { text: 'On passenger cars, the usual list is ' },
      { text: 'brake pads', link: '/parts/braking/brake-pads' },
      { text: ', ' },
      { text: 'brake discs', link: '/parts/braking/discs-rotors' },
      { text: ', ' },
      { text: 'oil filters', link: '/parts/filters/oil-filters' },
      { text: ' and air filters, ' },
      { text: 'wheel bearings', link: '/parts/bearings/wheel-bearings' },
      { text: ', ' },
      { text: 'control arms', link: '/parts/suspension-steering/control-arms' },
      { text: ' and alternators. On the light commercials, it shifts towards ' },
      { text: 'clutch kits', link: '/parts/transmission-clutch/clutch-kits' },
      { text: ', clutch release bearings, brake shoes, fuel filters and radiators. If your part is not on that list, the branch can still check it. The site shows what branches are asked for most, not the limit of what the network can supply.' },
    ],
  },
  { h: 2, text: 'Same badge, different part: why the VIN matters' },
  {
    p: [
      { text: 'A Kia Rio or a Hyundai i20 is not one car. Each name spans several generations, and within a generation the same model can leave the factory with different suppliers for a single component. Pad shape follows the brake calliper rather than the badge, for example. Before you order, have the VIN, the engine code and, if you still have the old part, a photo of it. Our ' },
      { text: 'fitment checklist for South African workshops', link: `/blog/${POST2_SLUG}` },
      { text: ' walks through the order to check things in.' },
    ],
  },
  { h: 2, text: 'Branded, genuine or copy: what a branch will offer' },
  {
    p: [
      { text: "Parts-Mall doesn't supply one brand only. Branches carry private-brand lines alongside OEM and genuine options where the application calls for them. PMC is the flagship line for fast-moving replacement parts, CAR-DEX covers suspension for Korean applications, A-GIST covers filters, Wingster covers friction and braking, and Mando supplies Korean OEM parts. The private-brand lines are certified to ISO 9001 and TS 16949, the same quality standard used in original equipment production, and the supplying branch confirms warranty terms in writing at dispatch. Because Kia and Hyundai parts are among the most copied in the aftermarket, read our guide on " },
      { text: 'how to avoid counterfeit car parts', link: `/blog/${POST3_SLUG}` },
      { text: ' before you buy from anyone you cannot trace.' },
    ],
  },
  { h: 2, text: 'How to order Kia or Hyundai spares from a Parts-Mall branch' },
  {
    ul: [
      [{ text: 'Find your nearest branch. We have 33 branches across all nine South African provinces. Use the ' }, { text: 'branch finder', link: '/branches' }, { text: ' to search by town or sort by distance.' }],
      [{ text: 'Lead with the vehicle: make, model, year, then the engine code or capacity, then the part described the way it appears on the car.' }],
      [{ text: 'Send a photo of the old part on WhatsApp if you have it. A part number off the old part narrows the search fastest, even if it is worn.' }],
      [{ text: 'Ask for stock, price and lead time in the same message, and get the warranty confirmed on the invoice.' }],
    ],
  },
  {
    p: [
      { text: 'Parts-Mall Africa is a wholesale branch network, not a webshop, so stock checks and quotes run through your branch rather than a checkout.' },
    ],
  },
  { h: 2, text: 'Kia and Hyundai spare parts: common questions' },
  { h: 3, text: 'Where can I buy Kia spare parts near me?' },
  {
    p: [
      { text: 'Search the ' },
      { text: 'Parts-Mall branch finder', link: '/branches' },
      { text: ' by town, province or your current location. Each branch page has a call button, a WhatsApp button and directions, and the counter team can confirm stock while you are on the line.' },
    ],
  },
  { h: 3, text: 'Do Kia and Hyundai share spare parts?' },
  {
    p: [
      { text: 'Some components overlap between related Kia and Hyundai models because of shared engineering, which helps availability. Overlap is never a reason to skip the fitment check, so confirm any part against your VIN and engine code before ordering.' },
    ],
  },
  { h: 3, text: 'Can I order Kia or Hyundai parts online?' },
  {
    p: [
      { text: 'Not through a checkout. Parts-Mall Africa supplies through its branches and agents, so you call or WhatsApp the branch with your vehicle details and they confirm stock and supply.' },
    ],
  },
  { h: 3, text: 'Do you stock parts for older Kia and Hyundai models?' },
  {
    p: [
      { text: "Many, yes. The site lists older models such as the Kia Pride, Sephia and Spectra and the Hyundai Getz. If your vehicle is not listed, call the nearest branch with the make, model and year and they will confirm what is available." },
    ],
  },
  { h: 3, text: 'Do workshops get trade pricing?' },
  {
    p: [
      { text: 'Standard trade pricing for individual workshops is handled at branch level, so speak to your nearest branch directly. If you resell or distribute at volume, look at the ' },
      { text: 'distributor and franchise route', link: '/wholesale' },
      { text: '.' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Post 5: symptom-led diagnosis (brakes, suspension, wheel bearings)
// ---------------------------------------------------------------------------
const post5: Block[] = [
  {
    p: [
      { text: "A grinding noise when you brake, a clunk over speed bumps, a hum that rises and falls with speed. Cars usually announce a worn part well before it fails, and the sound is often the best clue to which part it is. This guide covers the noises workshops and owners ask about most, what each usually points to, and which part to check first. It is general guidance. A proper inspection on a lift is what confirms the diagnosis, and anything involving brakes or steering should not be left waiting." },
    ],
  },
  { h: 2, text: 'Brake noises and what they mean' },
  { h: 3, text: 'A high-pitched squeal when braking' },
  {
    p: [
      { text: 'Most brake pads carry a small metal wear indicator that touches the disc and squeals when the friction material is getting thin. Squealing can also come from glazed pads or from dust and moisture, especially first thing in the morning. If it is constant, have the pads measured. A typical rule is to replace them once the friction material reaches about 3mm, or sooner if the wear sensor light comes on.' },
    ],
  },
  { h: 3, text: 'A grinding or scraping noise when braking' },
  {
    p: [
      { text: 'Grinding usually means the pad material is gone and the metal backing plate is cutting into the disc. Stop driving it if you can. The longer it continues, the more it costs, because the disc is being destroyed as well. Replace pads and check the discs against their stamped minimum thickness. If a disc is below minimum, scored, or has a lip on the outer edge, replace discs in axle pairs. See ' },
      { text: 'brake pads', link: '/parts/braking/brake-pads' },
      { text: ' and ' },
      { text: 'brake discs', link: '/parts/braking/discs-rotors' },
      { text: '.' },
    ],
  },
  { h: 3, text: 'A pulsing pedal or a shaking steering wheel under braking' },
  {
    p: [
      { text: "That's typically a disc with uneven thickness or surface, felt through the pedal or the steering wheel. Discs are normally the first thing to check, and a worn wheel bearing or loose suspension joint can add to the shake." },
    ],
  },
  { h: 3, text: 'The car pulls to one side when braking' },
  {
    p: [
      { text: 'A sticking ' },
      { text: 'brake calliper', link: '/parts/braking/callipers' },
      { text: ' or uneven pad wear on one side is the usual cause. Pad shape follows the calliper, so note which calliper your car has before ordering pads.' },
    ],
  },
  { h: 3, text: 'A soft or sinking brake pedal' },
  {
    p: [
      { text: 'This one is not a wait-and-see item. A pedal that feels spongy or slowly sinks points to a hydraulic problem such as a leak or air in the system. Get the car inspected the same day and avoid driving it in the meantime.' },
    ],
  },
  { h: 2, text: 'Clunks and knocks from the suspension' },
  {
    p: [
      { text: 'South African road surfaces are hard on suspension, and branches in regions with poorer roads carry deeper stock on bushes, ball joints and shock mountings for exactly that reason. The pattern of the noise tells you where to start.' },
    ],
  },
  {
    ul: [
      [{ text: 'A dull clunk over speed bumps and potholes. ', bold: true }, { text: 'Start with ' }, { text: 'stabiliser links', link: '/parts/suspension-steering/stabilizer-links' }, { text: ' and ' }, { text: 'bushings', link: '/parts/suspension-steering/bushings' }, { text: ', which are among the most common and least expensive causes. Then check ' }, { text: 'ball joints', link: '/parts/suspension-steering/ball-joints' }, { text: ' and ' }, { text: 'control arms', link: '/parts/suspension-steering/control-arms' }, { text: '.' }],
      [{ text: 'A knock when turning at low speed. ', bold: true }, { text: 'Suspect ball joints or ' }, { text: 'tie rod ends', link: '/parts/suspension-steering/tie-rod-ends' }, { text: '.' }],
      [{ text: 'Vague or wandering steering and uneven tyre wear. ', bold: true }, { text: 'Worn tie rod ends or rack ends, or an alignment that has drifted because a joint has worn.' }],
    ],
  },
  {
    p: [
      { text: 'A simple check on a lifted wheel is to grip it at the top and bottom and rock it, then at the sides. Movement points to a worn ball joint, a wheel bearing or a tie rod end. Treat a worn ball joint seriously. If one separates, the wheel can collapse, so it is not a part to drive on for months.' },
    ],
  },
  { h: 2, text: 'A humming or growling noise that changes with speed' },
  {
    p: [
      { text: 'A ' },
      { text: 'wheel bearing', link: '/parts/bearings/wheel-bearings' },
      { text: ' that is wearing usually produces a hum or growl that gets louder with speed. It often changes when you steer, because turning shifts the load onto one side. If the noise is loudest when you swing the wheel one way, the bearing on the opposite side is the one to check. Worn or cupped tyres can sound very similar, so rotate or inspect the tyres before you condemn the bearing. Some vehicles use a complete ' },
      { text: 'hub bearing assembly', link: '/parts/bearings/hub-bearings' },
      { text: ' rather than a separate bearing, and the branch will confirm which yours takes.' },
    ],
  },
  { h: 2, text: 'A squeal from the front of the engine' },
  {
    p: [
      { text: 'A squeal on start-up or when you turn the steering to full lock is commonly a loose or worn ' },
      { text: 'drive belt', link: '/parts/belts-chains/chain-belts' },
      { text: '. If the battery light comes on with it, check the belt and the ' },
      { text: 'alternator', link: '/parts/electrical-sensors/alternators' },
      { text: ' it drives. Do not ignore it. On many engines the same belt drives the water pump, and when it goes you lose charging, power steering and possibly cooling.' },
    ],
  },
  { h: 2, text: 'The wear items that never make a noise' },
  {
    p: [
      { text: 'Filters give little warning. Replace the ' },
      { text: 'oil filter', link: '/parts/filters/oil-filters' },
      { text: ' with every oil change, following your service book and shortening the interval for dusty roads, short trips and heavy loads. A clogged air filter costs power and fuel, a blocked cabin filter means weak airflow and a musty smell, and a restricted fuel filter shows up as hesitation under load. Browse the ' },
      { text: 'filters range', link: '/parts/filters' },
      { text: '.' },
    ],
  },
  { h: 2, text: 'When to stop driving' },
  {
    ul: [
      [{ text: 'Grinding brakes, or a pedal that is soft or sinking.' }],
      [{ text: 'A clunk combined with loose, vague steering.' }],
      [{ text: 'Any wobble or shake that gets worse with speed, or a wheel that moves when rocked.' }],
      [{ text: 'A battery light with a squealing or missing belt.' }],
    ],
  },
  { h: 2, text: 'What to tell the counter when you order' },
  {
    p: [
      { text: 'Say which wheel or axle, when the noise happens (braking, turning, over bumps, at speed) and give the VIN and engine code. Brakes and suspension parts are normally replaced in axle pairs, so ask for both sides. A photo of the old part on WhatsApp usually settles fitment in one message. For the full ordering routine, use our ' },
      { text: 'fitment checklist', link: `/blog/${POST2_SLUG}` },
      { text: ', then ' },
      { text: 'find your nearest branch', link: '/branches' },
      { text: '.' },
    ],
  },
  { h: 2, text: 'Common questions about car noises and worn parts' },
  { h: 3, text: 'Why are my brakes still squealing after new pads?' },
  {
    p: [
      { text: 'New pads sometimes squeal while they bed in, and noise can also come from a glazed disc, missing anti-squeal hardware or pads fitted to a disc that was not checked. If it continues after a few days of normal driving, take the car back to the workshop that fitted them.' },
    ],
  },
  { h: 3, text: 'How long do brake pads last?' },
  {
    p: [
      { text: 'There is no fixed interval. Front pads on a car used mostly in town typically last 30,000 to 50,000 km, but towing, hills and heavy loads shorten that considerably. Measure them rather than waiting for a noise.' },
    ],
  },
  { h: 3, text: 'Is a humming noise always a wheel bearing?' },
  {
    p: [
      { text: 'No. Uneven tyre wear and some tyre tread patterns produce a similar hum. Check the tyres first, then lift the car and test the wheel for play and roughness.' },
    ],
  },
  { h: 3, text: 'Can I drive with a clunking suspension?' },
  {
    p: [
      { text: 'Sometimes a clunk is only a worn stabiliser link or bush, but you cannot tell from the driver seat. Have it inspected soon, because a worn ball joint or control arm is a safety fault.' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Post 6: timing chain rattle, replacement, belt vs chain
// ---------------------------------------------------------------------------
const post6: Block[] = [
  {
    p: [
      { text: "A rattle from the front of the engine for a second or two after a cold start is easy to dismiss because it goes away. It is also the classic sign of a worn timing chain system, and on many engines the repair is far cheaper before the chain fails than after. This guide covers what timing chain rattle means, what causes a timing chain to stretch, which parts to replace with it, and how a timing chain differs from a timing belt." },
    ],
  },
  { h: 2, text: 'What the timing chain does' },
  {
    p: [
      { text: 'The timing chain links the crankshaft to the camshafts so the valves open and close in the correct relationship to piston position. It runs in engine oil and is held at the right tension by a hydraulic tensioner, while guides control its path. If the timing drifts or the chain skips, valves can meet pistons.' },
    ],
  },
  { h: 2, text: 'Timing chain rattle on cold start: why it happens' },
  {
    p: [
      { text: 'The hydraulic tensioner relies on oil pressure to take up slack. For a moment after a cold start, before oil pressure fills it, a stretched chain or worn guide is loose enough to rattle against the cover. Once pressure builds, the noise quietens, which is exactly why it gets ignored. A rattle that returns on sudden throttle changes points the same way.' },
    ],
  },
  { h: 2, text: 'Other signs of a stretched timing chain' },
  {
    ul: [
      [{ text: 'A rattle from the timing cover that fades as oil pressure builds.' }],
      [{ text: 'Camshaft and crankshaft correlation fault codes, with the check engine light on.' }],
      [{ text: 'Rough running, misfire or a loss of power.' }],
      [{ text: 'A rattle that comes back under sudden throttle changes.' }],
    ],
  },
  {
    p: [
      { text: 'A fault code alone does not prove the chain is at fault. It identifies the circuit reporting the problem, so a workshop will check the sensors and wiring as well before condemning the chain.' },
    ],
  },
  { h: 2, text: 'Why you should not just monitor it' },
  {
    p: [
      { text: 'On an interference engine, a failed timing component does not leave you stranded. It destroys the engine, because the valves meet the pistons and the repair becomes a rebuild. Timing chains were once considered lifetime parts, but on many modern engines chain stretch, worn guides and failing tensioners are common at higher mileage. A cold-start rattle is worth investigating straight away.' },
    ],
  },
  { h: 2, text: 'What causes a timing chain to stretch or rattle' },
  {
    p: [
      { text: 'High mileage is the main factor. After that, the tensioner and guides depend on clean oil at proper pressure, so overdue oil changes, a low oil level and short trips that never fully warm the engine all work against them. Keeping to the service book interval, and shortening it for hard use, is the cheapest protection a timing chain has.' },
    ],
  },
  { h: 2, text: 'What to replace with the timing chain' },
  {
    p: [
      { text: 'Replace the whole assembly rather than just the chain. The chain, guides, tensioner and sprockets wear together, the labour to reach them is identical, and a new chain fitted against a worn tensioner will slap and stretch early. See our range of ' },
      { text: 'timing chain assemblies', link: '/parts/belts-chains/timing-chains-assemblies' },
      { text: ' and ' },
      { text: 'timing chains', link: '/parts/engine/timing-chains' },
      { text: '. While the cover is off, ask about the timing cover gasket and the front crankshaft seal, since replacing them later means doing the same labour twice. Gaskets are listed in the ' },
      { text: 'gaskets and seals', link: '/parts/gaskets-seals' },
      { text: ' range.' },
    ],
  },
  { h: 2, text: 'Timing belt vs timing chain' },
  {
    ul: [
      [{ text: 'Timing belt. ', bold: true }, { text: 'A toothed rubber belt, normally replaced at an interval set by the vehicle maker in distance, time or both. Check the service book. A belt can fail with little warning, which is why the interval matters.' }],
      [{ text: 'Timing chain. ', bold: true }, { text: 'A metal chain that runs inside the engine in oil. There is no fixed interval on most engines, and replacement is driven by wear and symptoms rather than the calendar.' }],
    ],
  },
  {
    p: [
      { text: 'Which one your car has depends on the engine code, not the model name, because the same model can use a belt on one engine and a chain on another. Check the engine code stamped on the block, or send it to your branch with the VIN. The ' },
      { text: 'Parts-Mall vehicle pages', link: '/vehicles' },
      { text: ' list the models and engines the network covers.' },
    ],
  },
  { h: 2, text: 'How to order the right timing chain kit' },
  {
    ul: [
      [{ text: 'The engine code from the block, not just the capacity.' }],
      [{ text: 'Whether the kit includes the tensioner, guides and sprockets.' }],
      [{ text: 'Whether the engine is an interference design.' }],
      [{ text: 'Whether you also need the timing cover gasket and front crankshaft seal.' }],
    ],
  },
  {
    p: [
      { text: 'A photo of the old chain or tensioner sent over WhatsApp helps, and our ' },
      { text: 'fitment checklist', link: `/blog/${POST2_SLUG}` },
      { text: ' covers the rest. Then ' },
      { text: 'call your nearest branch', link: '/branches' },
      { text: ' with the VIN and engine code, and to avoid a copy part in a job this size, read our guide to ' },
      { text: 'counterfeit car parts', link: `/blog/${POST3_SLUG}` },
      { text: '.' },
    ],
  },
  { h: 2, text: 'Timing chain questions' },
  { h: 3, text: 'How long does a timing chain last?' },
  {
    p: [
      { text: 'There is no single figure. Most chains are designed to last a long time, but there is no fixed interval on most engines, and wear shows up at higher mileage, faster with poor oil maintenance.' },
    ],
  },
  { h: 3, text: 'Can I keep driving with a rattling timing chain?' },
  {
    p: [
      { text: 'It is not advisable. On an interference engine, a chain that jumps a tooth or fails can destroy the engine, so the sensible move is to have it inspected as soon as you hear the rattle.' },
    ],
  },
  { h: 3, text: 'Should the tensioner and guides be replaced with the chain?' },
  {
    p: [
      { text: 'Yes. They wear as a set, and the labour to reach them is already spent. A worn tensioner shortens the life of a new chain.' },
    ],
  },
  { h: 3, text: 'Does a check engine light mean the timing chain has failed?' },
  {
    p: [
      { text: 'Not necessarily. Camshaft and crankshaft correlation codes can point to the chain, but the sensors and wiring can trigger the same codes, so a diagnosis should confirm it before the engine is opened up.' },
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
    title: "South Africa's Auto Parts Market by the Numbers",
    excerpt:
      "The aftermarket is worth over US$3 billion, the fleet is ageing and new-car sales hit a record. The data shows why distributors back Parts-Mall.",
    category: 'Trade',
    publishedAt: '2026-09-28',
    body: post1,
    imageFile: 'post1-warehouse.png',
    imageAlt:
      'A warehouse worker in a hi-vis vest scans a shelf of boxed automotive parts against tall blue pallet racking in a distribution warehouse.',
  },
  {
    slug: POST2_SLUG,
    title: 'Right Replacement Part First Time: Fitment Checklist',
    excerpt:
      "A wrong part costs a return trip, a delivery fee and an apology. Here's the five-point fitment check that gets it right before the part leaves the counter.",
    category: 'Fitment',
    publishedAt: '2026-09-28',
    body: post2,
    imageFile: 'post2-fitment.png',
    imageAlt:
      "A mechanic's hands photograph a worn used alternator on a workbench next to its boxed new replacement, checking the part matches before ordering.",
  },
  {
    slug: POST3_SLUG,
    title: 'How to Avoid Counterfeit Car Parts in South Africa',
    excerpt:
      "Fake brake pads and suspension arms are common enough that the industry runs a reporting line. Here's how to tell a genuine or branded part from a copy.",
    category: 'Buying',
    publishedAt: '2026-09-28',
    body: post3,
    imageFile: 'post3-counterfeit.png',
    imageAlt:
      'Two sets of brake pads on a workshop counter, one new in branded packaging and one worn, being compared by a hand in a blue nitrile glove.',
  },
  {
    slug: POST4_SLUG,
    title: 'Kia and Hyundai Spare Parts in South Africa: Where to Buy',
    excerpt:
      "Need Kia or Hyundai spares in South Africa? Here's how to order the right part for a Rio, Picanto, i10 or Tucson from a trade branch near you.",
    category: 'Network',
    publishedAt: '2026-10-06',
    body: post4,
    imageFile: 'post4-kia-hyundai.png',
    imageAlt:
      'A staff member in a navy polo hands a mechanic a boxed set of brake pads across a trade counter, with shelves of boxed parts and filters behind.',
  },
  {
    slug: POST5_SLUG,
    title: 'Car Noises Explained: Brakes, Suspension and Wheel Bearings',
    excerpt:
      'Grinding when you brake, a clunk over bumps, a hum that rises with speed. Here is what each noise usually means and which part to check first.',
    category: 'Fitment',
    publishedAt: '2026-10-07',
    body: post5,
    imageFile: 'post5-car-noises.png',
    imageAlt:
      'Gloved hands hold a worn brake disc against the calliper and wheel hub on a car raised on a workshop lift.',
  },
  {
    slug: POST6_SLUG,
    title: 'Timing Chain Rattle on Cold Start: Causes and Repair',
    excerpt:
      'A rattle for a few seconds after a cold start is the classic sign of a stretched timing chain. Here is what causes it and what to replace with the chain.',
    category: 'Ordering',
    publishedAt: '2026-10-07',
    body: post6,
    imageFile: 'post6-timing-chain.png',
    imageAlt:
      'A timing chain, tensioner, guides and sprockets laid out on a steel workbench in front of an engine with its timing cover removed.',
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

  const hasImage = await fs
    .access(path.join(IMAGE_DIR, post.imageFile))
    .then(() => true)
    .catch(() => false)
  if (!hasImage && !existing.docs[0]) {
    // The blog index and post template both render the hero unconditionally.
    console.log(`  no image at ${IMAGE_DIR}/${post.imageFile}, skipping: ${post.slug}`)
    return
  }
  const imageId = hasImage ? await uploadImage(payload, post.imageFile, post.imageAlt) : undefined

  const data = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    publishedAt: post.publishedAt,
    ...(imageId ? { image: imageId } : {}),
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
  const today = new Date().toISOString().slice(0, 10)
  const only = process.argv.slice(2)
  for (const post of POSTS) {
    if (only.length && !only.includes(post.slug)) continue
    // Staggered release: re-run on or after publishedAt to publish a post.
    if (post.publishedAt > today && !process.env.FORCE) {
      console.log(`  scheduled for ${post.publishedAt}, skipping: ${post.slug}`)
      continue
    }
    await upsertGuide(payload, post)
  }
  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
