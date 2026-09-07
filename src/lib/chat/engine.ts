import { searchBranches, PROVINCE_ORDER, type Branch } from '@/lib/data/branches'
import { COMPANY } from '@/lib/data/company'
import { FAQS } from '@/lib/data/faqs'
import { MAKES } from '@/lib/data/vehicles'

export type ChatReply = {
  text: string
  branches?: (Branch & { km?: number })[]
  quickReplies?: string[]
  mode: 'rules'
}

const DEFAULT_QUICK_REPLIES = [
  'Find a branch',
  'Check part availability',
  'Distributor enquiries',
  'Vehicle makes you support',
]

const GREETING_RE = /^(hi|hello|hey|howzit|good\s?(morning|afternoon|evening)|sawubona|molo)\b/i

const BRANCH_TRIGGER_WORDS = [
  'branch',
  'branches',
  'nearest',
  'near me',
  'near',
  'location',
  'locate',
  'find',
  'where',
  'closest',
  'store',
  'depot',
  'outlet',
]

const HUMAN_TRIGGER_WORDS = ['human', 'agent', 'someone', 'person', 'representative', 'call me', 'speak to']

const WHOLESALE_TRIGGER_WORDS = ['wholesale', 'trade account', 'distributor', 'bulk', 'fleet', 'reseller', 'account']

const HOURS_TRIGGER_WORDS = ['hours', 'open', 'opening', 'close', 'closing time', 'what time']

/** Crude suffix stripping, not a real stemmer — enough to match "delivered"
 * against "delivery" and "branches" against "branch" without a dependency. */
function stem(word: string) {
  return word.replace(/(ies)$/, 'y').replace(/(ing|ies|ied|es|ed|s)$/, '')
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3)
    .map(stem)
}

function includesAny(haystack: string, needles: string[]) {
  const h = haystack.toLowerCase()
  return needles.some((n) => h.includes(n))
}

/** Strips branch-intent trigger words out of a message, leaving (hopefully)
 * a town/province name behind to search on — "find a branch near durban"
 * becomes "durban". */
function extractLocationQuery(message: string) {
  let q = message.toLowerCase()
  for (const w of [...BRANCH_TRIGGER_WORDS, 'a', 'the', 'my', 'to', 'in', 'me', 'is', 'there']) {
    q = q.replace(new RegExp(`\\b${w}\\b`, 'g'), ' ')
  }
  return q.replace(/\s+/g, ' ').trim()
}

/**
 * How many of the ~30 FAQs a given word shows up in. Words like "part" or
 * "branch" appear in a dozen questions and should count for little; words
 * like "warranty" or "franchisee" appear in one or two and are the actual
 * signal. Plain inverse document frequency, computed once at module load.
 */
const FAQ_DOC_FREQ = (() => {
  const df = new Map<string, number>()
  for (const faq of FAQS) {
    for (const t of new Set(tokenize(faq.q))) df.set(t, (df.get(t) ?? 0) + 1)
  }
  return df
})()

function idf(token: string) {
  return Math.log(1 + FAQS.length / (FAQ_DOC_FREQ.get(token) ?? 1))
}

function faqMatch(message: string) {
  const tokens = new Set(tokenize(message))
  if (tokens.size === 0) return null

  const scored = FAQS.map((faq) => {
    const qTokens = new Set(tokenize(faq.q))
    const aTokens = new Set(tokenize(faq.a))
    let score = 0
    for (const t of tokens) {
      if (qTokens.has(t)) score += 3 * idf(t)
      else if (aTokens.has(t)) score += idf(t)
    }
    return { score, faq }
  }).sort((a, b) => b.score - a.score)

  const [best, second] = scored
  if (!best || best.score < 2.2) return null
  // Two questions scored near-identically — answering the wrong one
  // confidently is worse than admitting the miss and falling through.
  if (second && best.score - second.score < 0.3) return null
  return best.faq
}

function makeMatch(message: string) {
  const m = message.toLowerCase()
  return MAKES.find((mk) => m.includes(mk.label.toLowerCase()) || m.includes(mk.slug))
}

