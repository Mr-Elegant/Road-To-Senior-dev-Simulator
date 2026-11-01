import { apiError, requireApiSession } from '@/lib/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { computeDashboardStats } from '@/data/mockLoans';

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiSession(request);
    const simulateDelay = parseInt(request.headers.get('x-simulate-delay') || '0', 10);
    if (simulateDelay > 0 && simulateDelay <= 10000) {
      await new Promise((r) => setTimeout(r, simulateDelay));
    }

    if (request.headers.get('x-simulate-failure') === 'true') {
      return NextResponse.json(
        { error: 'Simulated failure loading aggregated statistics (HTTP 500).' },
        { status: 500 }
      );
    }

    const stats = computeDashboardStats(user.id);
    return NextResponse.json(stats);
  } catch (err: unknown) {
    return apiError(err);
  }
}

