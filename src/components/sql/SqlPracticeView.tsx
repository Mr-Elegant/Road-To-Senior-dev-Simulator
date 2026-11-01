'use client';

import { requestSqlEvaluation } from '@/lib/evaluation/sqlClientEvaluation';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  SqlCategory,
  SqlQuestion,
  SqlQuestionType,
  SqlTierLevel,
  SqlTrackProgressData,
  SqlAttempt
} from '@/types/sqlTrack';
import { getSqlQuestionsByTier } from '@/data/sql';
import { evaluateExecutableSql } from '@/lib/evaluation/sqlEvaluator';
import { storage } from '@/lib/persistence/localStorageAdapter';
import {
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  Clock,
  Layers,
  Database,
  ChevronDown,
  ChevronRight,
  Flame,
  Award,
  AlertTriangle,
  Lightbulb,
  Check,
  X,
  Code2
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface SqlPracticeViewProps {
  selectedTier: SqlTierLevel;
  progress?: SqlTrackProgressData;
  onProgressUpdate?: (updated: SqlTrackProgressData) => void;
}

export function SqlPracticeView({
  selectedTier,
  progress,
  onProgressUpdate
}: SqlPracticeViewProps) {
  const allQuestions = getSqlQuestionsByTier(selectedTier);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Active question modal / drawer state
  const [activeQuestion, setActiveQuestion] = useState<SqlQuestion | null>(null);

  // Workspace interaction state for active question
  const [candidateCode, setCandidateCode] = useState<string>('');
  const [candidateExplanation, setCandidateExplanation] = useState<string>('');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showReference, setShowReference] = useState<boolean>(false);
  const [showFollowUp, setShowFollowUp] = useState<boolean>(false);

  // Test execution state
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{
    allPassed: boolean;
    score: number;
    testCaseResults: any[];
  } | null>(null);

  // AI Evaluation state
  const [isEvaluatingAi, setIsEvaluatingAi] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  const tierKey = selectedTier.replace('-', '') as 'tier1' | 'tier2' | 'tier3' | 'tier4';
  const tierProgress = progress?.[tierKey];
  const completedIds = new Set(tierProgress?.completedQuestionIds || []);
  const bookmarkedIds = new Set(tierProgress?.bookmarkedQuestionIds || []);

  // Filtered list
  const filteredQuestions = allQuestions.filter((q) => {
    if (searchQuery.trim()) {
      const qText = `${q.title} ${q.realWorldScenario} ${q.questionStatement} ${q.expectedConcepts.join(' ')}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    if (typeFilter !== 'all' && q.questionType !== typeFilter) return false;
    if (statusFilter === 'completed' && !completedIds.has(q.id)) return false;
    if (statusFilter === 'bookmarked' && !bookmarkedIds.has(q.id)) return false;
    if (statusFilter === 'unattempted' && completedIds.has(q.id)) return false;
    return true;
  });

  // Open Question detail
  const handleOpenQuestion = (q: SqlQuestion) => {
    setActiveQuestion(q);
    setCandidateCode(q.starterCode || q.sqlSolution || '');
    setCandidateExplanation('');
    setRevealedHints([]);
    setShowReference(false);
    setShowFollowUp(false);
    setTestResults(null);
    setAiFeedback(null);
  };

  const handleToggleHint = (index: number) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter((i) => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const handleToggleBookmark = async (questionId: string) => {
    const updatedBookmarks = await storage.toggleSqlBookmark(questionId, selectedTier);
    if (progress && onProgressUpdate) {
      onProgressUpdate({
        ...progress,
        [tierKey]: {
          ...(progress[tierKey] || {}),
          bookmarkedQuestionIds: updatedBookmarks
        }
      });
    }
  };

  // Run executable test cases
  const handleExecuteTests = async () => {
    if (!activeQuestion) return;
    setIsRunningTests(true);
    try {
      const outcome = await evaluateExecutableSql(candidateCode, activeQuestion);
      setTestResults(outcome);

      // If passed, save attempt to persistence
      if (outcome.allPassed) {
        const attempt: SqlAttempt = {
          id: `att_${Date.now()}`,
          questionId: activeQuestion.id,
          tier: activeQuestion.tier,
          timestamp: new Date().toISOString(),
          mode: 'coding',
          candidateSql: candidateCode,
          candidateAnswer: candidateExplanation,
          scoreOutOf100: outcome.score,
          passed: true,
          feedback: {
            technicalCorrectness: `All ${outcome.testCaseResults.length} automated test cases passed.`,
            strengths: ['Accurate relational query syntax', 'Produces expected output set'],
            improvements: ['Review performance on million-row scale']
          },
          timeSpentSeconds: 60
        };
        const updatedProgress = await storage.saveSqlAttempt(attempt);
        if (onProgressUpdate) onProgressUpdate(updatedProgress);
      }
    } catch (e: any) {
      console.error('Test execution failed:', e);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Request AI Bar Raiser Evaluation
  const handleEvaluateWithAi = async () => {
    if (!activeQuestion) return;
    setIsEvaluatingAi(true);
    try {
      const data = await requestSqlEvaluation(activeQuestion, { candidateAnswer: candidateExplanation, candidateSql: candidateCode, isIncident: activeQuestion.questionType === 'incident' });
      setAiFeedback(data);

      if (data && typeof data.scoreOutOf100 === 'number') {
        const attempt: SqlAttempt = {
          id: `att_ai_${Date.now()}`,
          questionId: activeQuestion.id,
          tier: activeQuestion.tier,
          timestamp: new Date().toISOString(),
          mode: 'practice',
          candidateSql: candidateCode,
          candidateAnswer: candidateExplanation,
          scoreOutOf100: data.scoreOutOf100,
          passed: data.passed,
          feedback: {
            technicalCorrectness: data.feedback?.technicalCorrectness || '',
            strengths: data.feedback?.strengths || [],
            improvements: data.feedback?.gapsOrMisconceptions || []
          },
          timeSpentSeconds: 120
        };
        const updatedProgress = await storage.saveSqlAttempt(attempt);
        if (onProgressUpdate) onProgressUpdate(updatedProgress);
      }
    } catch (e: any) {
      console.error('AI evaluation failed:', e);
    } finally {
      setIsEvaluatingAi(false);
    }
  };

  // Extract all categories in this tier for the filter dropdown
  const categoriesInTier = Array.from(new Set(allQuestions.map((q) => q.category)));

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, concepts, scenarios..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Categories ({categoriesInTier.length})</option>
            {categoriesInTier.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="executable">Executable Sandbox</option>
            <option value="conceptual">Conceptual / Internals</option>
            <option value="incident">Production Incident</option>
            <option value="design">Database Design</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed Only</option>
            <option value="bookmarked">Bookmarked Only</option>
            <option value="unattempted">Unattempted Only</option>
          </select>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((q) => {
          const isCompleted = completedIds.has(q.id);
          const isBookmarked = bookmarkedIds.has(q.id);

          return (
            <div
              key={q.id}
              onClick={() => handleOpenQuestion(q)}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-800/40 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      Q{q.order}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/60 truncate max-w-[130px]">
                      {q.category}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      q.executionDialect === 'postgresql' || q.tier === 'tier-3' || q.tier === 'tier-4'
                        ? 'bg-purple-950/70 text-purple-300 border border-purple-800/60'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {q.executionDialect === 'postgresql' || q.tier === 'tier-3' || q.tier === 'tier-4' ? 'PGlite' : 'AlaSQL'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={`p-1 rounded hover:bg-slate-700 transition ${
                        isBookmarked ? 'text-amber-400' : 'text-slate-400'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                    {isCompleted && (
                      <span title="Completed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1.5 line-clamp-2">
                  {q.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {q.realWorldScenario}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1 text-[11px]">
                  {q.questionType === 'executable' ? (
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <Play className="w-3 h-3" />
                      <span>Executable Sandbox</span>
                    </span>
                  ) : q.questionType === 'incident' ? (
                    <span className="text-rose-400 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Production Incident</span>
                    </span>
                  ) : (
                    <span className="text-purple-400 flex items-center space-x-1">
                      <Lightbulb className="w-3 h-3" />
                      <span>Architecture / Deep Internals</span>
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-blue-400 font-semibold group-hover:underline">
                  Practice &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl">
          <Database className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">No questions match the selected filters</h4>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search query or category filters.</p>
        </div>
      )}

      {/* Active Question Modal / Workspace Drawer */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700">
                  Q{activeQuestion.order}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      {activeQuestion.category}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-xs text-purple-400 font-medium">
                      {activeQuestion.difficultyLabel}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      activeQuestion.executionDialect === 'postgresql' || activeQuestion.tier === 'tier-3' || activeQuestion.tier === 'tier-4'
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      Engine: {activeQuestion.executionDialect === 'postgresql' || activeQuestion.tier === 'tier-3' || activeQuestion.tier === 'tier-4' ? 'PGlite (Postgres 16 WASM)' : 'AlaSQL (SQL-99)'}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {activeQuestion.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleBookmark(activeQuestion.id)}
                  className={`p-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition ${
                    bookmarkedIds.has(activeQuestion.id) ? 'text-amber-400' : 'text-slate-400'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={() => setActiveQuestion(null)}
                  className="p-2 rounded-lg border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Real-World Scenario Banner */}
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/50 text-xs text-blue-200 leading-relaxed">
                <span className="font-bold text-blue-400 block mb-1 uppercase tracking-wider text-[11px]">
                  Real-World Scenario:
                </span>
                {activeQuestion.realWorldScenario}
              </div>

              {/* Question Statement */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Statement:
                </h3>
                <p className="text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
                  {activeQuestion.questionStatement}
                </p>
              </div>

              {/* Expected Concepts */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Expected Concepts & Architectural Topics:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeQuestion.expectedConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/80 text-cyan-300 font-mono"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Executable Monaco Editor (If question is executable) */}
              {activeQuestion.questionType === 'executable' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span>SQL Solution Editor</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCandidateCode(activeQuestion.starterCode || '')}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded border border-slate-700"
                      >
                        Reset Starter Code
                      </button>
                      <button
                        onClick={handleExecuteTests}
                        disabled={isRunningTests}
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 shadow"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isRunningTests ? 'Running...' : 'Run & Verify Tests'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="h-56 rounded-lg overflow-hidden border border-slate-700">
                    <MonacoEditor
                      height="100%"
                      language="sql"
                      theme="vs-dark"
                      value={candidateCode}
                      onChange={(val) => setCandidateCode(val || '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>

                  {/* Test Results Output */}
                  {testResults && (
                    <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                      testResults.allPassed
                        ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
                        : 'bg-rose-950/30 border-rose-800 text-rose-200'
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center space-x-1.5">
                          {testResults.allPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                          )}
                          <span>
                            {testResults.allPassed
                              ? 'All Automated Test Cases Passed!'
                              : 'Test Cases Failed'}
                          </span>
                        </span>
                        <span className="font-mono text-sm">Score: {testResults.score}/100</span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {testResults.testCaseResults.map((tc, idx) => (
                          <div key={idx} className="p-2 rounded bg-black/30 flex flex-col space-y-1">
                            <div className="flex items-center justify-between font-medium">
                              <span>Test {idx + 1}: {tc.description}</span>
                              <span className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>
                                {tc.passed ? 'PASS' : 'FAIL'} ({tc.durationMs}ms)
                              </span>
                            </div>
                            {tc.diffMessage && (
                              <pre className="text-[11px] text-rose-300 font-mono whitespace-pre-wrap mt-1">
                                {tc.diffMessage}
                              </pre>
                            )}
                            {tc.error && (
                              <pre className="text-[11px] text-rose-400 font-mono">{tc.error}</pre>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Candidate Explanation / Architecture notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Explanation & Technical Rationale:
                  </label>
                  <button
                    onClick={handleEvaluateWithAi}
                    disabled={isEvaluatingAi || !candidateExplanation.trim()}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 shadow disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>{isEvaluatingAi ? 'Evaluating...' : 'Evaluate with Gemini AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={candidateExplanation}
                  onChange={(e) => setCandidateExplanation(e.target.value)}
                  placeholder="Explain your architectural reasoning, physical page mechanics, isolation trade-offs, or production considerations here..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* AI Bar Raiser Feedback Card */}
              {aiFeedback && (
                <div className={`p-4 rounded-xl border space-y-3 text-xs ${
                  aiFeedback.passed
                    ? 'bg-blue-950/40 border-blue-800 text-blue-200'
                    : 'bg-amber-950/40 border-amber-800 text-amber-200'
                }`}>
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Gemini Bar Raiser Assessment:</span>
                    </span>
                    <span className="font-mono text-base font-bold text-cyan-300">
                      Score: {aiFeedback.scoreOutOf100}/100
                    </span>
                  </div>

                  <p className="leading-relaxed">{aiFeedback.feedback?.technicalCorrectness}</p>

                  {aiFeedback.feedback?.strengths?.length > 0 && (
                    <div>
                      <span className="font-bold text-emerald-400 block mb-1">Strengths:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {aiFeedback.feedback.strengths.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiFeedback.feedback?.gapsOrMisconceptions?.length > 0 && (
                    <div>
                      <span className="font-bold text-rose-400 block mb-1">Gaps / Considerations:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {aiFeedback.feedback.gapsOrMisconceptions.map((g: string, i: number) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiFeedback.feedback?.followUpChallenge && (
                    <div className="p-2.5 rounded-lg bg-black/30 border border-slate-700/60">
                      <span className="font-bold text-cyan-300 block mb-0.5">Bar Raiser Challenge:</span>
                      <p className="text-slate-300">{aiFeedback.feedback.followUpChallenge}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Progressive Hints */}
              {activeQuestion.hints && activeQuestion.hints.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Progressive Hints</span>
                  </h4>
                  <div className="space-y-1.5">
                    {activeQuestion.hints.map((hint, idx) => {
                      const isRevealed = revealedHints.includes(idx);
                      return (
                        <div
                          key={idx}
                          className="border border-slate-800 rounded-lg overflow-hidden bg-slate-800/40"
                        >
                          <button
                            onClick={() => handleToggleHint(idx)}
                            className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-medium text-slate-300 hover:bg-slate-700/50"
                          >
                            <span>Hint {idx + 1}</span>
                            <span className="text-[11px] text-blue-400">
                              {isRevealed ? 'Hide' : 'Reveal'}
                            </span>
                          </button>
                          {isRevealed && (
                            <div className="px-3 pb-3 pt-1 text-xs text-amber-200/90 border-t border-slate-700/50 bg-amber-950/20">
                              {hint}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reference Solution Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowReference(!showReference)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center space-x-2 transition"
                >
                  {showReference ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showReference ? 'Hide Reference Architecture' : 'Reveal Reference Architecture'}</span>
                </button>

                {showReference && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3 text-xs leading-relaxed animate-in fade-in">
                    <h4 className="font-bold text-white text-sm">Reference Architecture & Explanation:</h4>
                    <pre className="text-slate-300 whitespace-pre-wrap font-sans">
                      {activeQuestion.referenceAnswer}
                    </pre>

                    {activeQuestion.sqlSolution && (
                      <div className="pt-2 border-t border-slate-700">
                        <span className="font-bold text-emerald-400 block mb-1">Standard SQL Solution:</span>
                        <pre className="p-3 rounded-lg bg-slate-950 font-mono text-emerald-300 overflow-x-auto">
                          {activeQuestion.sqlSolution}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Follow-Up Question & Answer */}
              {activeQuestion.followUp && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowFollowUp(!showFollowUp)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 border border-purple-800/60 flex items-center space-x-2 transition"
                  >
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>{showFollowUp ? 'Hide Staff Follow-Up' : 'Staff Bar Raiser Follow-Up'}</span>
                  </button>

                  {showFollowUp && (
                    <div className="mt-3 p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-2 text-xs leading-relaxed animate-in fade-in">
                      <h4 className="font-bold text-purple-200">
                        Follow-Up Question: {activeQuestion.followUp.question}
                      </h4>
                      <p className="text-purple-300/90 whitespace-pre-wrap">
                        {activeQuestion.followUp.expectedAnswer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
