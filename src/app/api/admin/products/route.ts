import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, saveProduct, deleteProduct, calcDealScore, isFakeDeal, Product } from '@/lib/products-store'
import { randomUUID } from 'crypto'

function checkAuth(req: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD ?? 'dealzoda2026'
  return req.headers.get('x-admin-password') === password
}

// GET /api/admin/products — list all products
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ products: getAllProducts() })
}

// POST /api/admin/products — add a product
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, category, market, retailer, retailerUrl,
          currentPrice, normalPrice, currency, aiVerdict, tags } = body

  if (!name || !currentPrice || !normalPrice || !market) {
    return NextResponse.json({ error: 'name, currentPrice, normalPrice, market are required' }, { status: 400 })
  }

  const cp    = Number(currentPrice)
  const np    = Number(normalPrice)
  const score = Number(body.dealScore) || calcDealScore(cp, np)
  const fake  = body.isFakeDeal ?? isFakeDeal(cp, np)
  const dropPct = Math.round(((np - cp) / np) * 100)

  const product: Product = {
    id:             randomUUID(),
    name:           name.trim(),
    description:    (description ?? '').trim(),
    category:       category ?? 'Other',
    market,
    retailer:       retailer ?? '',
    retailerUrl:    retailerUrl ?? '#',
    currentPrice:   cp,
    normalPrice:    np,
    currency:       currency ?? (market === 'MY' ? 'MYR' : market === 'IN' ? 'INR' : market === 'US' ? 'USD' : 'SGD'),
    dealScore:      Math.max(0, Math.min(100, score)),
    isFakeDeal:     fake,
    fakeReason:     body.fakeReason ?? '',
    aiVerdict:      aiVerdict ?? (fake ? 'Price is higher than normal. Do not buy.' : `${Math.abs(dropPct)}% below normal price.`),
    recommendation: fake ? 'SKIP' : score >= 80 ? 'BUY_NOW' : score >= 60 ? 'WAIT' : 'SKIP',
    priceDropPct:   dropPct,
    tags:           tags ? tags.split(',').map((t: string) => t.trim().toLowerCase()) : [],
    addedAt:        new Date().toISOString(),
    addedBy:        'founder',
  }

  saveProduct(product)
  return NextResponse.json({ success: true, product })
}

// DELETE /api/admin/products?id=xxx
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  deleteProduct(id)
  return NextResponse.json({ success: true })
}
