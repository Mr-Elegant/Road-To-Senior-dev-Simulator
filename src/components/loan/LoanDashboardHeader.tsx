'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Landmark, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { fetchApplications } from '@/lib/redux/slices/applicationsSlice';
import { fetchDashboardStats } from '@/lib/redux/slices/dashboardSlice';
import { selectApplicationsStatus } from '@/lib/redux/selectors';

export function LoanDashboardHeader() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectApplicationsStatus);
  const isRefreshing = status === 'loading';

  const handleManualRefresh = () => {
    dispatch(fetchApplications());
    dispatch(fetchDashboardStats());
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
      <div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
          <Link
            href="/library"
            className="hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Challenge Catalog</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-200">React & Redux Toolkit</span>
          <span>/</span>
          <span className="text-blue-400 font-mono">Enterprise Loan Management</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Enterprise Loan Management Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                NBFC Underwriting Suite
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              High-concurrency underwriting simulation featuring Redux Toolkit, optimistic status updates, and race condition defenses.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={isRefreshing}
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-zinc-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
}

