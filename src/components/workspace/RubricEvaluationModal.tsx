'use client';

import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';
import { RubricCriteria } from '@/types/scenario';
import { RubricScoreItem } from '@/types/userProgress';
import { computeRubricScore } from '@/lib/evaluation/rubricEvaluator';

interface RubricEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rubric: RubricCriteria[];
  initialScores?: RubricScoreItem[];
  recordedTestScore?: number;
  onSubmitScores: (scores: RubricScoreItem[], totalPercentage: number) => void;
}

export function RubricEvaluationModal({
  isOpen,
  onClose,
  rubric,
  initialScores = [],
  recordedTestScore,
  onSubmitScores,
}: RubricEvaluationModalProps) {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const item of initialScores) {
      map[item.criteriaId] = item.score;
    }
    // Default to level 2 if unselected
    for (const crit of rubric) {
      if (map[crit.id] === undefined) {
        map[crit.id] = 2;
      }
    }
    return map;
  });

  if (!isOpen) return null;

  const currentScoreItems: RubricScoreItem[] = Object.entries(scores).map(
    ([criteriaId, score]) => ({ criteriaId, score })
  );

  const evaluation = computeRubricScore(rubric, currentScoreItems);

  const handleScoreSelect = (criteriaId: string, levelScore: number) => {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: levelScore,
    }));
  };

  const handleConfirm = () => {
    onSubmitScores(currentScoreItems, evaluation.percentage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                Transparent Rubric Evaluation & Self-Assessment
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Evaluate your solution against senior engineering hiring bar rubrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-blue-400">
                {evaluation.percentage}%
              </div>
              <div className="text-[10px] text-zinc-400">
                {evaluation.earnedPoints} / {evaluation.maxPoints} pts
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice on transparent semantic grading */}
        <div className="px-6 py-2.5 bg-blue-500/5 border-b border-blue-500/10 text-[11px] text-blue-300 flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {recordedTestScore !== undefined
              ? `Your recorded score is ${recordedTestScore}% from the current DOM tests. Use the rubric below to assess your reasoning separately.`
              : 'Semantic integrity notice: We do not claim simplistic keyword matching provides reliable semantic evaluation. You review concrete rubric tiers below.'}
          </span>
        </div>

        {/* Criteria List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {rubric.map((criteria, idx) => {
            const selectedScore = scores[criteria.id] ?? 2;

            return (
              <div
                key={criteria.id}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                      Dimension {idx + 1} • {criteria.category.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-100 mt-0.5">
                      {criteria.label}
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    Weight: {criteria.weight}x
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {criteria.description}
                </p>

                {/* Level selection cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                  {criteria.levels.map((lvl) => {
                    const isSelected = selectedScore === lvl.score;

                    return (
                      <button
                        key={lvl.score}
                        type="button"
                        onClick={() => handleScoreSelect(criteria.id, lvl.score)}
                        className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/15 text-zinc-100 ring-1 ring-blue-500'
                            : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold font-mono">
                            Level {lvl.score} / 3
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </div>
                        <div className="text-[11px] leading-relaxed line-clamp-4">
                          {lvl.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between">
          <div className="text-xs text-zinc-400 font-mono">
            {recordedTestScore !== undefined ? 'Recorded test score' : 'Overall Score'}: <strong className="text-zinc-100 font-bold">{recordedTestScore ?? evaluation.percentage}%</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Record Attempt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

