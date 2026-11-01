import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AccessError, apiError, requireApiSession } from '@/lib/auth/server';
import { attemptSchema, emptyProgress, emptySqlProgress, mergeProgress, progressId, progressSchema, sqlAttemptSchema, tier1AttemptSchema } from './progressMerge';
import type { UserProgressData } from '@/types/userProgress';
import { readBoundedJson } from '@/lib/auth/request';

type Action = 'read' | 'attempt' | 'bookmark' | 'notes' | 'import' | 'reset' | 'reset-tier1' | 'reset-sql' | 'tier1' | 'sql' | 'status';

export async function readProgress(db: Prisma.TransactionClient, userId: string): Promise<UserProgressData> {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId }, include: { attempts: { orderBy: { timestamp: 'desc' } }, bookmarks: true, notes: true } });
  return {
    attempts: user.attempts.map((a) => ({
      id: a.clientAttemptId || a.id, scenarioId: a.scenarioId, timestamp: a.timestamp.toISOString(),
      timeSpentSeconds: a.timeSpentSeconds, hintsUsedCount: a.hintsUsedCount, totalScorePercentage: a.totalScorePercentage,
      passedTestsCount: a.passedTestsCount, totalTestsCount: a.totalTestsCount,
      submittedCode: a.submittedCode ?? undefined, rootCauseAnalysis: a.rootCauseAnalysis ?? undefined,
      immediateMitigation: a.immediateMitigation ?? undefined, permanentFix: a.permanentFix ?? undefined,
      testingStrategy: a.testingStrategy ?? undefined, monitoringPlan: a.monitoringPlan ?? undefined,
      reviewComments: a.reviewComments as unknown as UserProgressData['attempts'][number]['reviewComments'] ?? undefined,
      systemDesignNotes: a.systemDesignNotes as unknown as UserProgressData['attempts'][number]['systemDesignNotes'] ?? undefined,
      interviewAnswers: a.interviewAnswers as unknown as Record<string, string> ?? undefined,
      rubricScores: a.rubricScores as unknown as UserProgressData['attempts'][number]['rubricScores'],
      failedTestCases: a.failedTestCases as unknown as string[] ?? undefined, selfAssessmentCompleted: a.selfAssessmentDone,
    })),
    bookmarkedScenarioIds: user.bookmarks.map((b) => b.scenarioId),
    customNotes: Object.fromEntries(user.notes.map((n) => [n.scenarioId, n.notes])),
    streakDays: user.streakDays, lastActiveDate: user.lastActive?.toISOString().slice(0, 10) || '',
    tier1Progress: user.tier1Progress as unknown as UserProgressData['tier1Progress'] ?? undefined,
    sqlProgress: user.sqlProgress as unknown as UserProgressData['sqlProgress'] ?? undefined,
  };
}

