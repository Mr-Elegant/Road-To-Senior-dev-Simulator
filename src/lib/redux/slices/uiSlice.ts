import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastNotification, SimulationConfig, LoanStatus } from '@/types/loan';
import { updateApplicationStatus } from './applicationsSlice';

export interface UiState {
  detailsDrawerOpen: boolean;
  activeFiltersPanelOpen: boolean;
  confirmModal: {
    isOpen: boolean;
    applicationId: string | null;
    applicantName?: string;
    targetStatus: LoanStatus | null;
  };
  toasts: ToastNotification[];
  globalLoading: boolean;
  simulationConfig: SimulationConfig;
  activeBugScenarioId: string | null;
  interviewModeOpen: boolean;
}

export const initialUiState: UiState = {
  detailsDrawerOpen: false,
  activeFiltersPanelOpen: false,
  confirmModal: {
    isOpen: false,
    applicationId: null,
    targetStatus: null,
  },
  toasts: [],
  globalLoading: false,
  simulationConfig: {
    latencyMs: 300,
    failureRate: 0,
    simulateRaceCondition: false,
    simulateNetworkDrop: false,
  },
  activeBugScenarioId: null,
  interviewModeOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUiState,
  reducers: {
    setDetailsDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.detailsDrawerOpen = action.payload;
    },
    toggleActiveFiltersPanel: (state) => {
      state.activeFiltersPanelOpen = !state.activeFiltersPanelOpen;
    },
    openConfirmModal: (
      state,
      action: PayloadAction<{ applicationId: string; applicantName: string; targetStatus: LoanStatus }>
    ) => {
      state.confirmModal = {
        isOpen: true,
        applicationId: action.payload.applicationId,
        applicantName: action.payload.applicantName,
        targetStatus: action.payload.targetStatus,
      };
    },
    closeConfirmModal: (state) => {
      state.confirmModal = {
        isOpen: false,
        applicationId: null,
        targetStatus: null,
      };
    },
    addToast: (
      state,
      action: PayloadAction<{ type: ToastNotification['type']; title: string; message: string; autoDismissMs?: number }>
    ) => {
      const toast: ToastNotification = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        timestamp: Date.now(),
        autoDismissMs: action.payload.autoDismissMs || 4000,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setSimulationConfig: (state, action: PayloadAction<Partial<SimulationConfig>>) => {
      state.simulationConfig = { ...state.simulationConfig, ...action.payload };
    },
    setActiveBugScenarioId: (state, action: PayloadAction<string | null>) => {
      state.activeBugScenarioId = action.payload;
    },
    setInterviewModeOpen: (state, action: PayloadAction<boolean>) => {
      state.interviewModeOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Automatically add optimistic toast when update is initiated
      .addCase(updateApplicationStatus.pending, (state, action) => {
        const { id, newStatus } = action.meta.arg;
        state.toasts.push({
          id: `toast-optimistic-${Date.now()}`,
          type: 'info',
          title: 'Optimistic Update Applied',
          message: `Application ${id} status set to ${newStatus}. Awaiting API confirmation...`,
          timestamp: Date.now(),
          autoDismissMs: 3000,
        });
      })
      // Success toast on confirmation
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.toasts.push({
          id: `toast-success-${Date.now()}`,
          type: 'success',
          title: 'Status Update Confirmed',
          message: `Application ${action.payload.id} successfully updated to ${action.payload.status}.`,
          timestamp: Date.now(),
          autoDismissMs: 4000,
        });
      })
      // Error toast & rollback notice on failure
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        const id = action.payload?.id || action.meta.arg.id;
        state.toasts.push({
          id: `toast-error-${Date.now()}`,
          type: 'error',
          title: 'Update Failed — State Rolled Back',
          message:
            action.payload?.message ||
            `API rejected update for ${id}. Application state has been safely restored to original snapshot.`,
          timestamp: Date.now(),
          autoDismissMs: 6000,
        });
      });
  },
});

export const {
  setDetailsDrawerOpen,
  toggleActiveFiltersPanel,
  openConfirmModal,
  closeConfirmModal,
  addToast,
  removeToast,
  clearToasts,
  setGlobalLoading,
  setSimulationConfig,
  setActiveBugScenarioId,
  setInterviewModeOpen,
} = uiSlice.actions;

export default uiSlice.reducer;

