import { GoogleGenAI } from '@google/genai';
import {
  AiInterviewConfig,
  TurnFeedback,
  AiInterviewAssessment,
  AiInterviewResponse,
} from '@/types/aiInterview';
import {
  SYSTEM_INSTRUCTION_INTERVIEWER,
  buildQuestionPrompt,
  buildEvaluationAndFollowUpPrompt,
  buildHintPrompt,
  buildFinalAssessmentPrompt,
} from './prompts';
import {
  getOfflineQuestion,
  getOfflineEvaluation,
  getOfflineHint,
  getOfflineFinalAssessment,
} from './offlineFallback';
import { SqlQuestion } from '@/types/sqlTrack';
import {
  SYSTEM_INSTRUCTION_SQL_INTERVIEWER,
  buildSqlEvaluationPrompt,
  buildSqlIncidentDiagnosisPrompt,
  getOfflineSqlEvaluation,
} from './sqlPrompts';

// In-memory rate-limiter: Max 30 requests per minute globally per server process
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
let requestTimestamps: number[] = [];

function checkRateLimit(): boolean {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  requestTimestamps.push(now);
  return true;
}

export function extractJson<T>(rawText: string): T | null {
  try {
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(rawText.substring(start, end + 1)) as T;
      } catch {}
    }
    return null;
  }
}

export class GeminiInterviewService {
  private apiKey: string | null;
  private modelName: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    // Default to verified free-tier supported model: gemini-2.0-flash
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public getModelName(): string {
    return this.modelName;
  }

