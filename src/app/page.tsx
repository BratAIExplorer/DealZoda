'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const TRENDING = [
  'Samsung Galaxy S25',
  'MacBook Air M3',
  'Dyson V15',
  'Hotel Kuala Lumpur',
  'AirPods Pro 2',
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const router   = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (q: string) => {
    const term = q.trim()
    if (!term) return
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0F0E2A' }}>

      {/* ── Atmospheric background ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Central radial glow */}
        <div style={{
          position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 700, height: 420, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(107,33,168,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Top-right accent */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">

        {/* Logo + wordmark */}
        <div className="flex flex-col items-center mb-10" style={{ animation: 'fadeSlideDown 0.6s ease both' }}>
          <div className="relative mb-4">
            <div style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(107,33,168,0.35) 0%, transparent 70%)',
              filter: 'blur(12px)',
              animation: 'pulseGlow 3s ease-in-out infinite',
            }} />
            <Image
              src="/images/logo.png"
              alt="DealZoda"
              width={64}
              height={64}
              className="rounded-2xl relative"
              style={{ boxShadow: '0 0 32px rgba(107,33,168,0.4)', position: 'relative', zIndex: 1 }}
              priority
            />
          </div>
          <div className="text-center">
            <div className="font-display font-black text-white tracking-tight"
                 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', letterSpacing: '-0.02em' }}>
              DealZoda
            </div>
            <div className="font-mono text-xs mt-1 tracking-widest"
                 style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.2em' }}>
              SMART DEALS · FOUND FASTER
            </div>
          </div>
        </div>

        {/* Search form */}
        <div className="w-full max-w-2xl"
             style={{ animation: 'fadeSlideUp 0.6s 0.15s ease both', opacity: 0 }}>
          <form onSubmit={handleSubmit} className="relative">
            {/* Search icon */}
            <span className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'rgba(139,92,246,0.7)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search any product — Samsung S25, MacBook, flights to Bali..."
              autoFocus
              className="w-full py-4 pl-14 pr-28 rounded-2xl text-white text-sm outline-none transition-all duration-200"
              style={{
                background:           'rgba(255,255,255,0.05)',
                border:               '1px solid rgba(255,255,255,0.1)',
                backdropFilter:       'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              onFocus={e => {
                e.currentTarget.style.border    = '1px solid rgba(139,92,246,0.5)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(107,33,168,0.15), 0 8px 32px rgba(0,0,0,0.3)'
              }}
              onBlur={e => {
                e.currentTarget.style.border    = '1px solid rgba(255,255,255,0.1)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />

            {/* Clear */}
            {query && (
              <button type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                aria-label="Clear"
                className="absolute right-20 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}

            {/* Hunt button */}
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl font-display font-bold text-sm transition-all duration-150"
              style={{
                background: query.trim() ? '#F59E0B' : 'rgba(245,158,11,0.15)',
                color:      query.trim() ? '#0F0E2A' : 'rgba(245,158,11,0.35)',
                cursor:     query.trim() ? 'pointer'  : 'not-allowed',
              }}
            >
              Hunt →
            </button>
          </form>

          {/* Trending chips */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center items-center">
            <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Trending:
            </span>
            {TRENDING.map(term => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border:     '1px solid rgba(255,255,255,0.08)',
                  color:      'rgba(255,255,255,0.45)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.12)'
                  e.currentTarget.style.border     = '1px solid rgba(139,92,246,0.3)'
                  e.currentTarget.style.color      = 'rgba(196,132,252,1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.border     = '1px solid rgba(255,255,255,0.08)'
                  e.currentTarget.style.color      = 'rgba(255,255,255,0.45)'
                }}
              >
                {term}
              </button>
            ))}
          </div>

          {/* AI badge */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                 style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} />
              <span className="text-xs font-mono" style={{ color: 'rgba(196,132,252,0.7)' }}>
                Powered by Claude AI · 100% neutral · No paid placements
              </span>
            </div>
          </div>
        </div>

        {/* Value strip */}
        <div className="mt-12 flex items-center gap-6"
             style={{ animation: 'fadeIn 0.8s 0.5s ease both', opacity: 0 }}>
          {[
            { icon: '🔍', label: 'Any retailer' },
            { icon: '🛡️', label: 'Fake deal detector' },
            { icon: '⚡', label: 'Zoda Credits cashback' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-sm">{icon}</span>
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.28)' }}>{label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 px-6 py-4 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="" width={18} height={18} className="rounded opacity-40" />
          <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
            DealZoda · Beta
          </span>
        </div>
        <nav className="flex items-center gap-4">
          {[['Search', '/search'], ['Admin', '/admin']].map(([label, href]) => (
            <a key={href} href={href}
               className="text-xs transition-colors"
               style={{ color: 'rgba(255,255,255,0.2)' }}
               onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
               onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
              {label}
            </a>
          ))}
        </nav>
      </footer>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
