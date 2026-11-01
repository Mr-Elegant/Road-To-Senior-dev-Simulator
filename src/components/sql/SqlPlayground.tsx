'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SqlDatasetId, SqlExecutionOutcome, IntrospectedTable } from '@/types/sqlTrack';
import { ALL_SQL_DATASETS, getDatasetById } from '@/data/sql/datasets';
import { runQueryAgainstDataset, introspectSchema } from '@/lib/evaluation/sqlEvaluator';
import {
  Play,
  RotateCcw,
  Database,
  Table,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Code2,
  Layers,
  KeyRound,
  Cpu,
  RefreshCw
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export function SqlPlayground() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<SqlDatasetId>('ecommerce');
  const [selectedEngine, setSelectedEngine] = useState<'pglite' | 'alasql'>('pglite');
  const [query, setQuery] = useState<string>('SELECT * FROM products LIMIT 10;');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<SqlExecutionOutcome | null>(null);
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});

  // Runtime Introspected Schema
  const [introspectedTables, setIntrospectedTables] = useState<IntrospectedTable[]>([]);
  const [isIntrospecting, setIsIntrospecting] = useState<boolean>(false);

  const dataset = getDatasetById(selectedDatasetId);

  // Set default sample query on dataset switch
  useEffect(() => {
    if (selectedDatasetId === 'ecommerce') {
      setQuery('SELECT id, name, category, price\nFROM products\nWHERE price > 50\nORDER BY price DESC\nLIMIT 10;');
    } else if (selectedDatasetId === 'loan_management') {
      setQuery('SELECT id, customer_id, principal_amount, interest_rate, status\nFROM loans\nWHERE status = \'ACTIVE\'\nORDER BY principal_amount DESC;');
    } else if (selectedDatasetId === 'saas_analytics') {
      setQuery('SELECT event_name, count(*) AS event_count\nFROM events\nGROUP BY event_name\nORDER BY event_count DESC;');
    }
    setOutcome(null);
  }, [selectedDatasetId]);

  // Perform live runtime schema introspection whenever dataset or engine changes
  useEffect(() => {
    let cancelled = false;
    const fetchSchema = async () => {
      setIsIntrospecting(true);
      try {
        const tables = await introspectSchema(selectedDatasetId, selectedEngine);
        if (!cancelled) {
          setIntrospectedTables(tables);
        }
      } catch (e) {
        console.warn('Schema introspection notice:', e);
      } finally {
        if (!cancelled) {
          setIsIntrospecting(false);
        }
      }
    };
    fetchSchema();
    return () => {
      cancelled = true;
    };
  }, [selectedDatasetId, selectedEngine]);

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsRunning(true);
    try {
      const res = await runQueryAgainstDataset(
        query,
        selectedDatasetId,
        undefined,
        selectedEngine === 'pglite' ? 'postgresql' : 'generic-sql'
      );
      setOutcome(res);
    } catch (err: any) {
      setOutcome({
        passed: false,
        columns: [],
        rows: [],
        rowCount: 0,
        durationMs: 0,
        engineUsed: selectedEngine,
        error: err?.message || 'Failed to run query'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const toggleTableAccordion = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[750px]">
      {/* Left Sidebar: Dataset Selector & Schema Browser */}
      <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col h-[750px] overflow-hidden">
        {/* Engine Dialect Selector */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Execution Engine</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              {selectedEngine === 'pglite' ? 'PostgreSQL 16 WASM' : 'In-Memory SQL-99'}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedEngine('pglite')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition ${
                selectedEngine === 'pglite'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>PGlite (Postgres)</span>
            </button>
            <button
              onClick={() => setSelectedEngine('alasql')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition ${
                selectedEngine === 'alasql'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>AlaSQL (Generic)</span>
            </button>
          </div>
        </div>

        {/* Dataset Switcher */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Target Schema & Dataset</span>
          </label>
          <select
            value={selectedDatasetId}
            onChange={(e) => setSelectedDatasetId(e.target.value as SqlDatasetId)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ALL_SQL_DATASETS.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.name} ({ds.tables.length} tables)
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1.5">{dataset?.tagline}</p>
        </div>

        {/* Tables & Schema Accordion */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 border-t border-slate-800 pt-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Runtime Schema Introspection</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
              {isIntrospecting && <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />}
              <span>{introspectedTables.length || dataset?.tables.length} Tables</span>
            </span>
          </div>

          {(introspectedTables.length > 0 ? introspectedTables : (dataset?.tables || [])).map((t: any) => {
            const isExpanded = Boolean(expandedTables[t.name]);
            return (
              <div
                key={t.name}
                className="bg-slate-800/60 border border-slate-700/60 rounded-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleTableAccordion(t.name)}
                  className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-medium text-slate-200 hover:bg-slate-700/50"
                >
                  <div className="flex items-center space-x-2">
                    <Table className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="font-mono font-semibold text-white">{t.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {t.rowCount ?? t.sampleRowCount} rows
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-2 pt-1 border-t border-slate-700/40 bg-slate-900/60 space-y-1">
                    <div className="space-y-1">
                      {t.columns.map((col: any) => (
                        <div
                          key={col.name}
                          className="flex items-center justify-between text-[11px] font-mono py-0.5 border-b border-slate-800/40 last:border-none"
                        >
                          <div className="flex items-center space-x-1.5">
                            {col.isPrimaryKey && (
                              <span title="Primary Key">
                                <KeyRound className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              </span>
                            )}
                            <span className="text-slate-300">{col.name}</span>
                          </div>
                          <span className="text-slate-400 text-[10px]">{col.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sandbox Dialect Notice */}
        <div className="mt-3 p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-300/90 leading-tight">
          <span className="font-semibold text-blue-200">Active Engine:</span>{' '}
          {selectedEngine === 'pglite'
            ? 'PGlite WebAssembly (PostgreSQL 16). Full support for Window functions, JSONB, CTEs, locks & MVCC in-browser.'
            : 'AlaSQL in-memory engine. Fast SQL-99 generic practice with zero network round-trip.'}
        </div>
      </div>

      {/* Right Column: Query Editor & Results Table */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {/* Editor Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[360px]">
          {/* Editor Header Toolbar */}
          <div className="px-4 py-2.5 bg-slate-800/70 border-b border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">SQL Query Editor</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                {selectedEngine === 'pglite' ? 'Dialect: PostgreSQL' : 'Dialect: Generic SQL'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuery('')}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded border border-slate-700/60 hover:bg-slate-700 transition flex items-center space-x-1"
                title="Clear Editor"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>

              <button
                onClick={handleRunQuery}
                disabled={isRunning}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1.5 shadow-md shadow-emerald-900/20 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Query'}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 bg-[#1e1e1e]">
            <MonacoEditor
              height="100%"
              language="sql"
              theme="vs-dark"
              value={query}
              onChange={(val) => setQuery(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                suggestOnTriggerCharacters: true,
              }}
            />
          </div>
        </div>

        {/* Results Pane */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col flex-1 min-h-[350px]">
          {/* Results Status Header */}
          <div className="px-4 py-2.5 bg-slate-800/70 border-b border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-white">Execution Output</span>
              {outcome && (
                <div className="flex items-center space-x-3 text-xs">
                  {outcome.passed ? (
                    <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Success ({outcome.rowCount} rows)</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-rose-400 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Query Error</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1 text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{outcome.durationMs}ms</span>
                  </span>
                  {outcome.engineUsed && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                      Engine: {outcome.engineUsed === 'pglite' ? 'PGlite (Postgres)' : 'AlaSQL'}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              {selectedEngine === 'pglite' ? 'In-Browser PGlite WASM Session' : 'In-Memory AlaSQL Session'}
            </div>
          </div>

          {/* Results Content Body */}
          <div className="flex-1 overflow-auto p-4 bg-slate-950/60 font-mono text-xs">
            {outcome?.error ? (
              <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300">
                <div className="flex items-center space-x-2 font-bold mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Execution Failure:</span>
                </div>
                <pre className="text-xs whitespace-pre-wrap">{outcome.error}</pre>
              </div>
            ) : outcome && outcome.rows.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <Table className="w-8 h-8 text-slate-600 mb-2" />
                <p>Query returned 0 rows.</p>
              </div>
            ) : outcome && outcome.rows.length > 0 ? (
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-slate-200 border-b border-slate-700">
                      <th className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-r border-slate-700 w-12 text-center">
                        #
                      </th>
                      {outcome.columns.map((col) => (
                        <th
                          key={col}
                          className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-300 border-r border-slate-700/60 last:border-none"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outcome.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-1.5 px-3 text-[11px] text-slate-400 text-center border-r border-slate-800/60">
                          {idx + 1}
                        </td>
                        {outcome.columns.map((col) => {
                          const val = row[col];
                          const isNull = val === null || val === undefined;
                          return (
                            <td
                              key={col}
                              className="py-1.5 px-3 text-slate-200 border-r border-slate-800/60 last:border-none max-w-xs truncate"
                            >
                              {isNull ? (
                                <span className="text-amber-500/80 italic font-sans text-[10px]">NULL</span>
                              ) : typeof val === 'object' ? (
                                JSON.stringify(val)
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16 space-y-2">
                <Database className="w-10 h-10 text-slate-700" />
                <p className="text-sm">Click "Run Query" or press Ctrl+Enter to execute.</p>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <button
                    onClick={() => setQuery('SELECT * FROM ' + (dataset?.tables[0]?.name || 'products') + ' LIMIT 5;')}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700"
                  >
                    SELECT * FROM {dataset?.tables[0]?.name || 'table'}
                  </button>
                  <button
                    onClick={() => setQuery('SELECT count(*) AS total_count FROM ' + (dataset?.tables[0]?.name || 'products') + ';')}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700"
                  >
                    COUNT(*) Aggregation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
