'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Timer,
  Trophy,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Flame,
  Award,
  Sparkles,
  Bot,
  BookOpen,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { allScenarios } from '@/data';
import { Scenario } from '@/types/scenario';
import { TierLevel } from '@/types/tier1';
import { TierSelector } from '@/components/interview/TierSelector';
import { Tier1PracticeView } from '@/components/interview/Tier1PracticeView';
import { Tier1MockInterviewView } from '@/components/interview/Tier1MockInterviewView';
import { AiInterviewerWorkspace } from '@/components/interview/AiInterviewerWorkspace';

interface InterviewTrack {
  id: string;
  title: string;
  targetRole: string;
  durationMinutes: number;
  description: string;
  scenarioIds: string[];
}

const TRACKS: InterviewTrack[] = [
  {
    id: 'senior-fullstack',
    title: 'Senior Full-Stack Engineer Loop',
    targetRole: 'Senior Software Engineer (L5 / Senior)',
    durationMinutes: 45,
    description:
      'Covers JavaScript event loop starvation, Next.js server/client boundaries, and PostgreSQL deadlock resolution.',
    scenarioIds: [
      'js-event-loop-microtasks',
      'nextjs-server-client-boundary',
      'db-deadlock-inventory-reservation',
    ],
  },
  {
    id: 'staff-architect',
    title: 'Staff Architect & System Design Loop',
    targetRole: 'Staff / Principal Engineer (L6 / Staff)',
    durationMinutes: 60,
    description:
      'High-scale multi-channel notification engine, monolith modernization, and distributed outbox checkout architecture.',
    scenarioIds: [
      'sysdesign-scalable-notification-engine',
      'sysdesign-idempotent-checkout-service',
      'interview-staff-architect-modernization',
    ],
  },
  {
    id: 'lead-incident',
    title: 'Lead SRE & Incident Response Loop',
    targetRole: 'Tech Lead / Production Operations',
    durationMinutes: 45,
    description:
      'Kubernetes container OOM memory leaks, secrets leak remediation, and blameless post-mortem facilitation.',
    scenarioIds: [
      'ops-production-memory-leak-debug',
      'ops-secrets-leak-incident',
      'interview-lead-incident-postmortem',
    ],
  },
];

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTierParam = searchParams.get('tier');
  const modeParam = searchParams.get('mode');

  // Difficulty Tier: Tier 1 (Beginner), Tier 2, Tier 3, Tier 4 (Senior)
  const [selectedTier, setSelectedTier] = useState<TierLevel>(
    initialTierParam === 'tier-1' || modeParam === 'beginner'
      ? 'tier-1'
      : initialTierParam === 'tier-2'
      ? 'tier-2'
      : initialTierParam === 'tier-3'
      ? 'tier-3'
      : initialTierParam === 'tier-4' || modeParam === 'senior_mock' || modeParam === 'timed'
      ? 'tier-4'
      : 'tier-1' // Default to Tier 1 Beginner to highlight new capability, with easy 1-click toggle to Tier 4!
  );

  // Tier 1 sub-modes: 'practice' (Q&A library + hints + code exercises) vs 'mock' (sequential test + instant feedback) vs 'gemini' (AI conversational)
  const [tier1Mode, setTier1Mode] = useState<'practice' | 'mock' | 'gemini'>(
    modeParam === 'mock' ? 'mock' : modeParam === 'ai' ? 'gemini' : 'practice'
  );

  // Tier 4 Senior Tabs: 'ai' vs 'tracks'
  const [seniorTab, setSeniorTab] = useState<'ai' | 'tracks'>(
    modeParam === 'ai' ? 'ai' : 'tracks'
  );

  const [selectedTrack, setSelectedTrack] = useState<InterviewTrack>(
    modeParam === 'senior_mock' ? TRACKS[1] : TRACKS[0]
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(45);

  const [activeSession, setActiveSession] = useState<{
    track: InterviewTrack;
    remainingSeconds: number;
    currentRoundIdx: number;
  } | null>(null);

  // Countdown timer for Tier 4 timed simulation
  useEffect(() => {
    if (!activeSession) return;

    const timer = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev) return null;
        if (prev.remainingSeconds <= 1) {
          clearInterval(timer);
          alert(
            'Mock Interview Time Expired! Please review your evaluations in your progress dashboard.'
          );
          return null;
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession]);

  const handleStartSession = () => {
    setActiveSession({
      track: selectedTrack,
      remainingSeconds: selectedDuration * 60,
      currentRoundIdx: 0,
    });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Global Tier Level Selector */}
      <TierSelector selectedTier={selectedTier} onSelectTier={setSelectedTier} />

      {/* 2. TIER 1: BEGINNER INTERVIEW TRACK */}
      {selectedTier === 'tier-1' && (
        <div className="space-y-6">
          {/* Tier 1 Mode Navigation Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Tier 1 Track
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                Beginner Full-Stack Interview Preparation
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                63 foundational questions spanning JavaScript, HTML/CSS, React, Redux Toolkit, TypeScript, and Node.js REST APIs.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setTier1Mode('practice')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  tier1Mode === 'practice'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practice Mode</span>
                <span className="text-[10px] opacity-80">(Explore & Hints)</span>
              </button>

              <button
                onClick={() => setTier1Mode('mock')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  tier1Mode === 'mock'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Mock Interview Mode</span>
                <span className="text-[10px] opacity-80">(Timed & Scored)</span>
              </button>

              <button
                onClick={() => setTier1Mode('gemini')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  tier1Mode === 'gemini'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                    : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini AI Mentor</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/20 text-white uppercase">
                  Live
                </span>
              </button>
            </div>
          </div>

          {/* Render Active Tier 1 View */}
          {tier1Mode === 'practice' && <Tier1PracticeView />}
          {tier1Mode === 'mock' && <Tier1MockInterviewView />}
          {tier1Mode === 'gemini' && <AiInterviewerWorkspace />}
        </div>
      )}

      {/* 3. TIER 2: INTERMEDIATE PLACEHOLDER / CURRICULUM */}
      {selectedTier === 'tier-2' && (
        <div className="p-8 rounded-2xl border border-sky-500/20 bg-sky-500/5 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 border border-sky-500/20">
                Tier 2: Intermediate Track
              </span>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                Mid-Level Full-Stack Engineering Track
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                Focuses on real-world mid-level engineering: component lifecycles, complex state synchronization, REST & GraphQL integration, PostgreSQL query planning, and asynchronous race handling.
              </p>
            </div>
            <Link
              href="/library?difficulty=Mid-Level"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <span>Explore Mid-Level Challenges</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-sky-500/10">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                React & State Management
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Custom hooks, stale closure mitigation, context optimization, and caching strategies.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                Backend & SQL Architecture
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Relational joins, index design, database deadlocks, and connection pooling.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                Interactive AI Practice
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Practice with Gemini AI Interviewer set to Mid-Level difficulty for conversational feedback.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TIER 3: ADVANCED PLACEHOLDER / CURRICULUM */}
      {selectedTier === 'tier-3' && (
        <div className="p-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                Tier 3: Advanced Track
              </span>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                Advanced Systems & Performance Architecture
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                Tackle high-throughput event queues, micro-frontend hydration mismatches, caching topology, and distributed trace observability.
              </p>
            </div>
            <Link
              href="/challenges/loan-management"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <span>Launch Enterprise Redux Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* 5. TIER 4: SENIOR / PRODUCTION-LEVEL TRACK (Existing 50 Scenarios & Loops) */}
      {selectedTier === 'tier-4' && (
        <div className="space-y-8">
          {/* Senior Mode Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <button
              onClick={() => setSeniorTab('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                seniorTab === 'ai'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                  : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Senior Interviewer (Gemini Live)</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/20 text-white uppercase">
                Adaptive
              </span>
            </button>

            <button
              onClick={() => setSeniorTab('tracks')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                seniorTab === 'tracks'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Senior Scenario Loops (3 Curated Loops)</span>
            </button>
          </div>

          {seniorTab === 'ai' ? (
            <AiInterviewerWorkspace />
          ) : activeSession ? (
            <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-zinc-950 to-zinc-900 p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400">
                    Live Timed Interview Simulation
                  </span>
                  <h2 className="text-xl font-bold text-zinc-100 mt-1">
                    {activeSession.track.title}
                  </h2>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-amber-400">
                    {formatTimer(activeSession.remainingSeconds)}
                  </div>
                  <div className="text-[11px] text-zinc-400">Time Remaining</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">
                  Interview Rounds ({activeSession.track.scenarioIds.length} Scenarios)
                </h3>
                <div className="space-y-3">
                  {activeSession.track.scenarioIds.map((scenId, idx) => {
                    const s = allScenarios.find((x) => x.id === scenId);
                    const isCurrent = activeSession.currentRoundIdx === idx;

                    return (
                      <div
                        key={scenId}
                        className={`p-4 rounded-xl border flex items-center justify-between ${
                          isCurrent
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-zinc-800 bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-zinc-800 font-mono text-xs flex items-center justify-center font-bold text-zinc-300">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-zinc-100">
                              {s?.title || scenId}
                            </div>
                            <div className="text-xs text-zinc-400 font-mono">
                              {s?.topic} • {s?.difficulty} • {s?.type}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/challenge/${scenId}`}
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <span>Open Round {idx + 1}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (confirm('End this mock interview session?')) {
                      setActiveSession(null);
                    }
                  }}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  Conclude Interview Early
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                  <Timer className="w-4 h-4" />
                  <span>Senior & Staff Mock Interview Simulator</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Select Your Senior Simulation Loop
                </h1>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                  Experience the pressure, pacing, and multi-round scope of an actual senior or staff engineering on-site loop.
                </p>
              </div>

              {/* Track Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {TRACKS.map((t) => {
                  const isSelected = selectedTrack.id === t.id;

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTrack(t)}
                      className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/15 ring-2 ring-blue-500/30'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {t.targetRole}
                        </span>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                          {t.title}
                        </h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                          {t.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <span className="font-mono text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {t.durationMinutes} mins
                        </span>
                        <span
                          className={`font-semibold ${
                            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Duration Tuning */}
              <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Configure Interview Constraints
                </h3>
                <div className="flex items-center gap-3">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setSelectedDuration(mins)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono border transition-colors ${
                        selectedDuration === mins
                          ? 'border-blue-500 bg-blue-600 text-white'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
                    Starting this mock interview starts a live countdown timer. You will solve scenarios sequentially and complete self-assessment rubrics at the end.
                  </div>

                  <button
                    onClick={handleStartSession}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Begin Timed Senior Interview</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-mono text-zinc-500">
          Loading interview simulator...
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
