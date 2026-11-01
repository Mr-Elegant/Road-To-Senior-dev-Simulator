import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId = 'default-user', scenarioId, notes } = await request.json();

    if (!scenarioId) {
      return NextResponse.json({ error: 'Missing scenarioId' }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: 'Senior Candidate',
        email: 'candidate@interviewlab.dev',
      },
    });

    await prisma.userNote.upsert({
      where: {
        userId_scenarioId: {
          userId,
          scenarioId,
        },
      },
      update: {
        notes: notes || '',
      },
      create: {
        userId,
        scenarioId,
        notes: notes || '',
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error saving notes in PostgreSQL:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error saving notes' },
      { status: 500 }
    );
  }
}

