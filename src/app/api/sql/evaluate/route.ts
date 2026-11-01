import { NextResponse } from 'next/server';
import { getSqlQuestionById } from '@/data/sql';
import { geminiService } from '@/lib/gemini/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
  } catch (err: any) {
    console.error('Error in /api/sql/evaluate:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error evaluating SQL answer' },
      { status: 500 }
    );
  }
}

