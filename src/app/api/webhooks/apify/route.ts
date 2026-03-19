/**
 * POST /api/webhooks/apify
 *
 * Receives Apify actor run completion webhooks for all 7 affiliate sources.
 * Fetches dataset items, validates URLs, stores to price_history, scores async.
 *
 * ARCHITECTURE NOTE (v3.0):
 *   This is Layer 1 — Universal Search.
 *   We store ALL valid scraped items regardless of affiliate status.
 *   Layer 2 (affiliate link generation) runs at display time, not here.
 *   commission_potential is NEVER used for ranking — only ai_score + trust_score.
 *
 * Apify setup per actor:
 *   Webhook URL:     https://dealzoda.com/api/webhooks/apify
 *   Events:          ACTOR.RUN.SUCCEEDED
 *   Payload template (paste into each actor's webhook config):
 *   {
 *     "secret": "{{secret}}",         ← set APIFY_WEBHOOK_SECRET in Apify UI
 *     "source_domain": "lazada.com.my", ← change per actor
 *     "market": "MY",                   ← change per actor
 *     "actorRunId": "{{actorRunId}}",
 *     "datasetId": "{{defaultDatasetId}}"
 *   }
 */

import { NextRequest, NextResponse } from 'next/server'
import { db }                        from '@/lib/db'
import { isProductPageUrl }          from '@/lib/search/affiliate'
import Anthropic                     from '@anthropic-ai/sdk'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApifyWebhookBody {
  secret?:        string
  source_domain?: string   // set via Apify payload template per actor
  market?:        string
  actorRunId?:    string
  datasetId?:     string
  // Standard Apify envelope fields (ignored — we use template fields above)
  eventType?:     string
  eventData?:     { actorId?: string; actorRunId?: string; defaultDatasetId?: string }
  resource?:      { status?: string }
}

// Normalised item — union of all actor output shapes
interface ApifyItem {
  url?:           string
  link?:          string
  productUrl?:    string
  name?:          string
  title?:         string
  productName?:   string
  price?:         number | string
  finalPrice?:    number | string
  salePrice?:     number | string
  currentPrice?:  number | string
  currency?:      string
  image?:         string
  thumbnailImage?: string
  [key: string]:  unknown
}

interface StoredItem {
  product_name: string
  product_url:  string
  price:        number | null
  currency:     string
}

// ── Domain → currency map ─────────────────────────────────────────────────────

const DOMAIN_CURRENCY: Record<string, string> = {
  'lazada.com.my':   'MYR',
  'shopee.com.my':   'MYR',
  'amazon.com':      'USD',
  'amazon.in':       'INR',
  'amazon.com.my':   'MYR',
  'flipkart.com':    'INR',
  'booking.com':     'USD',
  'agoda.com':       'USD',
}

function currencyForDomain(domain: string): string {
  const clean = domain.toLowerCase().replace(/^www\./, '')
  for (const [key, cur] of Object.entries(DOMAIN_CURRENCY)) {
    if (clean.includes(key)) return cur
  }
  return 'MYR'
}

// ── Item normaliser ───────────────────────────────────────────────────────────

function normalise(item: ApifyItem, domain: string): StoredItem | null {
  const url = item.url ?? item.link ?? item.productUrl ?? ''
  if (!url || typeof url !== 'string') return null

  const name = String(
    item.name ?? item.title ?? item.productName ?? ''
  ).trim().slice(0, 490)
  if (!name) return null

  const rawPrice = item.price ?? item.finalPrice ?? item.salePrice ?? item.currentPrice
  const price    = rawPrice != null ? parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) : null

  return {
    product_name: name,
    product_url:  url.slice(0, 990),
    price:        price && !isNaN(price) ? price : null,
    currency:     item.currency ? String(item.currency).toUpperCase() : currencyForDomain(domain),
  }
}

// ── Async AI scorer (Brain 1 + Brain 2) ──────────────────────────────────────
// Fires after 200 is returned — never blocks the webhook response.

