import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    await prisma.$transaction([
      prisma.scenarioAttempt.deleteMany({ where: { userId } }),
      prisma.bookmark.deleteMany({ where: { userId } }),
      prisma.userNote.deleteMany({ where: { userId } }),
      prisma.user.updateMany({
        where: { id: userId },
        data: {
          streakDays: 0,
          tier1Progress: Prisma.DbNull,
          sqlProgress: Prisma.DbNull,
        },
      }),
    ]);

    return NextResponse.json({ success: true, message: 'User progress reset successfully' });
  } catch (err: any) {
    console.error('Error resetting progress in PostgreSQL:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error resetting progress' },
      { status: 500 }
    );
  }
}

