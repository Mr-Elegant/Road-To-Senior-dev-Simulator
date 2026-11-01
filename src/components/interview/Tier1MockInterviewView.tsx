'use client';

import React, { useState, useEffect } from 'react';
import { Tier1Category, Tier1Question, Tier1EvaluationResult, Tier1MockSummary } from '@/types/tier1';
import { allTier1Questions, TIER1_CATEGORIES, getTier1QuestionsByCategory } from '@/data/tier1';
import { evaluateTier1Answer } from '@/lib/evaluation/tier1Evaluator';
import { storage } from '@/lib/persistence/localStorageAdapter';
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Send,
  Trophy,
  Clock,
  Code2,
} from 'lucide-react';

interface MockQuestionTurn {
  question: Tier1Question;
  candidateAnswer: string;
  candidateCode?: string;
  evaluation?: Tier1EvaluationResult;
}

export function Tier1MockInterviewView() {
  const [selectedCount, setSelectedCount] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Interview session state
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questionsPool, setQuestionsPool] = useState<MockQuestionTurn[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer
  useEffect(() => {
    if (!isActive || isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, isCompleted]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartInterview = () => {
    const pool =
      selectedCategory === 'All'
        ? [...allTier1Questions]
        : getTier1QuestionsByCategory(selectedCategory as Tier1Category);

    // Shuffle pool
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, selectedCount).map((q) => ({
      question: q,
      candidateAnswer: '',
      candidateCode: q.codingExercise?.starterCode || '',
    }));

    setQuestionsPool(selected);
    setCurrentIdx(0);
    setCurrentAnswer('');
    setCurrentCode(selected[0]?.question.codingExercise?.starterCode || '');
    setElapsedSeconds(0);
    setIsActive(true);
    setIsCompleted(false);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() && !currentCode.trim()) {
      return;
    }

    const currentTurn = questionsPool[currentIdx];
    setIsEvaluating(true);

    try {
      const evalResult = await evaluateTier1Answer(
        currentTurn.question,
        currentAnswer,
        currentCode
      );

      // Update turn in pool
      const updatedPool = [...questionsPool];
      updatedPool[currentIdx] = {
        ...currentTurn,
        candidateAnswer: currentAnswer,
        candidateCode: currentCode,
        evaluation: evalResult,
      };
      setQuestionsPool(updatedPool);

      // Persist to storage
      await storage.saveTier1Attempt({
        id: `att-mock-${Date.now()}-${currentIdx}`,
        questionId: currentTurn.question.id,
        timestamp: new Date().toISOString(),
        candidateAnswer: currentAnswer,
        submittedCode: currentCode,
        evaluation: evalResult,
        mode: 'mock',
        timeSpentSeconds: 60,
      });
    } catch (err) {
      console.error('Error during mock evaluation:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questionsPool.length) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setCurrentAnswer(questionsPool[nextIdx].candidateAnswer || '');
      setCurrentCode(
        questionsPool[nextIdx].candidateCode ||
          questionsPool[nextIdx].question.codingExercise?.starterCode ||
          ''
      );
    } else {
      setIsCompleted(true);
      setIsActive(false);
    }
  };

  // Compute final summary when completed
  const summary: Tier1MockSummary | null = React.useMemo(() => {
    if (!isCompleted || questionsPool.length === 0) return null;

    const evaluatedTurns = questionsPool.filter((q) => q.evaluation);
    const totalScoreSum = evaluatedTurns.reduce(
      (sum, t) => sum + (t.evaluation?.scoreOutOf100 || 0),
      0
    );
    const avgScore = Math.round(totalScoreSum / (evaluatedTurns.length || 1));

    // Category breakdown
    const categoryStats: Record<string, { totalScore: number; count: number }> = {};
    for (const turn of evaluatedTurns) {
      const cat = turn.question.category;
      if (!categoryStats[cat]) categoryStats[cat] = { totalScore: 0, count: 0 };
      categoryStats[cat].totalScore += turn.evaluation?.scoreOutOf100 || 0;
      categoryStats[cat].count += 1;
    }

    const categoryBreakdown = Object.entries(categoryStats).map(([cat, stats]) => ({
      category: cat as Tier1Category,
      attempted: stats.count,
      avgScore: Math.round(stats.totalScore / stats.count),
    }));

    // Strengths vs weak areas
    const topStrengths = categoryBreakdown
      .filter((c) => c.avgScore >= 70)
      .map((c) => `${c.category} (${c.avgScore}%)`);

    const areasToRevisit = categoryBreakdown
      .filter((c) => c.avgScore < 70)
      .map((c) => `${c.category} (Score: ${c.avgScore}%)`);

    let readinessVerdict: Tier1MockSummary['readinessVerdict'] = 'More Practice Needed';
    if (avgScore >= 75) readinessVerdict = 'Ready for Junior Roles';
    else if (avgScore >= 55) readinessVerdict = 'Solid Foundations';

    return {
      totalQuestions: questionsPool.length,
      completedQuestions: evaluatedTurns.length,
      averageScore: avgScore,
      readinessVerdict,
      categoryBreakdown,
      topStrengths:
        topStrengths.length > 0 ? topStrengths : ['Demonstrated willingness to tackle all rounds'],
      areasToRevisit:
        areasToRevisit.length > 0
          ? areasToRevisit
          : ['Continue practicing code syntax exercises for speed'],
    };
  }, [isCompleted, questionsPool]);

  // 1. SETUP SCREEN
  if (!isActive && !isCompleted) {
    return (
      <div className="max-w-3xl mx-auto p-8 rounded-2xl glass-card space-y-6 animate-in fade-in duration-300">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Tier 1: Beginner Mock Interview Simulation</span>
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Simulate a Realistic Junior Full-Stack Technical Interview
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            Answer questions sequentially under simulated interview constraints without seeing the reference solutions in advance. Instant feedback is provided after each response.
          </p>
        </div>

        {/* Configuration settings */}
        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div>
            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block mb-2 font-mono uppercase tracking-wider">
              Select Question Count:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { count: 5, label: '5 Questions (Quick Check)' },
                { count: 10, label: '10 Questions (Standard)' },
                { count: 15, label: '15 Questions (Full Loop)' },
              ].map((opt) => (
                <button
                  key={opt.count}
                  onClick={() => setSelectedCount(opt.count)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedCount === opt.count
                      ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/30 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">{opt.count} Questions</div>
                  <div className="text-[10px] text-zinc-500 opacity-80 mt-0.5">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block mb-2 font-mono uppercase tracking-wider">
              Focus Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/70 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="All">All 6 Categories (Balanced Fundamentals)</option>
              {TIER1_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Reference answers are locked until you submit each response.
          </div>

          <button
            onClick={handleStartInterview}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Begin Tier 1 Mock Interview</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. SUMMARY REPORT SCREEN
  if (isCompleted && summary) {
    return (
      <div className="max-w-3xl mx-auto p-8 rounded-2xl glass-card space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Mock Interview Completed
            </span>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Performance & Readiness Summary
            </h2>
          </div>

          <div className="text-right">
            <div className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
              {summary.averageScore}%
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Overall Score</span>
          </div>
        </div>

        {/* Readiness Verdict Banner */}
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300 font-mono font-bold uppercase">
              Hiring Bar Assessment
            </div>
            <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {summary.readinessVerdict}
            </div>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            Time Elapsed: {formatTimer(elapsedSeconds)}
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-500">
            Category Breakdown
          </h3>
          <div className="space-y-2">
            {summary.categoryBreakdown.map((c) => (
              <div
                key={c.category}
                className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {c.category}
                  </span>
                  <div className="text-[11px] text-zinc-500">{c.attempted} question(s) tested</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        c.avgScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${c.avgScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 w-10 text-right">
                    {c.avgScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weak Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Strengths</span>
            </span>
            <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 list-disc list-inside">
              {summary.topStrengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Recommended Topics to Revisit</span>
            </span>
            <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 list-disc list-inside">
              {summary.areasToRevisit.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => {
              setIsCompleted(false);
              setIsActive(false);
            }}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Configure New Interview
          </button>

          <button
            onClick={handleStartInterview}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Interview Now</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. ACTIVE QUESTION RUNNER
  const currentTurn = questionsPool[currentIdx];
  const q = currentTurn.question;
  const isTurnEvaluated = Boolean(currentTurn.evaluation);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header bar: Progress + Timer */}
      <div className="flex items-center justify-between glass-card p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold font-mono text-zinc-500">
            Question {currentIdx + 1} of {questionsPool.length}
          </span>
          <div className="w-32 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{
                width: `${((currentIdx + 1) / questionsPool.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-amber-500 font-bold">
          <Clock className="w-4 h-4" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 rounded-2xl glass-card space-y-5">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {q.category}
          </span>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2 leading-snug">
            {q.title}
          </h2>
        </div>

        {/* Expected concepts (masked slightly during mock) */}
        <div>
          <span className="text-[11px] font-mono text-zinc-400 block mb-1">
            Focus Areas:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {q.expectedConcepts.map((c, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[11px] bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Answer textarea */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block">
            Your Technical Response:
          </label>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            disabled={isTurnEvaluated}
            rows={5}
            placeholder="Explain clearly in your own words. Reference solutions are hidden until submitted..."
            className="w-full p-4 text-xs font-mono rounded-xl bg-white/70 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 leading-relaxed disabled:opacity-75"
          />
        </div>

        {/* Optional Code Exercise (if included in question) */}
        {q.codingExercise && (
          <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Code2 className="w-4 h-4" />
              <span>Interactive Code Snippet:</span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              {q.codingExercise.instruction}
            </p>
            <textarea
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              disabled={isTurnEvaluated}
              rows={4}
              className="w-full p-3 font-mono text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed disabled:opacity-75"
            />
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            {isTurnEvaluated
              ? 'Response evaluated. Proceed to the next question when ready.'
              : 'Submit your response to receive immediate benchmark scoring.'}
          </div>

          <div className="flex items-center gap-3">
            {!isTurnEvaluated ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={isEvaluating}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEvaluating ? 'Evaluating...' : 'Submit Answer'}</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>
                  {currentIdx + 1 < questionsPool.length
                    ? 'Next Question'
                    : 'View Interview Results'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Turn Evaluation Feedback Card */}
        {currentTurn.evaluation && (
          <div className="mt-4 p-5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Instant Feedback: {currentTurn.evaluation.verdict}
                </span>
              </div>
              <span className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                {currentTurn.evaluation.scoreOutOf100}%
              </span>
            </div>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {currentTurn.evaluation.conceptualUnderstanding}
            </p>

            {/* Quick reference revealed after turn */}
            <div className="pt-2 border-t border-blue-500/10 text-xs">
              <span className="font-bold text-zinc-500 block mb-1">
                Reference Summary:
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                {q.shortReferenceAnswer}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
