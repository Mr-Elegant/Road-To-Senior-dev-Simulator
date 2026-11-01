import { z } from 'zod';
import type { UserProgressData } from '@/types/userProgress';
import type { Tier1ProgressData } from '@/types/tier1';
import type { SqlTrackProgressData, SqlTierProgress } from '@/types/sqlTrack';

export const progressId = z.string().min(1).max(200).regex(/^[a-zA-Z0-9_.:-]+$/);
const text = z.string().max(100000);
const score = z.number().finite().min(0).max(100);
const count = z.number().int().min(0).max(10000000);
const timestamp = z.iso.datetime({ offset: true }).refine((value) => Date.parse(value) <= Date.now() + 300000, 'Timestamp is in the future.');
const date = z.union([z.literal(''), z.iso.date()]);
const ids = z.array(progressId).max(2000);
const strings = z.array(z.string().max(5000)).max(100);
export const attemptSchema = z.strictObject({
  id: progressId, scenarioId: progressId, timestamp,
  timeSpentSeconds: count, hintsUsedCount: count,
  submittedCode: text.optional(), rootCauseAnalysis: text.optional(), immediateMitigation: text.optional(),
  permanentFix: text.optional(), testingStrategy: text.optional(), monitoringPlan: text.optional(),
  reviewComments: z.array(z.strictObject({ line: count.optional(), comment: text, category: z.string().max(100) })).max(200).optional(),
  systemDesignNotes: z.strictObject({ apiEndpoints: text.optional(), dataSchema: text.optional(), scalingStrategy: text.optional(), tradeoffs: text.optional(), nodesConfig: text.optional(), failureScenarios: text.optional() }).optional(),
  interviewAnswers: z.record(progressId, text).refine((value) => Object.keys(value).length <= 200).optional(),
  rubricScores: z.array(z.strictObject({ criteriaId: progressId, score: z.number().finite().min(0).max(3), notes: text.optional() })).max(100),
  totalScorePercentage: score, passedTestsCount: count, totalTestsCount: count, failedTestCases: strings.optional(), selfAssessmentCompleted: z.boolean(),
});
export const tier1AttemptSchema = z.strictObject({
  id: progressId, questionId: progressId, timestamp, candidateAnswer: text, submittedCode: text.optional(),
  mode: z.enum(['practice', 'mock']), timeSpentSeconds: count,
  evaluation: z.strictObject({
    scoreOutOf100: score, verdict: z.enum(['Mastered', 'Review Needed', 'Needs Practice']),
    conceptualUnderstanding: text, technicalCorrectness: text, clarityOfExplanation: text,
    practicalApplication: text, encouragement: text, matchedConcepts: strings, missingConcepts: strings,
    actionableTips: strings, evaluatorType: z.enum(['gemini', 'rubric-benchmark']),
  }),
});
export const sqlAttemptSchema = z.strictObject({
  id: progressId, questionId: progressId, tier: z.enum(['tier-1', 'tier-2', 'tier-3', 'tier-4']), timestamp,
  mode: z.enum(['practice', 'mock', 'coding', 'incident']), candidateSql: text.optional(), candidateAnswer: text.optional(),
  scoreOutOf100: score, passed: z.boolean(), timeSpentSeconds: count,
  feedback: z.strictObject({ technicalCorrectness: text, relationalSemantics: text.optional(), performanceNotes: text.optional(), strengths: strings, improvements: strings }).optional(),
});
const tier1Schema = z.strictObject({ attempts: z.array(tier1AttemptSchema).max(2000), bookmarkedQuestionIds: ids, lastActiveDate: date, totalScore: score });
const sqlTierSchema = z.strictObject({ attempts: z.array(sqlAttemptSchema).max(2000), completedQuestionIds: ids, bookmarkedQuestionIds: ids, averageScore: score });
const sqlSchema = z.strictObject({ tier1: sqlTierSchema, tier2: sqlTierSchema, tier3: sqlTierSchema, tier4: sqlTierSchema, lastActiveDate: date, totalQuestionsCompleted: count });
export const progressSchema = z.strictObject({
  attempts: z.array(attemptSchema).max(2000), bookmarkedScenarioIds: ids, streakDays: count, lastActiveDate: date,
  customNotes: z.record(progressId, text).refine((value) => Object.keys(value).length <= 2000).optional(),
  tier1Progress: tier1Schema.optional(), sqlProgress: sqlSchema.optional(),
});

