'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  Trash2,
  Layers,
  RefreshCw,
  CloudUpload,
  CloudDownload,
  Server,
  Zap,
} from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import { storage } from '@/lib/persistence/localStorageAdapter';

interface DbStatus {
  connected: boolean;
  provider?: string;
  latencyMs?: number;
  stats?: {
    users: number;
    attempts: number;
  };
  error?: string;
}

export default function SettingsWorkspace() {
  const { theme, setTheme } = useTheme();
  const [storageBytes, setStorageBytes] = useState(0);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const checkDbStatus = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch('/api/progress/status');
      const data = await res.json();
      setDbStatus(data);
    } catch (err: any) {
      setDbStatus({
        connected: false,
        error: err?.message || 'Could not reach status API',
      });
    } finally {
      setIsCheckingDb(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(storage.scopedKey('fullstack_interview_lab_progress_v1')) || '';
      setStorageBytes(new Blob([raw]).size);
    }
    checkDbStatus();
  }, []);

  const handleClear = async () => {
    if (confirm('Clear local storage and reset all challenge attempt records in database and browser?')) {
      await storage.resetProgress();
      setStorageBytes(0);
      setActionMessage({ text: 'Storage and database records reset successfully.', type: 'success' });
      setTimeout(() => setActionMessage(null), 3500);
      checkDbStatus();
    }
  };

  const handleSyncToPostgres = async () => {
    setIsSyncing(true);
    try {
      const res = await storage.syncAllToPostgres();
      if (res.success) {
        setActionMessage({ text: res.message, type: 'success' });
        checkDbStatus();
      } else {
        setActionMessage({ text: res.message, type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err?.message || 'Failed to sync to PostgreSQL', type: 'error' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handlePullFromPostgres = async () => {
    setIsSyncing(true);
    try {
      const res = await storage.fetchFromPostgres();
      if (res.success) {
        const raw = localStorage.getItem(storage.scopedKey('fullstack_interview_lab_progress_v1')) || '';
        setStorageBytes(new Blob([raw]).size);
        setActionMessage({ text: res.message, type: 'success' });
      } else {
        setActionMessage({ text: res.message, type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err?.message || 'Failed to pull from PostgreSQL', type: 'error' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Platform Preferences & Storage Infrastructure</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Configure appearance, monitor live PostgreSQL & Prisma cloud persistence, and manage data synchronization.
        </p>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-xs transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Theme Settings */}
      <div className="rounded-2xl glass-card p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Interface Appearance
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Select your preferred color theme for code editors, diagrams, and dashboards
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30 shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Dark (Default)</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30 shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
              theme === 'system'
                ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30 shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <Monitor className="w-4 h-4 text-blue-400" />
            <span>System Preference</span>
          </button>
        </div>
      </div>

      {/* Persistence Architecture Status */}
      <div className="rounded-2xl glass-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>Persistence & Database Engine</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Live dual-persistence: Sub-millisecond browser cache + Cloud PostgreSQL via Prisma
            </p>
          </div>
          <button
            onClick={checkDbStatus}
            disabled={isCheckingDb}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
            <span>Test DB Ping</span>
          </button>
        </div>

        {/* PostgreSQL Database Status Box */}
        <div
          className={`p-4 rounded-xl border space-y-3 transition-all ${
            dbStatus?.connected
              ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {dbStatus?.connected ? 'PostgreSQL Database: CONNECTED & SYNCED' : 'Database Status: Checking...'}
              </span>
            </div>
            {dbStatus?.connected && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {dbStatus.latencyMs}ms Ping
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                  Neon Tech AWS
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Engine</div>
              <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">PostgreSQL (Prisma v6)</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Cloud Attempts</div>
              <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {dbStatus?.stats?.attempts ?? 0} Recorded
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Local Cache</div>
              <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">{storageBytes} bytes</div>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Account attempts, notes, and bookmarks are saved on this device and synced to your account. If a sync fails, your device copy remains available. Use Account to import anonymous progress deliberately.
          </p>

          {/* Sync Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <button
              onClick={handleSyncToPostgres}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              <CloudUpload className="w-3.5 h-3.5" />
              <span>Merge device progress into account</span>
            </button>

            <button
              onClick={handlePullFromPostgres}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <CloudDownload className="w-3.5 h-3.5" />
              <span>Pull from PostgreSQL</span>
            </button>
          </div>
        </div>

        {/* Schema Information */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Relational Schema & Tables
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/20">
              Synced
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Active models: <code className="font-mono text-zinc-700 dark:text-zinc-300">User</code>,{' '}
            <code className="font-mono text-zinc-700 dark:text-zinc-300">ScenarioAttempt</code>,{' '}
            <code className="font-mono text-zinc-700 dark:text-zinc-300">Bookmark</code>,{' '}
            <code className="font-mono text-zinc-700 dark:text-zinc-300">UserNote</code>. Schema changes are managed via Prisma CLI.
          </p>
        </div>

        {/* Cache and Storage Cleanup */}
        <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80">
          <div>
            <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Clear Storage & Reset
            </div>
            <div className="text-[11px] text-zinc-500">
              Permanently clears stored attempts in browser and resets database records
            </div>
          </div>

          <button
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Storage & Database</span>
          </button>
        </div>
      </div>
    </div>
  );
}
