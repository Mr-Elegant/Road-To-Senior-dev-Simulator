function reduceApproval(state, action) {
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
}