export function emptyProgress(): UserProgressData {
  return { attempts: [], bookmarkedScenarioIds: [], streakDays: 0, lastActiveDate: '', customNotes: {} };
}
export function emptySqlProgress(): SqlTrackProgressData {
  const tier = (): SqlTierProgress => ({ attempts: [], completedQuestionIds: [], bookmarkedQuestionIds: [], averageScore: 0 });
  return { tier1: tier(), tier2: tier(), tier3: tier(), tier4: tier(), lastActiveDate: '', totalQuestionsCompleted: 0 };
}
function union(left: string[], right: string[]) { return [...new Set([...left, ...right])]; }
function attempts<T extends { id: string; timestamp: string }>(server: T[], local: T[]): T[] {
  const records = new Map(server.map((item) => [item.id, item]));
  for (const item of local) if (!records.has(item.id)) records.set(item.id, item);
  return [...records.values()].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
function mergeTier1(server: Tier1ProgressData | undefined, local: Tier1ProgressData): Tier1ProgressData {
  const merged = attempts(server?.attempts || [], local.attempts);
  return { attempts: merged, bookmarkedQuestionIds: union(server?.bookmarkedQuestionIds || [], local.bookmarkedQuestionIds), lastActiveDate: [server?.lastActiveDate || '', local.lastActiveDate].sort().at(-1)!, totalScore: merged.length ? Math.round(merged.reduce((sum, item) => sum + item.evaluation.scoreOutOf100, 0) / merged.length) : 0 };
}
function mergeSqlTier(server: SqlTierProgress | undefined, local: SqlTierProgress): SqlTierProgress {
  const merged = attempts(server?.attempts || [], local.attempts);
  return { attempts: merged, bookmarkedQuestionIds: union(server?.bookmarkedQuestionIds || [], local.bookmarkedQuestionIds), completedQuestionIds: union(server?.completedQuestionIds || [], local.completedQuestionIds), averageScore: merged.length ? Math.round(merged.reduce((sum, item) => sum + item.scoreOutOf100, 0) / merged.length) : 0 };
}
export function mergeProgress(server: UserProgressData, local: UserProgressData): UserProgressData {
  const merged: UserProgressData = {
    attempts: attempts(server.attempts, local.attempts),
    bookmarkedScenarioIds: union(server.bookmarkedScenarioIds, local.bookmarkedScenarioIds),
    // Imported streaks are advisory practice data; never replace newer activity.
    lastActiveDate: [server.lastActiveDate, local.lastActiveDate].sort().at(-1)!,
    streakDays: server.lastActiveDate >= local.lastActiveDate ? server.streakDays : local.streakDays,
    customNotes: { ...local.customNotes, ...server.customNotes },
  };
  if (server.tier1Progress || local.tier1Progress) merged.tier1Progress = mergeTier1(server.tier1Progress, local.tier1Progress || { attempts: [], bookmarkedQuestionIds: [], lastActiveDate: '', totalScore: 0 });
  if (server.sqlProgress || local.sqlProgress) {
    const emptyTier = (): SqlTierProgress => ({ attempts: [], completedQuestionIds: [], bookmarkedQuestionIds: [], averageScore: 0 });
    const sql = {} as SqlTrackProgressData;
    for (const key of ['tier1', 'tier2', 'tier3', 'tier4'] as const) sql[key] = mergeSqlTier(server.sqlProgress?.[key], local.sqlProgress?.[key] || emptyTier());
    sql.lastActiveDate = [server.sqlProgress?.lastActiveDate || '', local.sqlProgress?.lastActiveDate || ''].sort().at(-1)!;
    sql.totalQuestionsCompleted = new Set([sql.tier1, sql.tier2, sql.tier3, sql.tier4].flatMap((tier) => tier.completedQuestionIds)).size;
    merged.sqlProgress = sql;
  }
  return merged;
}
