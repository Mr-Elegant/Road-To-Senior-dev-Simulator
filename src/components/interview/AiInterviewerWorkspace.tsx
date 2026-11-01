'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import {
  Sparkles,
  Send,
  Lightbulb,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Layers,
  ChevronRight,
  RotateCcw,
  Bot,
  User,
  ShieldAlert,
  Flame,
  Check,
  Copy,
  Zap,
  Info,
} from 'lucide-react';
import {
  AiInterviewConfig,
  AiInterviewSession,
  ConversationTurn,
  AiInterviewAssessment,
  InterviewDifficulty,
} from '@/types/aiInterview';
import {
  getStoredAiSession,
  storeAiSession,
  clearStoredAiSession,
  archiveAiSessionToProgress,
} from '@/lib/persistence/aiSessionStorage';

const ROLES = [
  'Senior Full-Stack Engineer (L5)',
  'Staff Software Architect (L6)',
  'Tech Lead / Production Engineer',
  'Senior Backend & Distributed Systems',
];

const TECHNOLOGIES = [
  'Full-Stack (Next.js, TypeScript, PostgreSQL)',
  'Distributed Systems, Kafka & Microservices',
  'React 19, Concurrency & Performance',
  'Node.js, WebSockets & Async Runtimes',
  'High-Scale Database & Caching Architecture',
];

const DIFFICULTIES: InterviewDifficulty[] = ['Mid-Level', 'Senior', 'Staff/Principal'];

const DURATIONS = [
  { mins: 15, turns: 2, label: '15 Mins (Express: 2 Rounds)' },
  { mins: 30, turns: 3, label: '30 Mins (Standard: 3 Rounds)' },
  { mins: 45, turns: 4, label: '45 Mins (Deep Dive: 4 Rounds)' },
];

export function AiInterviewerWorkspace() {
  const { data: userSession, isPending } = authClient.useSession();
  if (isPending) return <p role="status" className="p-6 text-sm text-zinc-500">Checking your session…</p>;
  if (!userSession) return <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"><h2 className="text-lg font-semibold">Sign in for an AI interview</h2><p className="mt-2 text-sm text-zinc-500">Keep your interview history in your account. Beginner practice and timed challenge tracks remain available without an account.</p><Link href="/login?next=/interview?mode=ai" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Login to continue</Link></div>;
  return <AuthenticatedAiInterviewerWorkspace />;
}

