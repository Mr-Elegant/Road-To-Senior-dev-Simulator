'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Play,
  X,
} from 'lucide-react';
import { RunSuiteResult } from '@/lib/evaluation/safeCodeRunner';

interface TestRunnerPaneProps {
  testSuiteResult: RunSuiteResult | null;
  isRunning: boolean;
  onRunAgain: () => void;
  onClose: () => void;
  language?: string;
}

export function TestRunnerPane({
  testSuiteResult,
  isRunning,
  onRunAgain,
  onClose,
  language = 'javascript',
}: TestRunnerPaneProps) {
  const [activeTab, setActiveTab] = useState<'tests' | 'logs'>('tests');
  const closeButton = (
    <button type="button" onClick={onClose} aria-label="Close test results" title="Close test results"
      className="shrink-0 rounded p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
      <X className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  if (isRunning) {
    return (
      <div className="h-full min-h-0 flex flex-col bg-zinc-950 text-center border-t border-zinc-800">
        <div className="flex justify-end px-2 py-1">{closeButton}</div>
        <div role="status" className="min-h-0 flex-1 overflow-auto p-3 space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-mono text-zinc-300">
            Running sandboxed test suite...
          </div>
          <div className="text-[11px] text-zinc-500">
            Evaluating execution bounds, intercepts, and edge cases.
          </div>
        </div>
      </div>
    );
  }

  if (!testSuiteResult) {
    return (
      <div className="h-full min-h-0 flex flex-col bg-zinc-950 text-center text-zinc-500 border-t border-zinc-800">
        <div className="flex justify-end px-2 py-1">{closeButton}</div>
        <div className="min-h-0 flex-1 overflow-auto p-3 space-y-3">
          <Terminal className="w-8 h-8 mx-auto text-zinc-600" />
          <div className="text-xs font-semibold text-zinc-400">
            Test Runner Ready
          </div>
          <p className="text-[11px] leading-relaxed">
            Click &quot;Run Tests&quot; to execute your solution against deterministic verification cases in an isolated browser sandbox.
          </p>
          <button
            onClick={onRunAgain}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run All Tests</span>
          </button>
        </div>
      </div>
    );
  }

  const allPassed =
    testSuiteResult.passedTests === testSuiteResult.totalTests &&
    testSuiteResult.totalTests > 0;

  // Aggregate logs across all tests
  const allLogs = testSuiteResult.results.flatMap((r) =>
    r.logs.map((l) => `[${r.name}] ${l}`)
  );

  return (
    <div className="h-full min-h-0 flex flex-col bg-zinc-950 border-t border-zinc-800 overflow-hidden">
      {/* Header Bar */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/90 px-3 py-2">
        <div className="min-w-0 flex flex-wrap items-center gap-2">
          {allPassed ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {testSuiteResult.passedTests} / {testSuiteResult.totalTests} Tests Passed
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <XCircle className="w-4 h-4" />
              <span>
                {testSuiteResult.passedTests} / {testSuiteResult.totalTests} Tests Passed
              </span>
            </div>
          )}

          <div className="h-3 w-px bg-zinc-700" />

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'tests'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Test Cases ({testSuiteResult.results.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Console Logs ({allLogs.length})
            </button>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Client Sandbox
          </span>

          <button
            onClick={onRunAgain}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Re-run</span>
          </button>
          {closeButton}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        {activeTab === 'tests' && (
          <>
            {!testSuiteResult.isSupported && (
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-start gap-2 text-xs font-sans">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Notice on Language Support:</div>
                  <div className="text-[11px] mt-0.5">{testSuiteResult.message}</div>
                </div>
              </div>
            )}

            {testSuiteResult.results.map((r, i) => (
              <div
                key={r.testId}
                className={`p-3.5 rounded-xl border ${
                  r.passed
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/30 bg-rose-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-semibold">
                    {r.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="text-zinc-200">
                      Case {i + 1}: {r.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock className="w-3 h-3" />
                    <span>{r.durationMs}ms</span>
                  </div>
                </div>

                {r.errorMessage && (
                  <div className="text-rose-400 text-[11px] mb-2 p-2 rounded bg-rose-950/40 border border-rose-900/50">
                    {r.errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
                  <div>
                    <span className="text-zinc-500">Expected: </span>
                    <span className="text-zinc-300">{r.expectedOutput}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Actual: </span>
                    <span className={r.passed ? 'text-emerald-400' : 'text-rose-400'}>
                      {r.actualOutput}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'logs' && (
          <div className="p-3 rounded-xl border border-zinc-800 bg-black/60 font-mono text-[11px] min-h-[120px] text-zinc-300 space-y-1">
            {allLogs.length === 0 ? (
              <div className="text-zinc-500 italic">No console logs intercepted.</div>
            ) : (
              allLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-zinc-500 select-none">&gt; </span>
                  {log}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

