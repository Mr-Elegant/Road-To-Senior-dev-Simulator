'use client';

import React from 'react';
import { SqlTierLevel, SqlTrackProgressData } from '@/types/sqlTrack';
import { SQL_TIERS_METADATA } from '@/data/sql';
import { Database, ShieldCheck, Zap, AlertTriangle, CheckCircle2, ChevronRight, BarChart3 } from 'lucide-react';

interface SqlTierSelectorProps {
  selectedTier: SqlTierLevel;
  onSelectTier: (tier: SqlTierLevel) => void;
  progress?: SqlTrackProgressData;
}

export function SqlTierSelector({ selectedTier, onSelectTier, progress }: SqlTierSelectorProps) {
  const tiers: SqlTierLevel[] = ['tier-1', 'tier-2', 'tier-3', 'tier-4'];

  const getTierIcon = (tier: SqlTierLevel) => {
    switch (tier) {
      case 'tier-1':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'tier-2':
        return <Zap className="w-5 h-5 text-blue-400" />;
      case 'tier-3':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      case 'tier-4':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiers.map((tier) => {
        const meta = SQL_TIERS_METADATA[tier];
        const isSelected = selectedTier === tier;
        const tierKey = tier.replace('-', '') as 'tier1' | 'tier2' | 'tier3' | 'tier4';
        const tierData = progress?.[tierKey];
        const completedCount = tierData?.completedQuestionIds?.length || 0;
        const totalCount = meta.totalQuestions;
        const percent = Math.round((completedCount / totalCount) * 100);
        const avgScore = tierData?.averageScore || 0;

        return (
          <button
            key={tier}
            onClick={() => onSelectTier(tier)}
            className={`text-left rounded-xl border p-4 transition-all duration-200 relative group overflow-hidden ${
              isSelected
                ? 'bg-slate-800/90 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            {/* Top accent badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700/60`}>
                  {getTierIcon(tier)}
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    {meta.difficultyLabel}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {meta.name.split(':')[0]}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {totalCount} Qs
              </span>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 mb-3 min-h-[32px]">
              {meta.tagline}
            </p>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{completedCount} / {totalCount} Done</span>
                </span>
                <span className="text-slate-300 font-mono font-semibold">{percent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    tier === 'tier-1'
                      ? 'bg-emerald-500'
                      : tier === 'tier-2'
                      ? 'bg-blue-500'
                      : tier === 'tier-3'
                      ? 'bg-purple-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              {avgScore > 0 && (
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center space-x-1">
                    <BarChart3 className="w-3 h-3 text-cyan-400" />
                    <span>Avg Score:</span>
                  </span>
                  <span className="font-mono text-cyan-300 font-semibold">{avgScore}/100</span>
                </div>
              )}
            </div>

            {isSelected && (
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            )}
          </button>
        );
      })}
    </div>
  );
}

