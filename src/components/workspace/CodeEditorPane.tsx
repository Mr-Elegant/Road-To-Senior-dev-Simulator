'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Play, Code2, Copy, Check, WrapText } from 'lucide-react';
import { useTheme } from '../layout/ThemeProvider';

// Dynamically import Monaco to prevent SSR issues in Next.js
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-zinc-950 text-zinc-400 font-mono text-xs">
      Loading Monaco Code Engine...
    </div>
  ),
});

interface CodeEditorPaneProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  onRunTests?: () => void;
  isRunningTests?: boolean;
  hasTestCases?: boolean;
}

export function CodeEditorPane({
  code,
  onChange,
  language = 'javascript',
  onRunTests,
  isRunningTests,
  hasTestCases,
}: CodeEditorPaneProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono font-medium text-zinc-300">
            solution.{language === 'typescript' ? 'ts' : 'js'}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 uppercase">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Word wrap toggle */}
          <button
            onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
            className={`p-1.5 rounded text-xs transition-colors ${
              wordWrap === 'on'
                ? 'bg-zinc-800 text-blue-400'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
            title="Toggle Word Wrap"
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="Copy Solution Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Run Tests Button */}
          {hasTestCases && onRunTests && (
            <button
              onClick={onRunTests}
              disabled={isRunningTests}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningTests ? 'Running...' : 'Run Tests'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 w-full relative">
        <MonacoEditor
          height="100%"
          language={language.toLowerCase() === 'typescript' ? 'typescript' : 'javascript'}
          value={code}
          onChange={(val) => onChange(val || '')}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'JetBrains Mono, Fira Code, Menlo, monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: wordWrap,
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
          }}
        />
      </div>
    </div>
  );
}

