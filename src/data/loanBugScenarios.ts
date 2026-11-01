import { BugScenario } from '@/types/loan';

export const loanBugScenarios: BugScenario[] = [
  {
    id: 'bug-1-race-condition',
    number: 1,
    title: 'Stale Asynchronous Search Overwrites Newer Query Results',
    category: 'Concurrency',
    description:
      'A user searches for "Aarav", then quickly deletes it and searches for "Sophia". The first slow API call finishes after the second fast call and overwrites the active table results with the stale query.',
    productionSymptom:
      'The search input displays "Sophia", but the table displays loan applications for "Aarav". Refreshing or typing an extra space is the only way users can unstick the table.',
    rootCause:
      'Asynchronous responses resolve in non-deterministic order (network jitter). Without an AbortController or a monotonic request-ID/sequence tracker in Redux state, the latest resolved promise always commits to state regardless of when it was initiated.',
    solutionExplanation:
      '1. Utilize Redux Toolkit `thunkAPI.signal` with `fetch(url, { signal: thunkAPI.signal })` or `AbortController` to abort in-flight requests when a new search query is dispatched.\n2. In the Redux slice, track `latestRequestId: string | null` or monotonic `timestamp`. In the `extraReducers.fulfilled` matcher, compare `action.meta.requestId === state.latestRequestId`. If mismatched, silently ignore the stale payload.',
    buggyCodeSnippet: `// ❌ BUGGY: Always commits incoming payload to state regardless of dispatch order
export const fetchApplications = createAsyncThunk(
  'applications/fetch',
  async (params: LoanFilters) => {
    const res = await fetch(\`/api/applications?search=\${params.search}\`);
    return await res.json();
  }
);

extraReducers: (builder) => {
  builder.addCase(fetchApplications.fulfilled, (state, action) => {
    // ⚠️ STALE OVERWRITE: Older slow request can overwrite newer fast request!
    state.items = action.payload.items;
  });
}`,
    fixedCodeSnippet: `// ✅ SENIOR FIX: Abort signal + Request ID monotonic guard
export const fetchApplications = createAsyncThunk(
  'applications/fetch',
  async (params: LoanFilters, { signal }) => {
    // Passes AbortSignal directly to fetch; aborts stale previous calls
    const res = await fetch(\`/api/applications?search=\${params.search}\`, { signal });
    return await res.json();
  }
);

extraReducers: (builder) => {
  builder
    .addCase(fetchApplications.pending, (state, action) => {
      state.status = 'loading';
      state.latestRequestId = action.meta.requestId; // Record active request token
    })
    .addCase(fetchApplications.fulfilled, (state, action) => {
      // Monotonic guard: Only accept if this matches the latest dispatched thunk!
      if (state.latestRequestId === action.meta.requestId) {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      }
    });
}`,
  },
  {
    id: 'bug-2-duplicate-api-calls',
    number: 2,
    title: 'Duplicate API Requests During Component Re-rendering & Navigation',
    category: 'Performance',
    description:
      'Every time a parent component re-renders or the user tabs between drawer views, duplicate identical GET requests hit the `/api/applications` and `/api/dashboard/stats` endpoints.',
    productionSymptom:
      'Backend servers experience 4x expected QPS. Database connection pools spike under moderate user load.',
    rootCause:
      '`useEffect` dependency arrays include unmemoized object literals or functions (e.g. `[filters, pagination]`), triggering repeated execution on every render cycle even when actual property values have not changed.',
    solutionExplanation:
      '1. Normalize dependency primitives (e.g., `filters.search, filters.status, pagination.page, pagination.limit`) or use custom deep-equality comparisons.\n2. In Redux thunks, leverage the `condition` option in `createAsyncThunk(type, payloadCreator, { condition: (arg, { getState }) => !isCurrentlyLoading })` to suppress duplicate in-flight dispatches.',
    buggyCodeSnippet: `// ❌ BUGGY: Re-creates new object reference on every render, triggering infinite or duplicate fetches
useEffect(() => {
  dispatch(fetchApplications({ search, status }));
}, [{ search, status }]); // ⚠️ New object reference each render!

// In component:
const onRefresh = () => dispatch(fetchApplications(currentFilters)); // No in-flight guard`,
    fixedCodeSnippet: `// ✅ SENIOR FIX: Specific primitive dependencies + thunk condition guard
export const fetchApplications = createAsyncThunk(
  'applications/fetch',
  async (params: LoanFilters, { signal }) => {
    return await loanService.getApplications(params, { signal });
  },
  {
    // Condition guard prevents duplicate concurrent executions
    condition: (_, { getState }) => {
      const { applications } = getState() as RootState;
      if (applications.status === 'loading') {
        return false; // Skip duplicate dispatch
      }
      return true;
    },
  }
);

// Component: use individual stable primitive keys
useEffect(() => {
  dispatch(fetchApplications({ search, status, page, limit }));
}, [dispatch, search, status, page, limit]);`,
  },
  {
    id: 'bug-3-optimistic-update-failure',
    number: 3,
    title: 'Optimistic Status Update Failure Without Safe Rollback',
    category: 'State Management',
    description:
      'An officer approves a loan. The UI turns green immediately. The backend rejects the request due to an expired session or credit policy rule, but the UI remains "APPROVED", deceiving the officer.',
    productionSymptom:
      'Employees believe loans are approved and disburse funds or communicate approval to borrowers, but the core banking system still records the loan as PENDING or REJECTED.',
    rootCause:
      'Optimistic state mutation was applied on action dispatch, but no error rollback handler was implemented in `extraReducers.rejected` to restore the previous snapshot.',
    solutionExplanation:
      '1. When dispatching an optimistic update, capture a clone of the original application record in an `optimisticBackups: Record<string, LoanApplication>` map.\n2. If the thunk resolves with `rejected`, look up the backup snapshot and restore the record into `state.items` atomically, dispatching a high-visibility error toast notification.',
    buggyCodeSnippet: `// ❌ BUGGY: Updates state immediately but does nothing if server rejects
const updateStatus = createAsyncThunk('loan/updateStatus', async ({ id, status }) => {
  await api.patchStatus(id, status);
});

// Reducer:
builder.addCase(updateStatus.pending, (state, action) => {
  const item = state.items.find(i => i.id === action.meta.arg.id);
  if (item) item.status = action.meta.arg.status; // Optimistic mutation
});
// ⚠️ Missing rejected handler leaves broken state on network error!`,
    fixedCodeSnippet: `// ✅ SENIOR FIX: Backup snapshot + atomic rollback on rejection
builder
  .addCase(updateApplicationStatus.pending, (state, action) => {
    const { id, newStatus } = action.meta.arg;
    const item = state.items.find(i => i.id === id);
    if (item) {
      // 1. Preserve original state in rollback cache
      state.optimisticBackups[id] = { ...item };
      // 2. Mark updating to prevent concurrent duplicate clicks
      state.updatingIds[id] = true;
      // 3. Apply optimistic mutation
      item.status = newStatus;
    }
  })
  .addCase(updateApplicationStatus.fulfilled, (state, action) => {
    const { id } = action.meta.arg;
    delete state.optimisticBackups[id];
    delete state.updatingIds[id];
  })
  .addCase(updateApplicationStatus.rejected, (state, action) => {
    const { id } = action.meta.arg;
    // 4. Safely restore backup snapshot on failure
    if (state.optimisticBackups[id]) {
      const index = state.items.findIndex(i => i.id === id);
      if (index !== -1) {
        state.items[index] = state.optimisticBackups[id];
      }
      delete state.optimisticBackups[id];
    }
    delete state.updatingIds[id];
  });`,
  },
  {
    id: 'bug-4-incorrect-pagination',
    number: 4,
    title: 'Filter Change Leaves Current Page Out of Bounds',
    category: 'UX/Pagination',
    description:
      'A user navigates to Page 6 of loan applications. They then apply a filter for `status === "REJECTED"`, which only has 2 matching records. The table displays "No records found" because it requested Page 6 of a 1-page result set.',
    productionSymptom:
      'The UI claims there are 0 applications found, even though the total count indicator shows "Total: 2 Applications". Users think search/filtering is broken.',
    rootCause:
      'The search and filter reducer actions modify `state.filters`, but fail to reset `state.pagination.page` to 1.',
    solutionExplanation:
      'Any action that narrows or alters the query criteria (`setSearchQuery`, `setStatusFilter`, `setLoanTypeFilter`, `setPageSize`) must explicitly reset `state.pagination.page = 1`.',
    buggyCodeSnippet: `// ❌ BUGGY: Does not reset page index
setFilter: (state, action) => {
  state.filters.status = action.payload; // ⚠️ Page remains 6!
},
setSearch: (state, action) => {
  state.filters.search = action.payload; // ⚠️ Page remains 6!
}`,
    fixedCodeSnippet: `// ✅ SENIOR FIX: Explicit page reset on query/filter mutations
setStatusFilter: (state, action: PayloadAction<LoanStatus | 'ALL'>) => {
  state.filters.status = action.payload;
  state.pagination.page = 1; // Always reset pagination on filter change
},
setSearchQuery: (state, action: PayloadAction<string>) => {
  state.filters.search = action.payload;
  state.pagination.page = 1; // Always reset pagination on search change
},
setPageSize: (state, action: PayloadAction<number>) => {
  state.pagination.limit = action.payload;
  state.pagination.page = 1; // Prevent out-of-bounds on limit change
}`,
  },
  {
    id: 'bug-5-redux-state-mutation',
    number: 5,
    title: 'Accidental Direct State Mutation Bypassing Immer or Corrupting State',
    category: 'State Management',
    description:
      'A developer copies array references using shallow array methods (`const items = state.items; items.sort(...)`), mutating the frozen state in place or returning a new value while also mutating draft state in Redux Toolkit.',
    productionSymptom:
      'Runtime error: `TypeError: Cannot assign to read only property of object` in production builds, or Redux selector listeners fail to notify components of changes.',
    rootCause:
      'Array prototype methods like `.sort()`, `.reverse()`, and `.splice()` mutate arrays in place. In Redux Toolkit reducers, mixing `return newState` with direct mutations confuses Immer draft finalization.',
    solutionExplanation:
      'Either mutate the Immer draft directly without returning, or return a complete new state object. When sorting or filtering arrays in reducers or selectors, always copy first (`[...state.items].sort(...)`).',
    buggyCodeSnippet: `// ❌ BUGGY: Mutates array in place inside selector or reducer
const selectSorted = (state) => {
  return state.applications.items.sort((a, b) => b.amount - a.amount); // ⚠️ In-place mutation!
};

// Reducer:
setItems: (state, action) => {
  state.items = action.payload;
  return state.items; // ⚠️ Invalid Immer usage: cannot mutate draft AND return a value
}`,
    fixedCodeSnippet: `// ✅ SENIOR FIX: Immutable copy in selectors & clean Immer draft usage
export const selectSortedApplications = createSelector(
  [(state: RootState) => state.applications.items, (state: RootState) => state.applications.sorting],
  (items, sorting) => {
    // Clone array before sorting to avoid mutating state
    return [...items].sort((a, b) => {
      const aVal = a[sorting.field];
      const bVal = b[sorting.field];
      return sorting.order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }
);`,
  },
  {
    id: 'bug-6-excessive-re-renders',
    number: 6,
    title: 'Keystroke Search Causes Full Table and Metric Cards Re-render',
    category: 'Performance',
    description:
      'Typing into the search input causes all 50 table rows, all 5 metric cards, and the drawer component to re-render on every single character, causing typing latency on low-power devices.',
    productionSymptom:
      'React DevTools Profiler shows 60+ component re-renders per keystroke with render durations exceeding 120ms, dropping frame rates below 20fps.',
    rootCause:
      'Parent component holds the un-debounced search input in parent state and passes raw inline object callbacks (`onClick={() => handleSelect(id)}`) to child rows that lack `React.memo`. Selectors return new object references on every run.',
    solutionExplanation:
      '1. Debounce the search input using a 300ms timer so Redux action is only dispatched once the user pauses.\n2. Wrap `LoanTableRow` with `React.memo` and pass stable `useCallback` action handlers.\n3. Use `createSelector` from Redux Toolkit to memoize derived state calculations.',
    buggyCodeSnippet: `// ❌ BUGGY: Parent re-renders on every keystroke, forcing all children to re-render
const Dashboard = () => {
  const [search, setSearch] = useState('');
  // Re-creates functions every keystroke:
  return (
    <div>
      <input value={search} onChange={e => { setSearch(e.target.value); dispatch(fetch(e.target.value)); }} />
      {items.map(item => <Row key={item.id} item={item} onApprove={() => dispatch(approve(item.id))} />)}
    </div>
  );
}; // Row component is not wrapped in React.memo`,
    fixedCodeSnippet: `// ✅ SENIOR FIX: Debounced input + React.memo row + useCallback
const LoanTableRow = React.memo(({ item, onApprove, onReject, onSelect }: LoanTableRowProps) => {
  return (
    <tr onClick={() => onSelect(item.id)}>
      <td>{item.applicantName}</td>
      {/* ... */}
    </tr>
  );
});
LoanTableRow.displayName = 'LoanTableRow';

// Parent uses debounced search and stable callback references
const handleApprove = useCallback((id: string) => {
  dispatch(updateApplicationStatus({ id, newStatus: 'APPROVED' }));
}, [dispatch]);`,
  },
  {
    id: 'bug-7-stale-closure',
    number: 7,
    title: 'Asynchronous Callback Captures Outdated Filter or Pagination State',
    category: 'Concurrency',
    description:
      'A background polling interval or debounced callback dispatches a refresh request using stale filter values captured when the callback was initially created.',
    productionSymptom:
      'After switching filters from "Business" to "Mortgage", a background refresh fires 10 seconds later and silently flips the view back to "Business" loans.',
    rootCause:
      'A callback or `useEffect` timer enclosed `filters` without updating the closure, or did not read the latest state from `getState()` inside a Redux thunk.',
    solutionExplanation:
      'Inside Redux thunks, always read `getState()` dynamically at execution time rather than relying on arguments passed seconds earlier. In React effects, ensure timer callbacks use `useRef` or explicit dependency arrays with proper cleanup.',
    buggyCodeSnippet: `// ❌ BUGGY: Captures 'filters' at creation time in closure
useEffect(() => {
  const interval = setInterval(() => {
    // ⚠️ Stale closure: 'filters' never updates inside this interval!
    dispatch(fetchApplications(filters));
  }, 10000);
  return () => clearInterval(interval);
}, []); // Empty dependencies!`,
    fixedCodeSnippet: `// ✅ SENIOR FIX: Read fresh state via getState() or use fresh ref
export const refreshCurrentApplications = createAsyncThunk(
  'applications/refresh',
  async (_, { getState, dispatch }) => {
    // Read the *active* live state at the exact moment this thunk executes:
    const { applications } = getState() as RootState;
    return await loanService.getApplications({
      ...applications.filters,
      page: applications.pagination.page,
      limit: applications.pagination.limit,
    });
  }
);`,
  },
  {
    id: 'bug-8-failed-request-recovery',
    number: 8,
    title: 'Network Failure Leaves UI in Permanent Loading State with No Retry',
    category: 'Error Recovery',
    description:
      'A network drop or 503 gateway timeout occurs. The UI skeleton spinner spins indefinitely, the table is unclickable, and the user must hard-refresh the page to regain control.',
    productionSymptom:
      'Users report an infinite spinning wheel on the loan dashboard during transient Wi-Fi drops.',
    rootCause:
      'The catch block in the API call threw an unhandled error, or `state.status = "loading"` was never transitioned to `state.status = "failed"` in `extraReducers.rejected`.',
    solutionExplanation:
      '1. Handle `fetchApplications.rejected` in the reducer, setting `state.status = "failed"` and recording `state.error = action.error.message`.\n2. Render an error alert component with an explicit "Retry Request" button that dispatches the thunk again.',
    buggyCodeSnippet: `// ❌ BUGGY: Missing rejected handler leaves status as 'loading' forever
builder
  .addCase(fetchApplications.pending, (state) => {
    state.status = 'loading';
  })
  .addCase(fetchApplications.fulfilled, (state, action) => {
    state.status = 'succeeded';
    state.items = action.payload.items;
  });
  // ⚠️ If the network fails, status is stuck in 'loading' forever!`,
    fixedCodeSnippet: `// ✅ SENIOR FIX: Comprehensive rejected handler + Retry UI
builder
  .addCase(fetchApplications.pending, (state) => {
    state.status = 'loading';
    state.error = null;
  })
  .addCase(fetchApplications.fulfilled, (state, action) => {
    state.status = 'succeeded';
    state.items = action.payload.items;
    state.totalCount = action.payload.totalCount;
    state.error = null;
  })
  .addCase(fetchApplications.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.error.message || 'Failed to fetch loan applications. Network unreachable.';
  });`,
  },
];

