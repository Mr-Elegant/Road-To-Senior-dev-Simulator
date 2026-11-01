import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SqlTrackProgressData, SqlAttempt, SqlTierLevel } from '@/types/sqlTrack';

const DEFAULT_TIER_PROGRESS = {
  attempts: [],
  completedQuestionIds: [],
  bookmarkedQuestionIds: [],
  averageScore: 0,
};

const DEFAULT_SQL_PROGRESS: SqlTrackProgressData = {
  tier1: { ...DEFAULT_TIER_PROGRESS },
  tier2: { ...DEFAULT_TIER_PROGRESS },
  tier3: { ...DEFAULT_TIER_PROGRESS },
  tier4: { ...DEFAULT_TIER_PROGRESS },
  lastActiveDate: '',
  totalQuestionsCompleted: 0,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { sqlProgress: true },
    });

    return NextResponse.json(user?.sqlProgress || DEFAULT_SQL_PROGRESS);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId = 'default-user', attempt, bookmarkQuestionId, tier = 'tier-1', sqlProgress } = await request.json();

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: 'Senior Candidate',
        email: 'candidate@interviewlab.dev',
      },
      select: { sqlProgress: true },
    });

    // If full sqlProgress payload is provided directly
    if (sqlProgress) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          sqlProgress: sqlProgress as any,
          lastActive: new Date(),
        },
      });
      return NextResponse.json(sqlProgress);
    }

    const current: SqlTrackProgressData = (user?.sqlProgress as any) || { ...DEFAULT_SQL_PROGRESS };

    if (attempt) {
      const today = new Date().toISOString().split('T')[0];
      const tierKey = (attempt.tier?.replace('-', '') || 'tier1') as 'tier1' | 'tier2' | 'tier3' | 'tier4';
      const tierProgress = current[tierKey] || { ...DEFAULT_TIER_PROGRESS };

      const filtered = tierProgress.attempts.filter((a) => a.id !== attempt.id);
      const updatedAttempts = [attempt, ...filtered];

      const completedSet = new Set(tierProgress.completedQuestionIds);
      if (attempt.passed) {
        completedSet.add(attempt.questionId);
      }
      const updatedCompletedIds = Array.from(completedSet);

      const avgScore = updatedAttempts.length > 0
        ? Math.round(updatedAttempts.reduce((acc, curr) => acc + curr.scoreOutOf100, 0) / updatedAttempts.length)
        : 0;

      const updatedTierProgress = {
        ...tierProgress,
        attempts: updatedAttempts,
        completedQuestionIds: updatedCompletedIds,
        averageScore: avgScore,
      };

      const allCompleted = new Set([
        ...(tierKey === 'tier1' ? updatedCompletedIds : (current.tier1?.completedQuestionIds || [])),
        ...(tierKey === 'tier2' ? updatedCompletedIds : (current.tier2?.completedQuestionIds || [])),
        ...(tierKey === 'tier3' ? updatedCompletedIds : (current.tier3?.completedQuestionIds || [])),
        ...(tierKey === 'tier4' ? updatedCompletedIds : (current.tier4?.completedQuestionIds || [])),
      ]);

      const updatedSql: SqlTrackProgressData = {
        ...current,
        [tierKey]: updatedTierProgress,
        lastActiveDate: today,
        totalQuestionsCompleted: allCompleted.size,
      };

      await prisma.user.update({
        where: { id: userId },
        data: {
          sqlProgress: updatedSql as any,
          lastActive: new Date(),
        },
      });

      return NextResponse.json(updatedSql);
    }

    if (bookmarkQuestionId) {
      const tierKey = ((tier as string).replace('-', '') || 'tier1') as 'tier1' | 'tier2' | 'tier3' | 'tier4';
      const tierProgress = current[tierKey] || { ...DEFAULT_TIER_PROGRESS };

      const isBookmarked = tierProgress.bookmarkedQuestionIds.includes(bookmarkQuestionId);
      const updatedBookmarks = isBookmarked
        ? tierProgress.bookmarkedQuestionIds.filter((id) => id !== bookmarkQuestionId)
        : [...tierProgress.bookmarkedQuestionIds, bookmarkQuestionId];

      const updatedSql: SqlTrackProgressData = {
        ...current,
        [tierKey]: {
          ...tierProgress,
          bookmarkedQuestionIds: updatedBookmarks,
        },
      };

      await prisma.user.update({
        where: { id: userId },
        data: {
          sqlProgress: updatedSql as any,
        },
      });

      return NextResponse.json({ bookmarkedQuestionIds: updatedBookmarks });
    }

    return NextResponse.json(current);
  } catch (err: any) {
    console.error('Error updating SQL progress in PostgreSQL:', err);
    return NextResponse.json({ error: err?.message || 'Database error' }, { status: 500 });
  }
}

