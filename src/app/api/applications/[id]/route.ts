import { NextRequest, NextResponse } from 'next/server';
import { getLiveApplications } from '@/data/mockLoans';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const all = getLiveApplications();
    const found = all.find((app) => app.id.toLowerCase() === id.toLowerCase());

    if (!found) {
      return NextResponse.json(
        { error: `Loan application with ID "${id}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(found);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error retrieving application' },
      { status: 500 }
    );
  }
}

