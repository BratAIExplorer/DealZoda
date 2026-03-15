/**
 * Sample product data for beta testing.
 * These are seeded manually to let us test the search/alert/scoring UX
 * before Apify scraping is live.
 * Replace with real DB queries once Phase B (backend) is complete.
 */

export interface SampleProduct {
  id:             string
  name:           string
  description:    string
  category:       'Phones' | 'Laptops' | 'Cameras' | 'TVs' | 'Audio' | 'Hotels' | 'Flights' | 'Fashion' | 'Appliances'
  market:         'MY' | 'IN' | 'US' | 'SG'
  retailer:       string
  retailerUrl:    string
  currentPrice:   number
  normalPrice:    number  // 90-day average
  currency:       string
  dealScore:      number  // 0-100
  isFakeDeal:     boolean
  fakeReason?:    string
  aiVerdict:      string
  recommendation: 'BUY_NOW' | 'WAIT' | 'SKIP'
  priceDropPct:   number
  imageEmoji:     string  // placeholder until real images
  tags:           string[]
  lastUpdated:    string
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  // ── Phones ────────────────────────────────────────────────────────────────
  {
    id: 'p001',
    name: 'Samsung Galaxy S25',
    description: '6.2" Dynamic AMOLED, Snapdragon 8 Elite, 50MP camera, 4000mAh',
    category: 'Phones',
    market: 'MY',
    retailer: 'Shopee MY',
    retailerUrl: 'https://shopee.com.my',
    currentPrice: 1950,
    normalPrice: 2499,
    currency: 'MYR',
    dealScore: 91,
    isFakeDeal: false,
    aiVerdict: 'Lowest price in 34 days. Trending back up — supplier shortage detected.',
    recommendation: 'BUY_NOW',
    priceDropPct: 22,
    imageEmoji: '📱',
    tags: ['samsung', 'phone', 'android', 'flagship'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'p002',
    name: 'iPhone 16 Pro Max',
    description: '6.9" Super Retina XDR, A18 Pro chip, 48MP Fusion camera, Titanium',
    category: 'Phones',
    market: 'MY',
    retailer: 'Harvey Norman MY',
    retailerUrl: 'https://harveynorman.com.my',
    currentPrice: 5699,
    normalPrice: 5499,
    currency: 'MYR',
    dealScore: 18,
    isFakeDeal: true,
    fakeReason: 'Price was inflated from RM 5,499 to RM 5,999 before 12.12 sale. "Discount" to RM 5,699 is still MORE than the normal price.',
    aiVerdict: 'FAKE DEAL. Normal price is RM 5,499. You pay RM 200 more than usual.',
    recommendation: 'SKIP',
    priceDropPct: -4,
    imageEmoji: '📱',
    tags: ['iphone', 'apple', 'phone', 'ios', 'flagship'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'p003',
    name: 'OnePlus 12',
    description: '6.82" LTPO AMOLED, Snapdragon 8 Gen 3, 50MP Hasselblad, 5400mAh',
    category: 'Phones',
    market: 'IN',
    retailer: 'Flipkart',
    retailerUrl: 'https://flipkart.com',
    currentPrice: 52999,
    normalPrice: 64999,
    currency: 'INR',
    dealScore: 84,
    isFakeDeal: false,
    aiVerdict: '18% below 90-day average. Diwali sale pricing — historically reverts within 5 days.',
    recommendation: 'BUY_NOW',
    priceDropPct: 18,
    imageEmoji: '📱',
    tags: ['oneplus', 'phone', 'android', 'snapdragon'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'p004',
    name: 'Google Pixel 9 Pro',
    description: '6.3" LTPO OLED, Google Tensor G4, 50MP main camera, 7 years updates',
    category: 'Phones',
    market: 'US',
    retailer: 'Amazon US',
    retailerUrl: 'https://amazon.com',
    currentPrice: 849,
    normalPrice: 999,
    currency: 'USD',
    dealScore: 88,
    isFakeDeal: false,
    aiVerdict: '15% below all-time average. All-time low was $799 (Black Friday 2024). Strong buy signal.',
    recommendation: 'BUY_NOW',
    priceDropPct: 15,
    imageEmoji: '📱',
    tags: ['google', 'pixel', 'phone', 'android'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'p005',
    name: 'Xiaomi 14 Ultra',
    description: '6.73" LTPO AMOLED, Snapdragon 8 Gen 3, Leica quad camera system',
    category: 'Phones',
    market: 'MY',
    retailer: 'Lazada MY',
    retailerUrl: 'https://lazada.com.my',
    currentPrice: 3899,
    normalPrice: 4299,
    currency: 'MYR',
    dealScore: 73,
    isFakeDeal: false,
    aiVerdict: '9% below average. Decent discount but better deals expected during 11.11.',
    recommendation: 'WAIT',
    priceDropPct: 9,
    imageEmoji: '📱',
    tags: ['xiaomi', 'phone', 'android', 'leica', 'camera'],
    lastUpdated: new Date().toISOString(),
  },

  // ── Laptops ───────────────────────────────────────────────────────────────
  {
    id: 'l001',
    name: 'MacBook Air M3 (15-inch)',
    description: 'Apple M3 chip, 16GB RAM, 512GB SSD, 15.3" Liquid Retina',
    category: 'Laptops',
    market: 'US',
    retailer: 'Amazon US',
    retailerUrl: 'https://amazon.com',
    currentPrice: 1099,
    normalPrice: 1299,
    currency: 'USD',
    dealScore: 78,
    isFakeDeal: false,
    aiVerdict: '15% below average. Educational discount pricing. Not the all-time low ($999 during Black Friday) but solid.',
    recommendation: 'BUY_NOW',
    priceDropPct: 15,
    imageEmoji: '💻',
    tags: ['macbook', 'apple', 'laptop', 'm3', 'macos'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'l002',
    name: 'Dell XPS 15 (9530)',
    description: 'Intel Core i7-13700H, RTX 4060, 32GB DDR5, 1TB SSD, OLED',
    category: 'Laptops',
    market: 'US',
    retailer: 'Best Buy',
    retailerUrl: 'https://bestbuy.com',
    currentPrice: 1399,
    normalPrice: 1799,
    currency: 'USD',
    dealScore: 83,
    isFakeDeal: false,
    aiVerdict: '22% below average. Clearance sale — i7 model being discontinued. Excellent value.',
    recommendation: 'BUY_NOW',
    priceDropPct: 22,
    imageEmoji: '💻',
    tags: ['dell', 'xps', 'laptop', 'windows', 'oled', 'rtx'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'l003',
    name: 'ASUS ROG Zephyrus G16',
    description: 'AMD Ryzen 9 8945HS, RTX 4090, 32GB, 2TB, 240Hz QHD OLED',
    category: 'Laptops',
    market: 'MY',
    retailer: 'Courts MY',
    retailerUrl: 'https://courts.com.my',
    currentPrice: 8999,
    normalPrice: 9999,
    currency: 'MYR',
    dealScore: 65,
    isFakeDeal: false,
    aiVerdict: '10% discount. Not exceptional but decent for a gaming laptop. Watch for 11.11 — this category typically sees 15-20% deeper cuts.',
    recommendation: 'WAIT',
    priceDropPct: 10,
    imageEmoji: '🎮',
    tags: ['asus', 'rog', 'gaming', 'laptop', 'rtx4090', 'oled'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'l004',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    description: 'Intel Core Ultra 7, 32GB LPDDR5, 1TB SSD, 14" IPS, 1.12kg',
    category: 'Laptops',
    market: 'IN',
    retailer: 'Amazon IN',
    retailerUrl: 'https://amazon.in',
    currentPrice: 129999,
    normalPrice: 159999,
    currency: 'INR',
    dealScore: 80,
    isFakeDeal: false,
    aiVerdict: '19% below average. Corporate clearance pricing. Strong buy if you need a business ultrabook.',
    recommendation: 'BUY_NOW',
    priceDropPct: 19,
    imageEmoji: '💼',
    tags: ['lenovo', 'thinkpad', 'laptop', 'business', 'ultrabook'],
    lastUpdated: new Date().toISOString(),
  },

  // ── Audio ─────────────────────────────────────────────────────────────────
  {
    id: 'a001',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancelling, 30hr battery, multipoint connection',
    category: 'Audio',
    market: 'MY',
    retailer: 'Shopee MY',
    retailerUrl: 'https://shopee.com.my',
    currentPrice: 1099,
    normalPrice: 1499,
    currency: 'MYR',
    dealScore: 72,
    isFakeDeal: false,
    aiVerdict: '27% discount. Consistently deals well on Shopee. Price stable at this level for 2 weeks.',
    recommendation: 'BUY_NOW',
    priceDropPct: 27,
    imageEmoji: '🎧',
    tags: ['sony', 'headphones', 'noise-cancelling', 'wireless', 'anc'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'a002',
    name: 'Bose QuietComfort Ultra Headphones',
    description: 'Spatial audio, CustomTune, 24hr battery, premium leather',
    category: 'Audio',
    market: 'US',
    retailer: 'Amazon US',
    retailerUrl: 'https://amazon.com',
    currentPrice: 249,
    normalPrice: 329,
    currency: 'USD',
    dealScore: 82,
    isFakeDeal: false,
    aiVerdict: '24% below average. Lowest since launch. No indication of further price drop incoming.',
    recommendation: 'BUY_NOW',
    priceDropPct: 24,
    imageEmoji: '🎧',
    tags: ['bose', 'headphones', 'noise-cancelling', 'spatial-audio', 'premium'],
    lastUpdated: new Date().toISOString(),
  },

  // ── TVs ───────────────────────────────────────────────────────────────────
  {
    id: 'tv001',
    name: 'LG OLED C4 65"',
    description: 'OLED evo, α9 AI Processor, Dolby Vision, 4K 120Hz, Game Optimizer',
    category: 'TVs',
    market: 'MY',
    retailer: 'Courts MY',
    retailerUrl: 'https://courts.com.my',
    currentPrice: 6999,
    normalPrice: 8999,
    currency: 'MYR',
    dealScore: 81,
    isFakeDeal: false,
    aiVerdict: '22% discount. OLED TVs rarely dip this low in MY. LG typically holds price well.',
    recommendation: 'BUY_NOW',
    priceDropPct: 22,
    imageEmoji: '📺',
    tags: ['lg', 'oled', 'tv', '4k', 'gaming', 'dolby'],
    lastUpdated: new Date().toISOString(),
  },

  // ── Cameras ───────────────────────────────────────────────────────────────
  {
    id: 'c001',
    name: 'Sony A7 IV (Body Only)',
    description: '33MP full-frame BSI-CMOS, 4K 60fps, 759 phase-detect AF points',
    category: 'Cameras',
    market: 'US',
    retailer: 'B&H Photo',
    retailerUrl: 'https://bhphotovideo.com',
    currentPrice: 2298,
    normalPrice: 2798,
    currency: 'USD',
    dealScore: 76,
    isFakeDeal: false,
    aiVerdict: '18% discount. B&H grey market pricing. Verify warranty before purchasing internationally.',
    recommendation: 'BUY_NOW',
    priceDropPct: 18,
    imageEmoji: '📷',
    tags: ['sony', 'camera', 'mirrorless', 'fullframe', 'a7iv'],
    lastUpdated: new Date().toISOString(),
  },

  // ── Hotels ────────────────────────────────────────────────────────────────
  {
    id: 'h001',
    name: 'Ritz-Carlton Kuala Lumpur',
    description: 'Deluxe Room, 2 nights, breakfast included, KLCC view, June 15-17',
    category: 'Hotels',
    market: 'MY',
    retailer: 'Booking.com',
    retailerUrl: 'https://booking.com',
    currentPrice: 780,
    normalPrice: 1100,
    currency: 'MYR',
    dealScore: 87,
    isFakeDeal: false,
    aiVerdict: 'Per-night rate RM 390 — 29% below typical. Early booking discount, non-refundable. Very strong value.',
    recommendation: 'BUY_NOW',
    priceDropPct: 29,
    imageEmoji: '🏨',
    tags: ['hotel', 'kl', 'luxury', 'ritz-carlton', 'klcc'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h002',
    name: 'Marina Bay Sands Singapore',
    description: 'Deluxe Room, 2 nights, infinity pool access, Marina Bay view, June 20-22',
    category: 'Hotels',
    market: 'SG',
    retailer: 'Agoda',
    retailerUrl: 'https://agoda.com',
    currentPrice: 1280,
    normalPrice: 1650,
    currency: 'SGD',
    dealScore: 79,
    isFakeDeal: false,
    aiVerdict: 'SGD 640/night. 22% below peak. MBS rarely dips below SGD 600/night. Good timing.',
    recommendation: 'BUY_NOW',
    priceDropPct: 22,
    imageEmoji: '🏨',
    tags: ['hotel', 'singapore', 'marina-bay-sands', 'luxury', 'infinity-pool'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h003',
    name: 'Taj Mahal Palace Mumbai',
    description: 'Luxury Room, 2 nights, harbour view, butler service, July 5-7',
    category: 'Hotels',
    market: 'IN',
    retailer: 'MakeMyTrip',
    retailerUrl: 'https://makemytrip.com',
    currentPrice: 28000,
    normalPrice: 35000,
    currency: 'INR',
    dealScore: 75,
    isFakeDeal: false,
    aiVerdict: '20% below average. Pre-monsoon rates. Expect prices to rise July onwards.',
    recommendation: 'BUY_NOW',
    priceDropPct: 20,
    imageEmoji: '🏨',
    tags: ['hotel', 'mumbai', 'taj', 'luxury', 'harbour'],
    lastUpdated: new Date().toISOString(),
  },

  // ── Flights ───────────────────────────────────────────────────────────────
  {
    id: 'f001',
    name: 'KL → Singapore (Return)',
    description: 'AirAsia, non-stop, departs July 10 returns July 13, 1 bag included',
    category: 'Flights',
    market: 'MY',
    retailer: 'AirAsia',
    retailerUrl: 'https://airasia.com',
    currentPrice: 189,
    normalPrice: 320,
    currency: 'MYR',
    dealScore: 90,
    isFakeDeal: false,
    aiVerdict: 'Return trip for RM 189 — 41% below average. Seat sale ends in 18 hours. Act now.',
    recommendation: 'BUY_NOW',
    priceDropPct: 41,
    imageEmoji: '✈️',
    tags: ['flight', 'kl', 'singapore', 'airasia', 'return'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'f002',
    name: 'Delhi → Dubai (Return)',
    description: 'IndiGo, 1 stop via Mumbai, departs Aug 1 returns Aug 8, 15kg bag',
    category: 'Flights',
    market: 'IN',
    retailer: 'Goibibo',
    retailerUrl: 'https://goibibo.com',
    currentPrice: 24500,
    normalPrice: 38000,
    currency: 'INR',
    dealScore: 86,
    isFakeDeal: false,
    aiVerdict: '35% below average for this route. Shoulder season pricing before Eid surge. Strong buy.',
    recommendation: 'BUY_NOW',
    priceDropPct: 35,
    imageEmoji: '✈️',
    tags: ['flight', 'delhi', 'dubai', 'indigo', 'return', 'nri'],
    lastUpdated: new Date().toISOString(),
  },

  // ── Fashion ───────────────────────────────────────────────────────────────
  {
    id: 'fa001',
    name: 'Nike Air Max 270 React',
    description: 'Men\'s Running Shoe, React foam + Max Air unit, sizes 7-13',
    category: 'Fashion',
    market: 'US',
    retailer: 'Amazon US',
    retailerUrl: 'https://amazon.com',
    currentPrice: 89,
    normalPrice: 150,
    currency: 'USD',
    dealScore: 79,
    isFakeDeal: false,
    aiVerdict: '41% discount. End-of-season clearance. Limited sizes remaining — check stock.',
    recommendation: 'BUY_NOW',
    priceDropPct: 41,
    imageEmoji: '👟',
    tags: ['nike', 'shoes', 'running', 'fashion', 'airmax'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'fa002',
    name: 'Dyson Airwrap Multi-Styler',
    description: 'Complete Long, Coanda airflow, curls + waves + smooth, all hair types',
    category: 'Appliances',
    market: 'MY',
    retailer: 'Shopee MY',
    retailerUrl: 'https://shopee.com.my',
    currentPrice: 1699,
    normalPrice: 2199,
    currency: 'MYR',
    dealScore: 74,
    isFakeDeal: false,
    aiVerdict: '23% discount. Genuine Shopee Guaranteed seller. Verify warranty card is included.',
    recommendation: 'BUY_NOW',
    priceDropPct: 23,
    imageEmoji: '💇',
    tags: ['dyson', 'hair', 'styling', 'beauty', 'appliance'],
    lastUpdated: new Date().toISOString(),
  },
]

// ── Search utility ─────────────────────────────────────────────────────────

export function searchProducts(
  query: string,
  filters?: {
    market?: string
    category?: string
    maxScore?: number
    minScore?: number
    fakeDealsOnly?: boolean
    realDealsOnly?: boolean
  }
): SampleProduct[] {
  const q = query.toLowerCase().trim()

  return SAMPLE_PRODUCTS.filter(p => {
    // Text match
    const textMatch = !q || (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q)) ||
      p.retailer.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )

    // Filters
    const marketMatch  = !filters?.market   || p.market   === filters.market
    const catMatch     = !filters?.category || p.category === filters.category
    const minMatch     = !filters?.minScore || p.dealScore >= filters.minScore
    const maxMatch     = !filters?.maxScore || p.dealScore <= filters.maxScore
    const fakeMatch    = !filters?.fakeDealsOnly || p.isFakeDeal
    const realMatch    = !filters?.realDealsOnly || !p.isFakeDeal

    return textMatch && marketMatch && catMatch && minMatch && maxMatch && fakeMatch && realMatch
  }).sort((a, b) => b.dealScore - a.dealScore) // Sort by score descending
}

export const CATEGORIES = ['Phones', 'Laptops', 'Cameras', 'TVs', 'Audio', 'Hotels', 'Flights', 'Fashion', 'Appliances'] as const
export const MARKETS    = ['MY', 'IN', 'US', 'SG'] as const
export const MARKET_LABELS: Record<string, string> = {
  MY: '🇲🇾 Malaysia',
  IN: '🇮🇳 India',
  US: '🇺🇸 USA',
  SG: '🇸🇬 Singapore',
}
export const CURRENCY_SYMBOLS: Record<string, string> = {
  MYR: 'RM',
  INR: '₹',
  USD: '$',
  SGD: 'S$',
}
