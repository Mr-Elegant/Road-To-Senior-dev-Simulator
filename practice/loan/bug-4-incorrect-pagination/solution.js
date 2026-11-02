function updateQuery(state, change) {
  const { limit, ...filters } = change;
  return { ...state, filters: { ...state.filters, ...filters }, pagination: { ...state.pagination, limit: limit ?? state.pagination.limit } };
}