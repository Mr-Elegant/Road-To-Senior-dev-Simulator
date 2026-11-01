import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  LoanApplication,
  LoanFilters,
  LoanStatus,
  LoanType,
  RiskRating,
  SortConfig,
  SortField,
  SortOrder,
  PaginatedResponse,
} from '@/types/loan';
import { loanApiService } from '@/lib/api/loanService';
import type { RootState } from '../store';

export interface ApplicationsState {
  items: LoanApplication[];
  totalCount: number;
  totalPages: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    page: number;
    limit: number;
  };
  filters: LoanFilters;
  sorting: SortConfig;
  selectedApplicationId: string | null;
  latestRequestId: string | null;
  optimisticBackups: Record<string, LoanApplication>;
  updatingIds: Record<string, boolean>;
}

export const initialApplicationsState: ApplicationsState = {
  items: [],
  totalCount: 0,
  totalPages: 1,
  status: 'idle',
  error: null,
  pagination: {
    page: 1,
    limit: 10,
  },
  filters: {
    search: '',
    status: 'ALL',
    loanType: 'ALL',
    riskRating: 'ALL',
  },
  sorting: {
    field: 'applicationDate',
    order: 'desc',
  },
  selectedApplicationId: null,
  latestRequestId: null,
  optimisticBackups: {},
  updatingIds: {},
};

/**
 * Async Thunk to fetch applications with cancellation, state filtering, and race condition guard
 */
export const fetchApplications = createAsyncThunk<
  PaginatedResponse<LoanApplication>,
  { customLatency?: number } | undefined,
  { state: RootState }
>(
  'applications/fetchApplications',
  async (args, { getState, signal }) => {
    const { applications } = getState();
    const { filters, sorting, pagination } = applications;

    const response = await loanApiService.getApplications(
      {
        filters,
        sort: sorting,
        page: pagination.page,
        limit: pagination.limit,
        customLatency: args?.customLatency,
      },
      { signal }
    );

    return response;
  }
);

/**
 * Async Thunk to update loan application status with optimistic update and rollback
 */
export const updateApplicationStatus = createAsyncThunk<
  LoanApplication,
  { id: string; newStatus: LoanStatus; officerName?: string; note?: string; forceFail?: boolean },
  { state: RootState; rejectValue: { id: string; message: string } }
>(
  'applications/updateStatus',
  async ({ id, newStatus, officerName, note, forceFail }, { signal, rejectWithValue }) => {
    try {
      const updated = await loanApiService.updateStatus(id, newStatus, officerName, note, {
        signal,
        forceFail,
      });
      return updated;
    } catch (err: any) {
      return rejectWithValue({
        id,
        message: err?.message || `Failed to update loan application ${id} to ${newStatus}`,
      });
    }
  }
);

export const applicationsSlice = createSlice({
  name: 'applications',
  initialState: initialApplicationsState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      // Critical Senior Fix (Bug 4): Reset pagination to page 1 on search change
      state.pagination.page = 1;
    },
    setStatusFilter: (state, action: PayloadAction<LoanStatus | 'ALL'>) => {
      state.filters.status = action.payload;
      // Critical Senior Fix (Bug 4): Reset pagination to page 1 on filter change
      state.pagination.page = 1;
    },
    setLoanTypeFilter: (state, action: PayloadAction<LoanType | 'ALL'>) => {
      state.filters.loanType = action.payload;
      state.pagination.page = 1;
    },
    setRiskRatingFilter: (state, action: PayloadAction<RiskRating | 'ALL'>) => {
      state.filters.riskRating = action.payload;
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = Math.max(1, action.payload);
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.limit = Math.max(1, action.payload);
      state.pagination.page = 1;
    },
    setSorting: (state, action: PayloadAction<{ field: SortField; order?: SortOrder }>) => {
      if (state.sorting.field === action.payload.field && !action.payload.order) {
        state.sorting.order = state.sorting.order === 'asc' ? 'desc' : 'asc';
      } else {
        state.sorting.field = action.payload.field;
        state.sorting.order = action.payload.order || 'desc';
      }
    },
    selectApplication: (state, action: PayloadAction<string | null>) => {
      state.selectedApplicationId = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: 'ALL',
        loanType: 'ALL',
        riskRating: 'ALL',
      };
      state.pagination.page = 1;
    },
    rollbackOptimisticUpdate: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.optimisticBackups[id]) {
        const index = state.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          state.items[index] = state.optimisticBackups[id];
        }
        delete state.optimisticBackups[id];
      }
      delete state.updatingIds[id];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        // Critical Senior Fix (Bug 1): Track latest request token
        state.latestRequestId = action.meta.requestId;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        // Critical Senior Fix (Bug 1): Stale response race condition guard!
        // Only commit payload if this fulfilled response matches the latest dispatched request!
        if (state.latestRequestId === action.meta.requestId) {
          state.status = 'succeeded';
          state.items = action.payload.items;
          state.totalCount = action.payload.totalCount;
          state.totalPages = action.payload.totalPages;
          state.error = null;
        }
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        if (action.error.name === 'AbortError') {
          // Silent ignore for aborted queries
          return;
        }
        if (state.latestRequestId === action.meta.requestId) {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to load loan applications.';
        }
      })

      // Update Application Status (Optimistic Update + Safe Rollback)
      .addCase(updateApplicationStatus.pending, (state, action) => {
        const { id, newStatus } = action.meta.arg;
        const item = state.items.find((app) => app.id === id);

        if (item) {
          // 1. Snapshot original state for rollback
          state.optimisticBackups[id] = { ...item };
          // 2. Lock item to prevent duplicate submissions
          state.updatingIds[id] = true;
          // 3. Mutate draft state optimistically
          item.status = newStatus;
          item.lastModified = new Date().toISOString();
        }
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        const index = state.items.findIndex((app) => app.id === id);

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        // Clean up backup and lock
        delete state.optimisticBackups[id];
        delete state.updatingIds[id];
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        const id = action.payload?.id || action.meta.arg.id;

        // Critical Senior Fix (Bug 3): Atomic rollback of optimistic update
        if (state.optimisticBackups[id]) {
          const index = state.items.findIndex((app) => app.id === id);
          if (index !== -1) {
            state.items[index] = state.optimisticBackups[id];
          }
          delete state.optimisticBackups[id];
        }

        delete state.updatingIds[id];
      });
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setLoanTypeFilter,
  setRiskRatingFilter,
  setPage,
  setPageSize,
  setSorting,
  selectApplication,
  resetFilters,
  rollbackOptimisticUpdate,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;

