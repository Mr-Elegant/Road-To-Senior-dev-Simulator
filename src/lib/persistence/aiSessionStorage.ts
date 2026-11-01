import { AiInterviewSession } from '@/types/aiInterview';
import { storage } from './localStorageAdapter';
import { AttemptSubmission } from '@/types/userProgress';

const AI_SESSION_STORAGE_KEY = 'fullstack_ai_interview_session_v1';

export function getStoredAiSession(): AiInterviewSession | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storage.scopedKey(AI_SESSION_STORAGE_KEY));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AiInterviewSession;
    if (!parsed || !parsed.id || !parsed.config) return null;
    return parsed;
  } catch (e) {
    console.error('Failed to parse stored AI session:', e);
    return null;
  }
}

export function storeAiSession(session: AiInterviewSession): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    window.localStorage.setItem(storage.scopedKey(AI_SESSION_STORAGE_KEY), JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save AI session to localStorage:', e);
  }
}

export function clearStoredAiSession(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    window.localStorage.removeItem(storage.scopedKey(AI_SESSION_STORAGE_KEY));
  } catch (e) {
    console.error('Failed to clear stored AI session:', e);
  }
}

/**
 * Optionally archives a completed AI interview session into the main user progress attempts list
 * so it appears in recent attempts and topic mastery without disrupting existing schemas.
 */
export async function archiveAiSessionToProgress(session: AiInterviewSession): Promise<void> {
  if (!session.finalAssessment) return;

  const candidateTurns = session.history.filter((h) => h.role === 'candidate');
  const combinedAnswers = candidateTurns.map((t, idx) => `[Turn ${idx + 1}]:\n${t.content}`).join('\n\n---\n\n');

  const attempt: AttemptSubmission = {
    id: `ai-att-${Date.now()}`,
    scenarioId: `ai-${session.config.role.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    timestamp: new Date().toISOString(),
    timeSpentSeconds: session.config.durationMinutes * 60,
    hintsUsedCount: session.history.filter((h) => h.role === 'hint').length,
    submittedCode: combinedAnswers,
    rootCauseAnalysis: session.finalAssessment.executiveSummary,
    immediateMitigation: session.finalAssessment.topStrengths.join('; '),
    permanentFix: session.finalAssessment.criticalWeaknesses.join('; '),
    testingStrategy: session.finalAssessment.actionableRoadmap.join('; '),
    rubricScores: [
      { criteriaId: 'ai-overall', score: Math.round((session.finalAssessment.overallScore / 100) * 3) },
    ],
    totalScorePercentage: session.finalAssessment.overallScore,
    passedTestsCount: session.finalAssessment.overallScore >= 70 ? 1 : 0,
    totalTestsCount: 1,
    selfAssessmentCompleted: true,
  };

  try {
    await storage.saveAttempt(attempt);
  } catch (e) {
    console.warn('Could not archive AI session to main progress list:', e);
  }
}

