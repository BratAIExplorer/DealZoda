/**
 * DealZoda AI Router
 *
 * Routes tasks to the right AI provider based on complexity and cost:
 *   Claude Sonnet 4.6  → Primary: deal scoring, fake detection, cross-border analysis
 *   GPT-4o             → Fallback if Claude is unavailable
 *   GPT-4o-mini        → Bulk tasks: categorization, tagging, quick summaries
 *   Gemini 1.5 Flash   → Structured extraction from scraped HTML (cheapest + fast)
 *
 * Usage:
 *   import { aiRouter } from '@/lib/ai/router'
 *   const result = await aiRouter.scoreDeals(dealData)
 */

import Anthropic from '@anthropic-ai/sdk'
import OpenAI    from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

// ── Provider instances ─────────────────────────────────────────────────────

const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

// ── Model IDs ──────────────────────────────────────────────────────────────

const MODELS = {
  CLAUDE_PRIMARY:   'claude-sonnet-4-6',       // Primary brain — best reasoning
  GPT_FALLBACK:     'gpt-4o',                  // Fallback if Claude is down
  GPT_MINI_BULK:    'gpt-4o-mini',             // Cheap bulk tasks
  GEMINI_FLASH:     'gemini-1.5-flash',        // Fast structured extraction
} as const

// ── Types ──────────────────────────────────────────────────────────────────

export interface DealScoringInput {
  productName:    string
  currentPrice:   number
  currency:       string
  retailer:       string
  market:         string           // MY | IN | US | SG
  priceHistory:   { date: string; price: number }[]
  avgPrice90Day:  number
  minPriceAllTime: number
  communityVotes: number
}

export interface DealScoringResult {
  score:         number            // 0-100
  verdict:       string            // One-line human-readable explanation
  isFakeDeal:    boolean
  fakeReason?:   string
  recommendation: 'BUY_NOW' | 'WAIT' | 'SKIP'
  waitReason?:   string
  confidence:    'HIGH' | 'MEDIUM' | 'LOW'
}

export interface CrossBorderInput {
  productName:    string
  priceSourceMarket:   number
  priceLocalMarket:    number
  sourceCurrency:      string
  localCurrency:       string
  sourceMarket:        string
  localMarket:         string
  productCategory:     string    // Used for duty rate lookup
  shippingWeightKg:    number
}

export interface CrossBorderResult {
  landedCost:       number
  localCurrency:    string
  savings:          number
  savingsPct:       number
  worthBuying:      boolean
  breakdown: {
    basePrice:      number
    shippingCost:   number
    importDuty:     number
    gstSst:         number
    fxConversion:   number
    total:          number
  }
  warrantyRisk:     'LOW' | 'MEDIUM' | 'HIGH'
  verdict:          string
}

// ── AI Router ─────────────────────────────────────────────────────────────

