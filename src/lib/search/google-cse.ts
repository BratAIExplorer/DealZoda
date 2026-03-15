/**
 * Google Custom Search API client
 * Free tier: 100 queries/day  |  Paid: $5 per 1,000 queries
 * Setup: https://programmablesearchengine.google.com
 */

export interface CSEResult {
  title:    string
  url:      string
  snippet:  string
  price?:   string
  retailer: string
  image?:   string
}

// Known retailer display names keyed by domain fragment
const RETAILER_NAMES: Record<string, string> = {
  'shopee.com.my':        'Shopee MY',
  'shopee.com':           'Shopee',
  'lazada.com.my':        'Lazada MY',
  'lazada.com':           'Lazada',
  'amazon.com.my':        'Amazon MY',
  'amazon.com':           'Amazon US',
  'amazon.in':            'Amazon IN',
  'harveynorman.com.my':  'Harvey Norman MY',
  'allit.com.my':         'All IT',
  'tmt.com.my':           'TMT',
  'courts.com.my':        'Courts MY',
  'bestdenki.com.my':     'Best Denki MY',
  'challenger.sg':        'Challenger SG',
  'samsung.com/my':       'Samsung MY',
  'samsung.com/in':       'Samsung IN',
  'samsung.com':          'Samsung Official',
  'flipkart.com':         'Flipkart',
  'croma.com':            'Croma',
  'reliancedigital.in':   'Reliance Digital',
  'vijaysales.com':       'Vijay Sales',
  'iprice.my':            'iPrice MY',
  'booking.com':          'Booking.com',
  'agoda.com':            'Agoda',
  'airasia.com':          'AirAsia',
}

export function resolveRetailerName(displayLink: string): string {
  const dl = displayLink.toLowerCase().replace(/^www\./, '')
  for (const [domain, name] of Object.entries(RETAILER_NAMES)) {
    if (dl.includes(domain)) return name
  }
  // Fallback: capitalise the root domain
  const root = dl.split('.')[0]
  return root.charAt(0).toUpperCase() + root.slice(1)
}

function extractPrice(item: CSEAPIItem): string | undefined {
  // Structured data first (most reliable)
  const offer   = item.pagemap?.offer?.[0]
  const product = item.pagemap?.product?.[0]
  if (offer?.price)         return offer.price
  if (product?.price)       return product.price
  if (offer?.lowprice)      return offer.lowprice

  // Fall back to regex on title + snippet
  const text = `${item.title} ${item.snippet ?? ''}`
  const m = text.match(
    /(?:RM|MYR|USD|S\$|SGD|₹|INR|\$)\s*[\d,]+(?:\.\d{1,2})?|[\d,]+(?:\.\d{1,2})?\s*(?:RM|MYR|USD|SGD|INR)/i
  )
  return m?.[0]?.trim()
}

interface CSEAPIItem {
  title:       string
  link:        string
  displayLink: string
  snippet?:    string
  pagemap?: {
    offer?:       { price?: string; lowprice?: string }[]
    product?:     { price?: string }[]
    cse_image?:   { src?: string }[]
  }
}

interface CSEAPIResponse {
  items?: CSEAPIItem[]
  error?: { message: string; code: number }
  queries?: { request?: { totalResults?: string }[] }
}

export async function googleCSESearch(
  query:  string,
  market: string = 'MY'
): Promise<CSEResult[]> {
  const apiKey = process.env.GOOGLE_CSE_API_KEY
  const cx     = process.env.GOOGLE_CSE_ID

  if (!apiKey || !cx) {
    throw new Error('GOOGLE_CSE_API_KEY and GOOGLE_CSE_ID env vars are required')
  }

  // Append "buy now price" to surface product pages over editorial content (per addendum)
  const searchQuery = `${query} buy now price`

  // Geolocation bias
  const glMap: Record<string, string> = { MY: 'my', IN: 'in', US: 'us', SG: 'sg' }
  const gl = glMap[market] ?? 'my'

  const url = new URL('https://www.googleapis.com/customsearch/v1')
  url.searchParams.set('key',  apiKey)
  url.searchParams.set('cx',   cx)
  url.searchParams.set('q',    searchQuery)
  url.searchParams.set('num',  '10')
  url.searchParams.set('gl',   gl)

  const res = await fetch(url.toString(), { next: { revalidate: 0 } })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`Google CSE error ${res.status}: ${body?.error?.message ?? res.statusText}`)
  }

  const data: CSEAPIResponse = await res.json()

  if (!data.items?.length) return []

  return data.items.map((item): CSEResult => ({
    title:    item.title,
    url:      item.link,
    snippet:  item.snippet ?? '',
    price:    extractPrice(item),
    retailer: resolveRetailerName(item.displayLink),
    image:    item.pagemap?.cse_image?.[0]?.src,
  }))
}
