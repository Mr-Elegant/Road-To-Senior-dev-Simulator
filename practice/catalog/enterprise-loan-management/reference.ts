// 1. Applications Slice with Monotonic Concurrency Guard
export const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.page = 1; // Reset pagination
    },
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state, action) => {
        state.status = 'loading';
        state.latestRequestId = action.meta.requestId;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        if (state.latestRequestId === action.meta.requestId) {
          state.status = 'succeeded';
          state.items = action.payload.items;
          state.totalCount = action.payload.totalCount;
        }
      })
      .addCase(updateApplicationStatus.pending, (state, action) => {
        const { id, newStatus } = action.meta.arg;
        const item = state.items.find(i => i.id === id);
        if (item) {
          state.optimisticBackups[id] = { ...item };
          state.updatingIds[id] = true;
          item.status = newStatus;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        const id = action.payload?.id || action.meta.arg.id;
        if (state.optimisticBackups[id]) {
          const index = state.items.findIndex(i => i.id === id);
          if (index !== -1) state.items[index] = state.optimisticBackups[id];
          delete state.optimisticBackups[id];
        }
        delete state.updatingIds[id];
      });
  }
});