export function getRuleReply(
  message: string,
  location?: { lat: number; lng: number } | null,
): ChatReply {
  const trimmed = message.trim()

  if (!trimmed) {
    return {
      mode: 'rules',
      text: `Hi, I'm the Parts-Mall Africa assistant. I can help you find a branch, check what we cover, or answer a question about ordering, warranty or distributor terms. What do you need?`,
      quickReplies: DEFAULT_QUICK_REPLIES,
    }
  }

  if (GREETING_RE.test(trimmed) && trimmed.length < 40) {
    return {
      mode: 'rules',
      text: `Hi there. I can help you find your nearest branch, check a part or make, or answer a question about ordering, warranty or distributor terms. What are you after?`,
      quickReplies: DEFAULT_QUICK_REPLIES,
    }
  }

  if (includesAny(trimmed, HUMAN_TRIGGER_WORDS)) {
    return {
      mode: 'rules',
      text: `Happy to connect you — the fastest way to a real person is calling or WhatsApping your nearest branch directly, or contacting head office if this is a distributor or franchise matter. Share your town and I'll find the right branch.`,
      quickReplies: ['Find a branch', 'Distributor enquiries'],
    }
  }

  if (includesAny(trimmed, HOURS_TRIGGER_WORDS)) {
    return {
      mode: 'rules',
      text: `Most branches trade Monday to Friday, 08:00 to 17:00, and Saturday 08:00 to 13:00. Head office (${COMPANY.headOffice.name}) trades ${COMPANY.headOffice.hours}. Individual branch pages confirm exact hours — want me to find your branch?`,
      quickReplies: ['Find a branch'],
    }
  }

  // Checked before the wholesale trigger below, but only when the message
  // isn't also branch/location-flavoured — a real branch lookup ("is there
  // a branch in Polokwane") must still win the search below rather than
  // being swallowed by an FAQ that happens to share a stray common word.
  if (!includesAny(trimmed, BRANCH_TRIGGER_WORDS)) {
    const earlyFaq = faqMatch(trimmed)
    if (earlyFaq) {
      return { mode: 'rules', text: earlyFaq.a, quickReplies: DEFAULT_QUICK_REPLIES }
    }
  }

  if (includesAny(trimmed, WHOLESALE_TRIGGER_WORDS)) {
    return {
      mode: 'rules',
      text: `Regional distribution, franchise territories and fleet supply run through head office directly — contact head office with your business, region and the volumes you already move. Running a workshop instead? Standard trade pricing is handled at branch level.`,
      quickReplies: ['Take me to Wholesale', 'Find a branch'],
    }
  }

  const make = makeMatch(trimmed)
  if (make) {
    return {
      mode: 'rules',
      text: `Yes — ${make.label} is one of the makes we carry parts for. Confirm exact fitment with your branch, since the same reference can supersede across model years. Want me to find your nearest branch?`,
      quickReplies: ['Find a branch', `Browse ${make.label} parts`],
    }
  }

  if (includesAny(trimmed, BRANCH_TRIGGER_WORDS) || location) {
    const locQuery = extractLocationQuery(trimmed)
    const matchedProvince = PROVINCE_ORDER.find((p) => trimmed.toLowerCase().includes(p.toLowerCase()))
    const results = searchBranches(
      matchedProvince ? '' : locQuery,
      matchedProvince ?? 'All',
      location,
      3,
    )

    if (results.length === 0) {
      return {
        mode: 'rules',
        text: `I couldn't match that to a branch by name. Try a town or province, or share your location and I'll sort by distance.`,
        quickReplies: ['Share my location', ...PROVINCE_ORDER.slice(0, 3)],
      }
    }

    return {
      mode: 'rules',
      text: location
        ? `Here's what's closest to you:`
        : locQuery
          ? `Here's what matches "${locQuery}":`
          : `Here are a few branches — share your location or a town name to narrow it down further.`,
      branches: results,
      quickReplies: location ? undefined : ['Share my location'],
    }
  }

  return {
    mode: 'rules',
    text: `I couldn't find an exact answer for that. Try one of these, or a branch's counter team can help directly over a call or WhatsApp.`,
    quickReplies: DEFAULT_QUICK_REPLIES,
  }
}
