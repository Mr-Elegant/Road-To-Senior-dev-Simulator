import { NextRequest, NextResponse } from 'next/server';
import { computeDashboardStats } from '@/data/mockLoans';

export async function GET(request: NextRequest) {
  try {
    const simulateDelay = parseInt(request.headers.get('x-simulate-delay') || '0', 10);
    if (simulateDelay > 0) {
      await new Promise((r) => setTimeout(r, simulateDelay));
    }

    if (request.headers.get('x-simulate-failure') === 'true') {
      return NextResponse.json(
        { error: 'Simulated failure loading aggregated statistics (HTTP 500).' },
        { status: 500 }
      );
    }

    const stats = computeDashboardStats();
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to compute dashboard statistics' },
      { status: 500 }
    );
  }
}

