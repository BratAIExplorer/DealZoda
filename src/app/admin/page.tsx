'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/products-store'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'dealzoda2026'

const CATEGORIES = ['Phones','Laptops','Cameras','TVs','Audio','Hotels','Flights','Fashion','Appliances','Other']
const MARKETS    = [
  { code: 'MY', label: '🇲🇾 Malaysia',   currency: 'MYR', symbol: 'RM' },
  { code: 'IN', label: '🇮🇳 India',       currency: 'INR', symbol: '₹' },
  { code: 'US', label: '🇺🇸 USA',         currency: 'USD', symbol: '$' },
  { code: 'SG', label: '🇸🇬 Singapore',   currency: 'SGD', symbol: 'S$' },
]

const EMPTY_FORM = {
  name: '', description: '', category: 'Phones', market: 'MY',
  retailer: '', retailerUrl: '', currentPrice: '', normalPrice: '',
  aiVerdict: '', tags: '', dealScore: '', isFakeDeal: false, fakeReason: '',
}

export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState<{ text: string; ok: boolean } | null>(null)

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': password }

  const loadProducts = async () => {
    const r = await fetch('/api/admin/products', { headers })
    if (r.ok) {
      const d = await r.json()
      setProducts(d.products)
    }
  }

  useEffect(() => {
    if (authed) loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim()) setAuthed(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)

    const r = await fetch('/api/admin/products', {
      method: 'POST',
      headers,
      body: JSON.stringify(form),
    })
    const d = await r.json()

    if (r.ok) {
      setMsg({ text: `✓ "${d.product.name}" added — Score: ${d.product.dealScore}/100`, ok: true })
      setForm(EMPTY_FORM)
      loadProducts()
    } else {
      setMsg({ text: d.error ?? 'Failed to add product', ok: false })
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE', headers })
    loadProducts()
  }

  const selectedMarket = MARKETS.find(m => m.code === form.market)!

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F0E2A' }}>
        <form onSubmit={handleLogin} className="glass-card rounded-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/images/logo.png" alt="DealZoda" width={36} height={36} className="rounded-lg" />
            <div>
              <div className="font-display font-bold text-white">DealZoda Admin</div>
              <div className="text-xs text-slate-500">Product Manager</div>
            </div>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm mb-4"
            autoFocus
          />
          <button type="submit" className="btn-yellow w-full py-3 rounded-xl font-bold">
            Enter Admin →
          </button>
        </form>
      </div>
    )
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#0F0E2A' }}>
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between"
           style={{ background: 'rgba(15,14,42,0.95)' }}>
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="DealZoda" width={28} height={28} className="rounded-lg" />
          <span className="font-display font-bold text-white">Admin</span>
          <span className="text-slate-600">·</span>
          <span className="text-sm text-slate-500">{products.length} products in database</span>
        </div>
        <a href="/search" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
          View Search →
        </a>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">

        {/* ── Add Product Form ──────────────────────────────────────────────── */}
        <div>
          <h2 className="font-display font-bold text-white text-xl mb-5">Add Product</h2>

          {msg && (
            <div className={`rounded-xl px-4 py-3 mb-4 text-sm font-medium ${
              msg.ok ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
                     : 'text-red-300 bg-red-500/10 border border-red-500/20'
            }`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Product Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="e.g. Samsung Galaxy S25 Ultra"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                required />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Description</label>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="e.g. 6.9&quot; OLED, Snapdragon 8 Elite, 200MP camera"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
            </div>

            {/* Category + Market */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Market</label>
                <select value={form.market} onChange={e => setForm({...form, market: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm">
                  {MARKETS.map(m => <option key={m.code} value={m.code}>{m.label}</option>)}
                </select>
              </div>
            </div>

            {/* Retailer */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Retailer</label>
                <input value={form.retailer} onChange={e => setForm({...form, retailer: e.target.value})}
                  placeholder="e.g. Shopee MY"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Retailer URL</label>
                <input value={form.retailerUrl} onChange={e => setForm({...form, retailerUrl: e.target.value})}
                  placeholder="https://shopee.com.my/..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  Current Price ({selectedMarket.symbol}) *
                </label>
                <input type="number" value={form.currentPrice}
                  onChange={e => setForm({...form, currentPrice: e.target.value})}
                  placeholder="1950"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  required />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  Normal Price ({selectedMarket.symbol}) *
                  <span className="text-slate-600 font-normal ml-1">(90-day avg)</span>
                </label>
                <input type="number" value={form.normalPrice}
                  onChange={e => setForm({...form, normalPrice: e.target.value})}
                  placeholder="2499"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  required />
              </div>
            </div>

            {/* Auto score preview */}
            {form.currentPrice && form.normalPrice && (
              <div className="rounded-xl px-3 py-2 text-xs font-mono"
                   style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <span className="text-slate-500">Auto score: </span>
                <span className="text-purple-300 font-bold">
                  {Math.max(0, Math.min(100, Math.round((1 - Number(form.currentPrice)/Number(form.normalPrice)) * 180)))}/100
                </span>
                <span className="text-slate-600 ml-2">· override below if needed</span>
              </div>
            )}

            {/* Override score + Fake deal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  Override Score <span className="text-slate-600 font-normal">(optional)</span>
                </label>
                <input type="number" min="0" max="100" value={form.dealScore}
                  onChange={e => setForm({...form, dealScore: e.target.value})}
                  placeholder="Auto-calculated"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFakeDeal}
                    onChange={e => setForm({...form, isFakeDeal: e.target.checked})}
                    className="w-4 h-4 rounded" />
                  <span className="text-sm text-red-300 font-medium">Mark as Fake Deal</span>
                </label>
              </div>
            </div>

            {/* AI Verdict */}
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                Zoda Verdict <span className="text-slate-600 font-normal">(what Zoda says about this deal)</span>
              </label>
              <textarea value={form.aiVerdict} onChange={e => setForm({...form, aiVerdict: e.target.value})}
                placeholder="e.g. Lowest price in 34 days. Trending back up. Strong buy signal."
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm resize-none" />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                Tags <span className="text-slate-600 font-normal">(comma separated)</span>
              </label>
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
                placeholder="samsung, phone, android, galaxy"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
            </div>

            <button type="submit" disabled={saving}
              className="btn-yellow w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              {saving ? 'Adding...' : '+ Add Product to DealZoda'}
            </button>
          </form>
        </div>

        {/* ── Product List ──────────────────────────────────────────────────── */}
        <div>
          <h2 className="font-display font-bold text-white text-xl mb-5">
            Products ({products.length})
          </h2>

          {products.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-600">
              <div className="text-4xl mb-3">📭</div>
              <p>No products yet. Add the first one!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {products.map(p => {
                const sym = { MYR: 'RM', INR: '₹', USD: '$', SGD: 'S$' }[p.currency] ?? p.currency
                const scoreColor = p.dealScore >= 80 ? '#10B981' : p.dealScore >= 60 ? '#60A5FA' : '#F59E0B'
                return (
                  <div key={p.id} className="glass-card rounded-xl p-4 flex items-start gap-3">
                    {/* Score */}
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg"
                         style={{ background: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>
                      {p.dealScore}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-white text-sm font-semibold leading-tight">{p.name}</p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {p.market} · {p.retailer} · {sym}{p.currentPrice.toLocaleString()}
                            {p.isFakeDeal && <span className="text-red-400 ml-1">· FAKE</span>}
                          </p>
                        </div>
                        <button onClick={() => handleDelete(p.id, p.name)}
                          className="text-slate-700 hover:text-red-400 transition-colors text-sm shrink-0">
                          ✕
                        </button>
                      </div>
                      <p className="text-slate-600 text-xs mt-1 font-mono line-clamp-1">
                        › {p.aiVerdict}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
