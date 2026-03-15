/**
 * GET /api/search-live?q=...&market=MY
 *
 * Orchestration:
 *   1. Cache check (6h TTL) → return immediately if hit
 *   2. Google CSE search (10 results)
 *   3. Affiliate link wrap + URL product-page validation (per addendum)
 *   4. Claude batch scoring (single API call)
 *   5. Sort by deal_score DESC
 *   6. Cache + log + return
 *
 * Fallback at every step: never block user from seeing results.
 */

import { NextRequest, NextResponse } from 'next/server'
import { googleCSESearch }           from '@/lib/search/google-cse'
import { batchScore }                from '@/lib/search/ai-scorer'
import { processLink }               from '@/lib/search/affiliate'
import { cacheGet, cacheSet, cacheKey, cacheEvict } from '@/lib/search/cache'
import { appendFileSync, mkdirSync } from 'fs'
import { join }                      from 'path'

export interface LiveSearchResult {
  title:        string
  url:          string
  snippet:      string
  price?:       string
  retailer:     string
  image?:       string
  deal_score:   number
  is_fake_deal: boolean
  verdict:      string
  confidence:   'high' | 'medium' | 'low'
  hasAffiliate: boolean
  isProductPage: boolean
  aiUnavailable?: boolean
}

export interface LiveSearchResponse {
  q:             string
  market:        string
  count:         number
  fromCache:     boolean
  results:       LiveSearchResult[]
  error?:        string
  limitWarning?: string
}

// Rough daily-limit guard (resets on process restart — good enough for single VPS)
let dailyCount = 0
let dailyDate  = new Date().toDateString()

function trackDailyUsage(): string | undefined {
  const today = new Date().toDateString()
  if (today !== dailyDate) { dailyDate = today; dailyCount = 0 }
  dailyCount++
  const limit = Number(process.env.GOOGLE_CSE_DAILY_LIMIT ?? 100)
  if (dailyCount >= limit - 20) {
    return `Approaching daily search limit (${dailyCount}/${limit}). Consider upgrading.`
  }
}

function logSearch(entry: object) {
  try {
    const dir = join(process.cwd(), 'logs')
    mkdirSync(dir, { recursive: true })
    appendFileSync(join(dir, 'searches.jsonl'), JSON.stringify(entry) + '\n')
  } catch {}
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q      = (searchParams.get('q') ?? '').trim()
  const market = (searchParams.get('market') ?? 'MY').toUpperCase()
  const ts     = new Date().toISOString()

  if (!q) {
    return NextResponse.json<LiveSearchResponse>({ q, market, count: 0, fromCache: false, results: [] })
  }

  // ── 1. Cache check ──────────────────────────────────────────────────────────
  const key    = cacheKey(q, market)
  const cached = cacheGet<LiveSearchResult[]>(key)
  if (cached) {
    logSearch({ q, market, count: cached.length, fromCache: true, ts })
    return NextResponse.json<LiveSearchResponse>({ q, market, count: cached.length, fromCache: true, results: cached })
  }

  // Evict stale cache entries periodically
  if (Math.random() < 0.05) cacheEvict()

  // ── 2. Google CSE ───────────────────────────────────────────────────────────
  let cseResults
  const limitWarning = trackDailyUsage()

  try {
    cseResults = await googleCSESearch(q, market)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logSearch({ q, market, error: msg, ts })
    return NextResponse.json<LiveSearchResponse>({
      q, market, count: 0, fromCache: false, results: [],
      error: msg.includes('GOOGLE_CSE') ? 'Search not configured yet.' : 'Search temporarily unavailable.',
      limitWarning,
    })
  }

  if (!cseResults.length) {
    return NextResponse.json<LiveSearchResponse>({ q, market, count: 0, fromCache: false, results: [], limitWarning })
  }

  // ── 3. Affiliate wrap + URL validation ─────────────────────────────────────
  const linked = cseResults.map(r => ({ ...r, ...processLink(r.url) }))

  // ── 4. Claude batch scoring ─────────────────────────────────────────────────
  let scored
  let aiUnavailable = false
  try {
    scored = await batchScore(q, cseResults)
  } catch {
    aiUnavailable = true
    scored = cseResults.map(r => ({
      ...r,
      deal_score:   50,
      is_fake_deal: false,
      verdict:      'AI scoring unavailable — showing unranked results.',
      confidence:   'low' as const,
    }))
  }

  // ── 5. Merge + sort by deal_score DESC ──────────────────────────────────────
  const results: LiveSearchResult[] = scored.map((s, i) => ({
    title:        s.title,
    url:          linked[i].url,
    snippet:      s.snippet,
    price:        s.price,
    retailer:     s.retailer,
    image:        s.image,
    deal_score:   s.deal_score,
    is_fake_deal: s.is_fake_deal,
    verdict:      s.verdict,
    confidence:   s.confidence,
    hasAffiliate: linked[i].hasAffiliate,
    isProductPage: linked[i].isProductPage,
    ...(aiUnavailable ? { aiUnavailable: true } : {}),
  })).sort((a, b) => b.deal_score - a.deal_score)

  // ── 6. Cache + log + return ─────────────────────────────────────────────────
  cacheSet(key, results)
  logSearch({ q, market, count: results.length, fromCache: false, ts, topScore: results[0]?.deal_score })

  return NextResponse.json<LiveSearchResponse>({ q, market, count: results.length, fromCache: false, results, limitWarning })
}
