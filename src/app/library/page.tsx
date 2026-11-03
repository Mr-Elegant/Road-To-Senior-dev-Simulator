'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { allScenarios } from '@/data';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { UserProgressData } from '@/types/userProgress';
import { ChallengeFilters } from '@/components/library/ChallengeFilters';
import { ChallengeCard } from '@/components/library/ChallengeCard';
import { ClientErrorBoundary } from '@/components/common/ClientErrorBoundary';
import { BookOpen, AlertCircle } from 'lucide-react';

function LibraryContent() {
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<UserProgressData | null>(null);

  const initialTopic = searchParams?.get('topic') || 'All';
  const initialFilter = searchParams?.get('filter');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState(searchParams?.get('type') === 'incident' ? 'incident' : 'All');
  const [selectedStatus, setSelectedStatus] = useState(
    initialFilter === 'bookmarked' ? 'bookmarked' : initialFilter === 'needs_practice' ? 'incomplete' : 'All'
  );

  useEffect(() => {
    storage.getProgress().then(setProgress);
  }, []);

  // Sync state when URL query params change dynamically
  useEffect(() => {
    setSelectedType(searchParams?.get('type') === 'incident' ? 'incident' : 'All');
    const topicParam = searchParams?.get('topic');
    if (topicParam) {
      setSelectedTopic(topicParam);
    }
    const filterParam = searchParams?.get('filter');
    if (filterParam === 'bookmarked') {
      setSelectedStatus('bookmarked');
    } else if (filterParam === 'needs_practice') {
      setSelectedStatus('incomplete');
    }
  }, [searchParams]);

  const handleToggleBookmark = async (scenarioId: string) => {
    await storage.toggleBookmark(scenarioId);
    const updated = await storage.getProgress();
    setProgress(updated);
  };

  const bestScoreMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!progress || !Array.isArray(progress.attempts)) return map;
    for (const att of progress.attempts) {
      if (!att || !att.scenarioId) continue;
      const cur = map.get(att.scenarioId) ?? 0;
      if (typeof att.totalScorePercentage === 'number' && att.totalScorePercentage > cur) {
        map.set(att.scenarioId, att.totalScorePercentage);
      }
    }
    return map;
  }, [progress]);

  const filteredScenarios = useMemo(() => {
    return (allScenarios || []).filter((s) => {
      if (!s) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (s.title || '').toLowerCase().includes(q);
        const matchesTopic = (s.topic || '').toLowerCase().includes(q);
        const matchesSubtopic = (s.subtopic || '').toLowerCase().includes(q);
        const matchesProblem = (s.problemStatement || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesTopic && !matchesSubtopic && !matchesProblem) return false;
      }
      // Topic
      if (selectedTopic !== 'All' && (s.topic || '').toLowerCase() !== selectedTopic.toLowerCase()) return false;
      // Difficulty
      if (selectedDifficulty !== 'All' && (s.difficulty || '').toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
      // Type
      if (selectedType !== 'All' && (s.type || '').toLowerCase() !== selectedType.toLowerCase()) return false;
      // Status
      if (selectedStatus !== 'All') {
        const score = bestScoreMap.get(s.id) ?? 0;
        const isPassed = score >= 70;
        const isBookmarked = Array.isArray(progress?.bookmarkedScenarioIds)
          ? progress.bookmarkedScenarioIds.includes(s.id)
          : false;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Curated Engineering Scenario Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Challenge Catalog ({allScenarios.length} Scenarios)
        </h1>
        <Link href="/library?topic=React" className="inline-flex mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Explore React UI practice with preview and tests</Link>
        <Link href="/frontend-practice" className="ml-0 sm:ml-4 inline-flex mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">All 203 frontend practice questions →</Link>
        <Link href="/react-typescript" className="ml-0 sm:ml-4 inline-flex mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">React + TypeScript: 113 challenges →</Link>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Production-grade scenarios covering JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, Integrations, Engineering Operations, and System Design.
        </p>
        <Link href="/incidents" className="inline-block mt-3 text-sm font-semibold text-blue-600 dark:text-blue-300 underline underline-offset-2">Practice evolving production incidents →</Link>
      </div>

      {/* Filters Bar */}
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
      {filteredScenarios.length === 0 ? (
        <div className="rounded-2xl glass-card p-12 text-center">
          <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            No matching challenges found
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
            Try broadening your search query or reset your topic and status filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.map((scenario) => (
            <ChallengeCard
              key={scenario.id}
              scenario={scenario}
              isBookmarked={progress?.bookmarkedScenarioIds?.includes(scenario.id) ?? false}
              onToggleBookmark={handleToggleBookmark}
              bestScore={bestScoreMap.get(scenario.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <ClientErrorBoundary fallbackTitle="Challenge Catalog Temporarily Interrupted">
      <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-zinc-500">Loading catalog...</div>}>
        <LibraryContent />
      </Suspense>
    </ClientErrorBoundary>
  );
}
