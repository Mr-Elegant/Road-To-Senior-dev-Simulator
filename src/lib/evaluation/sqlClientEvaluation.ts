import type { SqlQuestion } from '@/types/sqlTrack';
import { getOfflineSqlEvaluation } from '@/lib/gemini/sqlPrompts';
import { storage } from '@/lib/persistence/localStorageAdapter';

// Anonymous SQL practice keeps its existing rubric engine; cloud AI requires a session.
export async function requestSqlEvaluation(question: SqlQuestion, input: { candidateAnswer?: string; candidateSql?: string; candidateAnalysis?: string; isIncident?: boolean }) {
  if (storage.getAccountId()) {
    const response = await fetch('/api/sql/evaluate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId: question.id, ...input }) });
    if (response.ok) return response.json();
    if (response.status !== 401) throw new Error('Evaluation is unavailable. Please try again.');
  }
  const feedback = getOfflineSqlEvaluation(question, input.candidateAnswer || input.candidateAnalysis || '', input.candidateSql);
  return { isGeminiLive: false, modelUsed: 'offline-sql-evaluator', scoreOutOf100: feedback.scoreOutOf100, passed: feedback.passed, feedback: {
    ...feedback, rootCauseAccuracy: feedback.technicalCorrectness, mitigationEvaluation: 'Offline rubric benchmark. Sign in for live AI feedback.', missingSafeguards: feedback.gapsOrMisconceptions,
  } };
}
