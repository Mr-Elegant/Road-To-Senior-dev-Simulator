'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { selectConfirmModal, selectUpdatingIds } from '@/lib/redux/selectors';
import { closeConfirmModal } from '@/lib/redux/slices/uiSlice';
import { updateApplicationStatus } from '@/lib/redux/slices/applicationsSlice';
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

export function StatusConfirmationModal() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector(selectConfirmModal);
  const updatingIds = useAppSelector(selectUpdatingIds);

  const [note, setNote] = useState('');
  const [simulateFailure, setSimulateFailure] = useState(false);

  if (!modal.isOpen || !modal.applicationId || !modal.targetStatus) return null;

  const isApproved = modal.targetStatus === 'APPROVED';
  const isUpdating = Boolean(updatingIds[modal.applicationId]);

  const handleConfirm = async () => {
    if (!modal.applicationId || !modal.targetStatus) return;

    const actionPromise = dispatch(
      updateApplicationStatus({
        id: modal.applicationId,
        newStatus: modal.targetStatus,
        officerName: 'Senior Underwriter',
        note: note.trim() || undefined,
        forceFail: simulateFailure,
      })
    );

    // Close modal immediately so user can observe the optimistic update in the table!
    dispatch(closeConfirmModal());
    setNote('');
    setSimulateFailure(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          onClick={() => !isUpdating && dispatch(closeConfirmModal())}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-950 p-6 text-left align-middle shadow-2xl border border-zinc-800 transition-all z-10 animate-in zoom-in-95 duration-200">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-2.5 rounded-xl border flex-shrink-0 ${
                isApproved
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {isApproved ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {isApproved ? 'Approve Loan Application' : 'Reject Loan Application'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                You are changing status for{' '}
                <strong className="text-zinc-200">{modal.applicantName}</strong> (
                <span className="font-mono text-blue-400">{modal.applicationId}</span>) to{' '}
                <span className={`font-bold ${isApproved ? 'text-emerald-400' : 'text-red-400'}`}>
                  {modal.targetStatus}
                </span>
                .
              </p>
            </div>
          </div>

          {/* Underwriter Note Input */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Decision Justification / Underwriter Notes (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Verified tax filings, loan-to-value within acceptable limits..."
              rows={3}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700/80 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Simulate Failure Checkbox (For Bug 3 & Rollback Testing) */}
          <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200/90">
            <input
              type="checkbox"
              id="simulate-failure"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              className="mt-0.5 rounded border-zinc-700 text-blue-600 focus:ring-blue-500 bg-zinc-900"
            />
            <label htmlFor="simulate-failure" className="cursor-pointer select-none">
              <span className="font-semibold text-amber-300">Simulate Server Failure (Test Rollback)</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Simulates an HTTP 409 / 422 error to verify optimistic update rollback and toast recovery.
              </p>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              disabled={isUpdating}
              onClick={() => dispatch(closeConfirmModal())}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              disabled={isUpdating}
              onClick={handleConfirm}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                isApproved
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                  : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
              }`}
            >
              {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Confirm {modal.targetStatus}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

