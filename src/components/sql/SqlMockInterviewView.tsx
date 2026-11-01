'use client';

import { requestSqlEvaluation } from '@/lib/evaluation/sqlClientEvaluation';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  SqlQuestion,
  SqlTierLevel,
  SqlTrackProgressData,
  SqlAttempt
} from '@/types/sqlTrack';
import { getSqlQuestionsByTier } from '@/data/sql';
import { evaluateExecutableSql } from '@/lib/evaluation/sqlEvaluator';
import { storage } from '@/lib/persistence/localStorageAdapter';
import {
  Timer,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Database,
  BarChart2,
  FileCheck2,
  ArrowRight
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface SqlMockInterviewViewProps {
  initialTier?: SqlTierLevel;
  progress?: SqlTrackProgressData;
  onProgressUpdate?: (updated: SqlTrackProgressData) => void;
}

export function SqlMockInterviewView({
  initialTier = 'tier-2',
  progress,
  onProgressUpdate
}: SqlMockInterviewViewProps) {
  const [tier, setTier] = useState<SqlTierLevel>(initialTier);
  const [questionCount, setQuestionCount] = useState<number>(4);
  const [timePerQuestionMinutes, setTimePerQuestionMinutes] = useState<number>(6);

  // Active session state
  const [isActive, setIsActive] = useState<boolean>(false);
  const [questions, setQuestions] = useState<SqlQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [candidateSql, setCandidateSql] = useState<string>('');
  const [candidateExplanation, setCandidateExplanation] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isSubmittingTurn, setIsSubmittingTurn] = useState<boolean>(false);

  // Accumulated turns results
  const [sessionResults, setSessionResults] = useState<{
    question: SqlQuestion;
    candidateSql: string;
    candidateExplanation: string;
    score: number;
    passed: boolean;
    feedback: string;
  }[]>([]);

  // Final summary state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Timer tick
  useEffect(() => {
    if (!isActive || isCompleted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handleNextQuestion(true); // Auto-advance on time expiration
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, isCompleted, currentIndex, candidateSql, candidateExplanation]);

  const handleStartInterview = () => {
    const tierPool = getSqlQuestionsByTier(tier);
    // Shuffle and pick questionCount
    const shuffled = [...tierPool].sort(() => 0.5 - Math.random()).slice(0, questionCount);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSessionResults([]);
    setIsCompleted(false);
    setIsActive(true);

    if (shuffled.length > 0) {
      setCandidateSql(shuffled[0].starterCode || '');
      setCandidateExplanation('');
      setSecondsRemaining(timePerQuestionMinutes * 60);
    }
  };

  const handleNextQuestion = async (isTimeOut: boolean = false) => {
    if (currentIndex >= questions.length) return;
    setIsSubmittingTurn(true);

    const currentQ = questions[currentIndex];
    let score = 50;
    let passed = false;
    let feedback = '';

    try {
      if (currentQ.questionType === 'executable' && candidateSql.trim()) {
        const execRes = await evaluateExecutableSql(candidateSql, currentQ);
        score = execRes.score;
        passed = execRes.allPassed;
        feedback = `Automated tests: ${execRes.allPassed ? 'Passed 100%' : 'Partial/Failed'}`;
      } else {
        // Evaluate with API
        const evalData = await requestSqlEvaluation(currentQ, { candidateAnswer: candidateExplanation, candidateSql });
        score = evalData.scoreOutOf100 ?? 60;
        passed = evalData.passed ?? (score >= 70);
        feedback = evalData.feedback?.technicalCorrectness || 'Evaluation recorded.';
      }
    } catch {
      score = isTimeOut ? 30 : 65;
      passed = score >= 70;
      feedback = isTimeOut ? 'Time limit expired.' : 'Evaluation recorded.';
    }

    const updatedResults = [
      ...sessionResults,
      {
        question: currentQ,
        candidateSql,
        candidateExplanation,
        score,
        passed,
        feedback
      }
    ];
    setSessionResults(updatedResults);

    // Record individual attempt to storage
    const attempt: SqlAttempt = {
      id: `att_mock_${Date.now()}_${currentIndex}`,
      questionId: currentQ.id,
      tier: currentQ.tier,
      timestamp: new Date().toISOString(),
      mode: 'mock',
      candidateSql,
      candidateAnswer: candidateExplanation,
      scoreOutOf100: score,
      passed,
      feedback: {
        technicalCorrectness: feedback,
        strengths: ['Mock interview completion'],
        improvements: []
      },
      timeSpentSeconds: timePerQuestionMinutes * 60 - secondsRemaining
    };
    await storage.saveSqlAttempt(attempt);

    // Check if finished
    if (currentIndex + 1 >= questions.length) {
      setIsCompleted(true);
      setIsActive(false);
      setIsSubmittingTurn(false);
      const updated = await storage.getSqlProgress();
      if (onProgressUpdate) onProgressUpdate(updated);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setCandidateSql(questions[nextIdx].starterCode || '');
      setCandidateExplanation('');
      setSecondsRemaining(timePerQuestionMinutes * 60);
      setIsSubmittingTurn(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Scorecard calculations
  const totalScore = sessionResults.length > 0
    ? Math.round(sessionResults.reduce((acc, r) => acc + r.score, 0) / sessionResults.length)
    : 0;

  const getVerdict = (score: number) => {
    if (score >= 88) return { label: 'Strong Hire', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500' };
    if (score >= 75) return { label: 'Hire', color: 'text-blue-400 bg-blue-950/60 border-blue-500' };
    if (score >= 60) return { label: 'Lean Hire', color: 'text-amber-400 bg-amber-950/60 border-amber-500' };
    return { label: 'No Hire', color: 'text-rose-400 bg-rose-950/60 border-rose-500' };
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {!isActive && !isCompleted && (
        /* Configuration Screen */
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-xl">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-1">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              SQL & PostgreSQL Technical Mock Interview
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Simulate a high-caliber database engineering interview. Questions are delivered one at a time under strict timer constraints and evaluated with automated test cases and AI Bar Raiser scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* Tier Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Target Difficulty Tier:
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as SqlTierLevel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="tier-1">Tier 1: Beginner SQL</option>
                <option value="tier-2">Tier 2: Intermediate SQL</option>
                <option value="tier-3">Tier 3: Advanced PostgreSQL</option>
                <option value="tier-4">Tier 4: Senior SRE & Production</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Number of Questions:
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={3}>3 Questions (Express - 15m)</option>
                <option value={4}>4 Questions (Standard - 25m)</option>
                <option value={6}>6 Questions (In-Depth - 35m)</option>
              </select>
            </div>

            {/* Time per Question */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Time Per Question:
              </label>
              <select
                value={timePerQuestionMinutes}
                onChange={(e) => setTimePerQuestionMinutes(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={4}>4 Minutes (Fast-Paced)</option>
                <option value={6}>6 Minutes (Standard)</option>
                <option value={8}>8 Minutes (Deliberate)</option>
              </select>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleStartInterview}
              className="px-8 py-3.5 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all inline-flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Mock Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Question Interview Screen */}
      {isActive && currentQ && (
        <div className="space-y-6">
          {/* Header Bar: Question Progress & Timer */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-900/60 text-blue-300 border border-blue-700">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {currentQ.category}
              </span>
            </div>

            {/* Countdown Timer */}
            <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border font-mono text-sm font-bold ${
              secondsRemaining < 60
                ? 'bg-rose-950/60 border-rose-700 text-rose-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-cyan-300'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white leading-tight">
              {currentQ.title}
            </h3>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200">
              <span className="font-bold text-blue-400 block mb-1">Scenario:</span>
              {currentQ.realWorldScenario}
            </div>

            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Statement:
              </span>
              <p className="text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
                {currentQ.questionStatement}
              </p>
            </div>
          </div>

          {/* Solution Editor or Input */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            {currentQ.questionType === 'executable' ? (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Write Your SQL Solution:
                </span>
                <div className="h-56 rounded-lg overflow-hidden border border-slate-700">
                  <MonacoEditor
                    height="100%"
                    language="sql"
                    theme="vs-dark"
                    value={candidateSql}
                    onChange={(v) => setCandidateSql(v || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Technical Explanation & Production Considerations:
              </span>
              <textarea
                rows={5}
                value={candidateExplanation}
                onChange={(e) => setCandidateExplanation(e.target.value)}
                placeholder="Detail your architectural reasoning, physical page mechanics, or trade-offs..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Turn Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleNextQuestion(false)}
                disabled={isSubmittingTurn}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50 transition"
              >
                <span>{isSubmittingTurn ? 'Evaluating...' : currentIndex + 1 === questions.length ? 'Submit Final Turn' : 'Submit & Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Scorecard */}
      {isCompleted && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-2xl">
          <div className="text-center max-w-lg mx-auto space-y-4">
            <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white">Mock Interview Complete</h2>
            <p className="text-xs text-slate-400">
              Your performance has been evaluated against Staff-level database engineering rubrics.
            </p>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-around">
              <div>
                <span className="text-xs text-slate-400 block">Overall Score</span>
                <span className="text-3xl font-extrabold text-white font-mono">{totalScore}/100</span>
              </div>
              <div className="h-10 w-px bg-slate-700" />
              <div>
                <span className="text-xs text-slate-400 block mb-1">Hiring Verdict</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getVerdict(totalScore).color}`}>
                  {getVerdict(totalScore).label}
                </span>
              </div>
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Turn-by-Turn Assessment Breakdown:
            </h4>
            <div className="space-y-2">
              {sessionResults.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-slate-400">Q{idx + 1}:</span>
                      <span className="text-sm font-semibold text-white">{res.question.title}</span>
                    </div>
                    <p className="text-xs text-slate-300">{res.feedback}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-mono font-bold text-cyan-300 block">
                      {res.score}/100
                    </span>
                    <span className={`text-[10px] font-bold ${res.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {res.passed ? 'PASSED' : 'NEEDS WORK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => {
                setIsCompleted(false);
                setIsActive(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center space-x-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake or Practice Another Tier</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