async function scoreItemsAsync(ids: string[], items: StoredItem[]): Promise<void> {
  if (!ids.length) return

  try {
    const client = new Anthropic()

    const input = items.map((item, i) => ({
      index:   i,
      name:    item.product_name,
      price:   item.price ?? 'unknown',
      currency: item.currency,
    }))

    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `You are Zoda, DealZoda's AI deal analyst. You are 100% neutral — you never favour any retailer. Score product deals and detect fake discounts. Be concise. Never hype. Always on the user's side.`,
      messages: [{
        role: 'user',
        content: `Score these scraped product listings. For each provide:
1. ai_score: integer 0-100 (100 = exceptional deal value)
2. is_fake_deal: boolean (inflated original price, suspicious discount)
3. verdict: max 12 words, plain English

Items:
${JSON.stringify(input, null, 2)}

Respond ONLY with a JSON array in input order. No preamble.`,
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const json = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    const scores: { ai_score?: number; is_fake_deal?: boolean; verdict?: string }[] = JSON.parse(json)

    // Update each row with its score
    await Promise.all(ids.map((id, i) => {
      const s = scores[i]
      if (!s) return Promise.resolve()
      return db.priceHistory.update({
        where: { id },
        data: {
          ai_score:     Math.min(100, Math.max(0, Number(s.ai_score ?? 50))),
          is_fake_deal: Boolean(s.is_fake_deal ?? false),
          ai_verdict:   s.verdict ?? null,
          ai_scored_at: new Date(),
        },
      })
    }))

  } catch {
    // Scoring failure never blocks storage — items stay with ai_score = null
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let body: ApifyWebhookBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── 2. Verify secret ───────────────────────────────────────────────────────
  const expectedSecret = process.env.APIFY_WEBHOOK_SECRET
  if (expectedSecret) {
    const incoming = body.secret ?? req.headers.get('x-apify-webhook-secret') ?? ''
    if (incoming !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }
  }

  // ── 3. Resolve dataset ID and source domain ────────────────────────────────
  const datasetId    = body.datasetId     ?? body.eventData?.defaultDatasetId
  const actorRunId   = body.actorRunId    ?? body.eventData?.actorRunId ?? 'unknown'
  const sourceDomain = body.source_domain ?? ''
  const market       = (body.market ?? 'MY').toUpperCase()

  if (!datasetId) {
    return NextResponse.json({ error: 'Missing datasetId' }, { status: 400 })
  }
  if (!sourceDomain) {
    return NextResponse.json({ error: 'Missing source_domain in payload template' }, { status: 400 })
  }

  // ── 4. Look up retailer by domain ─────────────────────────────────────────
  const retailer = await db.retailer.findFirst({
    where: {
      domain:    { contains: sourceDomain.replace(/^www\./, '') },
      is_active: true,
    },
  })

  if (!retailer) {
    return NextResponse.json(
      { error: `No active retailer found for domain: ${sourceDomain}` },
      { status: 422 }
    )
  }

  // ── 5. Fetch dataset items from Apify ─────────────────────────────────────
  const apifyToken = process.env.APIFY_API_TOKEN
  if (!apifyToken) {
    return NextResponse.json({ error: 'APIFY_API_TOKEN not configured' }, { status: 500 })
  }

  let rawItems: ApifyItem[]
  try {
    const res = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}&format=json&clean=true`,
      { headers: { 'Accept': 'application/json' } }
    )
    if (!res.ok) throw new Error(`Apify API ${res.status}: ${res.statusText}`)
    rawItems = await res.json()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Failed to fetch dataset: ${msg}` }, { status: 502 })
  }

  if (!Array.isArray(rawItems) || !rawItems.length) {
    return NextResponse.json({ stored: 0, skipped: 0, message: 'Empty dataset' })
  }

  // ── 6. Validate + store each item ─────────────────────────────────────────
  const toScore:  StoredItem[] = []
  const scoreIds: string[]     = []
  let stored  = 0
  let skipped = 0

  for (const raw of rawItems) {
    const item = normalise(raw, sourceDomain)
    if (!item) { skipped++; continue }

    // Rule 6: reject homepage/category URLs — must point to specific product
    if (!isProductPageUrl(item.product_url)) { skipped++; continue }

    try {
      const row = await db.priceHistory.create({
        data: {
          retailer_id:  retailer.id,
          product_name: item.product_name,
          product_url:  item.product_url,
          price:        item.price ?? undefined,
          currency:     item.currency,
          market,
          is_affiliate: retailer.has_affiliate,
          raw_data:     raw as object,
          apify_run_id: actorRunId,
        },
      })
      toScore.push(item)
      scoreIds.push(row.id)
      stored++
    } catch {
      skipped++
    }
  }

  // ── 7. Async AI scoring — fire and forget, never blocks 200 ───────────────
  if (scoreIds.length) {
    scoreItemsAsync(scoreIds, toScore).catch(() => {})
  }

  return NextResponse.json({
    ok:          true,
    retailer:    retailer.name,
    is_affiliate: retailer.has_affiliate,
    run_id:      actorRunId,
    stored,
    skipped,
    scoring:     scoreIds.length > 0 ? 'queued' : 'nothing_to_score',
  })
}
