import { NextRequest, NextResponse } from 'next/server';
import { queryApplications } from '@/data/mockLoans';
import { LoanStatus, LoanType, RiskRating, SortField, SortOrder } from '@/types/loan';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const search = searchParams.get('search') || '';
    const status = (searchParams.get('status') || 'ALL') as LoanStatus | 'ALL';
    const loanType = (searchParams.get('loanType') || 'ALL') as LoanType | 'ALL';
    const riskRating = (searchParams.get('riskRating') || 'ALL') as RiskRating | 'ALL';
    const sortBy = (searchParams.get('sortBy') || 'applicationDate') as SortField;
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as SortOrder;

    // Optional simulation headers
    const simulateDelay = parseInt(request.headers.get('x-simulate-delay') || '0', 10);
    if (simulateDelay > 0) {
      await new Promise((r) => setTimeout(r, simulateDelay));
    }

    if (request.headers.get('x-simulate-failure') === 'true') {
      return NextResponse.json(
        { error: 'Simulated downstream upstream gateway timeout (HTTP 504).' },
        { status: 504 }
      );
    }

    const result = queryApplications(
      { search, status, loanType, riskRating },
      { field: sortBy, order: sortOrder },
      page,
      limit
    );

    return NextResponse.json({
      ...result,
      page,
      limit,
      requestId: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error while fetching loan applications' },
      { status: 500 }
    );
  }
}

