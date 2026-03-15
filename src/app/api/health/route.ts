import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status:  'ok',
    version: '1.0.0',
    phase:   'Phase 1 — Beta',
    ts:      new Date().toISOString(),
  })
}
