import { NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini/service';
import { AiInterviewRequest, AiInterviewConfig } from '@/types/aiInterview';

export const runtime = 'nodejs';

/**
 * GET /api/ai-interview
 * Health check & configuration status endpoint.
 * Strictly never exposes the actual GEMINI_API_KEY value.
 */
export async function GET() {
  const isConfigured = geminiService.isConfigured();
  const modelName = geminiService.getModelName();

  return NextResponse.json({
    status: 'ok',
    isGeminiConfigured: isConfigured,
    model: modelName,
    freeTierSupported: true,
    message: isConfigured
      ? `Gemini AI Interviewer is active using model: ${modelName}.`
      : 'GEMINI_API_KEY is not configured in server environment. Offline fallback simulator is enabled.',
  });
}

/**
 * POST /api/ai-interview
 * Main conversational interview handler (start, reply, hint, evaluate).
 */
export async function POST(request: Request) {
  try {
    let body: AiInterviewRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { action, config, sessionState, candidateAnswer } = body;

    if (!action || !['start', 'reply', 'hint', 'evaluate'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid 'action'. Must be one of: 'start', 'reply', 'hint', 'evaluate'.",
        },
        { status: 400 }
      );
    }

    // 1. ACTION: START NEW INTERVIEW
    if (action === 'start') {
      const interviewConfig: AiInterviewConfig = {
        role: config?.role || 'Senior Full-Stack Engineer',
        technology: config?.technology || 'Full-Stack (Next.js, TypeScript, PostgreSQL)',
        difficulty: config?.difficulty || 'Senior',
        durationMinutes: config?.durationMinutes || 30,
      };

      const result = await geminiService.generateQuestion(interviewConfig);
      return NextResponse.json(result);
    }

    // 2. ACTION: SUBMIT ANSWER & GET FOLLOW-UP
    if (action === 'reply') {
      if (!candidateAnswer || typeof candidateAnswer !== 'string') {
        return NextResponse.json(
          { success: false, error: "Missing required 'candidateAnswer' string." },
          { status: 400 }
        );
      }

      // Security limit: Prevent denial of service or token exhaustion with massive inputs
      if (candidateAnswer.length > 10000) {
        return NextResponse.json(
          {
            success: false,
            error: 'Candidate answer exceeds maximum allowed length of 10,000 characters.',
          },
          { status: 400 }
        );
      }

      if (!sessionState?.currentQuestion) {
        return NextResponse.json(
          { success: false, error: "Missing 'sessionState.currentQuestion' in payload." },
          { status: 400 }
        );
      }

      const interviewConfig = sessionState.config || config || {
        role: 'Senior Full-Stack Engineer',
        technology: 'Full-Stack (Next.js, TypeScript, PostgreSQL)',
        difficulty: 'Senior',
        durationMinutes: 30,
      };

      const currentTurn = sessionState.currentTurn || 1;
      const maxTurns = sessionState.maxTurns || 3;
      const history = Array.isArray(sessionState.history) ? sessionState.history : [];

      const result = await geminiService.evaluateAndFollowUp(
        interviewConfig,
        sessionState.currentQuestion,
        history,
        candidateAnswer.trim(),
        currentTurn,
        maxTurns
      );

      return NextResponse.json(result);
    }

    // 3. ACTION: REQUEST PROGRESSIVE HINT
    if (action === 'hint') {
      if (!sessionState?.currentQuestion) {
        return NextResponse.json(
          { success: false, error: "Missing 'sessionState.currentQuestion' for hint request." },
          { status: 400 }
        );
      }

      const history = Array.isArray(sessionState.history) ? sessionState.history : [];
      const result = await geminiService.getHint(sessionState.currentQuestion, history);
      return NextResponse.json(result);
    }

    // 4. ACTION: GENERATE FINAL COMPREHENSIVE ASSESSMENT
    if (action === 'evaluate') {
      const interviewConfig = sessionState?.config || config || {
        role: 'Senior Full-Stack Engineer',
        technology: 'Full-Stack (Next.js, TypeScript, PostgreSQL)',
        difficulty: 'Senior',
        durationMinutes: 30,
      };

      const history = Array.isArray(sessionState?.history) ? sessionState.history : [];
      if (history.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Cannot evaluate an interview session with zero history.' },
          { status: 400 }
        );
      }

      const result = await geminiService.generateFinalAssessment(interviewConfig, history);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported operation.' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Unhandled API error in /api/ai-interview:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Internal server error processing AI interview request.',
      },
      { status: 500 }
    );
  }
}

