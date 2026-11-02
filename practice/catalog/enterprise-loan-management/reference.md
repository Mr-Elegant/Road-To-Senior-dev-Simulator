# Reference: Enterprise Loan Management Dashboard (React & Redux Toolkit)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The production solution implements three decoupled Redux Toolkit slices: applicationsSlice (managing server entity state, pagination, and monotonic request IDs), dashboardSlice (KPI metrics), and uiSlice (modals, drawer, toasts). createAsyncThunk connects to the loanApiService with AbortSignal cancellation and atomic optimistic rollback backups. Selectors memoize derived state to guarantee 60fps performance.",
    "codeOrArtifact": "// 1. Applications Slice with Monotonic Concurrency Guard\nexport const applicationsSlice = createSlice({\n  name: 'applications',\n  initialState,\n  reducers: {\n    setSearchQuery: (state, action) => {\n      state.filters.search = action.payload;\n      state.pagination.page = 1; // Reset pagination\n    },\n    // ...\n  },\n  extraReducers: (builder) => {\n    builder\n      .addCase(fetchApplications.pending, (state, action) => {\n        state.status = 'loading';\n        state.latestRequestId = action.meta.requestId;\n      })\n      .addCase(fetchApplications.fulfilled, (state, action) => {\n        if (state.latestRequestId === action.meta.requestId) {\n          state.status = 'succeeded';\n          state.items = action.payload.items;\n          state.totalCount = action.payload.totalCount;\n        }\n      })\n      .addCase(updateApplicationStatus.pending, (state, action) => {\n        const { id, newStatus } = action.meta.arg;\n        const item = state.items.find(i => i.id === id);\n        if (item) {\n          state.optimisticBackups[id] = { ...item };\n          state.updatingIds[id] = true;\n          item.status = newStatus;\n        }\n      })\n      .addCase(updateApplicationStatus.rejected, (state, action) => {\n        const id = action.payload?.id || action.meta.arg.id;\n        if (state.optimisticBackups[id]) {\n          const index = state.items.findIndex(i => i.id === id);\n          if (index !== -1) state.items[index] = state.optimisticBackups[id];\n          delete state.optimisticBackups[id];\n        }\n        delete state.updatingIds[id];\n      });\n  }\n});"
  },
  "rubric": [
    {
      "id": "rc-redux-arch",
      "category": "code_quality",
      "label": "Redux Architecture & State Management (20%)",
      "description": "Clean separation into applications, dashboard, and ui slices; typed hooks; single source of truth.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Exemplary: Normalized slices, createSelector, zero duplicated derived state, typed hooks."
        },
        {
          "score": 2,
          "description": "Competent: Basic slices configured with typed store, minor derived state duplication."
        },
        {
          "score": 1,
          "description": "Needs Work: Bloated monolithic slice or untyped hooks."
        }
      ]
    },
    {
      "id": "rc-api-thunks",
      "category": "correctness",
      "label": "API Integration & Asynchronous Handling (20%)",
      "description": "Proper use of createAsyncThunk, AbortSignal cancellation, and lifecycle state management.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Exemplary: Full pending/fulfilled/rejected handling with AbortSignal and condition guards."
        },
        {
          "score": 2,
          "description": "Competent: Async thunks handle standard success and error paths without cancellation."
        },
        {
          "score": 1,
          "description": "Needs Work: Raw fetch calls in components or unhandled promise rejections."
        }
      ]
    },
    {
      "id": "rc-race-conditions",
      "category": "reliability",
      "label": "Race Conditions & Error Handling (15%)",
      "description": "Monotonic request-ID guards, atomic optimistic rollback, and meaningful error states.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Exemplary: Monotonic request tokens discard stale responses; backup snapshot rollback on failure."
        },
        {
          "score": 2,
          "description": "Competent: Basic try/catch and error toasts without sequence tracking."
        },
        {
          "score": 1,
          "description": "Needs Work: Out-of-order network responses overwrite state."
        }
      ]
    },
    {
      "id": "rc-performance",
      "category": "tradeoffs",
      "label": "Performance Optimization (10%)",
      "description": "Debounced search, React.memo on rows, fine-grained selectors, and stable callbacks.",
      "weight": 3,
      "levels": [
        {
          "score": 3,
          "description": "Exemplary: 300ms debouncing, memoized row components, and useCallback stability."
        },
        {
          "score": 2,
          "description": "Competent: Some memoization applied, but parent renders cascade down."
        },
        {
          "score": 1,
          "description": "Needs Work: Full table re-renders on every keystroke."
        }
      ]
    }
  ],
  "alternatives": [
    "Using RTK Query with auto-generated hooks (useGetApplicationsQuery) and onQueryStarted for optimistic updates.",
    "Using TanStack Query (React Query) with queryClient.setQueryData for optimistic rollback."
  ],
  "commonMistakes": [
    "Failing to reset the page index when search or status filters change, causing empty views.",
    "Omitting optimistic rollback on rejected thunk actions, leaving false-positive approvals on screen.",
    "Allowing older slow search responses to overwrite newer queries due to network jitter.",
    "Directly mutating state arrays using in-place methods like sort() inside selectors or components."
  ],
  "followUps": [
    {
      "id": "loan-fq-1",
      "question": "How would you scale this dashboard if the record count reached 100,000 active loan applications?",
      "expectedConcepts": [
        "DOM Virtualization (react-window or @tanstack/react-virtual)",
        "Cursor / Keyset-based pagination instead of OFFSET",
        "Normalized entity cache with Redux createEntityAdapter",
        "Server-side aggregate computation for metrics"
      ],
      "sampleStrongAnswer": "At 100,000 records, loading all items in memory will crash the browser. We implement cursor-based keyset pagination on the backend to avoid slow OFFSET queries, use @tanstack/react-virtual to only render the ~20 visible rows in the viewport, normalize state using createEntityAdapter, and calculate all dashboard totals server-side."
    }
  ]
}
```
