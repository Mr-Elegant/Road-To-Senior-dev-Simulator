import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractJson, GeminiInterviewService } from '@/lib/gemini/service';
import {
  buildQuestionPrompt,
  buildEvaluationAndFollowUpPrompt,
  buildHintPrompt,
  buildFinalAssessmentPrompt,
} from '@/lib/gemini/prompts';
import {
  getOfflineQuestion,
  getOfflineEvaluation,
  getOfflineHint,
  getOfflineFinalAssessment,
} from '@/lib/gemini/offlineFallback';
import { GET, POST } from '@/app/api/ai-interview/route';
import { AiInterviewConfig } from '@/types/aiInterview';
import { requireApiSession } from '@/lib/auth/server';

vi.mock('@/lib/auth/server', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/auth/server')>(),
  requireApiSession: vi.fn().mockResolvedValue({ id: 'unit-user', name: 'Unit Candidate' }),
}));
vi.mock('@/lib/auth/aiQuota', () => ({ consumeAiQuota: vi.fn().mockResolvedValue(undefined) }));

describe('Gemini AI Interviewer Engine & API Verification', () => {
  const sampleConfig: AiInterviewConfig = {
    role: 'Senior Full-Stack Engineer',
    technology: 'Full-Stack (Next.js, TypeScript, PostgreSQL)',
    difficulty: 'Senior',
    durationMinutes: 30,
  };

  describe('Prompt Builders & Safety Constraints', () => {
    it('constructs rigorous question synthesis prompts containing business constraints', () => {
      const prompt = buildQuestionPrompt(sampleConfig);
      expect(prompt).toContain('Senior Full-Stack Engineer');
      expect(prompt).toContain('Full-Stack (Next.js, TypeScript, PostgreSQL)');
      expect(prompt).toContain('30 minutes');
      expect(prompt).toContain('real-world enterprise business scenario');
    });

    it('builds contextual evaluation prompts enforcing JSON format', () => {
      const prompt = buildEvaluationAndFollowUpPrompt(
        sampleConfig,
        'How do you prevent cache stampedes in Next.js?',
        [{ role: 'interviewer', content: 'Initial prompt' }],
        'I would use a distributed Redis mutex lock with stale-while-revalidate.',
        1,
        3
      );
      expect(prompt).toContain('CANDIDATE\'S LATEST ANSWER');
      expect(prompt).toContain('technicalCorrectness');
      expect(prompt).toContain('followUpQuestion');
      expect(prompt).toContain('scoreOutOf10');
    });

    it('builds hint prompt strictly prohibiting answer disclosure', () => {
      const prompt = buildHintPrompt('How to handle deadlocks?', []);
      expect(prompt).toContain('Do NOT give away the answer');
      expect(prompt).toContain('progressive guidance hint');
    });

    it('builds final assessment prompt specifying Hiring Committee scorecard schema', () => {
      const prompt = buildFinalAssessmentPrompt(sampleConfig, [
        { role: 'interviewer', content: 'Q1' },
        { role: 'candidate', content: 'A1' },
      ]);
      expect(prompt).toContain('Hiring Committee Bar Raiser');
      expect(prompt).toContain('hiringVerdict');
      expect(prompt).toContain('competencyBreakdown');
      expect(prompt).toContain('actionableRoadmap');
    });
  });

  describe('Robust JSON Extraction Utility', () => {
    it('extracts pure JSON objects', () => {
      const raw = '{"key": "value", "count": 42}';
      const parsed = extractJson<{ key: string; count: number }>(raw);
      expect(parsed).toEqual({ key: 'value', count: 42 });
    });

    it('strips markdown code fences (```json ... ```)', () => {
      const raw = '```json\n{\n  "status": "success",\n  "score": 10\n}\n```';
      const parsed = extractJson<{ status: string; score: number }>(raw);
      expect(parsed).toEqual({ status: 'success', score: 10 });
    });

    it('recovers JSON embedded in conversational prose', () => {
      const raw = 'Here is the requested evaluation:\n{"verdict": "Hire"}\nHope this helps!';
      const parsed = extractJson<{ verdict: string }>(raw);
      expect(parsed).toEqual({ verdict: 'Hire' });
    });

    it('returns null on malformed non-JSON inputs without crashing', () => {
      const raw = 'Not valid JSON at all';
      const parsed = extractJson(raw);
      expect(parsed).toBeNull();
    });
  });

  describe('Offline Fallback & Simulation Guarantee', () => {
    it('produces relevant questions when offline or API key is not configured', () => {
      const question = getOfflineQuestion(sampleConfig);
      expect(question.length).toBeGreaterThan(100);
      expect(question).toContain('Next.js');
    });

    it('evaluates answers and generates adaptive follow-up rounds', () => {
      const comprehensiveAnswer =
        'We implemented the transactional outbox pattern in PostgreSQL combined with Debezium CDC and Apache Kafka to guarantee idempotency. This ensures order records and outbox events commit atomically in the same local ACID transaction, avoiding dual-write failures while distributed Redis locks prevent concurrent webhook race conditions.';

      const result = getOfflineEvaluation(
        'Initial question',
        comprehensiveAnswer,
        1,
        3
      );
      expect(result.turnFeedback.technicalCorrectness).toBe('Exemplary');
      expect(result.turnFeedback.scoreOutOf10).toBeGreaterThanOrEqual(8);
      expect(result.nextQuestion).toContain('partition');
    });

    it('generates complete final scorecard with competency metrics', () => {
      const assessment = getOfflineFinalAssessment(sampleConfig, [
        { role: 'interviewer', content: 'Q1' },
        { role: 'candidate', content: 'Comprehensive architectural answer covering outbox pattern and Redis locking.' },
      ]);
      expect(assessment.overallScore).toBeGreaterThanOrEqual(70);
      expect(['Strong Hire', 'Hire', 'Leaning Hire']).toContain(assessment.hiringVerdict);
      expect(assessment.topStrengths.length).toBeGreaterThan(0);
      expect(assessment.competencyBreakdown.systemArchitecture.score).toBeGreaterThan(0);
    });
  });

  describe('Server Route Handler: /api/ai-interview', () => {
    it('rejects unauthenticated interview API calls', async () => {
      const { AccessError } = await import('@/lib/auth/server');
      vi.mocked(requireApiSession).mockRejectedValueOnce(new AccessError(401, 'Sign in to continue.'));
      const response = await POST(new Request('http://localhost/api/ai-interview', { method: 'POST', body: JSON.stringify({ action: 'start' }) }));
      expect(response.status).toBe(401);
    });
    it('GET endpoint returns configuration status without leaking keys', async () => {
      const response = await GET();
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBe('ok');
      expect(typeof data.isGeminiConfigured).toBe('boolean');
      expect(typeof data.model).toBe('string');
      // Guarantee key is never present in response
      expect(data.apiKey).toBeUndefined();
      expect(data.GEMINI_API_KEY).toBeUndefined();
    });

    it('POST rejects invalid or missing actions with 400 status', async () => {
      const req = new Request('http://localhost:3000/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invalid_action' }),
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Invalid 'action'");
    });

    it('POST rejects excessively large candidate answers (>10,000 characters) to prevent token abuse', async () => {
      const massiveAnswer = 'A'.repeat(10001);
      const req = new Request('http://localhost:3000/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          candidateAnswer: massiveAnswer,
          sessionState: { currentQuestion: 'Test Q' },
        }),
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('10,000 characters');
    });

    it('POST successfully starts an interview session and returns an initial question', async () => {
      const req = new Request('http://localhost:3000/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          config: sampleConfig,
        }),
      });

      const response = await POST(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.question).toBeTruthy();
    });

    it('POST provides progressive hints without spoiling answers', async () => {
      const req = new Request('http://localhost:3000/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'hint',
          sessionState: {
            currentQuestion: 'How to decouple monolith database without downtime?',
            history: [],
          },
        }),
      });

      const response = await POST(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.hint).toBeTruthy();
    });
  });
});
