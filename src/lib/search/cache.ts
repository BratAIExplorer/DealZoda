/**
 * In-memory TTL cache — no extra npm dependencies needed.
 * Single-instance VPS: module-level Map persists across requests in the same process.
 * Upgrade path: swap store for Redis when scaling to multiple instances.
 */

interface CacheEntry<T> {
  value:     T
  expiresAt: number
}

const store = new Map<string, CacheEntry<unknown>>()

export const CACHE_TTL_MS = 6 * 60 * 60 * 1000  // 6 hours

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.value
}

export function cacheSet<T>(key: string, value: T, ttlMs = CACHE_TTL_MS): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs })
}

export function cacheKey(query: string, market: string): string {
  return `search:${market.toLowerCase()}:${query.toLowerCase().trim()}`
}

/** Evict expired entries — call occasionally to prevent memory growth */
export function cacheEvict(): void {
  const now = Date.now()
  Array.from(store.entries()).forEach(([k, v]) => {
    if (now > v.expiresAt) store.delete(k)
  })
}
