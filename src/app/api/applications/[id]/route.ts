import { apiError, requireApiSession } from '@/lib/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { getLiveApplications } from '@/data/mockLoans';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiSession(request);
    const { id } = await params;
    const all = getLiveApplications(user.id);
    const found = all.find((app) => app.id.toLowerCase() === id.toLowerCase());

    if (!found) {
      return NextResponse.json(
        { error: `Loan application with ID "${id}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(found);
  } catch (err: unknown) {
    return apiError(err);
  }
}

