import { NextRequest, NextResponse } from 'next/server';
import { updateLoanStatusInDatabase, getLiveApplications } from '@/data/mockLoans';
import { LoanStatus } from '@/types/loan';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, officerName, note } = body as {
      status: LoanStatus;
      officerName?: string;
      note?: string;
    };

    if (!status || !['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid or missing target loan status.' },
        { status: 400 }
      );
    }

    // Optional simulation headers
    const simulateDelay = parseInt(request.headers.get('x-simulate-delay') || '0', 10);
    if (simulateDelay > 0) {
      await new Promise((r) => setTimeout(r, simulateDelay));
    }

    if (request.headers.get('x-simulate-failure') === 'true' || body.forceFail) {
      return NextResponse.json(
        {
          error:
            'Credit Committee policy exception: Concurrent update detected or underwriting risk threshold exceeded (HTTP 409).',
        },
        { status: 409 }
      );
    }

    const updated = updateLoanStatusInDatabase(
      id,
      status,
      officerName || 'Staff Underwriter',
      note
    );

    if (!updated) {
      return NextResponse.json(
        { error: `Application with ID "${id}" does not exist.` },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update loan application status' },
      { status: 500 }
    );
  }
}

