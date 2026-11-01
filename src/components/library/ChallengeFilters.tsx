'use client';

import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface ChallengeFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (diff: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
  totalFilteredCount: number;
}

const TOPICS = [
  'All',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Databases',
  'Integrations',
  'Engineering Operations',
  'System Design',
  'Security',
];

const DIFFICULTIES = ['All', 'Mid-Level', 'Senior', 'Staff/Principal'];

const TYPES = [
  { id: 'All', label: 'All Types' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'incident', label: 'Production Incident' },
  { id: 'coding', label: 'Coding Challenge' },
  { id: 'code_review', label: 'Code Review PR' },
  { id: 'system_design', label: 'System Design' },
  { id: 'senior_interview', label: 'Senior Interview' },
];

const STATUSES = [
  { id: 'All', label: 'All Status' },
  { id: 'completed', label: 'Completed (Passed)' },
  { id: 'incomplete', label: 'Incomplete' },
  { id: 'bookmarked', label: 'Bookmarked' },
];

export function ChallengeFilters({
  searchQuery,
  onSearchChange,
  selectedTopic,
  onTopicChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  onReset,
  totalFilteredCount,
}: ChallengeFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedTopic !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedType !== 'All' ||
    selectedStatus !== 'All';

  return (
    <div className="rounded-2xl glass-card p-5 shadow-sm space-y-4 transition-all">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search challenges by title, keywords, business context, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/70 dark:bg-zinc-950/70 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* Topic Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono uppercase tracking-wider">
            Domain Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="w-full py-2 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono uppercase tracking-wider">
            Seniority Bar
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="w-full py-2 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Seniorities' : d}
              </option>
            ))}
          </select>
        </div>

        {/* Challenge Type Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono uppercase tracking-wider">
            Challenge Format
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full py-2 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          >
            {TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Completion Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono uppercase tracking-wider">
            Progress Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full py-2 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Count and Active Badges */}
      <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80">
        <span className="font-mono">
          Showing <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{totalFilteredCount}</strong> engineering challenges
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-medium">
            Active filters applied
          </span>
        )}
      </div>
    </div>
  );
}
