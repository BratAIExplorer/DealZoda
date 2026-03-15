'use client'

import { useState } from 'react'
import Image from 'next/image'
import DealScoreBadge from '@/components/ui/DealScoreBadge'
import Button from '@/components/ui/Button'

// ── Data ────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    icon: '🎭',
    title: 'Fake deals everywhere',
    body: 'Sellers inflate prices before 11.11, then "discount" them. You pay MORE than the normal price. Nobody tells you.',
    fix: 'DealZoda detects every fake in seconds.',
  },
  {
    icon: '🌏',
    title: 'No cross-border intelligence',
    body: 'That laptop is RM 3,400 cheaper in the US. After duties and shipping, is it still worth it? Nobody calculates this for you.',
    fix: 'DealZoda shows the full landed cost instantly.',
  },
  {
    icon: '🔔',
    title: 'Alert spam you ignore',
    body: '50 emails a day. None of them worth your time. You stop opening them. You miss the one deal that mattered.',
    fix: 'Zoda fires a maximum of 3 alerts per day — each scored 90+.',
  },
]

const FEATURES = [
  {
    icon: '🧠',
    label: 'AI Deal Score',
    title: 'Every deal scored 0-100',
    body: 'Claude AI analyses price history, seasonal patterns, and community signals. You only see deals that genuinely make sense.',
    sample: 'Score 91/100. Price 23% below 90-day average. Historically bounces back in 3 days. Strong buy signal.',
    color: '#10B981',
  },
  {
    icon: '🚫',
    label: 'Fake Deal Detector',
    title: 'Calls out inflate-then-discount tricks',
    body: 'Price was RM 1,350 for 90 days. Three days before 11.11 it jumped to RM 2,000. Now it\'s "discounted" to RM 1,400. Still more than normal.',
    sample: 'FAKE DEAL — You pay RM 50 MORE than the normal price.',
    color: '#EF4444',
  },
  {
    icon: '✈️',
    label: 'Cross-Border Calculator',
    title: 'True landed cost from any market',
    body: 'Buy from the US, India, or Singapore? Zoda calculates the actual cost after import duties, shipping, SST, and exchange rates.',
    sample: 'Dell XPS 15: MY RM 8,500 vs US RM 5,800 converted. After duty + shipping: RM 7,108. Save RM 1,392 (16%).',
    color: '#60A5FA',
  },
  {
    icon: '⚡',
    label: 'Zoda Credits',
    title: 'Earn while you shop — always',
    body: 'Every purchase via DealZoda earns you 20-40% of our affiliate commission back as Zoda Credits. Cash out or unlock Premium free.',
    sample: 'You earned RM 40 in Zoda Credits from your laptop purchase. Balance: RM 63. Unlock Premium free.',
    color: '#F59E0B',
  },
]

const MARKETS = [
  { flag: '🇲🇾', name: 'Malaysia',   tag: 'Home base',        phase: 'Live Phase 1' },
  { flag: '🇮🇳', name: 'India',      tag: '$200B market',     phase: 'Live Phase 1' },
  { flag: '🇺🇸', name: 'USA',        tag: 'Best prices',      phase: 'Live Phase 1' },
  { flag: '🇸🇬', name: 'Singapore',  tag: 'Highest income SEA', phase: 'Phase 2' },
  { flag: '🇦🇪', name: 'UAE',        tag: 'Expat hub',        phase: 'Year 2' },
  { flag: '🇬🇧', name: 'UK',         tag: 'NRI community',    phase: 'Year 2' },
]

