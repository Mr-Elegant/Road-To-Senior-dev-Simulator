import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId = 'default-user', scenarioId } = await request.json();

    if (!scenarioId) {
      return NextResponse.json({ error: 'Missing scenarioId' }, { status: 400 });
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: 'Senior Candidate',
        email: 'candidate@interviewlab.dev',
      },
    });

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_scenarioId: {
          userId,
          scenarioId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          scenarioId,
        },
      });
    }

    const updatedBookmarks = await prisma.bookmark.findMany({
      where: { userId },
      select: { scenarioId: true },
    });

    return NextResponse.json({
      bookmarkedScenarioIds: updatedBookmarks.map((b) => b.scenarioId),
    });
  } catch (err: any) {
    console.error('Error toggling bookmark in PostgreSQL:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error toggling bookmark' },
      { status: 500 }
    );
  }
}

