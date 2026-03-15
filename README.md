# ⚡ DealZoda — Smart deals. Found faster.

AI-powered, cross-border deal intelligence platform.
Markets: Malaysia · India · USA · Singapore

---

## Stack

| Layer | Technology |
|-------|-----------|
| Web | Next.js 14 (App Router) |
| Database | PostgreSQL + Prisma ORM |
| Cache / Queue | Redis + BullMQ |
| AI | Anthropic Claude API |
| Scraping | Apify (Phase 1) → Playwright → Scrapy |
| Email | Resend |
| Auth | NextAuth.js (Google + Apple only) |
| Infrastructure | Docker Compose on Hostinger KVM 2 VPS |

---

## Folder Structure

```
DealZoda/
├── src/
│   ├── app/              # Next.js App Router (pages + API routes)
│   ├── components/       # React components
│   │   ├── ui/           # Base design system components
│   │   ├── deals/        # Deal cards, score badges, fake deal banners
│   │   ├── alerts/       # Alert creation and management
│   │   └── credits/      # Zoda Credits dashboard
│   ├── lib/              # Core business logic
│   │   ├── ai/           # Claude API — 5 AI brains
│   │   ├── scraper/      # Apify webhook handlers
│   │   ├── affiliate/    # Affiliate link generation + click tracking
│   │   └── notifications/# Telegram + email dispatch
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global CSS + Tailwind config
├── prisma/               # Database schema + migrations
├── workers/              # Background services
│   ├── alert-engine/     # Price drop alert processor
│   ├── credits-engine/   # Affiliate conversion → credits
│   └── telegram-bot/     # Telegram bot commands
├── infra/                # Docker Compose + Nginx + SSL
├── public/               # Static assets
├── docs/                 # Documentation
├── scripts/              # Deployment + seed scripts
└── .github/workflows/    # CI/CD pipelines
```

---

## Quick Start (Development)

```bash
# 1. Clone and install
git clone https://github.com/BratAIExplorer/DealZoda.git
cd DealZoda
npm install

# 2. Set up environment
cp .env.example .env
# Fill in your API keys in .env

# 3. Start all services
docker-compose up -d

# 4. Run database migrations
npx prisma migrate deploy
npx prisma db seed

# 5. Start dev server
npm run dev
```

---

## Production Deployment (VPS)

```bash
ssh deploy@76.13.179.32
cd /opt/dealzoda
git pull origin main
docker-compose up -d --build
```

---

## Phase Roadmap

| Phase | Timeline | Target |
|-------|----------|--------|
| Phase 0 | Week 1-2 | Telegram channel live. Domains registered. Manual deals. |
| Phase 1 | Month 1-3 | MVP web app. 20 beta users. AI scoring. Alerts. Credits. |
| Phase 2 | Month 4-6 | Affiliate revenue live. Singapore. Cross-border calculator. |
| Phase 3 | Month 7-12 | Freemium subscriptions. Browser extension. Mobile planning. |
| Phase 4 | Year 2 | B2B Merchant Portal. UAE + UK. Mobile app. |

---

*DealZoda — Confidential. March 2026.*
