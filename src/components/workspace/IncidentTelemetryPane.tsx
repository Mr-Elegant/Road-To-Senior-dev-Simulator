'use client';

import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Users,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { IncidentTelemetry } from '@/types/scenario';

interface IncidentTelemetryPaneProps {
  telemetry: IncidentTelemetry;
  rootCauseHypothesis: string;
  onRootCauseChange: (val: string) => void;
  evidence: string;
  onEvidenceChange: (val: string) => void;
  immediateMitigation: string;
  onImmediateMitigationChange: (val: string) => void;
  permanentCorrection: string;
  onPermanentCorrectionChange: (val: string) => void;
  regressionTests: string;
  onRegressionTestsChange: (val: string) => void;
  monitoringPlan: string;
  onMonitoringPlanChange: (val: string) => void;
}

export function IncidentTelemetryPane({
  telemetry,
  rootCauseHypothesis,
  onRootCauseChange,
  evidence,
  onEvidenceChange,
  immediateMitigation,
  onImmediateMitigationChange,
  permanentCorrection,
  onPermanentCorrectionChange,
  regressionTests,
  onRegressionTestsChange,
  monitoringPlan,
  onMonitoringPlanChange,
}: IncidentTelemetryPaneProps) {
  const [telemetryTab, setTelemetryTab] = useState<'logs' | 'metrics' | 'reports' | 'commits'>('logs');
  const [logFilter, setLogFilter] = useState<string>('ALL');

  const filteredLogs = telemetry.logs.filter((l) => {
    if (logFilter === 'ALL') return true;
    return l.level === logFilter;
  });

  return (
    <div className="h-full flex flex-col lg:flex-row bg-zinc-950 text-zinc-100 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
      {/* Left Column: Simulated Production Telemetry (Logs, Metrics, Reports, Commits) */}
      <div className="lg:w-1/2 flex flex-col h-full overflow-hidden">
        {/* Telemetry Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-2 flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTelemetryTab('logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                telemetryTab === 'logs'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>System Logs ({telemetry.logs.length})</span>
            </button>

            <button
              onClick={() => setTelemetryTab('metrics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                telemetryTab === 'metrics'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>APM Metrics ({telemetry.metrics.length})</span>
            </button>

            <button
              onClick={() => setTelemetryTab('reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                telemetryTab === 'reports'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer Impact</span>
            </button>

            <button
              onClick={() => setTelemetryTab('commits')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                telemetryTab === 'commits'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Deployments ({telemetry.recentDeployments.length})</span>
            </button>
          </div>

          {telemetryTab === 'logs' && (
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="py-1 px-2 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono text-zinc-300 focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="ERROR">ERROR</option>
              <option value="FATAL">FATAL</option>
              <option value="WARN">WARN</option>
              <option value="INFO">INFO</option>
            </select>
          )}
        </div>

        {/* Telemetry Display View */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-3">
          {telemetryTab === 'logs' && (
            <div className="space-y-2">
              {filteredLogs.map((log, idx) => {
                let badgeColor = 'text-zinc-400 bg-zinc-800';
                if (log.level === 'FATAL' || log.level === 'ERROR')
                  badgeColor = 'text-rose-400 bg-rose-950/80 border border-rose-900';
                else if (log.level === 'WARN')
                  badgeColor = 'text-amber-400 bg-amber-950/80 border border-amber-900';

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 leading-relaxed font-mono text-[11px]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-zinc-500">{log.timestamp}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>
                        {log.level}
                      </span>
                      <span className="text-blue-400">[{log.service}]</span>
                    </div>
                    <div className="text-zinc-200">{log.message}</div>
                  </div>
                );
              })}
            </div>
          )}

          {telemetryTab === 'metrics' && (
            <div className="space-y-3">
              {telemetry.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/70 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200">{m.metricName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        m.status === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                    <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                      <div className="text-zinc-500">Normal Baseline</div>
                      <div className="font-bold text-zinc-300 mt-0.5">{m.baseline}</div>
                    </div>
                    <div className="p-2 rounded bg-rose-950/40 border border-rose-900/60">
                      <div className="text-rose-400">Incident Peak</div>
                      <div className="font-bold text-rose-300 mt-0.5">{m.incidentPeak}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-400 italic pt-1 font-sans">
                    Trend: {m.trend}
                  </div>
                </div>
              ))}
            </div>
          )}

          {telemetryTab === 'reports' && (
            <div className="space-y-3 font-sans">
              {telemetry.customerReports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">{r.reporter}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400">
                      Impact: {r.impact}
                    </span>
                  </div>
                  <blockquote className="text-xs text-zinc-300 italic border-l-2 border-zinc-700 pl-3 py-1">
                    &quot;{r.quote}&quot;
                  </blockquote>
                </div>
              ))}
            </div>
          )}

          {telemetryTab === 'commits' && (
            <div className="space-y-4 font-sans">
              {telemetry.recentDeployments.map((d) => (
                <div
                  key={d.commitHash}
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-400 font-bold">{d.commitHash}</span>
                    <span className="text-zinc-500">{d.timeAgo}</span>
                  </div>
                  <div className="text-xs font-medium text-zinc-200">{d.message}</div>
                  <div className="text-[11px] text-zinc-400">Author: {d.author}</div>
                  {d.diffSnippet && (
                    <div className="mt-2 p-3 rounded-lg bg-black border border-zinc-800 font-mono text-[11px] overflow-x-auto text-zinc-300 whitespace-pre">
                      {d.diffSnippet}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Required Candidate Production Incident Response Form (6 Pillars) */}
      <div className="lg:w-1/2 flex flex-col h-full overflow-hidden bg-zinc-900/40">
        <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-2.5 flex items-center justify-between">
          <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Incident Response Protocol (6 Pillars)</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">Evaluated on Rubric</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* 1. Root Cause Hypothesis */}
          <div>
            <label className="block font-semibold text-zinc-200 mb-1">
              1. Root-Cause Hypothesis
            </label>
            <p className="text-[11px] text-zinc-400 mb-2">
              Explain precisely why production failed at the architectural or code level.
            </p>
            <textarea
              rows={3}
              value={rootCauseHypothesis}
              onChange={(e) => onRootCauseChange(e.target.value)}
              placeholder="e.g. Commit c4e910a introduced an unbounded in-memory array that leaked HTTP request bodies..."
              className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>

          {/* 2. Evidence Supporting Hypothesis */}
          <div>
            <label className="block font-semibold text-zinc-200 mb-1">
              2. Evidence Supporting Hypothesis
            </label>
            <p className="text-[11px] text-zinc-400 mb-2">
              Cite specific telemetry metrics, timestamps, logs, or commit diffs.
            </p>
            <textarea
              rows={3}
              value={evidence}
              onChange={(e) => onEvidenceChange(e.target.value)}
              placeholder="e.g. Prometheus RSS slope shows steady 200MB/hr growth until 1024MB limit, matching exit code 137 at 16:15..."
              className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>

          {/* 3. Immediate Mitigation */}
          <div>
            <label className="block font-semibold text-zinc-200 mb-1">
              3. Immediate Mitigation (Stabilization)
            </label>
            <p className="text-[11px] text-zinc-400 mb-2">
              What immediate action will stop active customer impact right now?
            </p>
            <textarea
              rows={2}
              value={immediateMitigation}
              onChange={(e) => onImmediateMitigationChange(e.target.value)}
              placeholder="e.g. Execute `kubectl rollout undo deployment/api-core` to restore previous stable image..."
              className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>

          {/* 4. Permanent Correction */}
          <div>
            <label className="block font-semibold text-zinc-200 mb-1">
              4. Permanent Architectural Correction
            </label>
            <p className="text-[11px] text-zinc-400 mb-2">
              How will you refactor the code/system to solve the root problem?
            </p>
            <textarea
              rows={3}
              value={permanentCorrection}
              onChange={(e) => onPermanentCorrectionChange(e.target.value)}
              placeholder="e.g. Replace global array with bounded LRU ring buffer (max 500 items) or stream to OpenTelemetry collector..."
              className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>

          {/* 5. Regression Tests */}
          <div>
            <label className="block font-semibold text-zinc-200 mb-1">
              5. Regression Testing Strategy
            </label>
            <p className="text-[11px] text-zinc-400 mb-2">
              What automated test will guarantee this specific failure never returns?
            </p>
            <textarea
              rows={2}
              value={regressionTests}
              onChange={(e) => onRegressionTestsChange(e.target.value)}
              placeholder="e.g. Unit test that passes 10,000 synthetic requests and asserts buffer size <= 500..."
              className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>

          {/* 6. Monitoring & Alerting Improvements */}
          <div>
            <label className="block font-semibold text-zinc-200 mb-1">
              6. Monitoring & Alerting Improvements
            </label>
            <p className="text-[11px] text-zinc-400 mb-2">
              Define PromQL alerting rules, SLO thresholds, or telemetry guards.
            </p>
            <textarea
              rows={2}
              value={monitoringPlan}
              onChange={(e) => onMonitoringPlanChange(e.target.value)}
              placeholder="e.g. Alert: container_memory_working_set_bytes / container_spec_memory_limit_bytes > 0.85 for 5m..."
              className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

