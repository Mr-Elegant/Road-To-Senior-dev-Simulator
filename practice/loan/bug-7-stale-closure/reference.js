function createRefresh(getState, send) {
  return () => {
    const state = getState();
    send({ ...state.filters, page: state.pagination.page, limit: state.pagination.limit });
  };
}
