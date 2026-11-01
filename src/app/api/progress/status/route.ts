import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const startTime = Date.now();
    const userCount = await prisma.user.count();
    const attemptCount = await prisma.scenarioAttempt.count();
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      connected: true,
      provider: 'PostgreSQL (Neon Cloud)',
      latencyMs,
      stats: {
        users: userCount,
        attempts: attemptCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        connected: false,
        provider: 'PostgreSQL',
        error: err?.message || 'Failed to connect to database',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