async function persistMerge(db: Prisma.TransactionClient, userId: string, current: UserProgressData, incoming: UserProgressData) {
  const merged = mergeProgress(current, incoming);
  const existing = new Set(current.attempts.map((a) => a.id));
  const additions = merged.attempts.filter((a) => !existing.has(a.id));
  if (additions.length) await db.scenarioAttempt.createMany({
    data: additions.map((a) => ({
      userId, clientAttemptId: a.id, scenarioId: a.scenarioId, timestamp: new Date(a.timestamp),
      timeSpentSeconds: a.timeSpentSeconds, hintsUsedCount: a.hintsUsedCount, totalScorePercentage: a.totalScorePercentage,
      passedTestsCount: a.passedTestsCount, totalTestsCount: a.totalTestsCount, submittedCode: a.submittedCode,
      rootCauseAnalysis: a.rootCauseAnalysis, immediateMitigation: a.immediateMitigation, permanentFix: a.permanentFix,
      testingStrategy: a.testingStrategy, monitoringPlan: a.monitoringPlan,
      reviewComments: a.reviewComments as Prisma.InputJsonValue | undefined,
      systemDesignNotes: a.systemDesignNotes as Prisma.InputJsonValue | undefined,
      interviewAnswers: a.interviewAnswers as Prisma.InputJsonValue | undefined,
      rubricScores: a.rubricScores as unknown as Prisma.InputJsonValue,
      failedTestCases: a.failedTestCases as Prisma.InputJsonValue | undefined, selfAssessmentDone: a.selfAssessmentCompleted,
    })), skipDuplicates: true,
  });
  if (merged.bookmarkedScenarioIds.length) await db.bookmark.createMany({ data: merged.bookmarkedScenarioIds.map((scenarioId) => ({ userId, scenarioId })), skipDuplicates: true });
  for (const [scenarioId, notes] of Object.entries(merged.customNotes || {})) {
    if (!(scenarioId in (current.customNotes || {}))) await db.userNote.upsert({ where: { userId_scenarioId: { userId, scenarioId } }, update: {}, create: { userId, scenarioId, notes } });
  }
  await db.user.update({ where: { id: userId }, data: {
    streakDays: merged.streakDays, lastActive: merged.lastActiveDate ? new Date(merged.lastActiveDate) : undefined,
    tier1Progress: merged.tier1Progress as unknown as Prisma.InputJsonValue | undefined,
    sqlProgress: merged.sqlProgress as unknown as Prisma.InputJsonValue | undefined,
  } });
  return merged;
}

const bookmarkSchema = z.strictObject({ scenarioId: progressId, bookmarked: z.boolean() });
const notesSchema = z.strictObject({ scenarioId: progressId, notes: z.string().max(100000) });
const tier1Body = z.strictObject({ attempt: tier1AttemptSchema.optional(), bookmarkQuestionId: progressId.optional(), bookmarked: z.boolean().optional() });
const sqlBody = z.strictObject({ attempt: sqlAttemptSchema.optional(), bookmarkQuestionId: progressId.optional(), bookmarked: z.boolean().optional(), tier: z.enum(['tier-1', 'tier-2', 'tier-3', 'tier-4']).optional() });

