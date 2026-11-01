import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserProgressData } from '@/types/userProgress';

export async function POST(request: Request) {
  try {
    const { userId = 'default-user', progress } = (await request.json()) as {
      userId?: string;
      progress: UserProgressData;
    };

    if (!progress) {
      return NextResponse.json({ error: 'Missing progress payload' }, { status: 400 });
    }

    // Ensure user exists or update their streak
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        streakDays: progress.streakDays || 1,
        lastActive: progress.lastActiveDate ? new Date(progress.lastActiveDate) : new Date(),
        tier1Progress: (progress.tier1Progress as any) || undefined,
        sqlProgress: (progress.sqlProgress as any) || undefined,
      },
      create: {
        id: userId,
        name: 'Senior Candidate',
        email: 'candidate@interviewlab.dev',
        streakDays: progress.streakDays || 1,
        lastActive: progress.lastActiveDate ? new Date(progress.lastActiveDate) : new Date(),
        tier1Progress: (progress.tier1Progress as any) || undefined,
        sqlProgress: (progress.sqlProgress as any) || undefined,
      },
    });

    // Reset previous attempts, bookmarks, notes
    await prisma.$transaction([
      prisma.scenarioAttempt.deleteMany({ where: { userId } }),
      prisma.bookmark.deleteMany({ where: { userId } }),
      prisma.userNote.deleteMany({ where: { userId } }),
    ]);

    // Re-insert attempts
    if (progress.attempts && progress.attempts.length > 0) {
      await prisma.scenarioAttempt.createMany({
        data: progress.attempts.map((a) => ({
          id: a.id || undefined,
          userId,
          scenarioId: a.scenarioId,
          timestamp: a.timestamp ? new Date(a.timestamp) : new Date(),
          timeSpentSeconds: a.timeSpentSeconds || 0,
          hintsUsedCount: a.hintsUsedCount || 0,
          totalScorePercentage: a.totalScorePercentage || 0,
          passedTestsCount: a.passedTestsCount || 0,
          totalTestsCount: a.totalTestsCount || 0,
          submittedCode: a.submittedCode,
          rootCauseAnalysis: a.rootCauseAnalysis,
          immediateMitigation: a.immediateMitigation,
          permanentFix: a.permanentFix,
          testingStrategy: a.testingStrategy,
          monitoringPlan: a.monitoringPlan,
          systemDesignNotes: a.systemDesignNotes as any,
          interviewAnswers: a.interviewAnswers as any,
          rubricScores: (a.rubricScores || []) as any,
          failedTestCases: (a.failedTestCases || []) as any,
          selfAssessmentDone: a.selfAssessmentCompleted || false,
        })),
      });
    }

    // Re-insert bookmarks
    if (progress.bookmarkedScenarioIds && progress.bookmarkedScenarioIds.length > 0) {
      await prisma.bookmark.createMany({
        data: progress.bookmarkedScenarioIds.map((scenarioId) => ({
          userId,
          scenarioId,
        })),
        skipDuplicates: true,
      });
    }

    // Re-insert custom notes
    if (progress.customNotes) {
      const noteEntries = Object.entries(progress.customNotes);
      for (const [scenarioId, notes] of noteEntries) {
        if (notes && notes.trim()) {
          await prisma.userNote.create({
            data: {
              userId,
              scenarioId,
              notes,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Progress imported into PostgreSQL' });
  } catch (err: any) {
    console.error('Error importing progress to PostgreSQL:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error importing progress' },
      { status: 500 }
    );
  }
}

