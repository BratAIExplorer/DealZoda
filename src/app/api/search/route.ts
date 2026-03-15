import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/data/sample-products'
import { appendFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// ── Search API ─────────────────────────────────────────────────────────────
// GET /api/search?q=samsung&market=MY&category=Phones

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const q        = searchParams.get('q')        ?? ''
  const market   = searchParams.get('market')   ?? undefined
  const category = searchParams.get('category') ?? undefined
  const minScore = searchParams.get('minScore') ? Number(searchParams.get('minScore')) : undefined

  // Run search against sample data (Phase 1) — replace with DB query in Phase B
  const results = searchProducts(q, {
    market:       market as 'MY' | 'IN' | 'US' | 'SG' | undefined,
    category:     category as any,
    minScore,
    realDealsOnly: searchParams.get('hideF') === '1',
  })

  // ── Log the search query for beta analytics ──────────────────────────────
  if (q.length >= 2) {
    logSearchQuery({
      query:     q,
      market,
      category,
      resultCount: results.length,
      timestamp:   new Date().toISOString(),
      ip:          req.headers.get('x-forwarded-for') ?? 'unknown',
    })
  }

  return NextResponse.json({
    query:   q,
    count:   results.length,
    results,
  })
}

// ── Append search to local log file ───────────────────────────────────────
// In production this will go to PostgreSQL — for now a JSONL log file works
function logSearchQuery(data: Record<string, unknown>) {
  try {
    const logDir  = join(process.cwd(), 'logs')
    const logFile = join(logDir, 'searches.jsonl')
    mkdirSync(logDir, { recursive: true })
    appendFileSync(logFile, JSON.stringify(data) + '\n', 'utf8')
  } catch {
    // Non-critical — don't break search if logging fails
  }
}
