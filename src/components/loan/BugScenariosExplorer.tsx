'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { selectActiveBugScenarioId, selectActiveBugScenario } from '@/lib/redux/selectors';
import { setActiveBugScenarioId } from '@/lib/redux/slices/uiSlice';
import { loanBugScenarios } from '@/data/loanBugScenarios';
import { Bug, X, CheckCircle, AlertTriangle, Code2, ChevronRight, BookOpen } from 'lucide-react';

export function BugScenariosExplorer() {
  const dispatch = useAppDispatch();
  const activeBugId = useAppSelector(selectActiveBugScenarioId);
  const activeBug = useAppSelector(selectActiveBugScenario);

  if (!activeBugId) return null;

  return (
    <div className="bg-zinc-950/95 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Interactive Engineering Lab
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-400">8 Production Bug Scenarios</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Production Incident & Concurrency Deep Dives
            </h3>
          </div>
        </div>

        <button
          onClick={() => dispatch(setActiveBugScenarioId(null))}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Close Bug Scenarios Explorer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Grid: Tabs on Left, Active Bug Analysis on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left column: 8 Bug Tabs */}
        <div className="lg:col-span-4 flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
          {loanBugScenarios.map((bug) => {
            const isSelected = bug.id === activeBugId;
            return (
              <button
                key={bug.id}
                onClick={() => dispatch(setActiveBugScenarioId(bug.id))}
                className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-md'
                    : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      BUG #{bug.number}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                      {bug.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold leading-snug line-clamp-2">
                    {bug.title}
                  </h4>
                </div>
                <ChevronRight
                  className={`w-4 h-4 mt-1 flex-shrink-0 transition-transform ${
                    isSelected ? 'text-amber-400 translate-x-0.5' : 'text-zinc-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right column: Deep Root Cause & Code Solution */}
        <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 flex flex-col justify-between max-h-[560px] overflow-y-auto">
          {activeBug ? (
            <div className="space-y-5 text-xs">
              {/* Scenario Title & Category */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Scenario {activeBug.number}: {activeBug.category}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white">{activeBug.title}</h2>
                <p className="text-zinc-300 mt-2 leading-relaxed">{activeBug.description}</p>
              </div>

              {/* Symptom in Production */}
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200/90">
                <div className="flex items-center gap-2 font-bold text-red-400 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Observed Production Symptom</span>
                </div>
                <p className="leading-relaxed">{activeBug.productionSymptom}</p>
              </div>

              {/* Root Cause Analysis */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-300">
                <div className="flex items-center gap-2 font-bold text-blue-400 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Technical Root Cause</span>
                </div>
                <p className="leading-relaxed">{activeBug.rootCause}</p>
              </div>

              {/* Senior Fix Explanation */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200/90">
                <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Senior Engineering Solution</span>
                </div>
                <p className="leading-relaxed whitespace-pre-line">{activeBug.solutionExplanation}</p>
              </div>

              {/* Code Comparison */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-zinc-400" />
                  <span>Code Implementation Comparison</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Buggy */}
                  <div className="rounded-xl border border-red-500/30 bg-zinc-950/90 overflow-hidden">
                    <div className="px-3 py-1.5 bg-red-950/40 border-b border-red-500/20 text-[11px] font-bold text-red-400">
                      ❌ Vulnerable / Buggy Pattern
                    </div>
                    <pre className="p-3 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
                      <code>{activeBug.buggyCodeSnippet}</code>
                    </pre>
                  </div>

                  {/* Fixed */}
                  <div className="rounded-xl border border-emerald-500/30 bg-zinc-950/90 overflow-hidden">
                    <div className="px-3 py-1.5 bg-emerald-950/40 border-b border-emerald-500/20 text-[11px] font-bold text-emerald-400">
                      ✅ Senior Production-Grade Fix
                    </div>
                    <pre className="p-3 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
                      <code>{activeBug.fixedCodeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500">
              Select a bug scenario from the left to inspect its root-cause analysis and fix.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

