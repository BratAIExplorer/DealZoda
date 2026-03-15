'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import DealScoreBadge from '@/components/ui/DealScoreBadge'
import type { LiveSearchResult, LiveSearchResponse } from '@/app/api/search-live/route'

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product, tracked, onTrack, onFirstClick,
}: {
  product:      LiveSearchResult
  tracked:      boolean
  onTrack:      (r: LiveSearchResult) => void
  onFirstClick: () => void
}) {
  const scoreColor = product.deal_score >= 80 ? '#10B981' : product.deal_score >= 60 ? '#60A5FA' : '#F59E0B'

  // Addendum: grey out button if URL is not a product page
  const viewDealLabel  = product.isProductPage ? 'View Deal ↗' : 'Visit retailer ↗'
  const viewDealStyle  = product.isProductPage
    ? { background: '#F59E0B', color: '#0F0E2A' }
    : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }

  return (
    <div className={`glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 flex flex-col gap-3
      ${product.is_fake_deal ? '' : 'hover:border-purple-500/20'}`}
         style={product.is_fake_deal ? { border: '1px solid rgba(239,68,68,0.2)' } : {}}>

      {/* Fake deal banner */}
      {product.is_fake_deal && (
        <div className="absolute top-0 left-0 right-0 px-4 py-2 flex items-center gap-2"
             style={{ background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
          <span className="text-red-400 text-xs font-bold">⚠ FAKE DEAL DETECTED</span>
          <span className="text-red-300/60 text-xs">— price appears inflated</span>
        </div>
      )}

      {/* AI unavailable notice */}
      {product.aiUnavailable && (
        <div className="absolute top-0 left-0 right-0 px-4 py-1.5 text-center"
             style={{ background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.15)' }}>
          <span className="text-yellow-500/70 text-xs font-mono">AI scoring unavailable — showing unranked results</span>
        </div>
      )}

      <div className={product.is_fake_deal || product.aiUnavailable ? 'mt-7' : ''}>
        {/* Header: title + score */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Retailer chip */}
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#C084FC' }}>
                {product.retailer}
              </span>
              {product.confidence === 'low' && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                      style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.2)' }}>
                  low confidence
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-white text-base leading-snug line-clamp-2">
              {product.title}
            </h3>
          </div>
          <div className="shrink-0">
            <DealScoreBadge score={product.deal_score} size="sm" />
          </div>
        </div>

        {/* Price */}
        {product.price && (
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-white text-xl">{product.price}</span>
            {product.is_fake_deal && (
              <span className="text-red-400 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                ↑ INFLATED
              </span>
            )}
          </div>
        )}

        {/* AI verdict */}
        <div className="rounded-xl px-3 py-2.5 font-mono text-xs leading-relaxed"
             style={{
               background: product.is_fake_deal ? 'rgba(239,68,68,0.05)' : 'rgba(0,0,0,0.25)',
               border: `1px solid ${product.is_fake_deal ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
               color: product.is_fake_deal ? '#FCA5A5' : '#94A3B8',
             }}>
          <span className="opacity-40 mr-1">Zoda›</span>
          {product.verdict}
        </div>

        {/* Snippet */}
        {product.snippet && (
          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{product.snippet}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1">
          {/* Track */}
          <button
            onClick={() => onTrack(product)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
              ${tracked
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                : 'text-slate-400 border-white/8 bg-white/4 hover:border-purple-500/30 hover:text-purple-300'
              }`}>
            {tracked ? '✓ Tracking' : '+ Track'}
          </button>

          {/* View Deal / Visit retailer (addendum: greyed out if not product page) */}
          {!product.is_fake_deal ? (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onFirstClick}
              className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
              style={viewDealStyle}
              title={!product.isProductPage ? 'No direct product link found — opens retailer' : undefined}
            >
              {viewDealLabel}
            </a>
          ) : (
            <div className="px-4 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
                 style={{ color: 'rgba(239,68,68,0.4)', border: '1px solid rgba(239,68,68,0.15)' }}>
              Do not buy
            </div>
          )}
        </div>

        {/* Zoda Credits line — only for affiliate links */}
        {!product.is_fake_deal && product.hasAffiliate && (
          <div className="pt-2 border-t flex items-center gap-1.5"
               style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <span className="text-yellow-400 text-xs">⚡</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Buy via DealZoda → <span className="text-yellow-400/70 font-medium">earn Zoda Credits</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)' }} />
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-4 w-4/5 rounded-lg"  style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-4 w-3/5 rounded-lg"  style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="w-12 h-12 rounded-xl shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>
      <div className="h-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="flex gap-2">
        <div className="flex-1 h-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="w-28 h-10 rounded-xl"   style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    </div>
  )
}

// ── Search Page ───────────────────────────────────────────────────────────────

export default function SearchPage() {
  const router         = useRouter()
  const searchParams   = useSearchParams()
  const initialQ       = searchParams.get('q') ?? ''

  const [query,       setQuery]       = useState(initialQ)
  const [inputVal,    setInputVal]    = useState(initialQ)
  const [results,     setResults]     = useState<LiveSearchResult[]>([])
  const [loading,     setLoading]     = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [fromCache,   setFromCache]   = useState(false)
  const [limitWarn,   setLimitWarn]   = useState<string | null>(null)
  const [trackedIds,  setTrackedIds]  = useState<Set<string>>(new Set())
  const [trackAlert,  setTrackAlert]  = useState<string | null>(null)
  const [showLogin,   setShowLogin]   = useState(false)
  const clickedOnce                   = useRef(false)

  // Load tracked from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dz_tracked')
      if (saved) setTrackedIds(new Set(JSON.parse(saved)))
    } catch {}
  }, [])

  // Fetch results
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setHasSearched(false)
    try {
      const r = await fetch(`/api/search-live?q=${encodeURIComponent(q)}&market=MY`)
      const d: LiveSearchResponse = await r.json()
      setResults(d.results ?? [])
      setFromCache(d.fromCache)
      setLimitWarn(d.limitWarning ?? null)
    } catch {
      setResults([])
    }
    setLoading(false)
    setHasSearched(true)
  }, [])

  // Search on initial load if ?q= present
  useEffect(() => {
    if (initialQ) doSearch(initialQ)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = inputVal.trim()
    if (!q) return
    setQuery(q)
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
    doSearch(q)
  }

  const handleTrack = (product: LiveSearchResult) => {
    const id = product.url
    setTrackedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        setTrackAlert(product.title)
        setTimeout(() => setTrackAlert(null), 3000)
      }
      localStorage.setItem('dz_tracked', JSON.stringify(Array.from(next)))
      return next
    })
  }

  const handleFirstClick = () => {
    if (clickedOnce.current) return
    clickedOnce.current = true
    setTimeout(() => setShowLogin(true), 800)
  }

  const fakeCount = results.filter(r => r.is_fake_deal).length

  return (
    <div className="min-h-screen" style={{ background: '#0F0E2A' }}>

      {/* Track toast */}
      {trackAlert && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl font-semibold text-sm shadow-xl text-white"
             style={{ background: '#10B981' }}>
          ✓ Tracking {trackAlert.slice(0, 40)}{trackAlert.length > 40 ? '…' : ''} — alert when price drops
        </div>
      )}

      {/* Soft login prompt (after first View Deal click) */}
      {showLogin && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-auto px-4"
             style={{ animation: 'fadeSlideUp 0.3s ease both' }}>
          <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-4"
               style={{ border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Want price drop alerts?</p>
              <p className="text-slate-500 text-xs mt-0.5">Sign in with Google — takes 10 seconds.</p>
            </div>
            <button className="btn-yellow px-3 py-2 rounded-xl text-xs font-bold shrink-0">
              Sign in
            </button>
            <button onClick={() => setShowLogin(false)}
                    className="text-slate-600 hover:text-white transition-colors text-lg shrink-0">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Header / Search bar ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b"
           style={{ background: 'rgba(15,14,42,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <a href="/" className="shrink-0 flex items-center gap-2">
              <Image src="/images/logo.png" alt="DealZoda" width={28} height={28} className="rounded-lg" />
              <span className="font-display font-bold text-white text-sm hidden sm:block">DealZoda</span>
            </a>

            {/* Inline search */}
            <form onSubmit={handleSubmit} className="flex-1 relative max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'rgba(139,92,246,0.6)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Search any product..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border:     '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={e => {
                  e.currentTarget.style.border    = '1px solid rgba(139,92,246,0.4)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                }}
                onBlur={e => {
                  e.currentTarget.style.border    = '1px solid rgba(255,255,255,0.1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              />
            </form>

            {/* BETA badge */}
            <div className="shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                 style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              BETA
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Limit warning */}
        {limitWarn && (
          <div className="mb-4 rounded-xl px-4 py-2.5 text-xs font-mono"
               style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
            ⚠ {limitWarn}
          </div>
        )}

        {/* Results meta bar */}
        {hasSearched && !loading && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-slate-500 text-sm">
              <span className="text-white font-semibold">{results.length}</span> results for
              <span className="text-purple-400 font-medium ml-1">"{query}"</span>
            </span>
            {fromCache && (
              <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981' }}>
                ⚡ instant (cached)
              </span>
            )}
            {fakeCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}>
                {fakeCount} fake{fakeCount > 1 ? 's' : ''} detected
              </span>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 rounded-full border-2 border-purple-500/30 border-t-purple-400"
                   style={{ animation: 'spin 0.8s linear infinite' }} />
              <span className="text-slate-400 text-sm font-mono">
                Zoda is hunting across 50+ retailers...
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((product, i) => (
              <ProductCard
                key={`${product.url}-${i}`}
                product={product}
                tracked={trackedIds.has(product.url)}
                onTrack={handleTrack}
                onFirstClick={handleFirstClick}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display font-bold text-white text-2xl mb-2">
              Nothing worth your money right now.
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Zoda keeps watching. We'll alert you the moment something real shows up for &quot;{query}&quot;.
            </p>
            <a href="/" className="inline-block mt-6 text-purple-400 hover:text-purple-300 text-sm transition-colors">
              ← Try a different search
            </a>
          </div>
        )}

        {/* Initial state — no search yet */}
        {!loading && !hasSearched && !initialQ && (
          <div className="text-center py-20 text-slate-600">
            <div className="text-5xl mb-4">⚡</div>
            <p>Type anything above and hit Enter</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          to { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
