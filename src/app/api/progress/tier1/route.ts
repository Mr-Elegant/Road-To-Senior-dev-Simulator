import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Tier1ProgressData, Tier1Attempt } from '@/types/tier1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier1Progress: true },
    });

    const defaultTier1: Tier1ProgressData = {
      attempts: [],
      bookmarkedQuestionIds: [],
      lastActiveDate: '',
      totalScore: 0,
    };

    return NextResponse.json(user?.tier1Progress || defaultTier1);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId = 'default-user', attempt, bookmarkQuestionId } = await request.json();

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: 'Senior Candidate',
        email: 'candidate@interviewlab.dev',
      },
      select: { tier1Progress: true },
    });

    const current: Tier1ProgressData = (user?.tier1Progress as any) || {
      attempts: [],
      bookmarkedQuestionIds: [],
      lastActiveDate: '',
      totalScore: 0,
    };

    if (attempt) {
      const today = new Date().toISOString().split('T')[0];
      const filtered = current.attempts.filter((a) => a.questionId !== attempt.questionId);
      const updatedAttempts = [...filtered, attempt];
      const totalScore = Math.round(
        updatedAttempts.reduce((acc, curr) => acc + curr.evaluation.scoreOutOf100, 0) /
          updatedAttempts.length
      );

      const updatedTier1: Tier1ProgressData = {
        ...current,
        attempts: updatedAttempts,
        lastActiveDate: today,
        totalScore,
      };

      await prisma.user.update({
        where: { id: userId },
        data: {
          tier1Progress: updatedTier1 as any,
          lastActive: new Date(),
        },
      });

      return NextResponse.json(updatedTier1);
    }

    if (bookmarkQuestionId) {
      const isBookmarked = current.bookmarkedQuestionIds.includes(bookmarkQuestionId);
      const updatedBookmarks = isBookmarked
        ? current.bookmarkedQuestionIds.filter((id) => id !== bookmarkQuestionId)
        : [...current.bookmarkedQuestionIds, bookmarkQuestionId];

      const updatedTier1: Tier1ProgressData = {
        ...current,
        bookmarkedQuestionIds: updatedBookmarks,
      };

      await prisma.user.update({
        where: { id: userId },
        data: {
          tier1Progress: updatedTier1 as any,
        },
      });

      return NextResponse.json({ bookmarkedQuestionIds: updatedBookmarks });
    }

    return NextResponse.json(current);
  } catch (err: any) {
    console.error('Error updating Tier1 in PostgreSQL:', err);
    return NextResponse.json({ error: err?.message || 'Database error' }, { status: 500 });
  }
}

