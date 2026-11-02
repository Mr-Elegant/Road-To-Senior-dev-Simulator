function reduceRequest(state, action) {
  if (action.type === 'pending') return { ...state, status: 'loading', activeRequestId: action.requestId, error: null };
  if (state.activeRequestId === null || state.activeRequestId !== action.requestId) return state;
  if (action.type === 'fulfilled') return { ...state, status: 'succeeded', activeRequestId: null, items: action.items, error: null };
  if (action.type === 'rejected') return { ...state, status: action.aborted ? 'idle' : 'failed', activeRequestId: null, error: action.aborted ? null : (action.error || 'Request failed') };
  return state;
}
