'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  AlertCircle,
  CheckSquare,
  Shield,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Info,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Scenario } from '@/types/scenario';
import { NextjsVersionPanel } from '@/components/nextjsPractice/NextjsVersionPanel';

interface ProblemStatementPanelProps {
  scenario: Scenario;
  hintsRevealed: number;
  onRevealNextHint: () => void;
  isHintsDrawerOpen: boolean;
  onToggleHintsDrawer: () => void;
}

export function ProblemStatementPanel({
  scenario,
  hintsRevealed,
  onRevealNextHint,
  isHintsDrawerOpen,
  onToggleHintsDrawer,
}: ProblemStatementPanelProps) {
  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'tasks'>('problem');

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4">
        <button
          onClick={() => setActiveTab('problem')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'problem'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Context & Specification</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'tasks'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Candidate Tasks ({scenario.candidateTasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hints')}
          className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'hints'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>
            Hints ({hintsRevealed}/{scenario.hints.length})
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'problem' && (
          <>
            {scenario.nextjsPractice && <NextjsVersionPanel info={scenario.nextjsPractice}/>}
            {/* Live Interactive Application Banner for Enterprise Loan Management */}
            {scenario.id === 'enterprise-loan-management' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-zinc-900 border border-blue-500/40 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Interactive Full Dashboard Available</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Enterprise Loan Management Dashboard (React & Redux Toolkit)
                </h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  Experience the complete running application with live Redux Toolkit state, simulated latency, 8 interactive bug scenarios, and senior oral defense mode.
                </p>
                <Link
                  href="/challenges/loan-management"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>Launch Live Loan Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Business Context */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>Production Business Context</span>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {scenario.businessContext}
              </div>
            </div>

            {/* Problem Statement */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Problem Statement</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {scenario.problemStatement}
              </p>
            </div>

            {/* Constraints */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Engineering Constraints</span>
              </div>
              <ul className="space-y-2">
                {scenario.constraints.map((constraint, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Test cases preview if applicable */}
            {scenario.testCases && scenario.testCases.length > 0 && (
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                  Deterministic Verification Cases ({scenario.testCases.length})
                </div>
                <div className="space-y-2">
                  {scenario.testCases.map((tc, idx) => (
                    <div
                      key={tc.id}
                      className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950 text-xs"
                    >
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                        Case {idx + 1}: {tc.name}
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                        Expected: <code className="font-mono text-zinc-800 dark:text-zinc-200">{tc.expectedOutput}</code>
                      </div>
                      {tc.explanation && (
                        <div className="text-zinc-400 text-[11px] mt-1 italic">
                          {tc.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'tasks' && (
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Candidate Deliverables & Assessment Tasks
            </div>
            <div className="space-y-3">
              {scenario.candidateTasks.map((task, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Progressive Guidance Hints
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Reveal hints sequentially if you are stuck. Each revealed hint slightly adjusts your final readiness benchmark.
              </p>
            </div>

            {/* Revealed Hints */}
            <div className="space-y-3">
              {scenario.hints.slice(0, hintsRevealed).map((hint, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed"
                >
                  <div className="font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Hint {idx + 1}</span>
                  </div>
                  <div>{hint}</div>
                </div>
              ))}
            </div>

            {/* Next hint button */}
            {hintsRevealed < scenario.hints.length ? (
              <button
                onClick={onRevealNextHint}
                className="w-full py-2.5 px-4 rounded-xl border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>
                  Reveal Hint {hintsRevealed + 1} of {scenario.hints.length}
                </span>
              </button>
            ) : (
              <div className="text-center p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                All hints for this scenario have been revealed.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

