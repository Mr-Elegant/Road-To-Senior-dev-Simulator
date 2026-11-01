'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { selectFilters, selectPagination, selectActiveFilterCount } from '@/lib/redux/selectors';
import {
  setSearchQuery,
  setStatusFilter,
  setLoanTypeFilter,
  setRiskRatingFilter,
  setPageSize,
  resetFilters,
} from '@/lib/redux/slices/applicationsSlice';
import { LoanStatus, LoanType, RiskRating } from '@/types/loan';
import { Search, RotateCcw, Filter, SlidersHorizontal, X } from 'lucide-react';

export function LoanFiltersBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const pagination = useAppSelector(selectPagination);
  const activeCount = useAppSelector(selectActiveFilterCount);

  // Local state for debounced search input to demonstrate senior optimization (Bug 6 fix)
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Synchronize local search if Redux filters are reset externally
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // Debounce dispatching search query to Redux by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== filters.search) {
        dispatch(setSearchQuery(localSearch));
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, filters.search, dispatch]);

  const handleStatusChange = useCallback(
    (status: LoanStatus | 'ALL') => {
      dispatch(setStatusFilter(status));
    },
    [dispatch]
  );

  const statuses: { label: string; value: LoanStatus | 'ALL'; color: string }[] = [
    { label: 'All Statuses', value: 'ALL', color: 'zinc' },
    { label: 'Pending', value: 'PENDING', color: 'amber' },
    { label: 'Under Review', value: 'UNDER_REVIEW', color: 'blue' },
    { label: 'Approved', value: 'APPROVED', color: 'emerald' },
    { label: 'Rejected', value: 'REJECTED', color: 'red' },
  ];

  const loanTypes: (LoanType | 'ALL')[] = [
    'ALL',
    'Personal',
    'Business',
    'Mortgage',
    'Vehicle',
    'Education',
  ];

  const riskRatings: (RiskRating | 'ALL')[] = ['ALL', 'LOW', 'MEDIUM', 'HIGH'];

  return (
    <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-md shadow-lg flex flex-col gap-3">
      {/* Top row: Search input & Status Pills */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Debounced Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by ID, applicant name, email, or purpose..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-zinc-950/80 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                dispatch(setSearchQuery(''));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {statuses.map((s) => {
            const isSelected = filters.status === s.value;
            return (
              <button
                key={s.value}
                onClick={() => handleStatusChange(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isSelected
                    ? s.value === 'ALL'
                      ? 'bg-zinc-100 text-zinc-900 border-zinc-100 shadow-sm'
                      : s.value === 'PENDING'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : s.value === 'UNDER_REVIEW'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      : s.value === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-red-500/20 text-red-300 border-red-500/50'
                    : 'bg-zinc-950/40 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Secondary Filters, Page Size, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Loan Type */}
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="font-medium">Type:</span>
            <select
              value={filters.loanType}
              onChange={(e) => dispatch(setLoanTypeFilter(e.target.value as LoanType | 'ALL'))}
              className="bg-zinc-950/80 border border-zinc-800 text-zinc-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {loanTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Loan Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Rating */}
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="font-medium">Risk:</span>
            <select
              value={filters.riskRating}
              onChange={(e) => dispatch(setRiskRatingFilter(e.target.value as RiskRating | 'ALL'))}
              className="bg-zinc-950/80 border border-zinc-800 text-zinc-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {riskRatings.map((r) => (
                <option key={r} value={r}>
                  {r === 'ALL' ? 'All Risk Tiers' : `${r} Risk`}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Badge */}
          {activeCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Filter className="w-3 h-3" />
              {activeCount} active filter{activeCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Page Size Selector */}
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Show:</span>
            <select
              value={pagination.limit}
              onChange={(e) => dispatch(setPageSize(parseInt(e.target.value, 10)))}
              className="bg-zinc-950/80 border border-zinc-800 text-zinc-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="5">5 / page</option>
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {activeCount > 0 && (
            <button
              onClick={() => {
                setLocalSearch('');
                dispatch(resetFilters());
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

