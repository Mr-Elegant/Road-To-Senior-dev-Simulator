import { apiError, requireApiSession } from '@/lib/auth/server';
import { consumeAiQuota } from '@/lib/auth/aiQuota';
import { readBoundedJson } from '@/lib/auth/request';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getSqlQuestionById } from '@/data/sql';
import { geminiService } from '@/lib/gemini/service';

export async function POST(request: Request) {
  try {
    const user = await requireApiSession(request);
    await consumeAiQuota(user.id);
    const parsed = z.object({ questionId: z.string().max(200), candidateAnswer: z.string().max(20000).optional(), candidateSql: z.string().max(20000).optional(), isIncident: z.boolean().optional(), candidateAnalysis: z.string().max(20000).optional() }).safeParse(await readBoundedJson(request));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid SQL evaluation payload.' }, { status: 422 });
    const body = parsed.data;
    const { questionId, candidateAnswer, candidateSql, isIncident, candidateAnalysis } = body;

    if (!questionId) {
      return NextResponse.json({ error: 'Missing questionId parameter' }, { status: 400 });
    }

    const question = getSqlQuestionById(questionId);
    if (!question) {
      return NextResponse.json({ error: `Question with id ${questionId} not found` }, { status: 404 });
    }

    if (isIncident && candidateAnalysis) {
      const incidentResult = await geminiService.evaluateSqlIncident(question, candidateAnalysis);
      return NextResponse.json(incidentResult);
    }

    const evaluationResult = await geminiService.evaluateSql(
      question,
      candidateAnswer || '',
      candidateSql
    );

    return NextResponse.json(evaluationResult);
  } catch (err: unknown) {
    return apiError(err);
  }
}

