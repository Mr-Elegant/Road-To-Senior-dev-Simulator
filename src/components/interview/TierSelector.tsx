'use client';

import React from 'react';
import { TierLevel } from '@/types/tier1';
import { TIERS_CATALOG } from '@/data/tier1';
import { Sparkles, Trophy, BookOpen, Layers, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

interface TierSelectorProps {
  selectedTier: TierLevel;
  onSelectTier: (tier: TierLevel) => void;
}

export function TierSelector({ selectedTier, onSelectTier }: TierSelectorProps) {
  const getTierIcon = (id: TierLevel) => {
    switch (id) {
      case 'tier-1':
        return BookOpen;
      case 'tier-2':
        return Layers;
      case 'tier-3':
        return Sparkles;
      case 'tier-4':
        return Trophy;
    }
  };

  const getTierCardClasses = (id: TierLevel, isSelected: boolean) => {
    if (!isSelected) {
      return 'border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md';
    }
    switch (id) {
      case 'tier-1':
        return 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/10';
      case 'tier-2':
        return 'border-sky-500 bg-sky-500/10 dark:bg-sky-500/15 ring-2 ring-sky-500/30 shadow-md shadow-sky-500/10';
      case 'tier-3':
        return 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15 ring-2 ring-indigo-500/30 shadow-md shadow-indigo-500/10';
      case 'tier-4':
        return 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/15 ring-2 ring-purple-500/30 shadow-md shadow-purple-500/10';
    }
  };

  const getBadgeStyle = (id: TierLevel) => {
    switch (id) {
      case 'tier-1':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25';
      case 'tier-2':
        return 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25';
      case 'tier-3':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25';
      case 'tier-4':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-3">
        <div>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            Interview Preparation Levels
          </span>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Choose Your Difficulty Track
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Tier 1 Beginner Track is fully unlocked with 63 questions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIERS_CATALOG.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const Icon = getTierIcon(tier.id);

          return (
            <div
              key={tier.id}
              onClick={() => onSelectTier(tier.id)}
              className={`p-5 rounded-2xl border cursor-pointer backdrop-blur-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5 ${getTierCardClasses(
                tier.id,
                isSelected
              )}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:scale-105'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono uppercase tracking-wider ${getBadgeStyle(
                      tier.id
                    )}`}
                  >
                    {tier.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {tier.name}
                </h3>
                <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
                  {tier.experienceLevel} • {tier.targetRole}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed line-clamp-3">
                  {tier.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-500 text-[11px]">
                  {tier.questionCountLabel}
                </span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isSelected
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <span>Select</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
