/**
 * Products Store — file-based persistence (Phase 1)
 * Reads/writes from /app/data/products.json on the VPS
 * In Phase B this gets replaced with Prisma + PostgreSQL queries
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR  = join(process.cwd(), 'data')
const DATA_FILE = join(DATA_DIR, 'products.json')

export interface Product {
  id:             string
  name:           string
  description:    string
  category:       string
  market:         'MY' | 'IN' | 'US' | 'SG'
  retailer:       string
  retailerUrl:    string
  currentPrice:   number
  normalPrice:    number
  currency:       string
  dealScore:      number
  isFakeDeal:     boolean
  fakeReason?:    string
  aiVerdict:      string
  recommendation: 'BUY_NOW' | 'WAIT' | 'SKIP'
  priceDropPct:   number
  tags:           string[]
  addedAt:        string
  addedBy:        string
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

export function getAllProducts(): Product[] {
  try {
    ensureDataDir()
    if (!existsSync(DATA_FILE)) return []
    const raw = readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw) as Product[]
  } catch {
    return []
  }
}

export function saveProduct(product: Product): void {
  ensureDataDir()
  const products = getAllProducts()
  const idx = products.findIndex(p => p.id === product.id)
  if (idx >= 0) {
    products[idx] = product   // update existing
  } else {
    products.unshift(product) // newest first
  }
  writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8')
}

export function deleteProduct(id: string): void {
  const products = getAllProducts().filter(p => p.id !== id)
  writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8')
}

export function searchProducts(query: string, market?: string, category?: string): Product[] {
  const q = query.toLowerCase().trim()
  return getAllProducts().filter(p => {
    const textMatch = !q || (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.retailer.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
    const marketMatch   = !market   || market   === 'all' || p.market   === market
    const categoryMatch = !category || category === 'all' || p.category === category
    return textMatch && marketMatch && categoryMatch
  }).sort((a, b) => b.dealScore - a.dealScore)
}

/** Auto-calculate deal score from prices if not manually set */
export function calcDealScore(currentPrice: number, normalPrice: number): number {
  if (normalPrice <= 0) return 50
  const pct = (normalPrice - currentPrice) / normalPrice
  if (pct <= 0)   return Math.max(5, 30 + Math.round(pct * 100))
  if (pct >= 0.5) return 95
  return Math.round(pct * 180)
}

/** Auto-detect fake deal: current price is higher than normal */
export function isFakeDeal(currentPrice: number, normalPrice: number): boolean {
  return currentPrice > normalPrice * 1.02
}
