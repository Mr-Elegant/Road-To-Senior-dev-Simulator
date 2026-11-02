import type { LoanLabExercise, LoanLabTest } from '@/types/loanLab';

const check = (id: string, name: string, input: Record<string, unknown>, expected: unknown, explanation: string, sample = false): LoanLabTest => ({ id, name, input, expected, explanation, sample });
const searchState = { items: ['original'], status: 'idle', activeRequestId: null, error: null };
const query = { search: '', status: 'ALL', page: 1, limit: 20 };
const loanItems = [{ id: 'a', applicantName: 'Aarav', loanAmount: 500, status: 'PENDING' }, { id: 'b', applicantName: 'Sophia', loanAmount: 100, status: 'APPROVED' }, { id: 'c', applicantName: 'Mina', loanAmount: 500, status: 'PENDING' }];

export const loanLabExercises: LoanLabExercise[] = [
  {
    bugId: 'bug-1-race-condition', title: 'Keep the newest search result', entryPoint: 'reduceSearch', kind: 'reducer',
    contract: 'Implement reduceSearch(state, action) as a pure reducer. State has items, status, activeRequestId and error. pending records action.requestId, sets loading and clears error. fulfilled/rejected may update only the active request. A matching fulfilled stores action.items; a matching rejected stores action.error. Terminal states clear activeRequestId. Unknown or stale actions preserve state. Inputs are frozen; return new objects for changes.',
    starterCode: `function reduceSearch(state, action) {
  if (action.type === 'pending') return { ...state, status: 'loading', activeRequestId: action.requestId, error: null };
  if (action.type === 'fulfilled') return { ...state, items: action.items, status: 'succeeded', activeRequestId: null, error: null };
  if (action.type === 'rejected') return { ...state, status: 'failed', activeRequestId: null, error: action.error };
  return state;
}`,
    referenceCode: `function reduceSearch(state, action) {
  if (action.type === 'pending') {
    return { ...state, status: 'loading', activeRequestId: action.requestId, error: null };
  }
  if (action.requestId !== state.activeRequestId || state.activeRequestId === null) return state;
  if (action.type === 'fulfilled') return { ...state, items: action.items, status: 'succeeded', activeRequestId: null, error: null };
  if (action.type === 'rejected') return { ...state, status: 'failed', activeRequestId: null, error: action.error };
  return state;
}`,
    hints: ['Track which request was most recently started, not which response arrived last.', 'Apply the request-ID guard to both success and failure; clear it only when the active request finishes.'],
    tests: [
      check('latest-first', 'A slow old response cannot replace a newer success', { initial: searchState, actions: [{ type: 'pending', requestId: 'old' }, { type: 'pending', requestId: 'new' }, { type: 'fulfilled', requestId: 'new', items: ['Sophia'] }, { type: 'fulfilled', requestId: 'old', items: ['Aarav'] }] }, { ...searchState, status: 'succeeded', items: ['Sophia'] }, 'The old response arrives last but does not own the active request.', true),
      check('stale-error', 'An old error cannot fail the current request', { initial: searchState, actions: [{ type: 'pending', requestId: 'old' }, { type: 'pending', requestId: 'new' }, { type: 'rejected', requestId: 'old', error: '503' }] }, { ...searchState, status: 'loading', activeRequestId: 'new' }, 'Ignore stale failures as well as stale success responses.', true),
      check('active-error', 'A current failure preserves previous results and ends loading', { initial: searchState, actions: [{ type: 'pending', requestId: 'x' }, { type: 'rejected', requestId: 'x', error: 'Offline' }] }, { ...searchState, status: 'failed', error: 'Offline' }, 'A genuine active error is surfaced without erasing prior data.'),
      check('stale-before', 'An old success cannot finish a pending newer search', { initial: searchState, actions: [{ type: 'pending', requestId: 'a' }, { type: 'pending', requestId: 'b' }, { type: 'fulfilled', requestId: 'a', items: ['old'] }] }, { ...searchState, status: 'loading', activeRequestId: 'b' }, 'The active request stays pending until its own outcome.'),
      check('unknown', 'Unknown events leave the state intact', { initial: searchState, actions: [{ type: 'other', requestId: 'x' }] }, searchState, 'Unrelated actions must not change this reducer.'),
    ],
  },
  {
    bugId: 'bug-2-duplicate-api-calls', title: 'Admit distinct queries, suppress duplicate in-flight work', entryPoint: 'shouldFetch', kind: 'fetch-gate',
    contract: 'Implement shouldFetch(active, next). active is null or {status, query}; next is {search,status,page,limit}. Return false only if an identical query is already loading. Compare the four query values, not object identity or JSON property order. Return true for changed queries, completed/failed requests, or no active request. Do not suppress all requests merely because one is loading.',
    starterCode: `function shouldFetch(active, next) {
  return !(active && active.status === 'loading');
}`,
    referenceCode: `function shouldFetch(active, next) {
  if (!active || active.status !== 'loading') return true;
  return ['search', 'status', 'page', 'limit'].some(key => active.query[key] !== next[key]);
}`,
    hints: ['A loading request for one search must not block a different search.', 'Compare stable primitive query fields; two object instances can describe the same request.'],
    tests: [
      check('duplicate', 'Suppress a duplicate described by a fresh object', { active: { status: 'loading', query }, next: { limit: 20, page: 1, status: 'ALL', search: '' } }, false, 'Equivalent values identify duplicate work even when property order differs.', true),
      check('new-search', 'Allow a newer search while the old query is loading', { active: { status: 'loading', query }, next: { ...query, search: 'Sophia' } }, true, 'A blanket loading guard would lose the latest user query.', true),
      check('new-page', 'Pagination changes are distinct queries', { active: { status: 'loading', query }, next: { ...query, page: 2 } }, true, 'Page is part of the request identity.'),
      check('retry', 'Allow retrying the same failed request', { active: { status: 'failed', query }, next: query }, true, 'A failed request is no longer in flight.'),
      check('empty', 'Allow the first request', { active: null, next: query }, true, 'No active work means nothing to deduplicate.'),
      check('new-status', 'Status and page size also distinguish requests', { active: { status: 'loading', query }, next: { ...query, status: 'PENDING', limit: 50 } }, true, 'Every documented query field participates in identity.'),
    ],
  },
  {
    bugId: 'bug-3-optimistic-update-failure', title: 'Roll back the correct optimistic approval', entryPoint: 'reduceApproval', kind: 'reducer',
    contract: 'Implement reduceApproval(state, action). State is {items:[{id,status}],pending:{[id]:{requestId,before}}}. start on an existing unlocked id backs up its status and applies action.status. Ignore another start while that id is locked. failure restores the backup; success applies action.status if provided, otherwise keeps the optimistic status. Settle only matching id/requestId and remove that pending entry. Keep other loans and pending operations intact. Ignore missing IDs and unknown events. Inputs are frozen.',
    starterCode: `function reduceApproval(state, action) {
  if (action.type === 'start') {
    return { ...state, items: state.items.map(item => item.id === action.id ? { ...item, status: action.status } : item) };
  }
  return state; // Failure never rolls the optimistic status back.
}`,
    referenceCode: `function reduceApproval(state, action) {
  const item = state.items.find(item => item.id === action.id);
  if (!item) return state;
  const pending = state.pending[action.id];
  if (action.type === 'start') {
    if (pending) return state;
    return { ...state,
      items: state.items.map(row => row.id === action.id ? { ...row, status: action.status } : row),
      pending: { ...state.pending, [action.id]: { requestId: action.requestId, before: item.status } }
    };
  }
  if (!pending || pending.requestId !== action.requestId || !['success', 'failure'].includes(action.type)) return state;
  const nextPending = { ...state.pending };
  delete nextPending[action.id];
  const status = action.type === 'failure' ? pending.before : (action.status ?? item.status);
  return { ...state, pending: nextPending, items: state.items.map(row => row.id === action.id ? { ...row, status } : row) };
}`,
    hints: ['Store the original status together with the request token for each loan.', 'Only the operation that owns the lock may settle it. Removing one backup must not remove another loan’s backup.'],
    tests: (() => {
      const initial = { items: [{ id: 'a', status: 'PENDING' }, { id: 'b', status: 'UNDER_REVIEW' }], pending: {} };
      const start = { type: 'start', id: 'a', status: 'APPROVED', requestId: 'r1' };
      return [
        check('rollback', 'Rejected approval restores the exact previous status', { initial, actions: [start, { type: 'failure', id: 'a', requestId: 'r1' }] }, initial, 'A failed optimistic change must restore its own snapshot.', true),
        check('lock', 'A second click cannot replace an in-flight backup', { initial, actions: [start, { ...start, status: 'REJECTED', requestId: 'r2' }] }, { items: [{ id: 'a', status: 'APPROVED' }, initial.items[1]], pending: { a: { requestId: 'r1', before: 'PENDING' } } }, 'A duplicate start cannot replace the original owner or snapshot.', true),
        check('stale-settle', 'An unrelated failure cannot roll back a newer operation', { initial, actions: [start, { type: 'failure', id: 'a', requestId: 'old' }] }, { items: [{ id: 'a', status: 'APPROVED' }, initial.items[1]], pending: { a: { requestId: 'r1', before: 'PENDING' } } }, 'Check request identity before touching a backup.'),
        check('concurrent', 'Settling one loan preserves another pending update', { initial, actions: [start, { ...start, id: 'b', requestId: 'r2' }, { type: 'failure', id: 'a', requestId: 'r1' }] }, { items: [initial.items[0], { id: 'b', status: 'APPROVED' }], pending: { b: { requestId: 'r2', before: 'UNDER_REVIEW' } } }, 'Concurrency is scoped to a row, not to the entire table.'),
        check('success', 'Successful server status replaces optimistic status and unlocks', { initial, actions: [start, { type: 'success', id: 'a', requestId: 'r1', status: 'UNDER_REVIEW' }] }, { items: [{ id: 'a', status: 'UNDER_REVIEW' }, initial.items[1]], pending: {} }, 'The confirmed server status is authoritative.'),
        check('missing', 'Ignore updates for absent records', { initial, actions: [{ ...start, id: 'missing' }] }, initial, 'Unknown IDs must not create orphaned locks.'),
      ];
    })(),
  },
  {
    bugId: 'bug-4-incorrect-pagination', title: 'Reset pagination when the query changes', entryPoint: 'updateQuery', kind: 'reducer',
    contract: 'Implement updateQuery(state, change) for state {filters:{search,status,loanType,riskRating},pagination:{page,limit}}. change may contain any filter fields and/or a positive integer limit. Merge supplied filter fields and limit. Reset page to 1 only when a supplied query value actually changes; preserve page on a no-op. Preserve all unspecified fields. Inputs are frozen.',
    starterCode: `function updateQuery(state, change) {
  const { limit, ...filters } = change;
  return { ...state, filters: { ...state.filters, ...filters }, pagination: { ...state.pagination, limit: limit ?? state.pagination.limit } };
}`,
    referenceCode: `function updateQuery(state, change) {
  const { limit, ...patch } = change;
  const filters = { ...state.filters, ...patch };
  const nextLimit = limit ?? state.pagination.limit;
  const changed = nextLimit !== state.pagination.limit || Object.keys(patch).some(key => patch[key] !== state.filters[key]);
  return changed ? { ...state, filters, pagination: { page: 1, limit: nextLimit } } : state;
}`,
    hints: ['Pagination belongs to the current query. A different filter creates a new query.', 'Compare previous values before resetting, and handle page-size changes too.'],
    tests: (() => {
      const initial = { filters: { search: '', status: 'ALL', loanType: 'ALL', riskRating: 'ALL' }, pagination: { page: 6, limit: 20 } };
      return [
        check('status', 'Narrowing status resets page six to page one', { initial, actions: [{ status: 'PENDING' }] }, { ...initial, filters: { ...initial.filters, status: 'PENDING' }, pagination: { page: 1, limit: 20 } }, 'A narrow result set may not have six pages.', true),
        check('search', 'A new search preserves other filters and resets page', { initial, actions: [{ search: 'Mina' }] }, { ...initial, filters: { ...initial.filters, search: 'Mina' }, pagination: { page: 1, limit: 20 } }, 'Reset pagination when search criteria change.', true),
        check('limit', 'Changing page size resets pagination', { initial, actions: [{ limit: 50 }] }, { ...initial, pagination: { page: 1, limit: 50 } }, 'Page size changes the interpretation of a page index.'),
        check('noop', 'Identical filters preserve the active page', { initial, actions: [{ status: 'ALL', limit: 20 }] }, initial, 'A repeated action with identical values must not move the user.'),
        check('combined', 'Multiple changes preserve all updated values', { initial, actions: [{ loanType: 'Business', riskRating: 'HIGH', limit: 10 }] }, { filters: { ...initial.filters, loanType: 'Business', riskRating: 'HIGH' }, pagination: { page: 1, limit: 10 } }, 'Merge the query changes rather than replacing unrelated filters.'),
      ];
    })(),
  },
  {
    bugId: 'bug-5-redux-state-mutation', title: 'Sort loans without mutating Redux state', entryPoint: 'sortLoans', kind: 'sort',
    contract: 'Implement sortLoans(items, sorting), returning an array ordered by sorting.field (loanAmount or applicantName) and sorting.order (asc or desc). Never mutate the input array or loan objects. Keep original relative order for equal values. Compare numeric amounts numerically and names lexicographically using ordinary JavaScript string ordering. Inputs are frozen.',
    starterCode: `function sortLoans(items, sorting) {
  return items.sort((a, b) => sorting.order === 'asc'
    ? (a[sorting.field] > b[sorting.field] ? 1 : -1)
    : (a[sorting.field] < b[sorting.field] ? 1 : -1));
}`,
    referenceCode: `function sortLoans(items, sorting) {
  return [...items].sort((a, b) => {
    const left = a[sorting.field], right = b[sorting.field];
    const result = left === right ? 0 : left < right ? -1 : 1;
    return sorting.order === 'asc' ? result : -result;
  });
}`,
    hints: ['Array.sort mutates the array it receives. Copy the array before sorting.', 'A comparator must return zero for ties; equal values should keep their original order.'],
    tests: [
      check('amount-asc', 'Frozen state sorts by numeric amount ascending', { items: loanItems, sorting: { field: 'loanAmount', order: 'asc' } }, ['b', 'a', 'c'], 'Copying the array avoids mutating the frozen store; equal amounts remain stable.', true),
      check('amount-desc', 'Descending amounts keep stable ties', { items: loanItems, sorting: { field: 'loanAmount', order: 'desc' } }, ['a', 'c', 'b'], 'The comparator must handle equality in either direction.', true),
      check('name', 'Names sort in descending string order', { items: loanItems, sorting: { field: 'applicantName', order: 'desc' } }, ['b', 'c', 'a'], 'Select the requested field rather than always sorting amounts.'),
      check('empty', 'An empty list is valid', { items: [], sorting: { field: 'loanAmount', order: 'asc' } }, [], 'No special mutation or fabricated record is needed for empty input.'),
      check('numeric', 'Amounts are compared numerically, not as strings', { items: [{ id: 'small', loanAmount: 9 }, { id: 'large', loanAmount: 100 }], sorting: { field: 'loanAmount', order: 'asc' } }, ['small', 'large'], 'String comparison would place 100 before 9.'),
    ],
  },
  {
    bugId: 'bug-6-excessive-re-renders', title: 'Keep selector results stable for unrelated updates', entryPoint: 'createLoanSelector', kind: 'selector',
    contract: 'Implement createLoanSelector(), returning a one-entry memoized select(state) function. state has items and filters {status,search}; unrelated ui fields may change. Filter status unless ALL, and match applicantName case-insensitively using trimmed search. Reuse the exact previous result array when the items reference, status value and normalized search are unchanged, even if state/filters objects are fresh. Recompute when those inputs change. Keep cache private to each selector instance. Inputs are frozen.',
    starterCode: `function createLoanSelector() {
  return state => state.items.filter(item =>
    (state.filters.status === 'ALL' || item.status === state.filters.status) &&
    item.applicantName.toLowerCase().includes(state.filters.search.trim().toLowerCase())
  );
}`,
    referenceCode: `function createLoanSelector() {
  let previousItems, previousStatus, previousSearch, previousResult;
  return state => {
    const status = state.filters.status;
    const search = state.filters.search.trim().toLowerCase();
    if (state.items === previousItems && status === previousStatus && search === previousSearch) return previousResult;
    previousItems = state.items; previousStatus = status; previousSearch = search;
    previousResult = state.items.filter(item => (status === 'ALL' || item.status === status) && item.applicantName.toLowerCase().includes(search));
    return previousResult;
  };
}`,
    hints: ['Filtering into a new array on every call changes the reference even when contents match.', 'Cache only by actual inputs: items reference and primitive filters, not the entire state or filters object.'],
    tests: [
      check('unrelated', 'Opening a drawer preserves the selector result reference', { items: loanItems, filters: { status: 'ALL', search: '' }, steps: [{ ui: { drawerOpen: true } }] }, [{ ids: ['a', 'b', 'c'], sameAsPrevious: null }, { ids: ['a', 'b', 'c'], sameAsPrevious: true }], 'useSelector observes result identity, so a fresh but identical array causes a render.', true),
      check('filter-change', 'A changed status recomputes the result', { items: loanItems, filters: { status: 'ALL', search: '' }, steps: [{ filters: { status: 'PENDING' } }] }, [{ ids: ['a', 'b', 'c'], sameAsPrevious: null }, { ids: ['a', 'c'], sameAsPrevious: false }], 'Memoization must not hide real filter changes.', true),
      check('normalized', 'Equivalent search and fresh filter objects reuse the cache', { items: loanItems, filters: { status: 'ALL', search: ' sophia ' }, steps: [{ filters: { status: 'ALL', search: 'SOPHIA' } }] }, [{ ids: ['b'], sameAsPrevious: null }, { ids: ['b'], sameAsPrevious: true }], 'Normalize the search before comparing cache keys.'),
      check('items-change', 'A replacement items reference invalidates the cache', { items: loanItems, filters: { status: 'ALL', search: '' }, steps: [{ items: [loanItems[1]] }] }, [{ ids: ['a', 'b', 'c'], sameAsPrevious: null }, { ids: ['b'], sameAsPrevious: false }], 'Store changes must be reflected in the derived list.'),
      check('empty-filter', 'Cache empty results just like populated arrays', { items: loanItems, filters: { status: 'ALL', search: 'missing' }, steps: [{ ui: { drawerOpen: true } }] }, [{ ids: [], sameAsPrevious: null }, { ids: [], sameAsPrevious: true }], 'A missing match is still a valid memoized result.'),
    ],
  },
  {
    bugId: 'bug-7-stale-closure', title: 'Read current filters when a refresh actually runs', entryPoint: 'createRefresh', kind: 'refresh',
    contract: 'Implement createRefresh(getState, send), returning a synchronous refresh callback. On each callback invocation, read the current state {filters,pagination} and call send once with {...filters,page:pagination.page,limit:pagination.limit}. Do not send while creating the callback. The same callback must work after filters and pagination are replaced. Capture a fresh request snapshot; do not mutate state or previously sent requests.',
    starterCode: `function createRefresh(getState, send) {
  const state = getState();
  return () => send({ ...state.filters, page: state.pagination.page, limit: state.pagination.limit });
}`,
    referenceCode: `function createRefresh(getState, send) {
  return () => {
    const state = getState();
    send({ ...state.filters, page: state.pagination.page, limit: state.pagination.limit });
  };
}`,
    hints: ['The callback may run long after it is created. Which values does its closure retain?', 'Read getState inside the returned callback, then build a new request object.'],
    tests: (() => {
      const initial = { filters: { search: '', loanType: 'Business' }, pagination: { page: 1, limit: 20 } };
      const updated = { filters: { search: 'Mina', loanType: 'Mortgage' }, pagination: { page: 3, limit: 50 } };
      return [
        check('latest', 'A delayed refresh uses the latest filters and page', { initial, events: [{ state: updated, call: true }] }, [{ search: 'Mina', loanType: 'Mortgage', page: 3, limit: 50 }], 'Read current state at callback execution time.', true),
        check('two-calls', 'The same callback sees successive state changes', { initial, events: [{ call: true }, { state: updated, call: true }] }, [{ search: '', loanType: 'Business', page: 1, limit: 20 }, { search: 'Mina', loanType: 'Mortgage', page: 3, limit: 50 }], 'A previously sent request must remain unchanged when later state changes.', true),
        check('no-call', 'Creating the callback does not send a request', { initial, events: [{ state: updated }] }, [], 'Registration and execution are separate events.'),
        check('page-only', 'A pagination-only update is also current', { initial, events: [{ state: { ...initial, pagination: { page: 8, limit: 10 } }, call: true }] }, [{ search: '', loanType: 'Business', page: 8, limit: 10 }], 'Freshness applies to pagination as well as search.'),
      ];
    })(),
  },
  {
    bugId: 'bug-8-failed-request-recovery', title: 'Leave loading and support retry after a failure', entryPoint: 'reduceRequest', kind: 'reducer',
    contract: 'Implement reduceRequest(state, action) with items,status,activeRequestId,error. pending records requestId, sets loading and clears any error. Only the active request can fulfill or reject. fulfilled stores action.items and succeeded; rejected stores failed and action.error, or "Request failed" if missing. An aborted active rejection returns idle with no error. All terminal states clear activeRequestId and preserve prior items on failure/abort. Unknown and stale events do nothing. Inputs are frozen.',
    starterCode: `function reduceRequest(state, action) {
  if (action.type === 'pending') return { ...state, status: 'loading', activeRequestId: action.requestId, error: null };
  if (action.type === 'fulfilled') return { ...state, status: 'succeeded', activeRequestId: null, items: action.items, error: null };
  return state;
}`,
    referenceCode: `function reduceRequest(state, action) {
  if (action.type === 'pending') return { ...state, status: 'loading', activeRequestId: action.requestId, error: null };
  if (state.activeRequestId === null || state.activeRequestId !== action.requestId) return state;
  if (action.type === 'fulfilled') return { ...state, status: 'succeeded', activeRequestId: null, items: action.items, error: null };
  if (action.type === 'rejected') return { ...state, status: action.aborted ? 'idle' : 'failed', activeRequestId: null, error: action.aborted ? null : (action.error || 'Request failed') };
  return state;
}`,
    hints: ['Every active pending request needs a terminal success, failure or cancellation transition.', 'Preserve previous rows on failure, clear the error when retrying, and ignore failures from stale requests.'],
    tests: [
      check('failure', 'A network failure ends loading and preserves rows', { initial: searchState, actions: [{ type: 'pending', requestId: 'x' }, { type: 'rejected', requestId: 'x', error: 'Offline' }] }, { ...searchState, status: 'failed', error: 'Offline' }, 'The user needs a failed state and error instead of an infinite spinner.', true),
      check('retry', 'Retry clears the error and can recover successfully', { initial: { ...searchState, status: 'failed', error: 'Offline' }, actions: [{ type: 'pending', requestId: 'r2' }, { type: 'fulfilled', requestId: 'r2', items: ['recovered'] }] }, { ...searchState, status: 'succeeded', items: ['recovered'] }, 'A fresh request can recover without hard-refreshing the dashboard.', true),
      check('aborted', 'Cancellation is not shown as a network failure', { initial: searchState, actions: [{ type: 'pending', requestId: 'x' }, { type: 'rejected', requestId: 'x', aborted: true }] }, searchState, 'An intentional cancellation returns to idle without an error.'),
      check('stale', 'An old rejection cannot fail a newer pending request', { initial: searchState, actions: [{ type: 'pending', requestId: 'a' }, { type: 'pending', requestId: 'b' }, { type: 'rejected', requestId: 'a', error: 'old error' }] }, { ...searchState, status: 'loading', activeRequestId: 'b' }, 'Failure handling needs the same request ownership guard as success.'),
      check('fallback', 'Missing error text has a useful fallback', { initial: searchState, actions: [{ type: 'pending', requestId: 'x' }, { type: 'rejected', requestId: 'x' }] }, { ...searchState, status: 'failed', error: 'Request failed' }, 'A rejected request must have a visible failure message.'),
    ],
  },
];

export const loanLabExerciseMap = new Map(loanLabExercises.map((exercise) => [exercise.bugId, exercise]));
