import { apiError, requireApiSession } from '@/lib/auth/server';
import { readBoundedJson } from '@/lib/auth/request';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { updateLoanStatusInDatabase, getLiveApplications } from '@/data/mockLoans';
import { LoanStatus } from '@/types/loan';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiSession(request);
    const { id } = await params;
    const parsed = z.object({ status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']), officerName: z.string().max(100).optional(), note: z.string().max(5000).optional(), forceFail: z.boolean().optional() }).safeParse(await readBoundedJson(request, 10000));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid loan status update.' }, { status: 422 });
    const body = parsed.data;

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
    if (simulateDelay > 0 && simulateDelay <= 10000) {
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
      user.name || 'Staff Underwriter',
      note,
      user.id
    );

    if (!updated) {
      return NextResponse.json(
        { error: `Application with ID "${id}" does not exist.` },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    return apiError(err);
  }
}

