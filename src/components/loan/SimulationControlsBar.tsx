'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { selectSimulationConfig, selectActiveBugScenarioId, selectInterviewModeOpen } from '@/lib/redux/selectors';
import { setSimulationConfig, setActiveBugScenarioId, setInterviewModeOpen, addToast } from '@/lib/redux/slices/uiSlice';
import { fetchApplications, setSearchQuery } from '@/lib/redux/slices/applicationsSlice';
import { loanApiService } from '@/lib/api/loanService';
import { Sliders, Zap, WifiOff, Bug, MessageSquare, Play, Sparkles } from 'lucide-react';

export function SimulationControlsBar() {
  const dispatch = useAppDispatch();
  const config = useAppSelector(selectSimulationConfig);
  const activeBugId = useAppSelector(selectActiveBugScenarioId);
  const isInterviewOpen = useAppSelector(selectInterviewModeOpen);

  const handleLatencyChange = (latencyMs: number) => {
    dispatch(setSimulationConfig({ latencyMs }));
    loanApiService.setSimulationConfig({ latencyMs });
  };

  const handleFailureRateChange = (failureRate: number) => {
    dispatch(setSimulationConfig({ failureRate }));
    loanApiService.setSimulationConfig({ failureRate });
  };

  const handleToggleNetworkDrop = () => {
    const nextVal = !config.simulateNetworkDrop;
    dispatch(setSimulationConfig({ simulateNetworkDrop: nextVal }));
    loanApiService.setSimulationConfig({ simulateNetworkDrop: nextVal });

    dispatch(
      addToast({
        type: nextVal ? 'warning' : 'info',
        title: nextVal ? 'Network Drop Simulated' : 'Network Restored',
        message: nextVal
          ? 'Next API requests will throw connection failure to test error boundary and retry behavior.'
          : 'Normal network connectivity restored.',
      })
    );
  };

  /**
   * Interactive test for Bug 1 (Race Condition):
   * Dispatches a slow query for "Aarav" (takes 1800ms),
   * followed 200ms later by a fast query for "Sophia" (takes 200ms).
   * Verifies that the slower "Aarav" response does NOT stomp the "Sophia" result!
   */
  const handleTestRaceCondition = () => {
    dispatch(
      addToast({
        type: 'info',
        title: 'Triggering Asynchronous Race Condition Test',
        message: 'Dispatching slow query "Aarav" (1800ms) followed by fast query "Sophia" (200ms)...',
        autoDismissMs: 5000,
      })
    );

    // 1. Dispatch slow search for "Aarav" with 1800ms custom latency
    dispatch(setSearchQuery('Aarav'));
    dispatch(fetchApplications({ customLatency: 1800 }));

    // 2. 200ms later, dispatch fast search for "Sophia" with 200ms latency
    setTimeout(() => {
      dispatch(setSearchQuery('Sophia'));
      dispatch(fetchApplications({ customLatency: 200 }));
    }, 200);
  };

  return (
    <div className="bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-950/90 border border-zinc-800 rounded-2xl p-4 backdrop-blur-md shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs">
      {/* Left side: Simulation Badges & Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>Production Simulation:</span>
        </div>

        {/* Latency Presets */}
        <div className="flex items-center gap-1.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800">
          <span className="text-[11px] text-zinc-400 px-1.5">Latency:</span>
          {[
            { label: 'Fast (0ms)', ms: 0 },
            { label: 'Normal (300ms)', ms: 300 },
            { label: 'Slow (800ms)', ms: 800 },
            { label: 'Laggy (2000ms)', ms: 2000 },
          ].map((item) => (
            <button
              key={item.ms}
              onClick={() => handleLatencyChange(item.ms)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                config.latencyMs === item.ms
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Network Error Injection */}
        <div className="flex items-center gap-1.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800">
          <span className="text-[11px] text-zinc-400 px-1.5">Failure Rate:</span>
          {[
            { label: '0%', rate: 0 },
            { label: '25%', rate: 0.25 },
            { label: '50%', rate: 0.5 },
          ].map((item) => (
            <button
              key={item.rate}
              onClick={() => handleFailureRateChange(item.rate)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                config.failureRate === item.rate
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Network Drop Toggle */}
        <button
          onClick={handleToggleNetworkDrop}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all ${
            config.simulateNetworkDrop
              ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
              : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
          }`}
        >
          <WifiOff className="w-3.5 h-3.5" />
          {config.simulateNetworkDrop ? 'Network: OFFLINE' : 'Simulate Offline'}
        </button>

        {/* Race Condition Test Trigger */}
        <button
          onClick={handleTestRaceCondition}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 font-medium transition-colors"
          title="Fires slow query followed by fast query to test request ID monotonic guards"
        >
          <Play className="w-3 h-3" />
          Test Race Condition
        </button>
      </div>

      {/* Right side: Bug Scenarios & Interview Mode Toggles */}
      <div className="flex items-center gap-2">
        {/* Bug Scenarios Drawer Toggle */}
        <button
          onClick={() => dispatch(setActiveBugScenarioId(activeBugId ? null : 'bug-1-race-condition'))}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            activeBugId
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600'
          }`}
        >
          <Bug className="w-3.5 h-3.5" />
          <span>8 Production Bugs</span>
        </button>

        {/* Interview Mode Toggle */}
        <button
          onClick={() => dispatch(setInterviewModeOpen(!isInterviewOpen))}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
            isInterviewOpen
              ? 'bg-purple-600 text-white shadow-purple-500/20'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Senior Interview Mode</span>
        </button>
      </div>
    </div>
  );
}

