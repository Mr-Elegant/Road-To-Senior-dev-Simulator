import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AttemptSubmission } from '@/types/userProgress';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'default-user', attempt } = body as {
      userId?: string;
      attempt: AttemptSubmission;
    };

    if (!attempt || !attempt.scenarioId) {
      return NextResponse.json({ error: 'Invalid attempt payload' }, { status: 400 });
    }

    // Ensure user exists and calculate streak
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    let newStreak = 1;
    if (existingUser?.lastActive) {
      const lastActiveStr = existingUser.lastActive.toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (lastActiveStr === todayStr) {
        newStreak = Math.max(1, existingUser.streakDays);
      } else if (lastActiveStr === yesterday) {
        newStreak = existingUser.streakDays + 1;
      }
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        lastActive: today,
        streakDays: newStreak,
      },
      create: {
        id: userId,
        name: 'Senior Candidate',
        email: 'candidate@interviewlab.dev',
        streakDays: 1,
        lastActive: today,
      },
    });

    // Save attempt
    await prisma.scenarioAttempt.create({
      data: {
        id: attempt.id || undefined,
        userId,
        scenarioId: attempt.scenarioId,
        timestamp: attempt.timestamp ? new Date(attempt.timestamp) : today,
        timeSpentSeconds: attempt.timeSpentSeconds || 0,
        hintsUsedCount: attempt.hintsUsedCount || 0,
        totalScorePercentage: attempt.totalScorePercentage || 0,
        passedTestsCount: attempt.passedTestsCount || 0,
        totalTestsCount: attempt.totalTestsCount || 0,
        submittedCode: attempt.submittedCode,
        rootCauseAnalysis: attempt.rootCauseAnalysis,
        immediateMitigation: attempt.immediateMitigation,
        permanentFix: attempt.permanentFix,
        testingStrategy: attempt.testingStrategy,
        monitoringPlan: attempt.monitoringPlan,
        systemDesignNotes: attempt.systemDesignNotes as any,
        interviewAnswers: attempt.interviewAnswers as any,
        rubricScores: (attempt.rubricScores || []) as any,
        failedTestCases: (attempt.failedTestCases || []) as any,
        selfAssessmentDone: attempt.selfAssessmentCompleted || false,
      },
    });

    // Return refreshed progress
    const refreshedUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        attempts: { orderBy: { timestamp: 'desc' } },
        bookmarks: true,
        notes: true,
      },
    });

    const notesMap: Record<string, string> = {};
    refreshedUser.notes.forEach((n) => {
      notesMap[n.scenarioId] = n.notes;
    });

    return NextResponse.json({
      attempts: refreshedUser.attempts.map((a) => ({
        id: a.id,
        scenarioId: a.scenarioId,
        timestamp: a.timestamp.toISOString(),
        timeSpentSeconds: a.timeSpentSeconds,
        hintsUsedCount: a.hintsUsedCount,
        totalScorePercentage: a.totalScorePercentage,
        passedTestsCount: a.passedTestsCount,
        totalTestsCount: a.totalTestsCount,
        submittedCode: a.submittedCode || undefined,
        rootCauseAnalysis: a.rootCauseAnalysis || undefined,
        immediateMitigation: a.immediateMitigation || undefined,
        permanentFix: a.permanentFix || undefined,
        testingStrategy: a.testingStrategy || undefined,
        monitoringPlan: a.monitoringPlan || undefined,
        systemDesignNotes: (a.systemDesignNotes as any) || undefined,
        interviewAnswers: (a.interviewAnswers as any) || undefined,
        rubricScores: (a.rubricScores as any) || [],
        failedTestCases: (a.failedTestCases as any) || undefined,
        selfAssessmentCompleted: a.selfAssessmentDone,
      })),
      bookmarkedScenarioIds: refreshedUser.bookmarks.map((b) => b.scenarioId),
      streakDays: refreshedUser.streakDays,
      lastActiveDate: todayStr,
      customNotes: notesMap,
      tier1Progress: refreshedUser.tier1Progress || undefined,
    });
  } catch (err: any) {
    console.error('Error recording attempt in PostgreSQL:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error persisting attempt' },
      { status: 500 }
    );
  }
}

