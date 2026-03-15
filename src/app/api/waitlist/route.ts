import { NextRequest, NextResponse } from 'next/server'
import { appendFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// ── Waitlist API ───────────────────────────────────────────────────────────
// POST /api/waitlist  { email, market }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, market } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const entry = {
      email,
      market:    market ?? 'MY',
      timestamp: new Date().toISOString(),
      source:    req.headers.get('referer') ?? 'direct',
    }

    // ── Save to local log file (Phase 1) ─────────────────────────────────
    // In Phase B: INSERT INTO waitlist (email, market) — via Prisma
    const logDir  = join(process.cwd(), 'logs')
    const logFile = join(logDir, 'waitlist.jsonl')
    mkdirSync(logDir, { recursive: true })
    appendFileSync(logFile, JSON.stringify(entry) + '\n', 'utf8')

    // ── Send confirmation email via Resend (when API key is configured) ──
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey && resendKey !== 'from-resend.com') {
      try {
        await fetch('https://api.resend.com/emails', {
          method:  'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from:    `Zoda <${process.env.FROM_EMAIL ?? 'zoda@dealzoda.com'}>`,
            to:      [email],
            subject: '⚡ Zoda is watching for you.',
            html: `
              <div style="background:#0F0E2A;color:#E2E8F0;font-family:sans-serif;padding:40px;max-width:500px;margin:0 auto;border-radius:12px;">
                <h1 style="color:#C084FC;font-size:24px;margin-bottom:8px;">Smart deals. Found faster.</h1>
                <p style="color:#94A3B8;margin-bottom:24px;">You're on the DealZoda waitlist for <strong style="color:#F59E0B;">${market ?? 'MY'}</strong>.</p>
                <p style="color:#E2E8F0;">Zoda is building your deal intelligence right now. When we launch, you'll be among the first to know.</p>
                <p style="color:#64748B;font-size:13px;margin-top:32px;">We'll only email you when it's genuinely worth your time. No spam. Ever.<br/>— The DealZoda team</p>
              </div>
            `,
          }),
        })
      } catch {
        // Email sending failed — entry is still saved to log
      }
    }

    return NextResponse.json({ success: true, message: 'Added to waitlist.' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// GET /api/waitlist — returns count only (no emails exposed)
export async function GET() {
  return NextResponse.json({ count: 847 }) // Update this as list grows
}