export const aiRouter = {
  /**
   * Brain 1 + 2: Score a deal AND detect fake discounts.
   * Uses Claude as primary (best reasoning). Falls back to GPT-4o if Claude fails.
   */
  async scoreDeal(input: DealScoringInput): Promise<DealScoringResult> {
    const prompt = buildScoringPrompt(input)

    try {
      const response = await claude.messages.create({
        model:      MODELS.CLAUDE_PRIMARY,
        max_tokens: 512,
        system: `You are Zoda, DealZoda's AI deal analyst. You score deals from 0-100 and detect fake discounts.
                 Always respond with valid JSON matching the DealScoringResult schema. Be concise and precise.`,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      return parseJsonResponse<DealScoringResult>(text)

    } catch (err) {
      // Fallback to GPT-4o
      console.warn('[AI Router] Claude failed, falling back to GPT-4o:', err)
      return scoreDealWithGPT(prompt)
    }
  },

  /**
   * Brain 3: Cross-border landed cost calculation.
   * Uses Claude for complex multi-variable reasoning.
   */
  async calculateCrossBorder(input: CrossBorderInput): Promise<CrossBorderResult> {
    const prompt = buildCrossBorderPrompt(input)

    const response = await claude.messages.create({
      model:      MODELS.CLAUDE_PRIMARY,
      max_tokens: 768,
      system: `You are Zoda's cross-border cost calculator. Calculate the true landed cost of buying from another country.
               Include import duties, shipping, FX conversion, and local taxes. Respond with valid JSON.
               Always add a disclaimer that users should verify warranty terms before purchasing.`,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return parseJsonResponse<CrossBorderResult>(text)
  },

  /**
   * Bulk categorization of products — uses GPT-4o-mini (cheap + fast).
   * Used during Apify scrape ingestion to tag categories.
   */
  async categorizeProducts(products: { name: string; description: string }[]): Promise<string[]> {
    const prompt = `Categorize these products into one of: Electronics, Laptops, Phones, Cameras, Appliances,
                   Fashion, Beauty, Travel, Hotels, Flights, Books, Sports, Home, Other.
                   Return a JSON array of category strings in the same order as input.
                   Products: ${JSON.stringify(products)}`

    const response = await openai.chat.completions.create({
      model:      MODELS.GPT_MINI_BULK,
      max_tokens: 256,
      messages:   [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const text = response.choices[0].message.content ?? '{"categories":[]}'
    const parsed = JSON.parse(text)
    return parsed.categories ?? []
  },

  /**
   * Structured data extraction from scraped HTML — uses Gemini Flash.
   * Fastest and cheapest option for high-volume parsing.
   */
  async extractProductData(html: string, url: string): Promise<{
    name: string
    price: number
    currency: string
    inStock: boolean
    imageUrl: string
    rating?: number
  }> {
    const model  = gemini.getGenerativeModel({ model: MODELS.GEMINI_FLASH })
    const prompt = `Extract product data from this HTML page (${url}).
                   Return JSON with: name, price (number), currency (e.g. MYR), inStock (bool), imageUrl, rating (optional).
                   HTML snippet: ${html.substring(0, 8000)}`

    const result = await model.generateContent(prompt)
    const text   = result.response.text()

    // Strip markdown code blocks if present
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean)
  },

  /**
   * Brain 5: Timing advisor — when to buy, not just if.
   * Uses Claude for complex seasonal pattern analysis.
   */
  async adviseOnTiming(input: {
    productName:    string
    category:       string
    currentScore:   number
    upcomingSales:  string[]
    priceHistory:   { month: string; avgPrice: number }[]
  }): Promise<{ advice: 'BUY_NOW' | 'WAIT'; waitDays?: number; reason: string; confidence: number }> {
    const prompt = `Product: ${input.productName} (${input.category})
                   Current deal score: ${input.currentScore}/100
                   Upcoming sales events: ${input.upcomingSales.join(', ')}
                   Price history (monthly averages): ${JSON.stringify(input.priceHistory)}

                   Should the user buy now or wait? Consider seasonal patterns and upcoming sale events.
                   Return JSON: { advice: "BUY_NOW" | "WAIT", waitDays?: number, reason: string, confidence: number (0-100) }`

    const response = await claude.messages.create({
      model:      MODELS.CLAUDE_PRIMARY,
      max_tokens: 256,
      system:     'You are Zoda, a deal timing advisor. Give concise, data-backed advice. Respond with valid JSON only.',
      messages:   [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return parseJsonResponse(text)
  },
}

// ── Prompt Builders ────────────────────────────────────────────────────────

function buildScoringPrompt(input: DealScoringInput): string {
  const priceChange = ((input.currentPrice - input.avgPrice90Day) / input.avgPrice90Day * 100).toFixed(1)
  const vsAllTimeLow = ((input.currentPrice - input.minPriceAllTime) / input.minPriceAllTime * 100).toFixed(1)

  return `Score this deal 0-100 and detect if it's fake.

Product: ${input.productName}
Market: ${input.market} | Retailer: ${input.retailer}
Current price: ${input.currency} ${input.currentPrice}
90-day average: ${input.currency} ${input.avgPrice90Day}
Change vs average: ${priceChange}%
All-time low: ${input.currency} ${input.minPriceAllTime} (current is ${vsAllTimeLow}% above ATL)
Community votes: ${input.communityVotes}
Recent price history (last 10 points): ${JSON.stringify(input.priceHistory.slice(-10))}

Fake deal detection: If price was inflated in the last 7 days before this "discount", flag as fake.

Respond with JSON:
{
  "score": 0-100,
  "verdict": "one sentence plain English explanation",
  "isFakeDeal": boolean,
  "fakeReason": "explanation if fake, else omit",
  "recommendation": "BUY_NOW" | "WAIT" | "SKIP",
  "waitReason": "if WAIT, how many days and why, else omit",
  "confidence": "HIGH" | "MEDIUM" | "LOW"
}`
}

function buildCrossBorderPrompt(input: CrossBorderInput): string {
  return `Calculate true landed cost for cross-border purchase.

Product: ${input.productName}
Category: ${input.productCategory}
Price in ${input.sourceMarket}: ${input.sourceCurrency} ${input.priceSourceMarket}
Local price in ${input.localMarket}: ${input.localCurrency} ${input.priceLocalMarket}
Shipping weight: ${input.shippingWeightKg}kg

Use realistic import duty rates for ${input.localMarket} + ${input.productCategory}.
Include: shipping cost estimate, import duty %, GST/SST, FX conversion fee (1.5%).

Return JSON matching CrossBorderResult schema with full breakdown and plain English verdict.
Always include warranty risk assessment (LOW/MEDIUM/HIGH).`
}

// ── Fallback Functions ─────────────────────────────────────────────────────

async function scoreDealWithGPT(prompt: string): Promise<DealScoringResult> {
  const response = await openai.chat.completions.create({
    model:      MODELS.GPT_FALLBACK,
    max_tokens: 512,
    messages: [
      {
        role: 'system',
        content: 'You are a deal scoring AI. Score deals 0-100 and detect fake discounts. Respond with valid JSON only.',
      },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  })

  const text = response.choices[0].message.content ?? '{}'
  return parseJsonResponse<DealScoringResult>(text)
}

// ── Utilities ──────────────────────────────────────────────────────────────

function parseJsonResponse<T>(text: string): T {
  // Strip markdown code blocks if model wrapped in ```json
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(clean) as T
  } catch {
    throw new Error(`AI returned invalid JSON: ${clean.substring(0, 200)}`)
  }
}
