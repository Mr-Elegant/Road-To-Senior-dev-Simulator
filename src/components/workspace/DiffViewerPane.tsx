'use client';

import React, { useState } from 'react';
import {
  GitPullRequest,
  PlusCircle,
  Trash2,
  AlertOctagon,
  ShieldAlert,
  Zap,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { CodeReviewFile } from '@/types/scenario';

export interface CandidateReviewComment {
  id: string;
  line: number;
  category: 'correctness' | 'security' | 'performance' | 'maintainability' | 'testing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  comment: string;
}

interface DiffViewerPaneProps {
  files: CodeReviewFile[];
  comments: CandidateReviewComment[];
  onAddComment: (comment: CandidateReviewComment) => void;
  onDeleteComment: (id: string) => void;
}

export function DiffViewerPane({
  files,
  comments,
  onAddComment,
  onDeleteComment,
}: DiffViewerPaneProps) {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [commentCategory, setCommentCategory] = useState<CandidateReviewComment['category']>('security');
  const [commentSeverity, setCommentSeverity] = useState<CandidateReviewComment['severity']>('high');
  const [commentText, setCommentText] = useState('');

  const currentFile = files[selectedFileIdx] || files[0];
  const lines = currentFile ? currentFile.newCode.split('\n') : [];

  const handleCreateComment = () => {
    if (!commentText.trim()) return;
    const newComment: CandidateReviewComment = {
      id: Math.random().toString(36).substring(7),
      line: activeLine ?? 1,
      category: commentCategory,
      severity: commentSeverity,
      comment: commentText.trim(),
    };
    onAddComment(newComment);
    setCommentText('');
    setActiveLine(null);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'security':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'correctness':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'performance':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-zinc-950 text-zinc-100 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
      {/* Left: Pull Request Diff File View */}
      <div className="lg:w-7/12 flex flex-col h-full overflow-hidden">
        {/* Header file selector */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-medium text-zinc-200">
              PR #412 Files Changed ({files.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {files.map((f, idx) => (
              <button
                key={f.filename}
                onClick={() => setSelectedFileIdx(idx)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedFileIdx === idx
                    ? 'bg-zinc-800 text-blue-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {f.filename}
              </button>
            ))}
          </div>
        </div>

        {/* Code Diff Lines */}
        <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
          <div className="text-[11px] text-zinc-500 px-3 py-1 italic font-sans">
            Click on any line number to add an inline review finding.
          </div>
          <div className="divide-y divide-zinc-900 border border-zinc-800 rounded-lg overflow-hidden bg-black/60">
            {lines.map((codeLine, idx) => {
              const lineNum = idx + 1;
              const lineComments = comments.filter((c) => c.line === lineNum);
              const isCommented = lineComments.length > 0;
              const isSelected = activeLine === lineNum;

              return (
                <div key={lineNum} className="group">
                  <div
                    className={`flex items-start transition-colors ${
                      isSelected
                        ? 'bg-blue-950/40'
                        : isCommented
                        ? 'bg-amber-950/20'
                        : 'hover:bg-zinc-900/50'
                    }`}
                  >
                    {/* Line number clicker */}
                    <button
                      onClick={() => setActiveLine(lineNum)}
                      className={`w-12 py-1 px-2 text-right select-none font-mono text-[11px] transition-colors border-r border-zinc-800 flex-shrink-0 ${
                        isCommented
                          ? 'text-amber-400 font-bold bg-amber-500/10'
                          : 'text-zinc-600 group-hover:text-zinc-300'
                      }`}
                      title="Click to add review comment"
                    >
                      {lineNum}
                    </button>

                    {/* Code string */}
                    <div className="py-1 px-3 text-zinc-300 whitespace-pre overflow-x-auto flex-1 leading-relaxed">
                      {codeLine}
                    </div>
                  </div>

                  {/* Existing comments on this line */}
                  {lineComments.map((c) => (
                    <div
                      key={c.id}
                      className="ml-12 mr-3 my-2 p-3 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-sans space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadge(
                              c.category
                            )}`}
                          >
                            {c.category}
                          </span>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold">
                            {c.severity} Severity
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteComment(c.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-zinc-200 text-xs leading-relaxed">{c.comment}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Review Comment Formulation & Summary */}
      <div className="lg:w-5/12 flex flex-col h-full overflow-hidden bg-zinc-900/40">
        <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-2.5 flex items-center justify-between">
          <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-blue-400" />
            <span>Review Findings & Comments ({comments.length})</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Line {activeLine ?? '(Select a line)'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Add Review Comment Form */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
            <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-blue-400" />
              <span>
                {activeLine ? `Comment on Line ${activeLine}` : 'Add Review Finding'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Issue Category
                </label>
                <select
                  value={commentCategory}
                  onChange={(e) => setCommentCategory(e.target.value as any)}
                  className="w-full py-1.5 px-2 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="security">Security Vulnerability</option>
                  <option value="correctness">Correctness Bug</option>
                  <option value="performance">Performance Problem</option>
                  <option value="maintainability">Maintainability</option>
                  <option value="testing">Missing Tests</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Severity Level
                </label>
                <select
                  value={commentSeverity}
                  onChange={(e) => setCommentSeverity(e.target.value as any)}
                  className="w-full py-1.5 px-2 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="critical">Critical (Blocker)</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low (Nitpick)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Line Number
              </label>
              <input
                type="number"
                min={1}
                max={lines.length || 100}
                value={activeLine ?? 1}
                onChange={(e) => setActiveLine(parseInt(e.target.value, 10))}
                className="w-full py-1.5 px-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Detailed Review Comment & Recommendation
              </label>
              <textarea
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Explain the defect, security threat or bug, and describe the required fix..."
                className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <button
              onClick={handleCreateComment}
              disabled={!commentText.trim()}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Attach Review Comment</span>
            </button>
          </div>

          {/* Review Checklist Guidance */}
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 space-y-2">
            <h4 className="font-semibold text-zinc-300 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Senior PR Review Checklist</span>
            </h4>
            <ul className="space-y-1 text-[11px] text-zinc-400 list-disc list-inside">
              <li>Are currency amounts kept as integer cents / BigInt?</li>
              <li>Are permissions & IDOR ownerships strictly checked?</li>
              <li>Are all asynchronous promises awaited without unhandled rejections?</li>
              <li>Are database queries composite-indexed without locks?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

