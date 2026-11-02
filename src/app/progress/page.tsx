'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Bookmark,
  AlertTriangle,
  Flame,
  FileJson,
  ArrowRight,
} from 'lucide-react';
import { allScenarios, scenarioMap } from '@/data';
import { TIER1_CATEGORIES, tier1QuestionMap } from '@/data/tier1';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { UserProgressData } from '@/types/userProgress';
import { calculateReadinessReport } from '@/lib/evaluation/readinessCalculator';
import { formatDuration } from '@/lib/utils';
import { loanLabAttemptInfo } from '@/lib/loanLab/attempts';

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [importJson, setImportJson] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    const data = await storage.getProgress();
    setProgress(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const report = useMemo(() => {
    return calculateReadinessReport(
      allScenarios,
      progress || {
        attempts: [],
        bookmarkedScenarioIds: [],
        streakDays: 1,
        lastActiveDate: '',
        customNotes: {},
      }
    );
  }, [progress]);

  const handleExport = async () => {
    const jsonStr = await storage.exportProgressJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-lab-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ text: 'Progress exported successfully!', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = async () => {
    if (!importJson.trim()) return;
    const ok = await storage.importProgressJson(importJson);
    if (ok) {
      await loadData();
      setIsImporting(false);
      setImportJson('');
      setMessage({ text: 'Progress data imported successfully!', type: 'success' });
    } else {
      setMessage({ text: 'Invalid JSON format or corrupted progress data.', type: 'error' });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all attempt logs and bookmarks? This cannot be undone.')) {
      await storage.resetProgress();
      await loadData();
      setMessage({ text: 'Progress reset to initial state.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const attempts = progress?.attempts || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header and Import/Export Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Progress Analytics & Performance History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Engineering Skill Benchmarking
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Detailed tracking of all scenario attempts, rubric scoring distributions, time investments, and weak areas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setIsImporting(!isImporting)}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Reset Progress"
            aria-label="Reset Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs ${
            message.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Import Modal / Drawer */}
      {isImporting && (
        <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 space-y-3 shadow-sm">
          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileJson className="w-4 h-4 text-blue-500" />
            <span>Import Saved Progress JSON</span>
          </div>
          <textarea
            rows={5}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste exported JSON progress string here..."
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-mono text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsImporting(false)}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              Confirm Import
            </button>
          </div>
        </div>
      )}

      {/* Readiness Tier and Breakdown Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total Attempts Logged</div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {attempts.length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Across all categories</div>
        </div>

        <div className="p-5 rounded-2xl glass-card">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Benchmark Tier</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {report.readinessTier}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
            {report.overallReadinessScore}/100 readiness score
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Active Practice Streak</div>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-1 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-current animate-pulse" />
            <span>{progress?.streakDays || 1} Days</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Consecutive learning days</div>
        </div>

        <div className="p-5 rounded-2xl glass-card">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Bookmarked Targets</div>
          <div className="text-2xl font-bold font-mono text-purple-500 mt-1 flex items-center gap-1.5">
            <Bookmark className="w-5 h-5 fill-current" />
            <span>{progress?.bookmarkedScenarioIds.length || 0}</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Scenarios saved for review</div>
        </div>
      </div>

      {/* Tier 1 Beginner Track Analytics Card */}
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 shadow-sm space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/15 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
              Tier 1: Beginner Track Progress
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1.5">
              Foundations Mastery (63 Questions)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Beginner track scores are kept distinct from senior production challenge scores.
            </p>
          </div>

          <Link
            href="/interview?tier=tier-1"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-xs"
          >
            <span>Practice Tier 1 Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TIER1_CATEGORIES.map((cat) => {
            const catAttempts = (progress?.tier1Progress?.attempts || []).filter(
              (a) => tier1QuestionMap.get(a.questionId)?.category === cat
            );
            const avg =
              catAttempts.length > 0
                ? Math.round(
                    catAttempts.reduce((s, a) => s + a.evaluation.scoreOutOf100, 0) /
                      catAttempts.length
                  )
                : 0;

            return (
              <div
                key={cat}
                className="p-3 rounded-xl bg-white/80 dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
              >
                <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                  {cat.replace(' Fundamentals', '')}
                </div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="text-lg font-black font-mono text-zinc-900 dark:text-zinc-100">
                    {avg > 0 ? `${avg}%` : '—'}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {catAttempts.length} logs
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Attempt History Table */}
      <div className="rounded-2xl glass-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Complete Simulation Attempt Log
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Auditable record of every submission, time taken, hints requested, and rubric results
            </p>
          </div>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-12 text-xs text-zinc-500 dark:text-zinc-400">
            No attempts logged yet. Complete any challenge to view your performance data here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-mono text-[11px]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Scenario</th>
                  <th className="py-3 px-3">Domain</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Hints</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {attempts.map((att) => {
                  const scen = scenarioMap.get(att.scenarioId);
                  const loanLab = loanLabAttemptInfo(att.scenarioId);
                  const isPassed = att.totalScorePercentage >= 70;

                  return (
                    <tr
                      key={att.id}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {new Date(att.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">
                        {scen?.title || loanLab?.title || att.scenarioId}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-500">
                        {scen?.topic || loanLab?.topic || 'Core'}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{formatDuration(att.timeSpentSeconds)}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-500">
                        {att.hintsUsedCount} hints
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded ${
                            isPassed
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {Math.round(att.totalScorePercentage)}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          href={loanLab?.href || `/challenge/${att.scenarioId}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