  private getClient(): GoogleGenAI {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in server environment.');
    }
    return new GoogleGenAI({ apiKey: this.apiKey });
  }

  /**
   * Helper to execute Gemini generation with strict 35-second timeout
   */
  private async executeGeminiCall(prompt: string, maxTokens: number = 3000): Promise<string> {
    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded: Please wait a moment before sending another request.');
    }

    const client = this.getClient();

    const generatePromise = client.models.generateContent({
      model: this.modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_INTERVIEWER,
        maxOutputTokens: maxTokens,
        temperature: 0.7,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API request timed out (35-second limit exceeded).')), 35000);
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const text = response.text;
    if (!text) {
      throw new Error('Received empty response from Gemini model.');
    }
    return text;
  }

  /**
   * Generate an original interview question
   */
  public async generateQuestion(config: AiInterviewConfig): Promise<AiInterviewResponse> {
    if (!this.isConfigured()) {
      return {
        success: true,
        isGeminiLive: false,
        modelUsed: 'offline-simulator',
        question: getOfflineQuestion(config),
      };
    }

    try {
      const prompt = buildQuestionPrompt(config);
      const questionText = await this.executeGeminiCall(prompt, 3500);

      return {
        success: true,
        isGeminiLive: true,
        modelUsed: this.modelName,
        question: questionText.trim(),
      };
    } catch (err: any) {
      const isQuota = String(err?.message || '').toLowerCase().includes('resourceexhausted') ||
        String(err?.message || '').toLowerCase().includes('quota') ||
        String(err?.status || '') === '429';

      console.warn('Gemini generateQuestion error, activating fallback:', err?.message || err);

      return {
        success: true,
        isGeminiLive: false,
        modelUsed: 'offline-fallback',
        question: getOfflineQuestion(config),
        error: isQuota
          ? 'Gemini API free tier rate limit or quota reached. Reverting to built-in simulation engine.'
          : err?.message || 'Error communicating with Gemini API.',
        isQuotaExhausted: isQuota,
      };
    }
  }

  /**
   * Evaluate candidate answer and produce contextual follow-up question
   */
  public async evaluateAndFollowUp(
    config: AiInterviewConfig,
    currentQuestion: string,
    history: { role: 'interviewer' | 'candidate' | 'hint'; content: string }[],
    candidateAnswer: string,
    currentTurn: number,
    maxTurns: number
  ): Promise<AiInterviewResponse> {
    if (!this.isConfigured()) {
      const offline = getOfflineEvaluation(currentQuestion, candidateAnswer, currentTurn, maxTurns);
      return {
        success: true,
        isGeminiLive: false,
        modelUsed: 'offline-simulator',
        turnFeedback: offline.turnFeedback,
        question: offline.nextQuestion,
        isCompleted: currentTurn >= maxTurns,
      };
    }

    try {
      const prompt = buildEvaluationAndFollowUpPrompt(
        config,
        currentQuestion,
        history,
        candidateAnswer,
        currentTurn,
        maxTurns
      );

      const responseText = await this.executeGeminiCall(prompt, 3500);
      const parsed = extractJson<{
        technicalCorrectness: TurnFeedback['technicalCorrectness'];
        strengths: string[];
        gapsOrMisconceptions: string[];
        scoreOutOf10: number;
        followUpQuestion: string;
      }>(responseText);

      if (!parsed || !parsed.followUpQuestion) {
        throw new Error('Failed to parse structured evaluation JSON from Gemini.');
      }

      return {
        success: true,
        isGeminiLive: true,
        modelUsed: this.modelName,
        turnFeedback: {
          technicalCorrectness: parsed.technicalCorrectness || 'Competent',
          strengths: parsed.strengths || ['Articulated initial solution components.'],
          gapsOrMisconceptions: parsed.gapsOrMisconceptions || ['Consider expanding on failure modes.'],
          scoreOutOf10: Math.min(10, Math.max(1, Number(parsed.scoreOutOf10) || 7)),
        },
        question: parsed.followUpQuestion,
        isCompleted: currentTurn >= maxTurns,
      };
    } catch (err: any) {
      const isQuota = String(err?.message || '').toLowerCase().includes('quota') ||
        String(err?.message || '').toLowerCase().includes('resourceexhausted') ||
        String(err?.status || '') === '429';

      console.warn('Gemini evaluateAndFollowUp error, activating fallback:', err?.message || err);
      const offline = getOfflineEvaluation(currentQuestion, candidateAnswer, currentTurn, maxTurns);

      return {
        success: true,
        isGeminiLive: false,
        modelUsed: 'offline-fallback',
        turnFeedback: offline.turnFeedback,
        question: offline.nextQuestion,
        isCompleted: currentTurn >= maxTurns,
        error: isQuota
          ? 'Gemini API quota exhausted. Using offline evaluative reasoning.'
          : err?.message || 'Error processing response with Gemini API.',
        isQuotaExhausted: isQuota,
      };
    }
  }

  /**
   * Request a hint without revealing reference solution
   */
  public async getHint(
    currentQuestion: string,
    history: { role: 'interviewer' | 'candidate' | 'hint'; content: string }[]
  ): Promise<AiInterviewResponse> {
    if (!this.isConfigured()) {
      return {
        success: true,
        isGeminiLive: false,
        modelUsed: 'offline-simulator',
        hint: getOfflineHint(currentQuestion),
      };
    }

    try {
      const prompt = buildHintPrompt(currentQuestion, history);
      const hintText = await this.executeGeminiCall(prompt, 1500);

      return {
        success: true,
        isGeminiLive: true,
        modelUsed: this.modelName,
        hint: hintText.trim(),
      };
    } catch (err: any) {
      return {
        success: true,
        isGeminiLive: false,
        modelUsed: 'offline-fallback',
        hint: getOfflineHint(currentQuestion),
        error: err?.message || 'Failed to fetch dynamic hint.',
      };
    }
  }

  /**
   * Generate final comprehensive assessment scorecard
   */
  public async generateFinalAssessment(
    config: AiInterviewConfig,
    history: { role: 'interviewer' | 'candidate' | 'hint'; content: string }[]
  ): Promise<AiInterviewResponse> {
    if (!this.isConfigured()) {
      return {
        success: true,
        isGeminiLive: false,
        modelUsed: 'offline-simulator',
        assessment: getOfflineFinalAssessment(config, history),
      };
    }

    try {
      const prompt = buildFinalAssessmentPrompt(config, history);
      const assessmentText = await this.executeGeminiCall(prompt, 3500);

      const parsed = extractJson<AiInterviewAssessment>(assessmentText);
      if (!parsed || !parsed.hiringVerdict || !parsed.competencyBreakdown) {
        throw new Error('Failed to parse final assessment scorecard JSON from Gemini.');
      }

      return {
        success: true,
        isGeminiLive: true,
        modelUsed: this.modelName,
        assessment: {
          ...parsed,
          disclaimer:
            'AI-generated assessment powered by Google Gemini Developer API. Performance scores represent simulated interview benchmarks and do not constitute an actual employment guarantee.',
        },
      };
    } catch (err: any) {
      console.warn('Gemini generateFinalAssessment error, activating fallback:', err?.message || err);
      return {
        success: true,
        isGeminiLive: false,
        modelUsed: 'offline-fallback',
        assessment: getOfflineFinalAssessment(config, history),
        error: err?.message || 'Error generating final assessment scorecard.',
      };
    }
  }
  /**
   * Evaluate Candidate Answer for SQL & PostgreSQL Track
   */
  public async evaluateSql(
    question: SqlQuestion,
    candidateAnswer: string,
    candidateSql?: string
  ): Promise<{
    isGeminiLive: boolean;
    modelUsed: string;
    scoreOutOf100: number;
    passed: boolean;
    feedback: {
      technicalCorrectness: string;
      strengths: string[];
      gapsOrMisconceptions: string[];
      followUpChallenge: string;
      suggestedImprovement: string;
    };
    error?: string;
  }> {
    if (!this.isConfigured()) {
      const offline = getOfflineSqlEvaluation(question, candidateAnswer, candidateSql);
      return {
        isGeminiLive: false,
        modelUsed: 'offline-sql-evaluator',
        scoreOutOf100: offline.scoreOutOf100,
        passed: offline.passed,
        feedback: offline,
      };
    }

    try {
      const prompt = buildSqlEvaluationPrompt(question, candidateAnswer, candidateSql);
      const rawText = await this.executeGeminiCall(prompt, 2500);
      const parsed = extractJson<{
        scoreOutOf100: number;
        passed: boolean;
        technicalCorrectness: string;
        strengths: string[];
        gapsOrMisconceptions: string[];
        followUpChallenge: string;
        suggestedImprovement: string;
      }>(rawText);

      if (!parsed || typeof parsed.scoreOutOf100 !== 'number') {
        throw new Error('Failed to parse structured SQL evaluation JSON from Gemini.');
      }

      return {
        isGeminiLive: true,
        modelUsed: this.modelName,
        scoreOutOf100: Math.min(100, Math.max(0, parsed.scoreOutOf100)),
        passed: Boolean(parsed.passed),
        feedback: {
          technicalCorrectness: parsed.technicalCorrectness || 'Competent relational implementation',
          strengths: parsed.strengths || ['Solid SQL reasoning'],
          gapsOrMisconceptions: parsed.gapsOrMisconceptions || [],
          followUpChallenge: parsed.followUpChallenge || question.followUp.question,
          suggestedImprovement: parsed.suggestedImprovement || 'Review reference architecture.',
        },
      };
    } catch (err: any) {
      console.warn('Gemini SQL evaluation error, fallback activated:', err?.message || err);
      const offline = getOfflineSqlEvaluation(question, candidateAnswer, candidateSql);
      return {
        isGeminiLive: false,
        modelUsed: 'offline-sql-fallback',
        scoreOutOf100: offline.scoreOutOf100,
        passed: offline.passed,
        feedback: offline,
        error: err?.message || 'Error executing Gemini SQL evaluation.',
      };
    }
  }

  /**
   * Evaluate Production Incident Diagnostic Analysis
   */
  public async evaluateSqlIncident(
    question: SqlQuestion,
    candidateAnalysis: string
  ): Promise<{
    isGeminiLive: boolean;
    modelUsed: string;
    scoreOutOf100: number;
    passed: boolean;
    feedback: {
      rootCauseAccuracy: string;
      mitigationEvaluation: string;
      missingSafeguards: string[];
      followUpIncidentScenario?: string;
    };
    error?: string;
  }> {
    if (!this.isConfigured()) {
      const offline = getOfflineSqlEvaluation(question, candidateAnalysis);
      return {
        isGeminiLive: false,
        modelUsed: 'offline-sql-evaluator',
        scoreOutOf100: offline.scoreOutOf100,
        passed: offline.passed,
        feedback: {
          rootCauseAccuracy: offline.technicalCorrectness,
          mitigationEvaluation: offline.suggestedImprovement,
          missingSafeguards: offline.gapsOrMisconceptions,
          followUpIncidentScenario: offline.followUpChallenge,
        },
      };
    }

    try {
      const prompt = buildSqlIncidentDiagnosisPrompt(question, candidateAnalysis);
      const rawText = await this.executeGeminiCall(prompt, 2500);
      const parsed = extractJson<{
        scoreOutOf100: number;
        passed: boolean;
        rootCauseAccuracy: string;
        mitigationEvaluation: string;
        missingSafeguards: string[];
        followUpIncidentScenario?: string;
      }>(rawText);

      if (!parsed || typeof parsed.scoreOutOf100 !== 'number') {
        throw new Error('Failed to parse structured incident evaluation JSON from Gemini.');
      }

      return {
        isGeminiLive: true,
        modelUsed: this.modelName,
        scoreOutOf100: Math.min(100, Math.max(0, parsed.scoreOutOf100)),
        passed: Boolean(parsed.passed),
        feedback: {
          rootCauseAccuracy: parsed.rootCauseAccuracy || 'Accurate root cause identification',
          mitigationEvaluation: parsed.mitigationEvaluation || 'Competent incident containment',
          missingSafeguards: parsed.missingSafeguards || [],
          followUpIncidentScenario: parsed.followUpIncidentScenario,
        },
      };
    } catch (err: any) {
      console.warn('Gemini incident evaluation error, fallback activated:', err?.message || err);
      const offline = getOfflineSqlEvaluation(question, candidateAnalysis);
      return {
        isGeminiLive: false,
        modelUsed: 'offline-sql-fallback',
        scoreOutOf100: offline.scoreOutOf100,
        passed: offline.passed,
        feedback: {
          rootCauseAccuracy: offline.technicalCorrectness,
          mitigationEvaluation: offline.suggestedImprovement,
          missingSafeguards: offline.gapsOrMisconceptions,
          followUpIncidentScenario: offline.followUpChallenge,
        },
        error: err?.message || 'Error executing Gemini incident evaluation.',
      };
    }
  }
}

export const geminiService = new GeminiInterviewService();