const LAYERS = [
  {
    num: '01',
    title: 'AI finds the real deal',
    desc: 'Scored, verified, fake-detected across MY · IN · US · SG',
    earn: 'Save RM 50–500',
    color: '#9333EA',
  },
  {
    num: '02',
    title: 'You buy via DealZoda link',
    desc: 'Same price. DealZoda earns an affiliate commission.',
    earn: 'You pay nothing extra',
    color: '#7C3AED',
  },
  {
    num: '03',
    title: 'Zoda Credits land in your account',
    desc: '20–40% of our commission shared back to you instantly.',
    earn: '+ RM 5 to RM 80 credits',
    color: '#F59E0B',
  },
  {
    num: '04',
    title: 'Stack your card rewards on top',
    desc: 'Your Maybank / HDFC / Amex points on the same transaction.',
    earn: 'Maximum value extracted',
    color: '#10B981',
  },
]

const RETAILERS = ['Lazada', 'Shopee', 'Amazon', 'Flipkart', 'Harvey Norman', 'Booking.com', 'Agoda', 'AirAsia', 'Croma', 'Best Buy', 'Walmart']

// ── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5 border-x-0 border-t-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/logo.png"
            alt="DealZoda"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-display font-bold text-white text-lg tracking-tight hidden sm:block">
            DealZoda
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#features"     className="hover:text-white transition-colors">Features</a>
          <a href="#credits"      className="hover:text-white transition-colors">Zoda Credits</a>
          <a href="#markets"      className="hover:text-white transition-colors">Markets</a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a href="#waitlist">
            <Button variant="yellow" size="sm">
              Get Early Access
              <span className="animate-bounce-x">→</span>
            </Button>
          </a>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-navy-dark border-t border-white/5 px-4 py-4 flex flex-col gap-4 text-sm text-slate-400">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="hover:text-white">How it works</a>
          <a href="#features"     onClick={() => setMenuOpen(false)} className="hover:text-white">Features</a>
          <a href="#credits"      onClick={() => setMenuOpen(false)} className="hover:text-white">Zoda Credits</a>
          <a href="#markets"      onClick={() => setMenuOpen(false)} className="hover:text-white">Markets</a>
        </div>
      )}
    </nav>
  )
}

// ── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-60" />
      <div className="glow-blob-purple top-[-100px] right-[-100px]" />
      <div className="glow-blob-yellow bottom-[-100px] left-[-50px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 reveal"
                 style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#C084FC' }}>
              <span className="counter-dot w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
              AI Deal Intelligence · MY · IN · US · SG
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold leading-[1.05] tracking-tight mb-6 reveal reveal-delay-1">
              <span className="text-white block text-5xl sm:text-6xl lg:text-7xl">Smart deals.</span>
              <span className="gradient-text block text-5xl sm:text-6xl lg:text-7xl">Found faster.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg reveal reveal-delay-2">
              DealZoda is the AI that hunts deals across Malaysia, India, USA & Singapore —
              scoring each one, detecting fake discounts, and calculating cross-border savings.
              <br /><br />
              <span className="text-purple-300 font-medium">And shares cashback back to you. Always.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10 reveal reveal-delay-3">
              <a href="#waitlist">
                <Button variant="yellow" size="lg">
                  Join the Waitlist — It's Free
                  <span className="animate-bounce-x">→</span>
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Social proof micro */}
            <div className="flex items-center gap-3 text-sm text-slate-500 reveal reveal-delay-4">
              <div className="flex -space-x-2">
                {['🇲🇾','🇮🇳','🇺🇸','🇸🇬'].map((flag, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-navy-light border-2 border-navy-deeper flex items-center justify-center text-sm">
                    {flag}
                  </div>
                ))}
              </div>
              <span><strong className="text-white">847</strong> deal hunters on the waitlist</span>
            </div>
          </div>

          {/* Right — Live Deal Card */}
          <div className="flex justify-center lg:justify-end reveal reveal-delay-2">
            <div className="relative">
              {/* Main floating deal card */}
              <div className="animate-float glass-card rounded-2xl p-5 w-80 shadow-card"
                   style={{ boxShadow: '0 0 0 1px rgba(139,92,246,0.2), 0 20px 60px rgba(0,0,0,0.5)' }}>

                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400 tracking-widest">LIVE ANALYSIS</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Shopee MY</span>
                </div>

                {/* Product */}
                <div className="mb-4">
                  <h3 className="font-display font-bold text-white text-lg leading-tight">
                    Samsung Galaxy S25
                  </h3>
                  <p className="text-slate-500 text-sm">Electronics · 128GB · Phantom Black</p>
                </div>

                {/* Price + Score row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-3xl font-display font-extrabold text-white">RM 1,950</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-500 line-through text-sm">RM 2,499</span>
                      <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        −22%
                      </span>
                    </div>
                  </div>
                  <DealScoreBadge score={91} size="md" animated={true} />
                </div>

                {/* AI Verdict */}
                <div className="rounded-xl p-3 mb-4 scan-container"
                     style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p className="text-xs text-emerald-300 leading-relaxed font-mono">
                    "Lowest price in 34 days. Trending back up — supplier shortage detected. Strong buy signal."
                  </p>
                </div>

                {/* Real Deal badge + CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                       style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <span className="text-emerald-400 text-xs">✓</span>
                    <span className="text-emerald-400 text-xs font-semibold">REAL DEAL</span>
                  </div>
                  <button className="btn-yellow px-4 py-2 rounded-xl text-sm font-bold">
                    View Deal →
                  </button>
                </div>

                {/* Credits line */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5">
                  <span className="text-yellow-400 text-xs">⚡</span>
                  <span className="text-xs text-slate-500">
                    Buy this → earn <span className="text-yellow-400 font-semibold">RM 19</span> in Zoda Credits
                  </span>
                </div>
              </div>

              {/* Floating fake deal card (offset) */}
              <div className="absolute -bottom-16 -left-16 animate-float-slow glass-card rounded-xl p-3.5 w-56"
                   style={{
                     animationDelay: '1s',
                     boxShadow: '0 0 0 1px rgba(239,68,68,0.2), 0 10px 30px rgba(0,0,0,0.4)',
                   }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-red-400 text-xs">⚠</span>
                  <span className="text-red-400 text-xs font-bold tracking-widest">FAKE DEAL</span>
                </div>
                <p className="text-white text-sm font-semibold mb-1">Xiaomi 14 Pro</p>
                <div className="flex items-center gap-2">
                  <span className="fake-price text-sm">RM 2,800</span>
                  <span className="text-red-400 text-xs">Normal: RM 1,900</span>
                </div>
                <p className="text-red-300/70 text-xs mt-1.5 font-mono leading-relaxed">
                  Price inflated before 11.11. You pay MORE.
                </p>
              </div>

              {/* Floating credits notification */}
              <div className="absolute -top-10 -right-8 animate-float glass-card rounded-xl px-3.5 py-2.5 w-48"
                   style={{
                     animationDelay: '2s',
                     boxShadow: '0 0 0 1px rgba(245,158,11,0.25), 0 10px 30px rgba(0,0,0,0.4)',
                   }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <div>
                    <p className="text-yellow-400 text-xs font-bold">Credits Earned!</p>
                    <p className="text-white text-sm font-semibold">+RM 40 Zoda Credits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Retailer ticker */}
        <div className="mt-20 overflow-hidden">
          <p className="text-center text-xs text-slate-600 uppercase tracking-widest mb-4 font-mono">Tracking prices across</p>
          <div className="overflow-hidden">
            <div className="ticker-track">
              {[...RETAILERS, ...RETAILERS].map((r, i) => (
                <span key={i} className="text-slate-500 text-sm font-medium whitespace-nowrap px-4 py-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Problems ─────────────────────────────────────────────────────────────────

function Problems() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="glow-blob-purple opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-mono text-purple-400 tracking-widest uppercase">The problem</span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-3">
            Deal hunting is <span className="gradient-text">broken.</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">
            Every tool that exists today is either dumb, biased, or only works in one country.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {PROBLEMS.map((p, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 group">
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="font-display font-bold text-white text-xl mb-3">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{p.body}</p>
              <div className="flex items-start gap-2 pt-4 border-t border-white/5">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                <p className="text-emerald-300 text-sm font-medium">{p.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: '💬',
      title: 'Tell Zoda what you want',
      desc: 'Type a product name or category. Set your budget. Choose your market. Done in under 2 minutes — Zoda sets everything up for you.',
    },
    {
      num: '02',
      icon: '🤖',
      title: 'AI hunts, scores & detects fakes',
      desc: 'Zoda crawls Lazada, Shopee, Amazon, Flipkart and dozens more. Every deal is scored 0-100. Fake inflations are called out immediately.',
    },
    {
      num: '03',
      icon: '🔔',
      title: 'You get alerted when it\'s real',
      desc: 'Maximum 3 alerts per day. Only 90+ scored deals reach you. Telegram or email — your choice. You decide. You save. You earn credits.',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 relative"
             style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(30,27,75,0.3) 50%, transparent 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-mono text-purple-400 tracking-widest uppercase">How it works</span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-3">
            Three steps, <span className="gradient-text">then relax.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px"
               style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(245,158,11,0.4), transparent)' }} />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center group">
              {/* Step number */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full animate-pulse-glow"
                     style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
                <div className="relative w-20 h-20 rounded-full glass-card flex flex-col items-center justify-center"
                     style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
                  <span className="text-2xl mb-0.5">{step.icon}</span>
                  <span className="text-purple-400 text-xs font-mono">{step.num}</span>
                </div>
              </div>

              <h3 className="font-display font-bold text-white text-xl mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="glow-blob-yellow opacity-40 top-0 right-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-mono text-purple-400 tracking-widest uppercase">Intelligence</span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-3">
            Five AI brains. <span className="gradient-text">One platform.</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">
            Competitors show you data. Zoda interprets it.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 group relative overflow-hidden">
              {/* Glow accent */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none"
                   style={{ background: `radial-gradient(circle at top right, ${f.color}, transparent 70%)` }} />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{f.icon}</span>
                      <span className="text-xs font-mono font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                            style={{ color: f.color, background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                        {f.label}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white text-xl mt-2">{f.title}</h3>
                  </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-4">{f.body}</p>

                {/* Sample output — terminal style */}
                <div className="rounded-xl p-3 font-mono text-xs leading-relaxed"
                     style={{
                       background: 'rgba(0,0,0,0.3)',
                       border: `1px solid ${f.color}25`,
                       color: f.color === '#EF4444' ? '#FCA5A5' : f.color === '#F59E0B' ? '#FCD34D' : '#86EFAC',
                     }}>
                  <span className="text-slate-600 mr-2">›</span>
                  {f.sample}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI power strip */}
        <div className="mt-10 glass-card rounded-2xl p-5 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
          <span className="text-slate-400 font-medium">Powered by</span>
          <span className="px-3 py-1 rounded-full text-purple-300 font-semibold"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            Claude AI (Primary)
          </span>
          <span className="text-slate-700">+</span>
          <span className="px-3 py-1 rounded-full text-green-300 font-semibold"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            GPT-4o (Fallback)
          </span>
          <span className="text-slate-700">+</span>
          <span className="px-3 py-1 rounded-full text-blue-300 font-semibold"
                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
            Gemini Flash (Speed)
          </span>
          <span className="text-slate-600 text-xs">· Triple AI redundancy. 99.9% uptime.</span>
        </div>
      </div>
    </section>
  )
}

// ── Markets ───────────────────────────────────────────────────────────────────

function Markets() {
  return (
    <section id="markets" className="py-24 relative"
             style={{ background: 'linear-gradient(180deg, transparent, rgba(15,14,42,0.8) 50%, transparent)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-mono text-purple-400 tracking-widest uppercase">Coverage</span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-3">
            One platform. <span className="gradient-text">Four markets.</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg">
            The only deal intelligence platform built for cross-border shoppers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MARKETS.map((m, i) => (
            <div key={i}
                 className={`glass-card rounded-2xl p-5 text-center group transition-all duration-300
                   ${m.phase === 'Live Phase 1' ? 'cursor-pointer' : 'opacity-60'}`}>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{m.flag}</div>
              <div className="font-display font-bold text-white text-sm">{m.name}</div>
              <div className="text-slate-500 text-xs mt-1">{m.tag}</div>
              <div className={`mt-2 text-xs font-semibold px-2 py-0.5 rounded-full inline-block
                ${m.phase === 'Live Phase 1'
                  ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
                  : 'text-slate-500 bg-white/5 border border-white/10'
                }`}>
                {m.phase}
              </div>
            </div>
          ))}
        </div>

        {/* Cross-border callout */}
        <div className="mt-10 glass-card rounded-2xl p-6 sm:p-8"
             style={{ border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-4xl shrink-0">✈️</div>
            <div>
              <h3 className="font-display font-bold text-white text-xl mb-1">
                The cross-border edge nobody else has
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                That Sony camera is RM 2,800 locally. In the US it's the equivalent of RM 1,600.
                After import duties (RM 240), shipping (RM 180), and SST (RM 130) — you pay{' '}
                <span className="text-yellow-400 font-semibold">RM 2,150. Save RM 650 (23%)</span>.
                Zoda calculates this automatically. No spreadsheet needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Zoda Credits ──────────────────────────────────────────────────────────────

function ZodaCredits() {
  return (
    <section id="credits" className="py-24 relative overflow-hidden">
      <div className="glow-blob-yellow opacity-50 bottom-0 right-1/4" />
      <div className="glow-blob-purple opacity-30 top-0 left-1/4" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Explanation */}
          <div>
            <span className="text-xs font-mono text-yellow-400 tracking-widest uppercase">Zoda Credits</span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-3 mb-5">
              You earn. <span className="gradient-text-yellow">Every time.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Every purchase via a DealZoda link earns you <strong className="text-yellow-400">20-40%</strong> of
              our affiliate commission back as Zoda Credits. Retailers pay the same — you earn at no extra cost.
            </p>

            {/* Math example */}
            <div className="glass-card rounded-2xl p-5 mb-6"
                 style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-xs font-mono text-yellow-400/70 uppercase tracking-widest mb-3">Real example</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">You buy a RM 4,000 laptop</span>
                  <span className="text-white font-semibold">RM 4,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amazon pays DealZoda (5%)</span>
                  <span className="text-purple-300 font-semibold">RM 200</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-yellow-300 font-semibold">You earn (20% share)</span>
                  <span className="text-yellow-400 font-bold text-base">RM 40 Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">+ your Maybank points on same purchase</span>
                  <span className="text-emerald-400 text-xs font-medium">double win</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400">✓</span> Cash out at RM 20 balance
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400">✓</span> Unlock Premium free
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400">✓</span> Donate to charity
              </div>
            </div>
          </div>

          {/* Right — 4-Layer Stack */}
          <div className="space-y-3">
            {LAYERS.map((layer, i) => (
              <div key={i} className="layer-card glass-card rounded-xl p-4 flex items-start gap-4"
                   style={{ borderColor: `${layer.color}20` }}>
                {/* Number */}
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm"
                     style={{ background: `${layer.color}15`, color: layer.color, border: `1px solid ${layer.color}30` }}>
                  {layer.num}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-semibold text-white text-sm">{layer.title}</h4>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ color: layer.color, background: `${layer.color}15` }}>
                      {layer.earn}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{layer.desc}</p>
                </div>
              </div>
            ))}

            {/* Transparency note */}
            <div className="pt-2 text-xs text-slate-600 font-mono text-center">
              Every affiliate link is labeled. Commission always disclosed. We never hide it.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Waitlist ──────────────────────────────────────────────────────────────────

function Waitlist() {
  const [email, setEmail] = useState('')
  const [market, setMarket] = useState('MY')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // TODO: wire up to your API endpoint or an email service like Resend
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section id="waitlist" className="py-24 relative overflow-hidden">
      {/* Yellow-tinted background */}
      <div className="absolute inset-0"
           style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
      <div className="dot-grid absolute inset-0 opacity-30" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
        {/* Counter badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
             style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <span className="counter-dot w-2 h-2 rounded-full bg-yellow-400 inline-block" />
          <span className="text-yellow-300 font-semibold text-sm">847 deal hunters already waiting</span>
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
          Get early access. <span className="gradient-text-yellow">It's free.</span>
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          Be among the first to use DealZoda when we launch.
          No credit card. No spam. Just deals worth your time.
        </p>

        {submitted ? (
          <div className="glass-card rounded-2xl p-8 text-center"
               style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="font-display font-bold text-white text-2xl mb-2">Zoda is watching for you.</h3>
            <p className="text-emerald-300">You're on the list. We'll alert you the moment we launch — and only when it's genuinely worth your time.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8"
                style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm text-slate-400 text-left mb-1.5 font-medium">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600
                             focus:border-yellow-500/50 focus:bg-white/8 transition-all duration-200 text-sm"
                />
              </div>

              {/* Market selection */}
              <div>
                <label className="block text-sm text-slate-400 text-left mb-1.5 font-medium">Your market</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { code: 'MY', flag: '🇲🇾', label: 'Malaysia' },
                    { code: 'IN', flag: '🇮🇳', label: 'India' },
                    { code: 'US', flag: '🇺🇸', label: 'USA' },
                    { code: 'SG', flag: '🇸🇬', label: 'Singapore' },
                  ].map(m => (
                    <button
                      key={m.code}
                      type="button"
                      onClick={() => setMarket(m.code)}
                      className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                        ${market === m.code
                          ? 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10'
                          : 'text-slate-500 border-white/10 bg-white/3 hover:border-white/20'
                        } border`}
                    >
                      <div className="text-xl mb-0.5">{m.flag}</div>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email}
                className="btn-yellow w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding you to the list...
                  </>
                ) : (
                  <>
                    Notify Me at Launch
                    <span>→</span>
                  </>
                )}
              </button>

              <p className="text-slate-600 text-xs text-center">
                No spam. No credit card. We only email you when DealZoda launches — and when deals are genuinely worth your time.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t py-12"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(8,7,26,0.8)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/images/logo.png" alt="DealZoda" width={32} height={32} className="rounded-lg" />
              <span className="font-display font-bold text-white">DealZoda</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Smart deals. Found faster.<br />
              The neutral AI-powered cross-border deal platform.
            </p>
            <div className="flex gap-3">
              <a href="https://t.me/DealZodaMY" target="_blank" rel="noopener noreferrer"
                 className="text-slate-500 hover:text-purple-400 transition-colors text-sm">
                Telegram ↗
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#features"     className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="#credits"      className="hover:text-white transition-colors">Zoda Credits</a></li>
              <li><a href="#markets"      className="hover:text-white transition-colors">Markets</a></li>
            </ul>
          </div>

          {/* Markets */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Markets</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>🇲🇾 Malaysia</li>
              <li>🇮🇳 India</li>
              <li>🇺🇸 United States</li>
              <li className="opacity-50">🇸🇬 Singapore <span className="text-xs">(Phase 2)</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/privacy"  className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms"    className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/cookies"  className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600"
             style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p>© 2026 DealZoda. All rights reserved.</p>
          <p className="font-mono text-center">
            Affiliate links are always disclosed ·{' '}
            <span className="text-purple-600">We are always on your side.</span>
          </p>
          <p>dealzoda.com · dealzoda.my</p>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problems />
      <HowItWorks />
      <Features />
      <Markets />
      <ZodaCredits />
      <Waitlist />
      <Footer />
    </main>
  )
}
