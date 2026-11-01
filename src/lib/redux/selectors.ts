import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { LoanApplication } from '@/types/loan';
import { loanBugScenarios } from '@/data/loanBugScenarios';

// Base slice selectors
export const selectApplicationsState = (state: RootState) => state.applications;
export const selectDashboardState = (state: RootState) => state.dashboard;
export const selectUiState = (state: RootState) => state.ui;

// Applications Selectors
export const selectApplicationsList = createSelector(
  [selectApplicationsState],
  (applications) => applications.items
);

export const selectApplicationsStatus = createSelector(
  [selectApplicationsState],
  (applications) => applications.status
);

export const selectApplicationsError = createSelector(
  [selectApplicationsState],
  (applications) => applications.error
);

export const selectPagination = createSelector(
  [selectApplicationsState],
  (applications) => applications.pagination
);

export const selectFilters = createSelector(
  [selectApplicationsState],
  (applications) => applications.filters
);

export const selectSorting = createSelector(
  [selectApplicationsState],
  (applications) => applications.sorting
);

export const selectSelectedApplicationId = createSelector(
  [selectApplicationsState],
  (applications) => applications.selectedApplicationId
);

export const selectSelectedApplication = createSelector(
  [selectApplicationsList, selectSelectedApplicationId],
  (items, selectedId): LoanApplication | null => {
    if (!selectedId) return null;
    return items.find((app) => app.id === selectedId) || null;
  }
);

export const selectUpdatingIds = createSelector(
  [selectApplicationsState],
  (applications) => applications.updatingIds
);

export const makeSelectIsApplicationUpdating = () =>
  createSelector(
    [selectUpdatingIds, (_state: RootState, id: string) => id],
    (updatingIds, id): boolean => Boolean(updatingIds[id])
  );

// Memoized Pagination Derived Metadata
export const selectPaginationSummary = createSelector(
  [selectPagination, (state: RootState) => state.applications.totalCount, (state: RootState) => state.applications.totalPages],
  (pagination, totalCount, totalPages) => {
    const { page, limit } = pagination;
    const startRecord = totalCount === 0 ? 0 : (page - 1) * limit + 1;
    const endRecord = Math.min(page * limit, totalCount);

    return {
      currentPage: page,
      limit,
      totalCount,
      totalPages: Math.max(1, totalPages),
      startRecord,
      endRecord,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
);

// Memoized Derived Status Counts for currently loaded page
export const selectPageStatusDistribution = createSelector(
  [selectApplicationsList],
  (items) => {
    const counts = {
      PENDING: 0,
      UNDER_REVIEW: 0,
      APPROVED: 0,
      REJECTED: 0,
    };
    for (const item of items) {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    }
    return counts;
  }
);

// Active Filters Count (Derived)
export const selectActiveFilterCount = createSelector(
  [selectFilters],
  (filters) => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.status !== 'ALL') count++;
    if (filters.loanType !== 'ALL') count++;
    if (filters.riskRating !== 'ALL') count++;
    return count;
  }
);

// Dashboard Metrics
export const selectDashboardStats = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.stats
);

export const selectDashboardStatus = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.status
);

// UI Selectors
export const selectActiveToasts = createSelector(
  [selectUiState],
  (ui) => ui.toasts
);

export const selectConfirmModal = createSelector(
  [selectUiState],
  (ui) => ui.confirmModal
);

export const selectIsDetailsDrawerOpen = createSelector(
  [selectUiState],
  (ui) => ui.detailsDrawerOpen
);

export const selectSimulationConfig = createSelector(
  [selectUiState],
  (ui) => ui.simulationConfig
);

export const selectActiveBugScenarioId = createSelector(
  [selectUiState],
  (ui) => ui.activeBugScenarioId
);

export const selectActiveBugScenario = createSelector(
  [selectActiveBugScenarioId],
  (activeId) => {
    if (!activeId) return null;
    return loanBugScenarios.find((b) => b.id === activeId) || null;
  }
);

export const selectInterviewModeOpen = createSelector(
  [selectUiState],
  (ui) => ui.interviewModeOpen
);

