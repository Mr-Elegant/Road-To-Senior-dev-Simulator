function createRefresh(getState, send) {
  const state = getState();
  return () => send({ ...state.filters, page: state.pagination.page, limit: state.pagination.limit });
}