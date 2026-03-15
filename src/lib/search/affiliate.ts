/**
 * Affiliate link wrapping + URL product-page validation
 *
 * Layer B — runs AFTER search results are returned.
 * Users see zero difference; only the URL changes when an affiliate tag is applied.
 *
 * Addendum rule:
 *   - If URL is a retailer homepage (no product path) → isProductPage = false
 *   - Caller should grey out "View Deal" and show "Visit retailer" instead
 */

export interface LinkResult {
  url:          string
  hasAffiliate: boolean   // true = affiliate link → show "Earn Zoda Credits"
  isProductPage: boolean  // false = homepage/search → show "Visit retailer" (greyed)
}

// ── Retailer domain → affiliate env key mapping ───────────────────────────────

const AFFILIATE_MAP: { domain: string; type: 'involve' | 'amazon' | 'vcommission'; envKey: string }[] = [
  { domain: 'lazada.com.my',  type: 'involve',     envKey: 'INVOLVE_ASIA_LAZADA_TAG'    },
  { domain: 'lazada.com',     type: 'involve',     envKey: 'INVOLVE_ASIA_LAZADA_TAG'    },
  { domain: 'shopee.com.my',  type: 'involve',     envKey: 'INVOLVE_ASIA_SHOPEE_TAG'    },
  { domain: 'shopee.com',     type: 'involve',     envKey: 'INVOLVE_ASIA_SHOPEE_TAG'    },
  { domain: 'amazon.com.my',  type: 'amazon',      envKey: 'AMAZON_ASSOCIATE_TAG_MY'    },
  { domain: 'amazon.in',      type: 'amazon',      envKey: 'AMAZON_ASSOCIATE_TAG_IN'    },
  { domain: 'amazon.com',     type: 'amazon',      envKey: 'AMAZON_ASSOCIATE_TAG_US'    },
  { domain: 'flipkart.com',   type: 'vcommission', envKey: 'VCOMMISSION_FLIPKART_ID'    },
  { domain: 'booking.com',    type: 'involve',     envKey: 'INVOLVE_ASIA_BOOKING_TAG'   },
  { domain: 'agoda.com',      type: 'involve',     envKey: 'INVOLVE_ASIA_AGODA_TAG'     },
]

// ── Affiliate link builders ───────────────────────────────────────────────────

function buildInvolveLink(url: string, pid: string): string {
  return `https://app.involve.asia/api/deeplink?pid=${encodeURIComponent(pid)}&url=${encodeURIComponent(url)}`
}

function buildAmazonLink(url: string, tag: string): string {
  try {
    const u = new URL(url)
    u.searchParams.set('tag', tag)
    return u.toString()
  } catch {
    return url
  }
}

// ── URL product-page detection (per addendum) ─────────────────────────────────

export function isProductPageUrl(url: string): boolean {
  try {
    const { hostname, pathname } = new URL(url)
    const host = hostname.replace(/^www\./, '')
    const path = pathname

    // Shopee product: /{slug}-i.{shopId}.{itemId}
    if (host.includes('shopee') && /\-i\.\d+\.\d+/.test(path)) return true

    // Lazada product: /products/{slug}-i{itemId}-s{skuId}.html
    if (host.includes('lazada') && (path.includes('/products/') || /\-i\d+\-s\d+/.test(path))) return true

    // Amazon product: /dp/{ASIN} or /gp/product/{ASIN}
    if (host.includes('amazon') && (/\/dp\/[A-Z0-9]{10}/.test(path) || path.includes('/gp/product/'))) return true

    // Flipkart product: /p/ pattern
    if (host.includes('flipkart') && path.includes('/p/')) return true

    // Harvey Norman, Best Denki, Courts, All IT, TMT — product pages have path depth ≥ 2
    const knownRetailers = ['harveynorman', 'bestdenki', 'courts', 'allit', 'tmt', 'challenger', 'croma', 'reliancedigital']
    if (knownRetailers.some(r => host.includes(r))) {
      const parts = path.split('/').filter(Boolean)
      return parts.length >= 2
    }

    // Samsung official: /my/smartphones/ style — depth ≥ 2
    if (host.includes('samsung.com')) {
      const parts = path.split('/').filter(Boolean)
      return parts.length >= 2
    }

    // Generic rule: path must have ≥ 2 segments and contain something product-like
    const parts = path.split('/').filter(Boolean)
    if (parts.length < 2) return false

    // Reject plain search/category pages
    const searchPatterns = /^(search|catalog|category|browse|c\/|s\/|l\/)$/i
    if (searchPatterns.test(parts[0])) return false

    return true
  } catch {
    return false
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export function processLink(url: string): LinkResult {
  const isProductPage = isProductPageUrl(url)

  try {
    const { hostname } = new URL(url)
    const host = hostname.replace(/^www\./, '')

    for (const entry of AFFILIATE_MAP) {
      if (!host.includes(entry.domain)) continue

      const tag = process.env[entry.envKey]
      const pid = process.env.INVOLVE_ASIA_PID

      if (!tag) break   // affiliate not configured — use direct link

      let affiliateUrl = url
      if (entry.type === 'involve' && pid) {
        affiliateUrl = buildInvolveLink(url, pid)
      } else if (entry.type === 'amazon') {
        affiliateUrl = buildAmazonLink(url, tag)
      }

      return { url: affiliateUrl, hasAffiliate: true, isProductPage }
    }
  } catch {
    // invalid URL — fall through
  }

  return { url, hasAffiliate: false, isProductPage }
}
