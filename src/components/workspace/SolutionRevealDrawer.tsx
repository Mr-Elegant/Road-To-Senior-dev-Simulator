'use client';

import React, { useState } from 'react';
import {
  X,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCode,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';
import { Scenario } from '@/types/scenario';

interface SolutionRevealDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
}

export function SolutionRevealDrawer({
  isOpen,
  onClose,
  scenario,
}: SolutionRevealDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'explanation' | 'code' | 'alternatives' | 'pitfalls' | 'followup'>('explanation');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    if (scenario.referenceSolution.codeOrArtifact) {
      navigator.clipboard.writeText(scenario.referenceSolution.codeOrArtifact);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">
                Staff Reference Benchmark & Solution
              </h2>
              <div className="text-[11px] text-zinc-400 font-mono">
                {scenario.id} • {scenario.topic}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-zinc-800 bg-zinc-900/60 px-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'explanation'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Architectural Analysis
          </button>

          {scenario.referenceSolution.codeOrArtifact && (
            <button
              onClick={() => setActiveTab('code')}
              className={`py-2.5 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'code'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Reference Code / Artifact
            </button>
          )}

          <button
            onClick={() => setActiveTab('alternatives')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'alternatives'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Alternative Approaches ({scenario.alternativeApproaches.length})
          </button>

          <button
            onClick={() => setActiveTab('pitfalls')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pitfalls'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Common Anti-Patterns ({scenario.commonMistakes.length})
          </button>

          <button
            onClick={() => setActiveTab('followup')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'followup'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Interview Follow-ups ({scenario.followUpQuestions.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs sm:text-sm">
          {activeTab === 'explanation' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Senior Architectural Explanation</span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 leading-relaxed text-zinc-300 whitespace-pre-line text-xs font-sans">
                {scenario.referenceSolution.explanation}
              </div>
            </div>
          )}

          {activeTab === 'code' && scenario.referenceSolution.codeOrArtifact && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-blue-400" />
                  <span>Production Reference Implementation</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-black/70 font-mono text-xs overflow-x-auto text-zinc-200 whitespace-pre leading-relaxed">
                {scenario.referenceSolution.codeOrArtifact}
              </div>
            </div>
          )}

          {activeTab === 'alternatives' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Alternative Acceptable Engineering Approaches</span>
              </div>
              <p className="text-xs text-zinc-400">
                In senior interviews, there is rarely only one valid architecture. Mentioning these alternative designs demonstrates breadth of technical perspective.
              </p>
              <div className="space-y-2.5 pt-2">
                {scenario.alternativeApproaches.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <span>{alt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pitfalls' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Common Candidate Mistakes & Anti-Patterns</span>
              </div>
              <p className="text-xs text-zinc-400">
                These are the most frequent red flags and failure modes observed in hiring committees.
              </p>
              <div className="space-y-2.5 pt-2">
                {scenario.commonMistakes.map((mistake, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    <span>{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'followup' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>Follow-Up Questions & Strong Answer Models</span>
              </div>
              <div className="space-y-4">
                {scenario.followUpQuestions.map((fq, idx) => (
                  <div
                    key={fq.id}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2.5"
                  >
                    <div className="text-xs font-bold text-zinc-200">
                      Q{idx + 1}: {fq.question}
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                      <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">
                        Exemplary Candidate Answer
                      </div>
                      {fq.sampleStrongAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
          >
            Close Reference Drawer
          </button>
        </div>
      </div>
    </div>
  );
}

