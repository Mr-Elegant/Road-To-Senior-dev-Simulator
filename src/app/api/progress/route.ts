import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: 'Senior Candidate',
        email: 'candidate@interviewlab.dev',
        streakDays: 1,
        lastActive: new Date(),
      },
      include: {
        attempts: {
          orderBy: { timestamp: 'desc' },
        },
        bookmarks: true,
        notes: true,
      },
    });

    const customNotes: Record<string, string> = {};
    user.notes.forEach((n) => {
      customNotes[n.scenarioId] = n.notes;
    });

    return NextResponse.json({
      connected: true,
      attempts: user.attempts.map((a) => ({
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
      bookmarkedScenarioIds: user.bookmarks.map((b) => b.scenarioId),
      streakDays: user.streakDays,
      lastActiveDate: user.lastActive ? user.lastActive.toISOString().split('T')[0] : '',
      customNotes,
      tier1Progress: user.tier1Progress || undefined,
      sqlProgress: user.sqlProgress || undefined,
    });
  } catch (err: any) {
    console.error('Error fetching progress from PostgreSQL:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error', connected: false },
      { status: 500 }
    );
  }
}