function AuthenticatedAiInterviewerWorkspace() {
  const [session, setSession] = useState<AiInterviewSession | null>(null);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedTech, setSelectedTech] = useState(TECHNOLOGIES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<InterviewDifficulty>('Senior');
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1]);

  // Loading & Inflight states
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGeminiLive, setIsGeminiLive] = useState<boolean>(true);
  const [geminiModel, setGeminiModel] = useState<string>('gemini-2.0-flash');

  // Answer input state
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const historyEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Check Gemini server status and restore any ongoing session
  useEffect(() => {
    // Check API status
    fetch('/api/ai-interview')
      .then((res) => res.json())
      .then((data) => {
        setIsGeminiLive(Boolean(data.isGeminiConfigured));
        if (data.model) setGeminiModel(data.model);
      })
      .catch(() => {
        setIsGeminiLive(false);
      });

    // Restore existing session
    const saved = getStoredAiSession();
    if (saved && saved.status === 'active') {
      setSession(saved);
      setTimeRemainingSeconds(saved.config.durationMinutes * 60);
    }
  }, []);

  // 2. Timer Countdown
  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.status]);

  // Scroll to bottom of conversation
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.history.length, isLoading]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 3. Start New AI Interview
  const handleStartInterview = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setStatusText('Synthesizing original real-world interview scenario via Gemini...');

    const config: AiInterviewConfig = {
      role: selectedRole,
      technology: selectedTech,
      difficulty: selectedDifficulty,
      durationMinutes: selectedDuration.mins,
    };

    try {
      const res = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', config }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to start AI interview.');
      }

      setIsGeminiLive(data.isGeminiLive);
      if (data.modelUsed) setGeminiModel(data.modelUsed);

      const newSession: AiInterviewSession = {
        id: `ai-sess-${Date.now()}`,
        config,
        status: 'active',
        createdAt: new Date().toISOString(),
        currentTurn: 1,
        maxTurns: selectedDuration.turns,
        currentQuestion: data.question || 'Describe your system architecture.',
        history: [
          {
            id: `turn-init`,
            role: 'interviewer',
            content: data.question || '',
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setSession(newSession);
      setTimeRemainingSeconds(config.durationMinutes * 60);
      storeAiSession(newSession);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error initializing interview session.');
    } finally {
      setIsLoading(false);
      setStatusText(null);
    }
  };

  // 4. Submit Candidate Answer & Receive Contextual Follow-up
  const handleSubmitAnswer = async () => {
    if (!session || !candidateAnswer.trim() || isLoading) return;

    const answerText = candidateAnswer.trim();
    setCandidateAnswer('');
    setIsLoading(true);
    setErrorMsg(null);
    setStatusText('Evaluating technical reasoning & generating contextual follow-up...');

    const candidateTurn: ConversationTurn = {
      id: `turn-cand-${Date.now()}`,
      role: 'candidate',
      content: answerText,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...session.history, candidateTurn];

    try {
      const res = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          candidateAnswer: answerText,
          sessionState: {
            config: session.config,
            currentQuestion: session.currentQuestion,
            history: updatedHistory.map((h) => ({ role: h.role, content: h.content })),
            currentTurn: session.currentTurn,
            maxTurns: session.maxTurns,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to evaluate answer.');
      }

      setIsGeminiLive(data.isGeminiLive);

      // Attach feedback to candidate turn
      if (data.turnFeedback) {
        candidateTurn.feedback = data.turnFeedback;
      }

      // Check if this concluded the interview
      if (data.isCompleted || session.currentTurn >= session.maxTurns) {
        setStatusText('Finalizing comprehensive Hiring Committee Scorecard...');
        // Request final evaluation
        await handleConcludeInterview(updatedHistory);
      } else {
        const nextQuestion = data.question || 'How would you scale this solution?';
        const interviewerTurn: ConversationTurn = {
          id: `turn-ai-${Date.now()}`,
          role: 'interviewer',
          content: nextQuestion,
          timestamp: new Date().toISOString(),
        };

        const nextSession: AiInterviewSession = {
          ...session,
          currentTurn: session.currentTurn + 1,
          currentQuestion: nextQuestion,
          history: [...updatedHistory, interviewerTurn],
        };

        setSession(nextSession);
        storeAiSession(nextSession);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting response.');
    } finally {
      setIsLoading(false);
      setStatusText(null);
    }
  };

  // 5. Request a Progressive Guidance Hint
  const handleRequestHint = async () => {
    if (!session || isLoading) return;

    setIsLoading(true);
    setStatusText('Generating architectural guidance hint...');

    try {
      const res = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'hint',
          sessionState: {
            currentQuestion: session.currentQuestion,
            history: session.history.map((h) => ({ role: h.role, content: h.content })),
            currentTurn: session.currentTurn,
            maxTurns: session.maxTurns,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch hint.');
      }

      const hintTurn: ConversationTurn = {
        id: `hint-${Date.now()}`,
        role: 'hint',
        content: data.hint || 'Consider latency vs consistency trade-offs.',
        timestamp: new Date().toISOString(),
      };

      const updatedSession: AiInterviewSession = {
        ...session,
        history: [...session.history, hintTurn],
      };

      setSession(updatedSession);
      storeAiSession(updatedSession);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to retrieve hint.');
    } finally {
      setIsLoading(false);
      setStatusText(null);
    }
  };

  // 6. Conclude Interview & Generate Hiring Committee Scorecard
  const handleConcludeInterview = async (customHistory?: ConversationTurn[]) => {
    if (!session) return;

    setIsLoading(true);
    setStatusText('Hiring Committee Bar Raiser is synthesizing your final evaluation scorecard...');

    const historyToEvaluate = customHistory || session.history;

    try {
      const res = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate',
          sessionState: {
            config: session.config,
            currentQuestion: session.currentQuestion,
            history: historyToEvaluate.map((h) => ({ role: h.role, content: h.content })),
            currentTurn: session.currentTurn,
            maxTurns: session.maxTurns,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to produce assessment scorecard.');
      }

      const completedSession: AiInterviewSession = {
        ...session,
        status: 'completed',
        history: historyToEvaluate,
        finalAssessment: data.assessment,
      };

      setSession(completedSession);
      storeAiSession(completedSession);
      await archiveAiSessionToProgress(completedSession);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error generating final assessment.');
    } finally {
      setIsLoading(false);
      setStatusText(null);
    }
  };

  const handleResetSession = () => {
    if (confirm('Discard current AI interview session and return to configuration?')) {
      clearStoredAiSession();
      setSession(null);
      setCandidateAnswer('');
      setErrorMsg(null);
    }
  };

  const handleCopySummary = () => {
    if (!session?.finalAssessment) return;
    const a = session.finalAssessment;
    const text = `Full Stack Interview Lab — Hiring Committee Assessment
Target Role: ${session.config.role}
Domain: ${session.config.technology}
Difficulty: ${session.config.difficulty}
Overall Score: ${a.overallScore}% (${a.hiringVerdict})
Target Level: ${a.targetLevelAchieved}

Summary:
${a.executiveSummary}

Top Strengths:
${a.topStrengths.map((s) => `• ${s}`).join('\n')}

Critical Weaknesses:
${a.criticalWeaknesses.map((w) => `• ${w}`).join('\n')}

Actionable Roadmap:
${a.actionableRoadmap.map((r) => `• ${r}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // =========================================================================
  // VIEW 1: INTERVIEW CONFIGURATION / SETUP SCREEN
  // =========================================================================
  if (!session) {
    return (
      <div className="space-y-8">
        {/* API Status Banner */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isGeminiLive ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {isGeminiLive ? 'Google Gemini Developer API Active' : 'Offline Simulation Mode Active'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isGeminiLive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                }`}>
                  {isGeminiLive ? geminiModel : 'Offline Simulator'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isGeminiLive
                  ? `Connected to ${geminiModel} with server-side rate protection.`
                  : 'Add GEMINI_API_KEY to .env.local for live Gemini generation. High-fidelity built-in simulator is ready.'}
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Role */}
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              1. Target Engineering Role
            </label>
            <div className="space-y-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedRole === role
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30 shadow-xs'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Technology Specialization */}
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              2. Technology Domain & Specialization
            </label>
            <div className="space-y-2">
              {TECHNOLOGIES.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedTech === tech
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30 shadow-xs'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              3. Hiring Bar Seniority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    selectedDifficulty === diff
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30 shadow-xs'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Session Duration & Turns */}
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              4. Pacing & Depth (Turn Limit)
            </label>
            <div className="space-y-2">
              {DURATIONS.map((dur) => (
                <button
                  key={dur.mins}
                  onClick={() => setSelectedDuration(dur)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedDuration.mins === dur.mins
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30 shadow-xs'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button Banner */}
        <div className="p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/20 via-zinc-900 to-indigo-950/30 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Ready to start your adaptive AI interview session</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Gemini will synthesize a unique production scenario, listen to your answers, and challenge your architectural choices in real time.
            </p>
          </div>

          <button
            onClick={handleStartInterview}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Scenario...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Start AI Interview Session</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FINAL COMPREHENSIVE SCORECARD
  // =========================================================================
  if (session.status === 'completed' && session.finalAssessment) {
    const a = session.finalAssessment;
    const verdictColors: Record<string, string> = {
      'Strong Hire': 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      Hire: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
      'Leaning Hire': 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
      'Leaning No Hire': 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      'No Hire': 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    };

    return (
      <div className="space-y-6">
        {/* Top Assessment Banner */}
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-zinc-950 to-zinc-900 p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-5 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  AI-Generated Evaluation (Google Gemini Developer API)
                </span>
                <span className="text-xs text-zinc-400">
                  {session.config.role} • {session.config.difficulty}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-100 mt-2">
                Hiring Committee Evaluation Scorecard
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <div className="text-3xl font-extrabold font-mono text-blue-400">
                  {a.overallScore}%
                </div>
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Overall Score</div>
              </div>

              <div className={`px-4 py-2.5 rounded-xl border font-bold text-sm ${verdictColors[a.hiringVerdict] || verdictColors['Hire']}`}>
                {a.hiringVerdict}
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-black/40 text-xs text-zinc-300 leading-relaxed">
            <span className="font-bold text-zinc-100 mr-2">Executive Summary:</span>
            {a.executiveSummary}
          </div>

          {/* Competency Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(a.competencyBreakdown).map(([key, item]) => {
              const labels: Record<string, string> = {
                systemArchitecture: 'System Architecture',
                correctnessAndEdgeCases: 'Correctness & Edges',
                productionReadiness: 'Production Readiness',
                tradeoffAnalysis: 'Trade-off Analysis',
              };

              return (
                <div key={key} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">{labels[key] || key}</span>
                    <span className="text-xs font-mono font-bold text-blue-400">{item.score}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight">{item.comment}</p>
                </div>
              );
            })}
          </div>

          {/* Strengths & Weaknesses Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-zinc-300">
                {a.topStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Critical Areas for Growth</span>
              </h4>
              <ul className="space-y-2 text-xs text-zinc-300">
                {a.criticalWeaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Recommended Study & Practice Roadmap</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {a.actionableRoadmap.map((road, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 leading-relaxed">
                  <span className="font-bold text-purple-400 block mb-1">Step {idx + 1}</span>
                  {road}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-zinc-800 pt-5 flex-wrap gap-3">
            <p className="text-[11px] text-zinc-500 max-w-md italic">{a.disclaimer}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied Scorecard' : 'Copy Scorecard'}</span>
              </button>

              <button
                onClick={handleResetSession}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Another AI Interview</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: ACTIVE CONVERSATIONAL INTERVIEW SESSION
  // =========================================================================
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col h-[750px] shadow-2xl overflow-hidden">
      {/* Session Top Status Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/90 px-6 py-3.5 flex items-center justify-between flex-wrap gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-100">
                AI Interviewer ({session.config.role})
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
                Round {session.currentTurn} of {session.maxTurns}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {session.config.technology} • {session.config.difficulty}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Active Countdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-mono font-bold text-amber-400">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>

          {/* Conclude Early Button */}
          <button
            onClick={() => handleConcludeInterview()}
            disabled={isLoading || session.history.length <= 1}
            className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold transition-colors disabled:opacity-40"
          >
            End & Generate Scorecard
          </button>

          {/* Reset Session */}
          <button
            onClick={handleResetSession}
            className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Reset Interview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-zinc-950/70">
        {session.history.map((turn, idx) => {
          if (turn.role === 'interviewer') {
            return (
              <div key={turn.id || idx} className="flex items-start gap-3.5 max-w-3xl">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-2 whitespace-pre-wrap">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                    Staff Hiring Bar Interviewer
                  </div>
                  <div>{turn.content}</div>
                </div>
              </div>
            );
          }

          if (turn.role === 'hint') {
            return (
              <div key={turn.id || idx} className="flex items-start gap-3.5 max-w-2xl ml-6">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                  <span className="font-bold text-amber-400 block mb-0.5">Architectural Guidance Hint:</span>
                  {turn.content}
                </div>
              </div>
            );
          }

          // Candidate response
          return (
            <div key={turn.id || idx} className="flex flex-col items-end gap-2 max-w-3xl ml-auto">
              <div className="flex items-start gap-3.5 flex-row-reverse">
                <div className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center text-zinc-200 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-xs sm:text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 mb-1">
                    Your Response
                  </div>
                  <div>{turn.content}</div>
                </div>
              </div>

              {/* Turn Evaluative Feedback */}
              {turn.feedback && (
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/80 text-[11px] text-zinc-300 max-w-xl space-y-1.5 mr-10 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                    <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">
                      Interviewer Assessment
                    </span>
                    <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-zinc-800 text-zinc-200">
                      Score: {turn.feedback.scoreOutOf10}/10 ({turn.feedback.technicalCorrectness})
                    </span>
                  </div>

                  {turn.feedback.strengths.length > 0 && (
                    <div className="text-emerald-400">
                      <span className="font-semibold text-emerald-500 mr-1">Strengths:</span>
                      {turn.feedback.strengths.join('; ')}
                    </div>
                  )}

                  {turn.feedback.gapsOrMisconceptions.length > 0 && (
                    <div className="text-amber-400">
                      <span className="font-semibold text-amber-500 mr-1">Gaps / Risks:</span>
                      {turn.feedback.gapsOrMisconceptions.join('; ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3.5 max-w-md">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              <span>{statusText || 'Interviewer is thinking...'}</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={historyEndRef} />
      </div>

      {/* Candidate Response Workspace Footer */}
      <div className="border-t border-zinc-800 bg-zinc-900/90 p-4 space-y-3 flex-shrink-0">
        <div className="relative">
          <textarea
            rows={3}
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmitAnswer();
              }
            }}
            placeholder="Structure your architectural response: identify trade-offs, explain component interactions, and address edge cases..."
            disabled={isLoading}
            className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none font-sans leading-relaxed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            <span>Words: {candidateAnswer.trim().split(/\s+/).filter(Boolean).length}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Press Ctrl + Enter to submit</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Request Hint */}
            <button
              onClick={handleRequestHint}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Request Hint</span>
            </button>

            {/* Submit Answer */}
            <button
              onClick={handleSubmitAnswer}
              disabled={isLoading || !candidateAnswer.trim()}
              className="px-5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Answer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

