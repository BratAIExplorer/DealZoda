import type { Metadata } from 'next'
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

// ── Fonts ──────────────────────────────────────────────────────────────────
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

// ── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'DealZoda — Smart deals. Found faster.',
  description:
    'AI-powered cross-border deal intelligence for Malaysia, India, USA & Singapore. Real deal scores. Fake deal detection. Zoda Credits cashback.',
  keywords: [
    'deals Malaysia', 'best price Malaysia', 'AI deals', 'fake discount detector',
    'price tracker', 'cross border shopping', 'deals India', 'Lazada deals',
    'Shopee deals', 'Amazon deals', 'Zoda Credits', 'cashback deals',
  ],
  openGraph: {
    title: 'DealZoda — Smart deals. Found faster.',
    description: 'The AI-powered deal platform that detects fake discounts, tracks prices across 4 markets, and shares cashback as Zoda Credits.',
    type: 'website',
    url: 'https://dealzoda.com',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DealZoda — Smart deals. Found faster.',
    description: 'AI deal intelligence across Malaysia, India, USA & Singapore.',
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  themeColor: '#0F0E2A',
}

// ── Root Layout ────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} dark`}
    >
      <body className="bg-navy-deeper text-slate-200 font-body antialiased">
        {children}
      </body>
    </html>
  )
}
