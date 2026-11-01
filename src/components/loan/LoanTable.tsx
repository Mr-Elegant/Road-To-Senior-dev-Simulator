'use client';

import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import {
  selectApplicationsList,
  selectApplicationsStatus,
  selectApplicationsError,
  selectSorting,
  selectUpdatingIds,
} from '@/lib/redux/selectors';
import {
  setSorting,
  selectApplication,
  fetchApplications,
  resetFilters,
} from '@/lib/redux/slices/applicationsSlice';
import { openConfirmModal, setDetailsDrawerOpen } from '@/lib/redux/slices/uiSlice';
import { LoanTableRow } from './LoanTableRow';
import { SortField, LoanStatus } from '@/types/loan';
import { ArrowUpDown, ArrowUp, ArrowDown, AlertCircle, RefreshCw, Inbox } from 'lucide-react';

export function LoanTable() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectApplicationsList);
  const status = useAppSelector(selectApplicationsStatus);
  const error = useAppSelector(selectApplicationsError);
  const sorting = useAppSelector(selectSorting);
  const updatingIds = useAppSelector(selectUpdatingIds);

  const isLoading = status === 'loading';
  const isFailed = status === 'failed';

  // Stable handlers with useCallback to prevent re-rendering memoized rows
  const handleSelectRow = useCallback(
    (id: string) => {
      dispatch(selectApplication(id));
      dispatch(setDetailsDrawerOpen(true));
    },
    [dispatch]
  );

  const handleRequestStatusChange = useCallback(
    (applicationId: string, applicantName: string, targetStatus: LoanStatus) => {
      dispatch(openConfirmModal({ applicationId, applicantName, targetStatus }));
    },
    [dispatch]
  );

  const handleSort = useCallback(
    (field: SortField) => {
      dispatch(setSorting({ field }));
      // Fetch fresh sorted page from server/mock API
      dispatch(fetchApplications());
    },
    [dispatch]
  );

  const renderSortIcon = (field: SortField) => {
    if (sorting.field !== field) {
      return <ArrowUpDown className="w-3 h-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sorting.order === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-400 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-400 font-bold" />
    );
  };

  // 1. Error State with Retry Button (Senior Fix for Bug 8)
  if (isFailed && items.length === 0) {
    return (
      <div className="bg-zinc-900/60 border border-red-500/30 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3">
        <div className="p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-zinc-100">Unable to Load Loan Applications</h3>
        <p className="text-sm text-zinc-400 max-w-md">{error || 'Network connection failed or service is unavailable.'}</p>
        <button
          onClick={() => dispatch(fetchApplications())}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/60 text-xs font-semibold text-zinc-400 tracking-wider uppercase select-none">
              {/* ID Header */}
              <th className="py-3 px-4">Application ID</th>

              {/* Applicant Header (Sortable) */}
              <th
                onClick={() => handleSort('applicantName')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Applicant</span>
                  {renderSortIcon('applicantName')}
                </div>
              </th>

              {/* Loan Amount Header (Sortable) */}
              <th
                onClick={() => handleSort('loanAmount')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Loan Amount</span>
                  {renderSortIcon('loanAmount')}
                </div>
              </th>

              {/* Loan Type */}
              <th className="py-3 px-4">Type & Risk</th>

              {/* Date Header (Sortable) */}
              <th
                onClick={() => handleSort('applicationDate')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Applied On</span>
                  {renderSortIcon('applicationDate')}
                </div>
              </th>

              {/* Status Header */}
              <th className="py-3 px-4">Status</th>

              {/* Actions Header */}
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60">
            {/* Loading Skeletons */}
            {isLoading && items.length === 0 ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-4 bg-zinc-800 rounded w-24"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-zinc-800 rounded w-36 mb-1.5"></div>
                    <div className="h-3 bg-zinc-800/60 rounded w-48"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-zinc-800 rounded w-28 mb-1.5"></div>
                    <div className="h-3 bg-zinc-800/60 rounded w-16"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-zinc-800 rounded w-20 mb-1.5"></div>
                    <div className="h-3 bg-zinc-800/60 rounded w-14"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-zinc-800 rounded w-24"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 bg-zinc-800 rounded-full w-24"></div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-6 bg-zinc-800 rounded-lg w-16 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              /* Empty State */
              <tr>
                <td colSpan={7} className="py-16 px-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div className="p-3 rounded-full bg-zinc-800/60 text-zinc-400">
                      <Inbox className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-medium text-zinc-200">No applications match your filter</h4>
                    <p className="text-xs text-zinc-500 max-w-sm">
                      Try adjusting your search query, status filters, or loan categories.
                    </p>
                    <button
                      onClick={() => dispatch(resetFilters())}
                      className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              /* Populated Rows */
              items.map((application) => (
                <LoanTableRow
                  key={application.id}
                  application={application}
                  isUpdating={Boolean(updatingIds[application.id])}
                  onSelect={handleSelectRow}
                  onRequestStatusChange={handleRequestStatusChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

