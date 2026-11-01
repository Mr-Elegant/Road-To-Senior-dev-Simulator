'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { practiceProblems, practiceProblemMap } from '@/data/practiceProblems';
import { PracticeProblem, SupportedLanguage } from '@/types/practice';
import { PracticeWorkspace } from '@/components/practice/PracticeWorkspace';
import {
  Code2,
  Database,
  FileCode,
  Terminal,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';

function PracticePageContent() {
  const searchParams = useSearchParams();
  const initialLang = searchParams.get('lang') || 'all';
  const initialId = searchParams.get('id');

  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLang);
  const [selectedProblemId, setSelectedProblemId] = useState<string>(
    initialId && practiceProblemMap.has(initialId)
      ? initialId
      : practiceProblems[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');

  const currentProblem = practiceProblemMap.get(selectedProblemId) || practiceProblems[0];

  const filteredProblems = useMemo(() => {
    return practiceProblems.filter((p) => {
      if (selectedLanguage !== 'all' && p.language !== selectedLanguage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedLanguage, searchQuery]);

  const handleSelectLanguage = (langId: string) => {
    setSelectedLanguage(langId);
    if (langId !== 'all') {
      const firstMatching = practiceProblems.find((p) => p.language === langId);
      if (firstMatching) {
        setSelectedProblemId(firstMatching.id);
      }
    }
  };

  const handleNextProblem = () => {
    const idx = filteredProblems.findIndex((p) => p.id === currentProblem.id);
    if (idx >= 0 && idx < filteredProblems.length - 1) {
      setSelectedProblemId(filteredProblems[idx + 1].id);
    } else if (filteredProblems.length > 0) {
      setSelectedProblemId(filteredProblems[0].id);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-zinc-950">
      {/* Top Problem Navigation & Language Selector Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 flex items-center justify-between flex-wrap gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-zinc-100 hidden sm:inline">
              Coding Practice Lab
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-700 hidden sm:block" />

          {/* Language filter pills */}
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'javascript', label: 'JavaScript' },
              { id: 'typescript', label: 'TypeScript' },
              { id: 'sql', label: 'SQL' },
              { id: 'python', label: 'Python' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleSelectLanguage(lang.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedLanguage === lang.id
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Problem selector dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={currentProblem.id}
            onChange={(e) => setSelectedProblemId(e.target.value)}
            className="py-1 px-3 rounded-lg border border-zinc-700 bg-zinc-800 text-xs text-zinc-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-xs truncate"
          >
            {filteredProblems.map((prob) => (
              <option key={prob.id} value={prob.id}>
                [{prob.language.toUpperCase()}] {prob.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Integrated Practice Workspace */}
      <div className="flex-1 overflow-hidden">
        <PracticeWorkspace
          problem={currentProblem}
          onNextProblem={handleNextProblem}
        />
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-zinc-500">Loading coding practice lab...</div>}>
      <PracticePageContent />
    </Suspense>
  );
}

