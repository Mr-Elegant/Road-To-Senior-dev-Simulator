'use client';

import { requestSqlEvaluation } from '@/lib/evaluation/sqlClientEvaluation';

import React, { useState } from 'react';
import { SqlQuestion, SqlTrackProgressData, SqlAttempt } from '@/types/sqlTrack';
import { getSqlIncidentQuestions } from '@/data/sql';
import { storage } from '@/lib/persistence/localStorageAdapter';
import {
  AlertTriangle,
  Flame,
  Activity,
  Terminal,
  Server,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Clock,
  Layers,
  Database,
  Cpu,
  Lock,
  HardDrive
} from 'lucide-react';

interface SqlIncidentViewProps {
  progress?: SqlTrackProgressData;
  onProgressUpdate?: (updated: SqlTrackProgressData) => void;
}

export function SqlIncidentView({ progress, onProgressUpdate }: SqlIncidentViewProps) {
  const incidents = getSqlIncidentQuestions();
  const [selectedIncident, setSelectedIncident] = useState<SqlQuestion>(incidents[0]);

  // Form fields
  const [candidateAnalysis, setCandidateAnalysis] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [showPostMortem, setShowPostMortem] = useState<boolean>(false);

  const handleSelectIncident = (inc: SqlQuestion) => {
    setSelectedIncident(inc);
    setCandidateAnalysis('');
    setEvalResult(null);
    setShowPostMortem(false);
  };

  const handleEvaluateIncident = async () => {
    if (!candidateAnalysis.trim()) return;
    setIsEvaluating(true);
    try {
      const data = await requestSqlEvaluation(selectedIncident, { candidateAnalysis, isIncident: true });
      setEvalResult(data);

      if (data && typeof data.scoreOutOf100 === 'number') {
        const attempt: SqlAttempt = {
          id: `att_inc_${Date.now()}`,
          questionId: selectedIncident.id,
          tier: selectedIncident.tier,
          timestamp: new Date().toISOString(),
          mode: 'incident',
          candidateAnswer: candidateAnalysis,
          scoreOutOf100: data.scoreOutOf100,
          passed: data.passed,
          feedback: {
            technicalCorrectness: data.feedback?.rootCauseAccuracy || '',
            strengths: [data.feedback?.mitigationEvaluation || 'Incident evaluated'],
            improvements: data.feedback?.missingSafeguards || []
          },
          timeSpentSeconds: 180
        };
        const updated = await storage.saveSqlAttempt(attempt);
        if (onProgressUpdate) onProgressUpdate(updated);
      }
    } catch (e) {
      console.error('Incident evaluation failed:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const telemetry = selectedIncident.incidentDetails?.systemTelemetry;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left List of Incidents */}
      <div className="lg:col-span-4 space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>P0/P1 Production Incidents</span>
          </span>
          <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/80">
            {incidents.length} Active
          </span>
        </div>

        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {incidents.map((inc) => {
            const isSelected = inc.id === selectedIncident.id;
            return (
              <button
                key={inc.id}
                onClick={() => handleSelectIncident(inc)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-rose-950/30 border-rose-500/80 ring-1 ring-rose-500/40 text-white shadow-lg shadow-rose-950/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-rose-400 font-bold">Q{inc.order} &bull; INCIDENT</span>
                  <span className="text-slate-400">{inc.category}</span>
                </div>
                <h4 className="text-xs font-bold line-clamp-2 leading-snug">
                  {inc.title.replace('Production Incident: ', '')}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Incident Telemetry & Diagnostic Cockpit */}
      <div className="lg:col-span-8 space-y-5">
        {/* Incident Alert Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-red-950/20 to-slate-900 border border-rose-800/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-black text-[11px] font-black tracking-wider uppercase">
                CRITICAL P0
              </span>
              <span className="text-xs text-rose-300 font-mono">
                {selectedIncident.category}
              </span>
            </div>
            <span className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Live Outage</span>
            </span>
          </div>

          <h2 className="text-lg font-bold text-white leading-tight">
            {selectedIncident.title}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedIncident.realWorldScenario}
          </p>

          {/* Telemetry Metric Cards */}
          {telemetry && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block flex items-center space-x-1">
                  <Server className="w-3 h-3 text-cyan-400" />
                  <span>Connections</span>
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {telemetry.activeConnections ?? 'N/A'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Lock Waits</span>
                </span>
                <span className="text-sm font-mono font-bold text-amber-300">
                  {telemetry.lockWaitsCount ?? '0'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block flex items-center space-x-1">
                  <Cpu className="w-3 h-3 text-rose-400" />
                  <span>CPU Load</span>
                </span>
                <span className="text-sm font-mono font-bold text-rose-300">
                  {telemetry.cpuUtilizationPercent ? `${telemetry.cpuUtilizationPercent}%` : 'N/A'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block flex items-center space-x-1">
                  <HardDrive className="w-3 h-3 text-purple-400" />
                  <span>Lag / Retention</span>
                </span>
                <span className="text-sm font-mono font-bold text-purple-300">
                  {telemetry.replicationLagBytes
                    ? `${(telemetry.replicationLagBytes / 1024 / 1024 / 1024).toFixed(1)} GB`
                    : 'Normal'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Server Log Sniffer Terminal */}
        {telemetry?.logSnippet && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>/var/log/postgresql/postgresql.log (Tail)</span>
              </span>
              <span className="text-rose-400 animate-pulse font-bold">&bull; LIVE</span>
            </div>
            <pre className="p-4 text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto text-[11px] text-amber-200/90">
              {telemetry.logSnippet}
            </pre>
          </div>
        )}

        {/* Candidate Diagnostic Input */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Incident Response & Root Cause Analysis
              </h3>
              <p className="text-[11px] text-slate-400">
                1. Identify the exact root cause &bull; 2. State immediate containment commands &bull; 3. Propose permanent architectural safeguards
              </p>
            </div>
            <button
              onClick={handleEvaluateIncident}
              disabled={isEvaluating || !candidateAnalysis.trim()}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-rose-900/20 disabled:opacity-50 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-200" />
              <span>{isEvaluating ? 'Analyzing...' : 'Submit to SRE Lead'}</span>
            </button>
          </div>

          <textarea
            rows={6}
            value={candidateAnalysis}
            onChange={(e) => setCandidateAnalysis(e.target.value)}
            placeholder="Document root cause (e.g. process blocking chain, xmin pinning, lock queue order), exact remediation queries, and preventative configuration changes..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
          />
        </div>

        {/* AI SRE Evaluation Feedback */}
        {evalResult && (
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3 text-xs leading-relaxed animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-sm text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>SRE Lead Evaluation Verdict:</span>
              </span>
              <span className="font-mono text-base font-extrabold text-cyan-300">
                Score: {evalResult.scoreOutOf100}/100
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-bold text-cyan-400 block mb-0.5">Root Cause Diagnosis:</span>
                <p className="text-slate-300">{evalResult.feedback?.rootCauseAccuracy}</p>
              </div>

              <div>
                <span className="font-bold text-emerald-400 block mb-0.5">Mitigation & Containment:</span>
                <p className="text-slate-300">{evalResult.feedback?.mitigationEvaluation}</p>
              </div>

              {evalResult.feedback?.missingSafeguards?.length > 0 && (
                <div>
                  <span className="font-bold text-rose-400 block mb-0.5">Missing SRE Safeguards:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {evalResult.feedback.missingSafeguards.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reference Post-Mortem Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowPostMortem(!showPostMortem)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            {showPostMortem ? 'Hide Official Incident Post-Mortem' : 'Reveal Official Incident Post-Mortem & Runbook'}
          </button>

          {showPostMortem && (
            <div className="mt-3 p-5 rounded-xl bg-slate-900 border border-slate-700 space-y-3 text-xs leading-relaxed animate-in fade-in">
              <h4 className="font-bold text-white text-sm">
                Official Incident Post-Mortem & Production Runbook:
              </h4>
              <div className="text-slate-300 whitespace-pre-wrap font-sans">
                {selectedIncident.referenceAnswer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

