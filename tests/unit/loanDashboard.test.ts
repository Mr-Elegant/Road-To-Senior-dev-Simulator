import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createAppStore, RootState } from '@/lib/redux/store';
import {
  fetchApplications,
  updateApplicationStatus,
  setSearchQuery,
  setStatusFilter,
  setLoanTypeFilter,
  setPage,
  setPageSize,
  setSorting,
  resetFilters,
  initialApplicationsState,
} from '@/lib/redux/slices/applicationsSlice';
import { fetchDashboardStats, initialDashboardState } from '@/lib/redux/slices/dashboardSlice';
import { initialUiState, openConfirmModal, closeConfirmModal, addToast, removeToast } from '@/lib/redux/slices/uiSlice';
import {
  selectPaginationSummary,
  selectActiveFilterCount,
  selectPageStatusDistribution,
  selectSelectedApplication,
} from '@/lib/redux/selectors';
import { loanApiService } from '@/lib/api/loanService';
import { resetLiveApplications, getLiveApplications } from '@/data/mockLoans';
import { LoanApplication } from '@/types/loan';

describe('Enterprise Loan Management Dashboard Redux Architecture', () => {
  let store: ReturnType<typeof createAppStore>;

  beforeEach(() => {
    resetLiveApplications();
    loanApiService.setSimulationConfig({ latencyMs: 0, failureRate: 0, simulateNetworkDrop: false });
    store = createAppStore();
  });

  describe('1. Initial Redux State', () => {
    it('initializes applications slice with default pagination, filters, and concurrency tracking', () => {
      const state = store.getState().applications;
      expect(state.items).toEqual([]);
      expect(state.status).toBe('idle');
      expect(state.error).toBeNull();
      expect(state.pagination).toEqual({ page: 1, limit: 10 });
      expect(state.filters.status).toBe('ALL');
      expect(state.filters.search).toBe('');
      expect(state.sorting.field).toBe('applicationDate');
      expect(state.sorting.order).toBe('desc');
      expect(state.latestRequestId).toBeNull();
      expect(state.optimisticBackups).toEqual({});
      expect(state.updatingIds).toEqual({});
    });

    it('initializes dashboard slice with zeroed baseline metrics', () => {
      const state = store.getState().dashboard;
      expect(state.status).toBe('idle');
      expect(state.stats.totalApplications).toBe(0);
      expect(state.stats.approvedApplications).toBe(0);
      expect(state.lastFetched).toBeNull();
    });

    it('initializes ui slice with closed modals and default simulation settings', () => {
      const state = store.getState().ui;
      expect(state.detailsDrawerOpen).toBe(false);
      expect(state.confirmModal.isOpen).toBe(false);
      expect(state.toasts).toEqual([]);
      expect(state.simulationConfig.latencyMs).toBe(300);
      expect(state.activeBugScenarioId).toBeNull();
    });
  });

  describe('2. API Integration & Asynchronous Thunks', () => {
    it('successfully fetches applications and transitions status from loading to succeeded', async () => {
      const promise = store.dispatch(fetchApplications());
      expect(store.getState().applications.status).toBe('loading');

      await promise;

      const state = store.getState().applications;
      expect(state.status).toBe('succeeded');
      expect(state.items.length).toBeGreaterThan(0);
      expect(state.totalCount).toBeGreaterThan(0);
      expect(state.totalPages).toBeGreaterThanOrEqual(1);
      expect(state.error).toBeNull();
    });

    it('successfully fetches dashboard statistics', async () => {
      await store.dispatch(fetchDashboardStats());
      const state = store.getState().dashboard;

      expect(state.status).toBe('succeeded');
      expect(state.stats.totalApplications).toBeGreaterThan(0);
      expect(state.stats.totalLoanAmount).toBeGreaterThan(0);
      expect(state.lastFetched).not.toBeNull();
    });

    it('handles API network failure and transitions status to failed with error message', async () => {
      // Configure mock API service to drop network
      loanApiService.setSimulationConfig({ simulateNetworkDrop: true });

      await store.dispatch(fetchApplications());

      const state = store.getState().applications;
      expect(state.status).toBe('failed');
      expect(state.error).toContain('Network unreachable');
    });
  });

  describe('3. Search, Filtering, and Pagination Interactions', () => {
    it('resets pagination page index to 1 when search query changes (Bug 4 Fix)', async () => {
      // Simulate user on page 4
      store.dispatch(setPage(4));
      expect(store.getState().applications.pagination.page).toBe(4);

      // User types a search query
      store.dispatch(setSearchQuery('Sharma'));

      const state = store.getState().applications;
      expect(state.filters.search).toBe('Sharma');
      expect(state.pagination.page).toBe(1); // Page reset guard verified!
    });

    it('resets pagination page index to 1 when status filter changes', () => {
      store.dispatch(setPage(3));
      store.dispatch(setStatusFilter('APPROVED'));

      const state = store.getState().applications;
      expect(state.filters.status).toBe('APPROVED');
      expect(state.pagination.page).toBe(1);
    });

    it('resets pagination page index to 1 when page size changes', () => {
      store.dispatch(setPage(5));
      store.dispatch(setPageSize(50));

      const state = store.getState().applications;
      expect(state.pagination.limit).toBe(50);
      expect(state.pagination.page).toBe(1);
    });

    it('resets all filters to initial defaults and restores page 1 on resetFilters', () => {
      store.dispatch(setSearchQuery('Elena'));
      store.dispatch(setStatusFilter('REJECTED'));
      store.dispatch(setLoanTypeFilter('Personal'));
      store.dispatch(setPage(2));

      store.dispatch(resetFilters());

      const state = store.getState().applications;
      expect(state.filters.search).toBe('');
      expect(state.filters.status).toBe('ALL');
      expect(state.filters.loanType).toBe('ALL');
      expect(state.pagination.page).toBe(1);
    });

    it('toggles sort order on the same field and defaults to desc on a new field', () => {
      store.dispatch(setSorting({ field: 'loanAmount' }));
      expect(store.getState().applications.sorting).toEqual({ field: 'loanAmount', order: 'desc' });

      // Click same field again -> toggles to asc
      store.dispatch(setSorting({ field: 'loanAmount' }));
      expect(store.getState().applications.sorting).toEqual({ field: 'loanAmount', order: 'asc' });

      // Switch to date field -> defaults to desc
      store.dispatch(setSorting({ field: 'applicationDate' }));
      expect(store.getState().applications.sorting).toEqual({ field: 'applicationDate', order: 'desc' });
    });
  });

  describe('4. Safe Optimistic Status Updates & Rollback Recovery', () => {
    it('applies optimistic status update immediately and locks row (Bug 3 Prevention)', async () => {
      await store.dispatch(fetchApplications());
      const targetId = 'LN-2026-0101'; // Initially PENDING

      const initialItem = store.getState().applications.items.find((a) => a.id === targetId);
      expect(initialItem?.status).toBe('PENDING');

      // Dispatch update to APPROVED with latency to inspect optimistic intermediate state
      loanApiService.setSimulationConfig({ latencyMs: 50 });
      const updatePromise = store.dispatch(
        updateApplicationStatus({ id: targetId, newStatus: 'APPROVED' })
      );

      // Verify immediate optimistic mutation before resolution
      const optimisticState = store.getState().applications;
      const optimisticItem = optimisticState.items.find((a) => a.id === targetId);
      expect(optimisticItem?.status).toBe('APPROVED'); // Optimistically updated!
      expect(optimisticState.optimisticBackups[targetId]?.status).toBe('PENDING'); // Snapshot preserved!
      expect(optimisticState.updatingIds[targetId]).toBe(true); // Row locked against duplicate submissions!

      await updatePromise;

      // Verify fulfilled cleanup
      const finalState = store.getState().applications;
      expect(finalState.optimisticBackups[targetId]).toBeUndefined();
      expect(finalState.updatingIds[targetId]).toBeUndefined();
      const finalItem = finalState.items.find((a) => a.id === targetId);
      expect(finalItem?.status).toBe('APPROVED');
    });

    it('rolls back status to original snapshot when server rejects the update (Bug 3 Fix)', async () => {
      await store.dispatch(fetchApplications());
      const targetId = 'LN-2026-0101'; // Initially PENDING

      // Force failure simulation on status update
      const updatePromise = store.dispatch(
        updateApplicationStatus({ id: targetId, newStatus: 'APPROVED', forceFail: true })
      );

      // Verify optimistic update was applied initially
      expect(store.getState().applications.items.find((a) => a.id === targetId)?.status).toBe('APPROVED');

      await updatePromise;

      // After rejection: State MUST be rolled back to PENDING!
      const finalState = store.getState().applications;
      const restoredItem = finalState.items.find((a) => a.id === targetId);
      expect(restoredItem?.status).toBe('PENDING'); // Rollback successful!
      expect(finalState.optimisticBackups[targetId]).toBeUndefined();
      expect(finalState.updatingIds[targetId]).toBeUndefined();

      // UI slice should have received an error toast informing the user
      const uiState = store.getState().ui;
      const errorToast = uiState.toasts.find((t) => t.type === 'error');
      expect(errorToast).toBeDefined();
      expect(errorToast?.title).toContain('State Rolled Back');
    });
  });

  describe('5. Concurrency & Race Condition Defense (Bug 1 Fix)', () => {
    it('discards stale slower responses when a newer search query completes first', async () => {
      // 1. Manually simulate Request 1 (stale search query)
      const action1Pending = fetchApplications.pending('req-1-old', undefined);
      store.dispatch(action1Pending);
      expect(store.getState().applications.latestRequestId).toBe('req-1-old');

      // 2. User quickly types new search -> Request 2 initiates
      const action2Pending = fetchApplications.pending('req-2-new', undefined);
      store.dispatch(action2Pending);
      expect(store.getState().applications.latestRequestId).toBe('req-2-new');

      // 3. Fast Request 2 resolves FIRST
      const action2Fulfilled = fetchApplications.fulfilled(
        {
          items: [{ id: 'LN-SOPHIA', applicantName: 'Sophia Chen', status: 'APPROVED' } as LoanApplication],
          totalCount: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        'req-2-new',
        undefined
      );
      store.dispatch(action2Fulfilled);

      // State now reflects Sophia
      expect(store.getState().applications.items[0].id).toBe('LN-SOPHIA');

      // 4. Stale Request 1 finishes LATER due to network jitter
      const action1Fulfilled = fetchApplications.fulfilled(
        {
          items: [{ id: 'LN-AARAV', applicantName: 'Aarav Sharma', status: 'PENDING' } as LoanApplication],
          totalCount: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        'req-1-old',
        undefined
      );
      store.dispatch(action1Fulfilled);

      // VERIFICATION: State MUST STILL BE SOPHIA! Stale Aarav was discarded!
      const items = store.getState().applications.items;
      expect(items.length).toBe(1);
      expect(items[0].id).toBe('LN-SOPHIA');
      expect(items[0].applicantName).toBe('Sophia Chen');
    });
  });

  describe('6. Memoized Selectors Performance & Derived Computations', () => {
    it('selectPaginationSummary computes boundary records correctly without state mutation', () => {
      const mockState: RootState = {
        applications: {
          ...initialApplicationsState,
          totalCount: 47,
          totalPages: 5,
          pagination: { page: 3, limit: 10 },
        },
        dashboard: initialDashboardState,
        ui: initialUiState,
      };

      const summary = selectPaginationSummary(mockState);
      expect(summary.currentPage).toBe(3);
      expect(summary.startRecord).toBe(21);
      expect(summary.endRecord).toBe(30);
      expect(summary.totalCount).toBe(47);
      expect(summary.totalPages).toBe(5);
      expect(summary.hasNext).toBe(true);
      expect(summary.hasPrev).toBe(true);
    });

    it('selectActiveFilterCount derives active filters count accurately', () => {
      const mockState: RootState = {
        applications: {
          ...initialApplicationsState,
          filters: {
            search: 'fintech',
            status: 'PENDING',
            loanType: 'Business',
            riskRating: 'ALL',
          },
        },
        dashboard: initialDashboardState,
        ui: initialUiState,
      };

      const activeCount = selectActiveFilterCount(mockState);
      expect(activeCount).toBe(3); // search, status, and loanType
    });

    it('selectPageStatusDistribution derives distribution across PENDING, APPROVED, REJECTED', () => {
      const mockState: RootState = {
        applications: {
          ...initialApplicationsState,
          items: [
            { id: '1', status: 'PENDING' } as LoanApplication,
            { id: '2', status: 'PENDING' } as LoanApplication,
            { id: '3', status: 'APPROVED' } as LoanApplication,
            { id: '4', status: 'REJECTED' } as LoanApplication,
            { id: '5', status: 'UNDER_REVIEW' } as LoanApplication,
          ],
        },
        dashboard: initialDashboardState,
        ui: initialUiState,
      };

      const dist = selectPageStatusDistribution(mockState);
      expect(dist.PENDING).toBe(2);
      expect(dist.APPROVED).toBe(1);
      expect(dist.REJECTED).toBe(1);
      expect(dist.UNDER_REVIEW).toBe(1);
    });
  });
});