export async function progressRoute(request: Request, action: Action) {
  try {
    const user = await requireApiSession(request);
    if (new URL(request.url).searchParams.has('userId')) throw new AccessError(400, 'User identity is determined by your session.');
    if (request.method === 'GET') {
      const started = Date.now();
      const data = await readProgress(prisma, user.id);
      if (action === 'status') return NextResponse.json({ connected: true, provider: 'PostgreSQL', latencyMs: Date.now() - started, stats: { users: 1, attempts: data.attempts.length } });
      if (action === 'tier1') return NextResponse.json(data.tier1Progress || { attempts: [], bookmarkedQuestionIds: [], lastActiveDate: '', totalScore: 0 });
      if (action === 'sql') return NextResponse.json(data.sqlProgress || emptySqlProgress());
      return NextResponse.json(data);
    }
    const body = action.startsWith('reset') ? null : await readBoundedJson(request, 2 * 1024 * 1024);
    const result = await prisma.$transaction(async (db) => {
      // Serialize merges per account, including JSON progress updates.
      await db.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${user.id} FOR UPDATE`;
      const current = await readProgress(db, user.id);
      if (action === 'reset-tier1' || action === 'reset-sql') {
        await db.user.update({ where: { id: user.id }, data: action === 'reset-tier1' ? { tier1Progress: Prisma.DbNull } : { sqlProgress: Prisma.DbNull } });
        return { success: true };
      }
      if (action === 'reset') {
        await db.scenarioAttempt.deleteMany({ where: { userId: user.id } });
        await db.bookmark.deleteMany({ where: { userId: user.id } });
        await db.userNote.deleteMany({ where: { userId: user.id } });
        await db.user.update({ where: { id: user.id }, data: { streakDays: 0, lastActive: null, tier1Progress: Prisma.DbNull, sqlProgress: Prisma.DbNull } });
        return { success: true };
      }
      if (action === 'import') {
        const { progress } = z.strictObject({ progress: progressSchema }).parse(body);
        await persistMerge(db, user.id, current, progress);
        return { success: true, message: 'Progress merged. Existing account records were preserved.' };
      }
      if (action === 'attempt') {
        const { attempt } = z.strictObject({ attempt: attemptSchema }).parse(body);
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const streak = current.lastActiveDate === today ? Math.max(1, current.streakDays) : current.lastActiveDate === yesterday ? current.streakDays + 1 : 1;
        return persistMerge(db, user.id, current, { ...emptyProgress(), attempts: [attempt], lastActiveDate: today, streakDays: streak });
      }
      if (action === 'bookmark') {
        const { scenarioId, bookmarked } = bookmarkSchema.parse(body);
        if (bookmarked) await db.bookmark.upsert({ where: { userId_scenarioId: { userId: user.id, scenarioId } }, update: {}, create: { userId: user.id, scenarioId } });
        else await db.bookmark.deleteMany({ where: { userId: user.id, scenarioId } });
        return { bookmarkedScenarioIds: (await db.bookmark.findMany({ where: { userId: user.id } })).map((b) => b.scenarioId) };
      }
      if (action === 'notes') {
        const { scenarioId, notes } = notesSchema.parse(body);
        await db.userNote.upsert({ where: { userId_scenarioId: { userId: user.id, scenarioId } }, update: { notes }, create: { userId: user.id, scenarioId, notes } });
        return { success: true };
      }
      if (action === 'tier1') {
        const payload = tier1Body.parse(body);
        if (payload.attempt) {
          const merged = await persistMerge(db, user.id, current, { ...emptyProgress(), tier1Progress: { attempts: [payload.attempt], bookmarkedQuestionIds: [], lastActiveDate: payload.attempt.timestamp.slice(0, 10), totalScore: 0 } });
          return merged.tier1Progress;
        }
        if (!payload.bookmarkQuestionId || payload.bookmarked === undefined) throw new AccessError(422, 'Choose a bookmark or submit an attempt.');
        const progress = current.tier1Progress || { attempts: [], bookmarkedQuestionIds: [], lastActiveDate: '', totalScore: 0 };
        progress.bookmarkedQuestionIds = [...new Set(progress.bookmarkedQuestionIds.filter((id) => id !== payload.bookmarkQuestionId).concat(payload.bookmarked ? [payload.bookmarkQuestionId] : []))];
        await db.user.update({ where: { id: user.id }, data: { tier1Progress: progress as unknown as Prisma.InputJsonValue } });
        return progress;
      }
      const payload = sqlBody.parse(body);
      const incoming = emptySqlProgress();
      if (payload.attempt) {
        const key = payload.attempt.tier.replace('-', '') as 'tier1' | 'tier2' | 'tier3' | 'tier4';
        incoming[key].attempts = [payload.attempt];
        incoming[key].completedQuestionIds = payload.attempt.passed ? [payload.attempt.questionId] : [];
        incoming.lastActiveDate = payload.attempt.timestamp.slice(0, 10);
        return (await persistMerge(db, user.id, current, { ...emptyProgress(), sqlProgress: incoming })).sqlProgress;
      }
      if (!payload.bookmarkQuestionId || payload.bookmarked === undefined || !payload.tier) throw new AccessError(422, 'Choose a bookmark and tier or submit an attempt.');
      const progress = current.sqlProgress || incoming;
      const key = payload.tier.replace('-', '') as 'tier1' | 'tier2' | 'tier3' | 'tier4';
      progress[key].bookmarkedQuestionIds = [...new Set(progress[key].bookmarkedQuestionIds.filter((id) => id !== payload.bookmarkQuestionId).concat(payload.bookmarked ? [payload.bookmarkQuestionId] : []))];
      await db.user.update({ where: { id: user.id }, data: { sqlProgress: progress as unknown as Prisma.InputJsonValue } });
      return progress;
    }, { maxWait: 10000, timeout: 20000 });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid progress data.', details: error.issues.slice(0, 5).map((issue) => ({ path: issue.path, message: issue.message })) }, { status: 422 });
    return apiError(error);
  }
}
