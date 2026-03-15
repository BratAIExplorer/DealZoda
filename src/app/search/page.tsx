'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import DealScoreBadge from '@/components/ui/DealScoreBadge'
import { Product } from '@/lib/products-store'

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Phones','Laptops','Cameras','TVs','Audio','Hotels','Flights','Fashion','Appliances','Other']
const MARKETS    = ['MY','IN','US','SG']
const MARKET_LABELS: Record<string, string> = { MY: '🇲🇾 Malaysia', IN: '🇮🇳 India', US: '🇺🇸 USA', SG: '🇸🇬 Singapore' }
const CURRENCY_SYMBOLS: Record<string, string> = { MYR: 'RM', INR: '₹', USD: '$', SGD: 'S$' }

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, tracked, onTrack }: {
  product:  Product
  tracked:  boolean
  onTrack:  (id: string) => void
}) {
  const sym = CURRENCY_SYMBOLS[product.currency] ?? product.currency

  return (
    <div className={`glass-card rounded-2xl p-5 relative overflow-hidden group transition-all duration-300
      ${product.isFakeDeal ? 'border-red-500/20' : ''}`}>

      {/* Fake deal banner */}
      {product.isFakeDeal && (
        <div className="absolute top-0 left-0 right-0 px-4 py-2 flex items-center gap-2"
             style={{ background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.25)' }}>
          <span className="text-red-400 text-xs font-bold">⚠ FAKE DEAL DETECTED</span>
          <span className="text-red-300/70 text-xs truncate">— {product.fakeReason?.split('.')[0]}</span>
        </div>
      )}

      <div className={product.isFakeDeal ? 'mt-8' : ''}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {/* Market + category chips */}
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
                    style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', color: '#C084FC' }}>
                {MARKET_LABELS[product.market] ?? product.market}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-slate-500"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {product.category}
              </span>
            </div>

            <h3 className="font-display font-bold text-white text-lg leading-tight">{product.name}</h3>
            <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{product.description}</p>
            <p className="text-slate-600 text-xs mt-1">via {product.retailer}</p>
          </div>

          {/* Score badge */}
          <div className="shrink-0">
            <DealScoreBadge score={product.dealScore} size="sm" />
          </div>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-display font-extrabold text-2xl text-white">
            {sym}{product.currentPrice.toLocaleString()}
          </span>
          {!product.isFakeDeal && product.priceDropPct > 0 && (
            <>
              <span className="text-slate-500 line-through text-sm">
                {sym}{product.normalPrice.toLocaleString()}
              </span>
              <span className="text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                −{product.priceDropPct}%
              </span>
            </>
          )}
          {product.isFakeDeal && (
            <span className="text-red-400 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              ↑ {Math.abs(product.priceDropPct)}% INFLATED
            </span>
          )}
        </div>

        {/* AI verdict */}
        <div className="rounded-xl px-3 py-2.5 mb-4 font-mono text-xs leading-relaxed"
             style={{
               background: product.isFakeDeal ? 'rgba(239,68,68,0.05)' : 'rgba(0,0,0,0.25)',
               border: `1px solid ${product.isFakeDeal ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
               color: product.isFakeDeal ? '#FCA5A5' : '#94A3B8',
             }}>
          <span className="opacity-50 mr-1">Zoda›</span>
          {product.aiVerdict}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTrack(product.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${tracked
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                : 'btn-outline'
              } border`}
          >
            {tracked ? '✓ Tracking' : '+ Track This'}
          </button>

          {!product.isFakeDeal && (
            <a href={product.retailerUrl} target="_blank" rel="noopener noreferrer"
               className="btn-yellow px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
              View Deal
              <span className="text-xs opacity-70">↗</span>
            </a>
          )}

          {product.isFakeDeal && (
            <div className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400/60 border border-red-500/15 cursor-not-allowed">
              Do not buy
            </div>
          )}
        </div>

        {/* Credits earn line */}
        {!product.isFakeDeal && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5">
            <span className="text-yellow-400 text-xs">⚡</span>
            <span className="text-xs text-slate-600">
              Buy via DealZoda →{' '}
              <span className="text-yellow-400/80 font-medium">
                earn {CURRENCY_SYMBOLS[product.currency] ?? ''}{estimateCredits(product)} in Zoda Credits
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function estimateCredits(p: Product): string {
  const MYR_MAP: Record<string, number> = { MYR: 1, USD: 4.7, INR: 0.057, SGD: 3.5 }
  const rate = MYR_MAP[p.currency] ?? 1
  return (p.currentPrice * rate * 0.01).toFixed(0)
}

// ── Search Page ───────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [query,       setQuery]       = useState('')
  const [market,      setMarket]      = useState('')
  const [category,    setCategory]    = useState('')
  const [hideFakes,   setHideFakes]   = useState(false)
  const [results,     setResults]     = useState<Product[]>([])
  const [totalInDb,   setTotalInDb]   = useState(0)
  const [trackedIds,  setTrackedIds]  = useState<Set<string>>(new Set())
  const [hasSearched, setHasSearched] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [trackAlert,  setTrackAlert]  = useState<string | null>(null)

  // Load tracked products from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dz_tracked')
      if (saved) setTrackedIds(new Set(JSON.parse(saved)))
    } catch {}
  }, [])

  // Fetch from API
  const doSearch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ q: query, market, category })
      const r = await fetch(`/api/search?${params}`)
      if (r.ok) {
        const d = await r.json()
        const filtered = hideFakes ? d.results.filter((p: Product) => !p.isFakeDeal) : d.results
        setResults(filtered)
        setTotalInDb(d.total)
      }
    } catch {}
    setHasSearched(true)
    setLoading(false)
  }, [query, market, category, hideFakes])

  useEffect(() => {
    const timer = setTimeout(doSearch, 300)
    return () => clearTimeout(timer)
  }, [doSearch])

  // Show all on first load
  useEffect(() => {
    doSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTrack = (id: string) => {
    setTrackedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        const p = results.find(r => r.id === id)
        setTrackAlert(p?.name ?? null)
        setTimeout(() => setTrackAlert(null), 3000)
      }
      localStorage.setItem('dz_tracked', JSON.stringify(Array.from(next)))
      return next
    })
  }

  const fakeCount = results.filter(r => r.isFakeDeal).length

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-dark)' }}>
      {/* Track alert toast */}
      {trackAlert && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl font-semibold text-sm shadow-xl"
             style={{ background: '#10B981', color: '#fff' }}>
          ✓ Tracking {trackAlert} — you'll be alerted when price drops
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/5 sticky top-0 z-40"
           style={{ background: 'rgba(15,14,42,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <a href="/" className="flex items-center gap-2 shrink-0">
              <Image src="/images/logo.png" alt="DealZoda" width={28} height={28} className="rounded-lg" />
              <span className="font-display font-bold text-white text-base hidden sm:block">DealZoda</span>
            </a>
            <span className="text-slate-700 hidden sm:block">›</span>
            <span className="text-slate-500 text-sm hidden sm:block">Beta Search</span>
            <div className="ml-auto flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                 style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block animate-pulse" />
              BETA
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products, hotels, flights... (e.g. Samsung, MacBook, Singapore hotel)"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-slate-600 text-sm transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors text-lg">
                ✕
              </button>
            )}
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <select
              value={market}
              onChange={e => setMarket(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-slate-400
                         focus:border-purple-500/40 transition-colors cursor-pointer"
            >
              <option value="">All Markets</option>
              {MARKETS.map(m => (
                <option key={m} value={m}>{MARKET_LABELS[m]}</option>
              ))}
            </select>

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-slate-400
                         focus:border-purple-500/40 transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <button
              onClick={() => setHideFakes(!hideFakes)}
              className={`text-xs px-3 py-2 rounded-xl border transition-all font-medium
                ${hideFakes
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : 'text-slate-500 bg-white/4 border-white/8 hover:border-white/15'
                }`}>
              {hideFakes ? '✓' : ''} Hide Fake Deals
            </button>

            <span className="ml-auto text-xs text-slate-600 font-mono">
              {loading ? 'searching...' : `${results.length} results`}
              {fakeCount > 0 && !hideFakes && (
                <span className="text-red-400/70 ml-1.5">· {fakeCount} fake{fakeCount > 1 ? 's' : ''} detected</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tracked summary */}
        {trackedIds.size > 0 && (
          <div className="glass-card rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
               style={{ border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.05)' }}>
            <span className="text-emerald-400">✓</span>
            <span className="text-sm text-emerald-300">
              Tracking <strong>{trackedIds.size} product{trackedIds.size > 1 ? 's' : ''}</strong> — you'll be alerted when prices drop.
            </span>
            <a href="#waitlist" className="ml-auto text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors">
              Set up alerts →
            </a>
          </div>
        )}

        {/* Results grid */}
        {results.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                tracked={trackedIds.has(product.id)}
                onTrack={handleTrack}
              />
            ))}
          </div>
        ) : hasSearched && !loading ? (
          totalInDb === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="font-display font-bold text-white text-2xl mb-2">
                No products yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Check back soon — deals are being added daily.
              </p>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-white text-2xl mb-2">
                Nothing worth your money right now.
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Zoda keeps watching. We'll alert you the moment something real shows up for "{query}".
              </p>
            </div>
          )
        ) : null}

        {/* Beta note */}
        <div className="mt-12 text-center">
          <div className="inline-block glass-card rounded-xl px-5 py-3 text-sm text-slate-600">
            <span className="text-yellow-500/70">⚡ Beta mode</span> · {totalInDb} products in database ·
            Live scraping activates in Phase 2 · Products added daily
          </div>
        </div>
      </div>
    </div>
  )
}
