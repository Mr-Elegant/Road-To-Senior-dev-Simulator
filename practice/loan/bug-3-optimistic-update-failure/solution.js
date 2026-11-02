function reduceApproval(state, action) {
  if (action.type === 'start') {
    return { ...state, items: state.items.map(item => item.id === action.id ? { ...item, status: action.status } : item) };
  }
  return state; // Failure never rolls the optimistic status back.
}