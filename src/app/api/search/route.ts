import { NextRequest, NextResponse } from 'next/server'
import { searchProducts, getAllProducts } from '@/lib/products-store'
import { appendFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q        = searchParams.get('q')        ?? ''
  const market   = searchParams.get('market')   ?? ''
  const category = searchParams.get('category') ?? ''

  const results = searchProducts(q, market, category)
  const total   = getAllProducts().length

  // Log search query for analytics
  if (q.length >= 2) {
    try {
      const logDir = join(process.cwd(), 'logs')
      mkdirSync(logDir, { recursive: true })
      appendFileSync(
        join(logDir, 'searches.jsonl'),
        JSON.stringify({ q, market, category, results: results.length, ts: new Date().toISOString() }) + '\n'
      )
    } catch {}
  }

  return NextResponse.json({ q, total, count: results.length, results })
}
