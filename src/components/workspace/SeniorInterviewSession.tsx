'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Send,
  Lock,
} from 'lucide-react';
import { FollowUpQuestion } from '@/types/scenario';

interface SeniorInterviewSessionProps {
  questions: FollowUpQuestion[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
  isCompleted?: boolean;
}

export function SeniorInterviewSession({
  questions,
  answers,
  onAnswerChange,
  isCompleted,
}: SeniorInterviewSessionProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentQ = questions[selectedIdx] || questions[0];

  if (!currentQ) {
    return <div className="p-6 text-zinc-500 text-xs">No interview questions configured.</div>;
  }

  const answeredCount = Object.values(answers).filter((a) => a.trim().length > 20).length;

  return (
    <div className="h-full flex flex-col lg:flex-row bg-zinc-950 text-zinc-100 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
      {/* Left: Questions Navigation List */}
      <div className="lg:w-4/12 flex flex-col h-full overflow-hidden bg-zinc-900/60">
        <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-3">
          <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>Interview Dialogue ({answeredCount}/{questions.length} answered)</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Senior/Staff Level Architecture Interview
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {questions.map((q, idx) => {
            const hasAnswer = (answers[q.id] || '').trim().length > 20;
            const isSelected = selectedIdx === idx;

            return (
              <button
                key={q.id}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-zinc-100'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                    Question {idx + 1}
                  </span>
                  {hasAnswer ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-zinc-700" />
                  )}
                </div>
                <div className="text-xs font-medium line-clamp-2 leading-relaxed">
                  {q.question}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Question Formulation & Expected Competencies */}
      <div className="lg:w-8/12 flex flex-col h-full overflow-hidden">
        {/* Active Question Display */}
        <div className="border-b border-zinc-800 bg-zinc-900/80 p-5 space-y-2">
          <div className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider">
            Interviewer Prompt #{selectedIdx + 1}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-100 leading-snug">
            {currentQ.question}
          </h3>

          <div className="pt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-zinc-400">
              Expected Competencies:
            </span>
            {currentQ.expectedConcepts.map((concept, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Candidate Response Workspace */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-between space-y-4">
          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Your Architectural & Leadership Response
            </label>
            <textarea
              rows={12}
              value={answers[currentQ.id] || ''}
              onChange={(e) => onAnswerChange(currentQ.id, e.target.value)}
              placeholder="Structure your verbal/written response clearly: define the trade-offs, cite real-world failure modes, and justify your engineering decisions..."
              className="flex-1 w-full p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs sm:text-sm font-sans leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-zinc-500">
              Words: {(answers[currentQ.id] || '').trim().split(/\s+/).filter(Boolean).length}
            </span>

            {selectedIdx < questions.length - 1 ? (
              <button
                onClick={() => setSelectedIdx(selectedIdx + 1)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All questions reviewed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

