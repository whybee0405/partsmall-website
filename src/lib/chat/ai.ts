import { BRANCHES, NETWORK } from '@/lib/data/branches'
import { COMPANY, CORPORATE_FACTS } from '@/lib/data/company'
import { FAQS } from '@/lib/data/faqs'
import { MAKES } from '@/lib/data/vehicles'

export type ChatMessage = { role: 'user' | 'assistant'; text: string }
export type AiReply = { text: string; mode: 'ai' }

/**
 * Optional AI backing for the chat assistant. Entirely dormant unless
 * ANTHROPIC_API_KEY is set in the environment — with no key, callers should
 * fall back to the rule-based engine (see engine.ts), which is the default
 * for every deployment until a key is deliberately added. No SDK dependency:
 * a direct fetch to the Messages API keeps this optional feature from adding
 * weight to installs that never turn it on.
 */
export function aiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

function systemPrompt() {
  const branchList = BRANCHES.map((b) => `${b.name} (${b.province}${b.province === 'Pan-Africa' ? `, ${b.country}` : ''})`).join('; ')
  const faqBlock = FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')
  const makesList = MAKES.map((m) => m.label).join(', ')
  const factsBlock = CORPORATE_FACTS.map((f) => `${f.value} ${f.label} (${f.note})`).join('; ')

  return `You are the customer-facing chat assistant on the Parts-Mall Africa website, a wholesale distributor of Korean vehicle parts across ${NETWORK.total} branch/country points in Africa (${NETWORK.southAfrica} in South Africa across ${NETWORK.provinces} provinces, plus pan-African country points).

Ground rules:
- Only state facts given to you below. Never invent a phone number, statistic, price, or stock claim.
- This is a wholesale branch/agent network, not a retail webshop — there is no online checkout.
- If asked about stock or pricing for a specific part, direct the user to call or WhatsApp their nearest branch with the part name, vehicle, and OEM reference if they have one — the counter team confirms live, you cannot.
- When recommending a branch, only name branches from the list below, and suggest the user confirm on that branch's page.
- Keep answers short (2-4 sentences), plain, and direct — the audience is workshop owners and trade buyers, not casual browsers.
- If you don't know, say so and suggest contacting head office (${COMPANY.headOffice.email}) or the nearest branch.

Branch network: ${branchList}

Vehicle makes supported: ${makesList}

Group facts: ${factsBlock}

Frequently asked questions, answer from these when relevant:
${faqBlock}`
}

export async function getAiReply(message: string, history: ChatMessage[]): Promise<AiReply | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const model = process.env.CHAT_AI_MODEL || 'claude-haiku-4-5-20251001'
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 9000)

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        system: systemPrompt(),
        messages: [
          ...history.slice(-6).map((h) => ({ role: h.role, content: h.text })),
          { role: 'user', content: message },
        ],
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      console.error('Chat AI request failed:', res.status, await res.text().catch(() => ''))
      return null
    }

    const data = (await res.json()) as { content?: { type: string; text?: string }[] }
    const text = data.content?.find((c) => c.type === 'text')?.text?.trim()
    return text ? { text, mode: 'ai' } : null
  } catch (error) {
    console.error('Chat AI request errored, falling back to rules:', error)
    return null
  } finally {
    clearTimeout(timeout)
  }
}
