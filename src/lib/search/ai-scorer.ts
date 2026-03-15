/**
 * Claude batch scorer — one API call prices all results for a query
 * Model: claude-sonnet-4-6  (per spec — not Haiku, not Opus)
 */

import Anthropic from '@anthropic-ai/sdk'
import type { CSEResult } from './google-cse'

export interface ScoredResult {
  deal_score:  number               // 0–100
  is_fake_deal: boolean
  verdict:     string               // ≤15 words, plain English
  confidence:  'high' | 'medium' | 'low'
}

export type ScoredCSEResult = CSEResult & ScoredResult

const SYSTEM_PROMPT = `You are Zoda, DealZoda's AI deal analyst. \
You are 100% neutral — you never favour any retailer. \
Your job is to score product deals and detect fake discounts. \
Be concise. Be honest. Never hype. Always on the user's side.`

/**
 * Batch-score all results for a query in a single Claude call.
 * Returns array in same order as input, with fallback defaults if parsing fails.
 */
export async function batchScore(
  query:   string,
  results: CSEResult[]
): Promise<ScoredCSEResult[]> {

  if (!results.length) return []

  const client = new Anthropic()

  const input = results.map((r, i) => ({
    index:    i,
    title:    r.title,
    retailer: r.retailer,
    price:    r.price ?? 'unknown',
    snippet:  r.snippet.slice(0, 200),
  }))

  const userPrompt = `A user searched for: "${query}"

Here are the search results. For each result provide:
1. deal_score: integer 0-100 (100 = exceptional deal, 0 = avoid)
2. is_fake_deal: boolean (true if price appears artificially inflated or suspicious)
3. verdict: string, max 15 words, plain English, no hype
4. confidence: "high" | "medium" | "low" based on available price data

Results:
${JSON.stringify(input, null, 2)}

Respond ONLY with a JSON array in the same order as the input. No preamble. No explanation. JSON only.`

  try {
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    // Strip markdown code fences if present
    const json = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    const scores: ScoredResult[] = JSON.parse(json)

    return results.map((r, i) => ({
      ...r,
      deal_score:   clamp(Number(scores[i]?.deal_score ?? 50), 0, 100),
      is_fake_deal: Boolean(scores[i]?.is_fake_deal ?? false),
      verdict:      scores[i]?.verdict ?? 'Check this deal manually.',
      confidence:   scores[i]?.confidence ?? 'low',
    }))

  } catch {
    // Graceful fallback — never block the user from seeing results
    return results.map(r => ({
      ...r,
      deal_score:   50,
      is_fake_deal: false,
      verdict:      'AI scoring unavailable — verify price independently.',
      confidence:   'low' as const,
    }))
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
