'use client';

import React from 'react';
import { LoanApplication, LoanStatus } from '@/types/loan';
import { Check, X, ShieldAlert, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';

export interface LoanTableRowProps {
  application: LoanApplication;
  isUpdating: boolean;
  onSelect: (id: string) => void;
  onRequestStatusChange: (id: string, name: string, status: LoanStatus) => void;
}

function formatAmount(amount: number, currency: string): string {
  if (currency === 'INR') {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Senior Optimization (Bug 6 fix): Wrapped in React.memo to ensure row only re-renders
 * when its own data, updating state, or callbacks change, shielding it from parent keystroke re-renders!
 */
export const LoanTableRow = React.memo(function LoanTableRow({
  application,
  isUpdating,
  onSelect,
  onRequestStatusChange,
}: LoanTableRowProps) {
  const isApproved = application.status === 'APPROVED';
  const isRejected = application.status === 'REJECTED';
  const isPending = application.status === 'PENDING';
  const isUnderReview = application.status === 'UNDER_REVIEW';

  const riskBadgeColor =
    application.riskRating === 'LOW'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : application.riskRating === 'MEDIUM'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-red-500/10 text-red-400 border-red-500/20';

  const statusBadgeColor = isApproved
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    : isRejected
    ? 'bg-red-500/20 text-red-300 border-red-500/40'
    : isUnderReview
    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

  return (
    <tr
      onClick={() => onSelect(application.id)}
      className="group border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors cursor-pointer text-sm"
    >
      {/* Application ID */}
      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-blue-400 group-hover:text-blue-300 whitespace-nowrap">
        {application.id}
      </td>

      {/* Applicant Info */}
      <td className="py-3.5 px-4">
        <div className="font-medium text-zinc-100 group-hover:text-white transition-colors">
          {application.applicantName}
        </div>
        <div className="text-xs text-zinc-400 truncate max-w-[200px]">
          {application.applicantEmail}
        </div>
      </td>

      {/* Loan Amount */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="font-semibold text-zinc-100">
          {formatAmount(application.loanAmount, application.currency)}
        </div>
        <div className="text-[11px] text-zinc-400">
          Score: <span className="font-mono text-zinc-300">{application.creditScore}</span>
        </div>
      </td>

      {/* Loan Type & Risk */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="text-zinc-200 font-medium">{application.loanType}</div>
        <div className="mt-0.5">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${riskBadgeColor}`}
          >
            {application.riskRating === 'LOW' && <ShieldCheck className="w-2.5 h-2.5" />}
            {application.riskRating === 'HIGH' && <ShieldAlert className="w-2.5 h-2.5" />}
            {application.riskRating} RISK
          </span>
        </div>
      </td>

      {/* Application Date */}
      <td className="py-3.5 px-4 text-xs text-zinc-400 whitespace-nowrap">
        {formatDate(application.applicationDate)}
      </td>

      {/* Status Badge */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${statusBadgeColor}`}
        >
          {isUpdating ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              Updating...
            </span>
          ) : (
            application.status.replace('_', ' ')
          )}
        </span>
      </td>

      {/* Quick Actions (Approve / Reject) */}
      <td
        className="py-3.5 px-4 whitespace-nowrap text-right"
        onClick={(e) => e.stopPropagation()} // Prevent opening details drawer when clicking buttons
      >
        <div className="flex items-center justify-end gap-1.5">
          {/* Quick Approve Button */}
          {!isApproved && (
            <button
              disabled={isUpdating}
              onClick={() => onRequestStatusChange(application.id, application.applicantName, 'APPROVED')}
              title="Approve Application"
              className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Quick Reject Button */}
          {!isRejected && (
            <button
              disabled={isUpdating}
              onClick={() => onRequestStatusChange(application.id, application.applicantName, 'REJECTED')}
              title="Reject Application"
              className="p-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* View Drawer Arrow */}
          <button
            onClick={() => onSelect(application.id)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="View Details"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

