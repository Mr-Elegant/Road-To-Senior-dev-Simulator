function reduceRequest(state, action) {
  if (action.type === 'pending') return { ...state, status: 'loading', activeRequestId: action.requestId, error: null };
  if (action.type === 'fulfilled') return { ...state, status: 'succeeded', activeRequestId: null, items: action.items, error: null };
  return state;
}