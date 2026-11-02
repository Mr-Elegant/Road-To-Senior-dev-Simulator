function reduceSearch(state, action) {
  if (action.type === 'pending') return { ...state, status: 'loading', activeRequestId: action.requestId, error: null };
  if (action.type === 'fulfilled') return { ...state, items: action.items, status: 'succeeded', activeRequestId: null, error: null };
  if (action.type === 'rejected') return { ...state, status: 'failed', activeRequestId: null, error: action.error };
  return state;
}