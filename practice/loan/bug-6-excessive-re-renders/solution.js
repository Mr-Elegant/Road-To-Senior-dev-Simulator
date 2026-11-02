function createLoanSelector() {
  return state => state.items.filter(item =>
    (state.filters.status === 'ALL' || item.status === state.filters.status) &&
    item.applicantName.toLowerCase().includes(state.filters.search.trim().toLowerCase())
  );
}