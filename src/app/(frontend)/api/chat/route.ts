import { NextResponse } from 'next/server'
import { getRuleReply } from '@/lib/chat/engine'
import { aiConfigured, getAiReply, type ChatMessage } from '@/lib/chat/ai'

/**
 * Chat assistant endpoint. Defaults to the deterministic rule engine — zero
 * cost, zero external calls, works the moment the site deploys. Set
 * ANTHROPIC_API_KEY in the environment to switch every request over to a
 * real model instead; if that call fails or times out for any reason, this
 * silently falls back to the rule engine rather than erroring, so the widget
 * never breaks because of an upstream outage.
 */
export async function POST(request: Request) {
  let body: { message?: string; history?: ChatMessage[]; location?: { lat: number; lng: number } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  const message = String(body.message || '').slice(0, 1000)
  const history = Array.isArray(body.history) ? body.history.slice(-10) : []
  const location =
    body.location && typeof body.location.lat === 'number' && typeof body.location.lng === 'number'
      ? body.location
      : null

  if (aiConfigured() && !location) {
    const aiReply = await getAiReply(message, history)
    if (aiReply) return NextResponse.json(aiReply)
  }

  return NextResponse.json(getRuleReply(message, location))
}
