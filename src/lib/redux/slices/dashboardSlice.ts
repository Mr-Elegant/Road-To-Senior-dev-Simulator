import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardStats } from '@/types/loan';
import { loanApiService } from '@/lib/api/loanService';
import { updateApplicationStatus } from './applicationsSlice';

export interface DashboardState {
  stats: DashboardStats;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetched: number | null;
}

export const initialDashboardState: DashboardState = {
  stats: {
    totalApplications: 0,
    pendingApplications: 0,
    underReviewApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalLoanAmount: 0,
    approvedLoanAmount: 0,
    pendingLoanAmount: 0,
    approvalRate: 0,
    avgCreditScore: 0,
  },
  status: 'idle',
  error: null,
  lastFetched: null,
};

export const fetchDashboardStats = createAsyncThunk<DashboardStats, void>(
  'dashboard/fetchStats',
  async (_, { signal }) => {
    return await loanApiService.getDashboardStats({ signal });
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialDashboardState,
  reducers: {
    invalidateStats: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return;
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch dashboard metrics.';
      })

      // When a loan status is updated, we can also refresh stats
      .addCase(updateApplicationStatus.fulfilled, (state) => {
        state.lastFetched = null; // Mark stale to trigger refresh
      });
  },
});

export const { invalidateStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;

