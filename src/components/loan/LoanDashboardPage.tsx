'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ReduxProviderWrapper } from '@/components/loan/ReduxProviderWrapper';
import { LoanDashboardHeader } from '@/components/loan/LoanDashboardHeader';
import { SimulationControlsBar } from '@/components/loan/SimulationControlsBar';
import { BugScenariosExplorer } from '@/components/loan/BugScenariosExplorer';
import { InterviewModePanel } from '@/components/loan/InterviewModePanel';
import { LoanSummaryCards } from '@/components/loan/LoanSummaryCards';
import { LoanFiltersBar } from '@/components/loan/LoanFiltersBar';
import { LoanTable } from '@/components/loan/LoanTable';
import { LoanPagination } from '@/components/loan/LoanPagination';
import { LoanDetailsDrawer } from '@/components/loan/LoanDetailsDrawer';
import { StatusConfirmationModal } from '@/components/loan/StatusConfirmationModal';
import { ToastContainer } from '@/components/loan/ToastContainer';
import { useAppDispatch } from '@/lib/redux/store';
import { fetchApplications } from '@/lib/redux/slices/applicationsSlice';
import { fetchDashboardStats } from '@/lib/redux/slices/dashboardSlice';
import { LoanBugLabLauncher } from './LoanBugLabLauncher';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { bestLoanLabScores } from '@/lib/loanLab/attempts';
import { loanLabExerciseMap } from '@/data/loanLabExercises';
import { setActiveBugScenarioId } from '@/lib/redux/slices/uiSlice';

function LoanDashboardContent({ initialBugId }: { initialBugId?: string }) {
  const dispatch = useAppDispatch();
  const [scores, setScores] = useState<Record<string, number>>({});
  const refreshScores = useCallback(() => { void storage.getProgress().then((progress) => setScores(bestLoanLabScores(progress.attempts))); }, []);
  useEffect(refreshScores, [refreshScores]);
  useEffect(() => { if (initialBugId && loanLabExerciseMap.has(initialBugId)) dispatch(setActiveBugScenarioId(initialBugId)); }, [dispatch, initialBugId]);

  // Initial load of applications and dashboard metrics
  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Navigation */}
      <LoanDashboardHeader />

      {/* 2. Simulation Controls & Toggles */}
      <SimulationControlsBar />
      <LoanBugLabLauncher completed={Object.values(scores).filter((score) => score === 100).length} />

      {/* 3. Conditional Bug Scenarios Explorer */}
      <BugScenariosExplorer scores={scores} onRecorded={refreshScores} />

      {/* 4. Conditional Senior Interview Panel */}
      <InterviewModePanel />

      {/* 5. Summary KPI Metric Cards */}
      <LoanSummaryCards />

      {/* 6. Search, Status, and Filter Bar */}
      <LoanFiltersBar />

      {/* 7. Loan Applications Table */}
      <LoanTable />

      {/* 8. Pagination Controls */}
      <LoanPagination />

      {/* 9. Loan Details Slide-Over Drawer */}
      <LoanDetailsDrawer />

      {/* 10. Status Change Confirmation Modal */}
      <StatusConfirmationModal />

      {/* 11. Floating Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function EnterpriseLoanDashboardPage({ initialBugId }: { initialBugId?: string }) {
  return (
    <ReduxProviderWrapper>
      <LoanDashboardContent initialBugId={initialBugId} />
    </ReduxProviderWrapper>
  );
}

