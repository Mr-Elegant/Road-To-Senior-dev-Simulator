'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { selectSelectedApplication, selectIsDetailsDrawerOpen, selectUpdatingIds } from '@/lib/redux/selectors';
import { setDetailsDrawerOpen, openConfirmModal } from '@/lib/redux/slices/uiSlice';
import { LoanStatus } from '@/types/loan';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  CreditCard,
  Percent,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
} from 'lucide-react';

export function LoanDetailsDrawer() {
  const dispatch = useAppDispatch();
  const application = useAppSelector(selectSelectedApplication);
  const isOpen = useAppSelector(selectIsDetailsDrawerOpen);
  const updatingIds = useAppSelector(selectUpdatingIds);

  const isUpdating = application ? Boolean(updatingIds[application.id]) : false;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(setDetailsDrawerOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dispatch]);

  if (!isOpen || !application) return null;

  const handleAction = (targetStatus: LoanStatus) => {
    dispatch(
      openConfirmModal({
        applicationId: application.id,
        applicantName: application.applicantName,
        targetStatus,
      })
    );
  };

  const isApproved = application.status === 'APPROVED';
  const isRejected = application.status === 'REJECTED';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => dispatch(setDetailsDrawerOpen(false))}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-xl w-full flex">
        <div className="w-full bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/60 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {application.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                      isApproved
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : isRejected
                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {application.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">{application.applicantName}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">{application.purpose}</p>
              </div>

              <button
                onClick={() => dispatch(setDetailsDrawerOpen(false))}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Financial Overview Card */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Requested Loan Facility
              </span>
              <div className="text-3xl font-black text-white mt-1 tracking-tight">
                {application.currency === 'INR' ? '₹' : '$'}
                {application.loanAmount.toLocaleString()}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                <span>Facility: <strong className="text-zinc-200">{application.loanType}</strong></span>
                <span>•</span>
                <span>Officer: <strong className="text-zinc-200">{application.assignedOfficer}</strong></span>
              </div>
            </div>

            {/* Underwriting Metrics Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Risk & Underwriting Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Credit Score */}
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                    <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                    <span>Credit Score (Bureau)</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-zinc-100">
                    {application.creditScore}
                    <span className="text-xs font-normal text-zinc-400 ml-1.5">
                      ({application.creditScore >= 750 ? 'Excellent' : application.creditScore >= 680 ? 'Good' : 'Sub-prime'})
                    </span>
                  </div>
                </div>

                {/* Annual Income */}
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Annual Income</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-zinc-100">
                    {application.currency === 'INR' ? '₹' : '$'}
                    {application.annualIncome.toLocaleString()}
                  </div>
                </div>

                {/* DTI Ratio */}
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                    <Percent className="w-3.5 h-3.5 text-purple-400" />
                    <span>Debt-to-Income (DTI)</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-zinc-100">
                    {application.debtToIncomeRatio}%
                    <span className="text-xs font-normal text-zinc-400 ml-1.5">
                      (Cap: 45%)
                    </span>
                  </div>
                </div>

                {/* Risk Rating */}
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                    {application.riskRating === 'LOW' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span>Risk Classification</span>
                  </div>
                  <div className="text-lg font-bold text-zinc-100">
                    {application.riskRating}
                  </div>
                </div>
              </div>
            </div>

            {/* Applicant Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Applicant Information
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-900/40 text-zinc-300">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono">{application.applicantEmail}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-900/40 text-zinc-300">
                  <Phone className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono">{application.applicantPhone}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-900/40 text-zinc-300">
                  <Briefcase className="w-4 h-4 text-zinc-500" />
                  <span>Employment: <strong>{application.employmentStatus}</strong></span>
                </div>
              </div>
            </div>

            {/* Underwriting Notes */}
            {application.notes.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Officer Underwriting Notes
                </h3>
                <ul className="space-y-1.5">
                  {application.notes.map((note, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/60">
                      <FileText className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Audit Trail / Timeline */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Audit Timeline & Lifecycle
              </h3>
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-zinc-800">
                {application.timeline.map((event) => (
                  <div key={event.id} className="relative flex items-start gap-3 text-xs pl-1">
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center flex-shrink-0 z-10 text-zinc-400">
                      <Clock className="w-3 h-3" />
                    </div>
                    <div className="flex-1 bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-200">{event.action}</span>
                        <span className="text-[11px] text-zinc-500">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">By {event.actor}</div>
                      {event.note && <div className="text-zinc-300 text-[11px] mt-1 italic">{event.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons in Footer */}
          <div className="p-6 border-t border-zinc-800/80 bg-zinc-900/70 sticky bottom-0 z-10 backdrop-blur-md flex items-center justify-end gap-3">
            <button
              onClick={() => dispatch(setDetailsDrawerOpen(false))}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>

            {!isRejected && (
              <button
                disabled={isUpdating}
                onClick={() => handleAction('REJECTED')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/40 text-red-300 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-40 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject Application
              </button>
            )}

            {!isApproved && (
              <button
                disabled={isUpdating}
                onClick={() => handleAction('APPROVED')}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve Loan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

