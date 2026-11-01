'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  allScenarios,
} from '@/data';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { UserProgressData } from '@/types/userProgress';
import { calculateReadinessReport } from '@/lib/evaluation/readinessCalculator';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { ReadinessBanner } from '@/components/dashboard/ReadinessBanner';
import { QuickActionButtons } from '@/components/dashboard/QuickActionButtons';
import { TopicMasteryChart } from '@/components/dashboard/TopicMasteryChart';
import { WeakAreasPanel } from '@/components/dashboard/WeakAreasPanel';
import { RecentAttemptsList } from '@/components/dashboard/RecentAttemptsList';
import { ChallengeFilters } from '@/components/library/ChallengeFilters';
import { ChallengeCard } from '@/components/library/ChallengeCard';
import { Terminal, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Load progress from persistence
  const loadProgress = async () => {
    const data = await storage.getProgress();
    setProgress(data);
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const handleToggleBookmark = async (scenarioId: string) => {
    await storage.toggleBookmark(scenarioId);
    await loadProgress();
  };

  // Compute best score map per scenario
  const bestScoreMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!progress) return map;
    for (const att of progress.attempts) {
      const cur = map.get(att.scenarioId) ?? 0;
      if (att.totalScorePercentage > cur) {
        map.set(att.scenarioId, att.totalScorePercentage);
      }
    }
    return map;
  }, [progress]);

  // Compute readiness report
  const readinessReport = useMemo(() => {
    return calculateReadinessReport(allScenarios, progress || {
      attempts: [],
      bookmarkedScenarioIds: [],
      streakDays: 1,
      lastActiveDate: '',
      customNotes: {},
    });
  }, [progress]);

  // Average score
  const averageScore = useMemo(() => {
    if (bestScoreMap.size === 0) return 0;
    let sum = 0;
    for (const val of bestScoreMap.values()) sum += val;
    return sum / bestScoreMap.size;
  }, [bestScoreMap]);

  // Topic scenario counts
  const allTopicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of allScenarios) {
      counts[s.topic] = (counts[s.topic] || 0) + 1;
    }
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  // Filtered challenges for the dashboard preview grid
  const filteredScenarios = useMemo(() => {
    return allScenarios.filter((s) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesTopic = s.topic.toLowerCase().includes(q);
        const matchesProblem = s.problemStatement.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTopic && !matchesProblem) return false;
      }
      // Topic
      if (selectedTopic !== 'All' && s.topic !== selectedTopic) return false;
      // Difficulty
      if (selectedDifficulty !== 'All' && s.difficulty !== selectedDifficulty) return false;
      // Type
      if (selectedType !== 'All' && s.type !== selectedType) return false;
      // Status
      if (selectedStatus !== 'All') {
        const score = bestScoreMap.get(s.id) ?? 0;
        const isPassed = score >= 70;
        const isBookmarked = progress?.bookmarkedScenarioIds.includes(s.id);
        if (selectedStatus === 'completed' && !isPassed) return false;
        if (selectedStatus === 'incomplete' && isPassed) return false;
        if (selectedStatus === 'bookmarked' && !isBookmarked) return false;
      }
      return true;
    });
  }, [searchQuery, selectedTopic, selectedDifficulty, selectedType, selectedStatus, bestScoreMap, progress]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedType('All');
    setSelectedStatus('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome & Quick Launch */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            <span className="p-1 rounded-md bg-blue-500/10 border border-blue-500/20">
              <Terminal className="w-3.5 h-3.5" />
            </span>
            <span>Interactive Senior & Staff Simulation Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Engineering Interview Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            Hone your architectural diagnosis, deep code debugging, production incident mitigation, and system design under senior hiring committee rubrics.
          </p>
        </div>

        <div className="flex-shrink-0">
          <QuickActionButtons
            allScenarios={allScenarios}
            progress={progress}
            weakestTopic={readinessReport.weakestAreas[0]}
          />
        </div>
      </div>

      {/* Metric KPI Cards */}
      <MetricCards
        totalScenarios={allScenarios.length}
        completedCount={bestScoreMap.size}
        averageScore={averageScore}
        streakDays={progress?.streakDays || 1}
        bookmarksCount={progress?.bookmarkedScenarioIds?.length || 0}
        readinessScore={readinessReport.overallReadinessScore}
      />

      {/* Interview Readiness Estimate Banner */}
      <ReadinessBanner report={readinessReport} />

      {/* Grid: Domain Mastery vs Recent Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopicMasteryChart
            topicBreakdown={readinessReport.topicBreakdown}
            allTopics={allTopicCounts}
          />
        </div>
        <div>
          <RecentAttemptsList attempts={progress?.attempts || []} />
        </div>
      </div>

      {/* Weak Areas Deep Dive */}
      <WeakAreasPanel
        weakestAreas={readinessReport.weakestAreas}
        allScenarios={allScenarios}
      />

      {/* Explore Scenarios with Filters */}
      <div className="space-y-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Explore Practice Challenges
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Filter by engineering discipline, difficulty, or scenario format
            </p>
          </div>
          <Link
            href="/library"
            className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group"
          >
            <span>Full Catalog ({allScenarios.length})</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ChallengeFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onReset={handleResetFilters}
          totalFilteredCount={filteredScenarios.length}
        />

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.slice(0, 9).map((scenario) => (
            <ChallengeCard
              key={scenario.id}
              scenario={scenario}
              isBookmarked={progress?.bookmarkedScenarioIds.includes(scenario.id) || false}
              onToggleBookmark={handleToggleBookmark}
              bestScore={bestScoreMap.get(scenario.id)}
            />
          ))}
        </div>

        {filteredScenarios.length > 9 && (
          <div className="text-center pt-4">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-xs transition-colors"
            >
              <span>View All {filteredScenarios.length} Scenarios in Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
