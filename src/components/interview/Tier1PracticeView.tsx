'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Tier1Question, Tier1EvaluationResult } from '@/types/tier1';
import { allTier1Questions, TIER1_CATEGORIES } from '@/data/tier1';
import { evaluateTier1Answer } from '@/lib/evaluation/tier1Evaluator';
import { storage } from '@/lib/persistence/localStorageAdapter';
import {
  Search,
  Bookmark,
  RotateCcw,
  Send,
  Lightbulb,
  FileCode,
  Award,
  Code2,
} from 'lucide-react';

export function Tier1PracticeView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(allTier1Questions[0].id);

  // Per-question interactive states
  const [candidateAnswers, setCandidateAnswers] = useState<Record<string, string>>({});
  const [candidateCodes, setCandidateCodes] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [evaluations, setEvaluations] = useState<Record<string, Tier1EvaluationResult>>({});
  const [isEvaluating, setIsEvaluating] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Load saved bookmarks and previous attempts
  useEffect(() => {
    storage.getTier1Progress().then((p) => {
      setBookmarkedIds(p.bookmarkedQuestionIds || []);
      const prevEvals: Record<string, Tier1EvaluationResult> = {};
      const prevAnswers: Record<string, string> = {};
      const prevCodes: Record<string, string> = {};

      for (const att of p.attempts || []) {
        if (!prevEvals[att.questionId]) {
          prevEvals[att.questionId] = att.evaluation;
          prevAnswers[att.questionId] = att.candidateAnswer;
          if (att.submittedCode) prevCodes[att.questionId] = att.submittedCode;
        }
      }
      setEvaluations(prevEvals);
      setCandidateAnswers(prevAnswers);
      setCandidateCodes(prevCodes);
    });
  }, []);

  const filteredQuestions = useMemo(() => {
    return allTier1Questions.filter((q) => {
      if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesCategory = q.category.toLowerCase().includes(query);
        const matchesConcept = q.expectedConcepts.some((c) => c.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCategory && !matchesConcept) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const currentQuestion = useMemo(() => {
    return (
      allTier1Questions.find((q) => q.id === selectedQuestionId) ||
      filteredQuestions[0] ||
      allTier1Questions[0]
    );
  }, [selectedQuestionId, filteredQuestions]);

  const handleToggleBookmark = async (id: string) => {
    const updated = await storage.toggleTier1Bookmark(id);
    setBookmarkedIds(updated);
  };

  const handleRequestHint = (id: string, maxHints: number) => {
    setRevealedHints((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.min(maxHints, current + 1) };
    });
  };

  const handleToggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetQuestion = (id: string) => {
    setCandidateAnswers((prev) => ({ ...prev, [id]: '' }));
    setCandidateCodes((prev) => ({ ...prev, [id]: '' }));
    setEvaluations((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setRevealedSolutions((prev) => ({ ...prev, [id]: false }));
    setRevealedHints((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleSubmitAnswer = async (q: Tier1Question) => {
    const answer = candidateAnswers[q.id] || '';
    const code =
      candidateCodes[q.id] !== undefined
        ? candidateCodes[q.id]
        : q.codingExercise?.starterCode || '';

    if (!answer.trim() && !code.trim()) {
      return;
    }

    setIsEvaluating((prev) => ({ ...prev, [q.id]: true }));

    try {
      const result = await evaluateTier1Answer(q, answer, code);
      setEvaluations((prev) => ({ ...prev, [q.id]: result }));

      // Persist attempt to storage
      await storage.saveTier1Attempt({
        id: `att-t1-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        questionId: q.id,
        timestamp: new Date().toISOString(),
        candidateAnswer: answer,
        submittedCode: code,
        evaluation: result,
        mode: 'practice',
        timeSpentSeconds: 60,
      });
    } catch (err) {
      console.error('Error evaluating answer:', err);
    } finally {
      setIsEvaluating((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  const currentEval = evaluations[currentQuestion.id];
  const isBookmarked = bookmarkedIds.includes(currentQuestion.id);
  const hintCount = revealedHints[currentQuestion.id] || 0;
  const showSolution = Boolean(revealedSolutions[currentQuestion.id]);
  const isSubmitting = Boolean(isEvaluating[currentQuestion.id]);

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-4 rounded-2xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search beginner questions (e.g. closures, flexbox, useState)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/70 dark:bg-zinc-950/70 border border-zinc-200/90 dark:border-zinc-800/90 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            All Categories ({allTier1Questions.length})
          </button>
          {TIER1_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.replace(' Fundamentals', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Practice Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Navigator */}
        <div className="lg:col-span-4 space-y-2 max-h-[720px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-1 mb-2 flex items-center justify-between">
            <span>Questions ({filteredQuestions.length})</span>
            <span className="text-[11px] font-mono">
              {Object.keys(evaluations).length} Attempted
            </span>
          </div>

          {filteredQuestions.map((q) => {
            const isSelected = q.id === currentQuestion.id;
            const evalResult = evaluations[q.id];
            const isSaved = bookmarkedIds.includes(q.id);

            return (
              <div
                key={q.id}
                onClick={() => setSelectedQuestionId(q.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/15 shadow-xs ring-1 ring-blue-500/30'
                    : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-bold flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                      {q.order}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {q.category.replace(' Fundamentals', '')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {evalResult && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          evalResult.verdict === 'Mastered'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {evalResult.scoreOutOf100}%
                      </span>
                    )}
                    {isSaved && <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" />}
                  </div>
                </div>

                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-2 line-clamp-2 leading-snug">
                  {q.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Question Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl glass-card space-y-5">
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Tier 1: Beginner
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {currentQuestion.category}
                  </span>
                  {currentQuestion.codingExercise && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      <span>Includes Code Exercise</span>
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {currentQuestion.title}
                </h2>
              </div>

              <button
                onClick={() => handleToggleBookmark(currentQuestion.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Expected Concepts Tags */}
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Expected Core Concepts:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentQuestion.expectedConcepts.map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-lg text-xs bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-medium border border-zinc-200/50 dark:border-zinc-700/50"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Candidate Answer Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 flex items-center justify-between">
                <span>Your Explanation (in your own simple words):</span>
                <span className="text-[11px] text-zinc-400 font-normal">
                  Plain language preferred • No need for heavy jargon
                </span>
              </label>
              <textarea
                value={candidateAnswers[currentQuestion.id] || ''}
                onChange={(e) =>
                  setCandidateAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: e.target.value,
                  }))
                }
                rows={5}
                placeholder="Explain what this concept is, why it is used, and how it works in practice..."
                className="w-full p-4 text-xs font-mono rounded-xl bg-white/70 dark:bg-zinc-950/70 border border-zinc-200/90 dark:border-zinc-800/90 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 leading-relaxed shadow-xs"
              />
            </div>

            {/* Coding Exercise Pane (if present) */}
            {currentQuestion.codingExercise && (
              <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Code2 className="w-4 h-4" />
                  <span>Interactive Coding Task</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {currentQuestion.codingExercise.instruction}
                </p>
                {currentQuestion.codingExercise.expectedOutput && (
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    Expected output:{' '}
                    <code className="text-indigo-600 dark:text-indigo-300 font-bold">
                      {currentQuestion.codingExercise.expectedOutput}
                    </code>
                  </div>
                )}
                <textarea
                  value={
                    candidateCodes[currentQuestion.id] !== undefined
                      ? candidateCodes[currentQuestion.id]
                      : currentQuestion.codingExercise.starterCode
                  }
                  onChange={(e) =>
                    setCandidateCodes((prev) => ({
                      ...prev,
                      [currentQuestion.id]: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full p-3 font-mono text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSubmitAnswer(currentQuestion)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating Answer...' : 'Submit for Review'}</span>
                </button>

                <button
                  onClick={() =>
                    handleRequestHint(currentQuestion.id, currentQuestion.hints.length)
                  }
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    Hint ({hintCount}/{currentQuestion.hints.length})
                  </span>
                </button>

                <button
                  onClick={() => handleToggleSolution(currentQuestion.id)}
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-500" />
                  <span>{showSolution ? 'Hide Solution' : 'Reference Solution'}</span>
                </button>
              </div>

              {currentEval && (
                <button
                  onClick={() => handleResetQuestion(currentQuestion.id)}
                  className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry Question</span>
                </button>
              )}
            </div>

            {/* Revealed Hints */}
            {hintCount > 0 && (
              <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                  <span>Progressive Guidance Hints</span>
                </div>
                {currentQuestion.hints.slice(0, hintCount).map((h, i) => (
                  <div key={i} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                    <span className="font-mono font-bold text-amber-500">#{i + 1}:</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Revealed Solution Drawer */}
            {showSolution && (
              <div className="p-5 rounded-xl border border-purple-500/25 bg-purple-500/5 space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                  <FileCode className="w-4 h-4" />
                  <span>Official Reference Explanation</span>
                </div>

                <div className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  {currentQuestion.shortReferenceAnswer}
                </div>

                {currentQuestion.practicalExample && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                      Practical Example Code:
                    </span>
                    <pre className="p-4 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
                      <code>{currentQuestion.practicalExample}</code>
                    </pre>
                  </div>
                )}

                {currentQuestion.optionalFollowUp && (
                  <div className="pt-3 border-t border-purple-500/10 space-y-1.5">
                    <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 font-mono">
                      Optional Interview Follow-Up:
                    </span>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Q: {currentQuestion.optionalFollowUp.question}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      Answer: {currentQuestion.optionalFollowUp.expectedAnswer}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Evaluation Results Card */}
            {currentEval && (
              <div
                className={`p-5 rounded-2xl border space-y-4 shadow-xs ${
                  currentEval.verdict === 'Mastered'
                    ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
                    : 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10'
                }`}
              >
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Award
                      className={`w-5 h-5 ${
                        currentEval.verdict === 'Mastered' ? 'text-emerald-500' : 'text-amber-500'
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Evaluation: {currentEval.verdict}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                        {currentEval.evaluatorType === 'gemini'
                          ? '✨ Gemini AI Contextual Evaluation'
                          : '📋 Tier 1 Conceptual Benchmark Rubric (Predefined Mode)'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
                      {currentEval.scoreOutOf100}%
                    </div>
                    <span className="text-[10px] text-zinc-400">Performance Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                      Conceptual Understanding
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {currentEval.conceptualUnderstanding}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                      Technical Correctness
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {currentEval.technicalCorrectness}
                    </p>
                  </div>
                </div>

                {currentEval.actionableTips && currentEval.actionableTips.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase font-mono tracking-wider">
                      Helpful Recommendations:
                    </span>
                    <ul className="list-disc list-inside text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                      {currentEval.actionableTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
