'use client';

import React, { useState, useEffect } from 'react';
import { SqlTierLevel, SqlTrackProgressData } from '@/types/sqlTrack';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { SqlTierSelector } from '@/components/sql/SqlTierSelector';
import { SqlPracticeView } from '@/components/sql/SqlPracticeView';
import { SqlPlayground } from '@/components/sql/SqlPlayground';
import { SqlMockInterviewView } from '@/components/sql/SqlMockInterviewView';
import { SqlIncidentView } from '@/components/sql/SqlIncidentView';
import {
  Database,
  Terminal,
  Award,
  Flame,
  CheckCircle2,
  BarChart3,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

type SqlTab = 'practice' | 'playground' | 'mock' | 'incidents';

export default function SqlTrackPage() {
  const [selectedTier, setSelectedTier] = useState<SqlTierLevel>('tier-1');
  const [activeTab, setActiveTab] = useState<SqlTab>('practice');
  const [progress, setProgress] = useState<SqlTrackProgressData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load progress on mount
  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await storage.getSqlProgress();
        setProgress(data);
      } catch (e) {
        console.error('Failed to load SQL progress:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadProgress();
  }, []);

  const totalCompleted = progress?.totalQuestionsCompleted || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 p-8 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>Full Stack Engineering Interview Lab &bull; SQL Track</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              SQL & PostgreSQL Engineering Track
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              From relational fundamentals to Staff-level database engineering. Master B-Tree page splits, MVCC vacuum wraparound, EXPLAIN ANALYZE optimization, zero-downtime migrations, and live P0 incident recovery.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 font-medium">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-bold font-mono">120</span>
                <span>Original Questions</span>
              </span>
              <span className="flex items-center space-x-1.5 font-medium">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold font-mono">3</span>
                <span>Production Datasets</span>
              </span>
              <span className="flex items-center space-x-1.5 font-medium">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>In-Browser AlaSQL Sandbox</span>
              </span>
              <span className="flex items-center space-x-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-bold font-mono">{totalCompleted} / 120</span>
                <span>Completed</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tier Selector Carousel / Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Difficulty Tier:
            </h2>
            <span className="text-xs text-slate-400">
              Click any tier to explore questions and progress
            </span>
          </div>

          <SqlTierSelector
            selectedTier={selectedTier}
            onSelectTier={(t) => setSelectedTier(t)}
            progress={progress}
          />
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-4 py-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'practice'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice & Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'playground'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>SQL Sandbox & Playground</span>
          </button>

          <button
            onClick={() => setActiveTab('mock')}
            className={`px-4 py-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'mock'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Timed Mock Interview</span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-4 py-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'incidents'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>P0 Production Incident Cockpit</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div>
          {activeTab === 'practice' && (
            <SqlPracticeView
              selectedTier={selectedTier}
              progress={progress}
              onProgressUpdate={(up) => setProgress(up)}
            />
          )}

          {activeTab === 'playground' && <SqlPlayground />}

          {activeTab === 'mock' && (
            <SqlMockInterviewView
              initialTier={selectedTier}
              progress={progress}
              onProgressUpdate={(up) => setProgress(up)}
            />
          )}

          {activeTab === 'incidents' && (
            <SqlIncidentView
              progress={progress}
              onProgressUpdate={(up) => setProgress(up)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

