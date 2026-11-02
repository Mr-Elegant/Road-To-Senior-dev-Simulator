function updateQuery(state, change) {
  const { limit, ...patch } = change;
  const filters = { ...state.filters, ...patch };
  const nextLimit = limit ?? state.pagination.limit;
  const changed = nextLimit !== state.pagination.limit || Object.keys(patch).some(key => patch[key] !== state.filters[key]);
  return changed ? { ...state, filters, pagination: { page: 1, limit: nextLimit } } : state;
}
