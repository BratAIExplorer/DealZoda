# Phase 1 — Locked Scope

## What We ARE Building in Phase 1

- [ ] Google + Apple login (NextAuth.js)
- [ ] Deal feed homepage — top 20 AI-scored deals, filter by market + category
- [ ] Product search — by name, returns price + AI score
- [ ] Price history chart — 30-day raw + 12-month monthly average
- [ ] Alert creation — set price threshold per product
- [ ] AI Deal Scoring — Claude API scores each deal 0-100 per crawl cycle
- [ ] Fake Deal Detector — compares sale price vs 90-day average, flags inflations
- [ ] Apify webhooks — receive scraped data, store, trigger AI scoring
- [ ] Telegram alerts — notify when alert threshold is hit
- [ ] Weekly email digest — via Resend
- [ ] Zoda Credits — track affiliate clicks, receive conversion webhook, show balance
- [ ] User dashboard — savings total, credits balance, active alerts
- [ ] Account deletion — one-click PDPA-compliant full data removal

## What We are NOT Building in Phase 1

- ❌ Cross-border calculator (Phase 2)
- ❌ Subscription billing / Stripe (Phase 3)
- ❌ Browser extension (Phase 3)
- ❌ Mobile app (Phase 3)
- ❌ Singapore market (Phase 2)
- ❌ Community voting forum (Phase 2)
- ❌ Merchant Portal (Phase 4)
- ❌ B2B features (Phase 4)
- ❌ UAE / UK markets (Phase 4)

## 8-Week Build Order

| Week | Target |
|------|--------|
| 1 | Project setup: Next.js, DB, Docker Compose, Nginx, SSL |
| 2 | Auth: Google + Apple login, user profile |
| 3 | Apify webhook + price ingestion + AI scoring pipeline |
| 4 | Deal feed homepage + price history chart + fake deal badge |
| 5 | Alerts system + Telegram bot + email digest via Resend |
| 6 | Zoda Credits: affiliate tracking + conversion webhook + balance UI |
| 7 | Testing + mobile responsiveness + bug fixes |
| 8 | Launch prep: analytics, monitoring, seed 100 products, beta test 5 users |

## Demand Signals Before Charging (7 must all be green)

1. 50+ active weekly users
2. 30%+ alert open rate
3. 15%+ deal click-through rate
4. 10+ users who earned AND redeemed Zoda Credits
5. 5 unprompted "I would pay for this" statements
6. 3+ confirmed affiliate purchases in network dashboard
7. Users recommending to friends without prompting
