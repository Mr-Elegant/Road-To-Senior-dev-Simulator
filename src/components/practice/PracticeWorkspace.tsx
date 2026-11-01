'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Play,
  Send,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Terminal,
  Code2,
  Eye,
  Copy,
  Check,
  ShieldCheck,
  Info,
  BookOpen,
} from 'lucide-react';
import { PracticeProblem, CodeExecutionSuiteResult } from '@/types/practice';
import { runSandboxedCode } from '@/lib/execution/sandboxEngine';
import { SqlResultTable } from './SqlResultTable';
import { useTheme } from '../layout/ThemeProvider';
import { storage } from '@/lib/persistence/localStorageAdapter';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-zinc-950 text-zinc-400 font-mono text-xs">
      Loading Monaco Code Engine...
    </div>
  ),
});

interface PracticeWorkspaceProps {
  problem: PracticeProblem;
  onNextProblem?: () => void;
}

export function PracticeWorkspace({ problem, onNextProblem }: PracticeWorkspaceProps) {
  const { resolvedTheme } = useTheme();
  const [code, setCode] = useState(problem.starterCode);
  const [activeLeftTab, setActiveLeftTab] = useState<'desc' | 'hints' | 'solution'>('desc');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);

  // Execution states
  const [executionResult, setExecutionResult] = useState<CodeExecutionSuiteResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionMode, setExecutionMode] = useState<'run' | 'submit' | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset code when problem changes
  useEffect(() => {
    setCode(problem.starterCode);
    setExecutionResult(null);
    setHintsRevealed(0);
    setIsSolutionRevealed(false);
    setActiveLeftTab('desc');
  }, [problem.id]);

  // "Run Code" workflow: runs against first 2 sample test cases
  const handleRunCode = async () => {
    setIsExecuting(true);
    setExecutionMode('run');
    try {
      const sampleCases = problem.testCases.slice(0, 2);
      const res = await runSandboxedCode(
        problem.language,
        code,
        sampleCases,
        problem.sqlSetup
      );
      setExecutionResult(res);
    } catch (e: any) {
      console.error('Run code error', e);
    } finally {
      setIsExecuting(false);
    }
  };

  // "Submit Answer" workflow: runs against all test cases, awards score, persists attempt
  const handleSubmitAnswer = async () => {
    setIsExecuting(true);
    setExecutionMode('submit');
    try {
      const res = await runSandboxedCode(
        problem.language,
        code,
        problem.testCases,
        problem.sqlSetup
      );
      setExecutionResult(res);

      // Record attempt in local storage
      const scorePercentage = Math.round(
        (res.passedTests / Math.max(1, res.totalTests)) * 100
      );

      await storage.saveAttempt({
        id: `practice-${Date.now()}`,
        scenarioId: problem.id,
        timestamp: new Date().toISOString(),
        timeSpentSeconds: 300,
        hintsUsedCount: hintsRevealed,
        submittedCode: code,
        totalScorePercentage: scorePercentage,
        passedTestsCount: res.passedTests,
        totalTestsCount: res.totalTests,
        rubricScores: [],
        selfAssessmentCompleted: true,
      });

      if (scorePercentage === 100) {
        setIsSolutionRevealed(true);
      }
    } catch (e: any) {
      console.error('Submit answer error', e);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMonacoLanguage = () => {
    if (problem.language === 'typescript') return 'typescript';
    if (problem.language === 'sql') return 'sql';
    if (problem.language === 'python') return 'python';
    return 'javascript';
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-zinc-950 text-zinc-100 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
      {/* Left Pane: Problem Description, Constraints, Hints, Reference Solution */}
      <div className="w-full md:w-5/12 h-full flex flex-col overflow-hidden bg-zinc-900/60 flex-shrink-0">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-zinc-800 bg-zinc-900 px-4">
          <button
            onClick={() => setActiveLeftTab('desc')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeLeftTab === 'desc'
                ? 'border-blue-500 text-blue-400 bg-zinc-900/90'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Problem Description</span>
          </button>

          <button
            onClick={() => setActiveLeftTab('hints')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeLeftTab === 'hints'
                ? 'border-blue-500 text-blue-400 bg-zinc-900/90'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hints ({hintsRevealed}/{problem.hints.length})</span>
          </button>

          <button
            onClick={() => setActiveLeftTab('solution')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeLeftTab === 'solution'
                ? 'border-blue-500 text-blue-400 bg-zinc-900/90'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Reference Solution</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs sm:text-sm">
          {activeLeftTab === 'desc' && (
            <>
              {/* Problem Title & Category */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    {problem.language}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300">
                    {problem.difficulty}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {problem.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-zinc-100">
                  {problem.title}
                </h2>
              </div>

              {/* Description */}
              <div className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
                {problem.description}
              </div>

              {/* Sample Inputs and Outputs */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    Sample Input:
                  </div>
                  <div className="text-zinc-200">{problem.sampleInput}</div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    Expected Output:
                  </div>
                  <div className="text-emerald-400">{problem.sampleOutput}</div>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Constraints & Requirements
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SQL Schema Preview if applicable */}
              {problem.sqlSetup && problem.sqlSetup.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Preloaded Database Tables ({problem.sqlSetup.length})
                  </div>
                  {problem.sqlSetup.map((table) => (
                    <div key={table.tableName} className="p-3 rounded-xl border border-zinc-800 bg-black/60 font-mono text-[11px] text-zinc-300">
                      <div className="font-bold text-blue-400 mb-1">
                        Table: {table.tableName}
                      </div>
                      <div className="text-zinc-400 whitespace-pre overflow-x-auto text-[10px]">
                        {table.schemaSql.trim()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeLeftTab === 'hints' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-zinc-100">Progressive Guidance Hints</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Reveal hints one-by-one to guide your implementation.
                </p>
              </div>

              <div className="space-y-3">
                {problem.hints.slice(0, hintsRevealed).map((hint, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-zinc-200 leading-relaxed">
                    <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Hint {idx + 1}</span>
                    </div>
                    <div>{hint}</div>
                  </div>
                ))}
              </div>

              {hintsRevealed < problem.hints.length ? (
                <button
                  onClick={() => setHintsRevealed(hintsRevealed + 1)}
                  className="w-full py-2.5 px-4 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Reveal Hint {hintsRevealed + 1} of {problem.hints.length}</span>
                </button>
              ) : (
                <div className="text-center p-3 rounded-xl border border-zinc-800 text-xs text-zinc-500">
                  All hints for this problem have been revealed.
                </div>
              )}
            </div>
          )}

          {activeLeftTab === 'solution' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-zinc-100">Reference Benchmark</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Senior engineering model solution & complexity analysis
                  </p>
                </div>
                {!isSolutionRevealed && (
                  <button
                    onClick={() => setIsSolutionRevealed(true)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
                  >
                    Reveal Solution
                  </button>
                )}
              </div>

              {isSolutionRevealed ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-zinc-400">
                      {problem.referenceSolution.timeComplexity} • {problem.referenceSolution.spaceComplexity || 'O(1)'}
                    </span>
                    <button
                      onClick={() => handleCopyCode(problem.referenceSolution.code)}
                      className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-800 bg-black/70 font-mono text-xs overflow-x-auto text-zinc-200 whitespace-pre leading-relaxed">
                    {problem.referenceSolution.code}
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                    <strong className="text-zinc-100 block mb-1">Architectural Rationale:</strong>
                    {problem.referenceSolution.explanation}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 text-center space-y-3">
                  <Eye className="w-8 h-8 text-zinc-600 mx-auto" />
                  <div className="text-xs font-bold text-zinc-300">
                    Solution Guarded
                  </div>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Try solving the problem independently or submitting your code first. Revealing the solution will display the reference implementation.
                  </p>
                  <button
                    onClick={() => setIsSolutionRevealed(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
                  >
                    I Understand, Reveal Reference Solution
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Monaco Editor & Test Execution Results */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {/* Editor Toolbar */}
        <div className="border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono font-medium text-zinc-200">
              editor.{problem.language === 'sql' ? 'sql' : problem.language === 'typescript' ? 'ts' : 'js'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 font-bold flex items-center gap-1.5">
              <span>Monaco Editor</span>
              <span className="text-zinc-500">•</span>
              <span className="uppercase text-blue-400">{problem.language}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset Code */}
            <button
              onClick={() => {
                if (confirm('Reset editor to starter code?')) {
                  setCode(problem.starterCode);
                  setExecutionResult(null);
                }
              }}
              className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Reset Code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Run Code Button */}
            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="px-3.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current text-blue-400" />
              <span>{isExecuting && executionMode === 'run' ? 'Running...' : 'Run Code'}</span>
            </button>

            {/* Submit Answer Button */}
            <button
              onClick={handleSubmitAnswer}
              disabled={isExecuting}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isExecuting && executionMode === 'submit' ? 'Evaluating...' : 'Submit Answer'}</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 w-full relative min-h-[300px]">
          <MonacoEditor
            height="100%"
            language={getMonacoLanguage()}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: 'JetBrains Mono, Fira Code, Menlo, monospace',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'all',
            }}
          />
        </div>

        {/* Test Execution Results Pane */}
        <div className="h-64 border-t border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden flex-shrink-0">
          {/* Results Bar Header */}
          <div className="border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-200">
                Test Execution Results
              </span>
              {executionResult && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    executionResult.passedTests === executionResult.totalTests && executionResult.totalTests > 0
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {executionResult.passedTests} / {executionResult.totalTests} Passed
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Browser Sandbox</span>
            </div>
          </div>

          {/* Results Details */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-3">
            {!executionResult ? (
              <div className="h-full flex items-center justify-center text-center text-zinc-500 text-xs">
                <div>
                  <Terminal className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                  <p>Ready to execute.</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">
                    Click &quot;Run Code&quot; for sample tests or &quot;Submit Answer&quot; for full evaluation.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Status Notice */}
                {!executionResult.isConfigured ? (
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 font-sans space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Execution Service Unconfigured</span>
                    </div>
                    <div className="text-[11px] leading-relaxed text-zinc-300">
                      {executionResult.statusMessage}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-zinc-400 font-sans italic mb-1">
                    {executionResult.statusMessage}
                  </div>
                )}

                {/* Test Result Cards */}
                {executionResult.results.map((r, i) => (
                  <div
                    key={r.testId}
                    className={`p-3.5 rounded-xl border ${
                      r.passed
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-rose-500/30 bg-rose-500/5'
                    } space-y-2`}
                  >
                    <div className="flex items-center justify-between">
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
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{r.durationMs}ms</span>
                      </div>
                    </div>

                    {r.errorMessage && (
                      <div className="p-2 rounded bg-rose-950/40 border border-rose-900/60 text-rose-400 text-[11px]">
                        {r.errorMessage}
                      </div>
                    )}

                    {/* SQL Result Table if applicable */}
                    {r.tableData && (
                      <div className="pt-1">
                        <SqlResultTable data={r.tableData} />
                      </div>
                    )}

                    {/* Console logs */}
                    {r.logs.length > 0 && (
                      <div className="p-2 rounded bg-black/60 text-zinc-400 text-[11px] space-y-0.5">
                        <div className="text-zinc-500 text-[10px] uppercase font-bold">Logs:</div>
                        {r.logs.map((log, idx) => (
                          <div key={idx} className="text-zinc-300">&gt; {log}</div>
                        ))}
                      </div>
                    )}

                    {/* Expected vs Actual strings */}
                    {!r.tableData && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
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
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

