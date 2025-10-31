import { NextResponse } from 'next/server';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'NextMed API is running',
    timestamp: new Date().toISOString(),
  });
}