function createLoanSelector() {
  let previousItems, previousStatus, previousSearch, previousResult;
  return state => {
    const status = state.filters.status;
    const search = state.filters.search.trim().toLowerCase();
    if (state.items === previousItems && status === previousStatus && search === previousSearch) return previousResult;
    previousItems = state.items; previousStatus = status; previousSearch = search;
    previousResult = state.items.filter(item => (status === 'ALL' || item.status === status) && item.applicantName.toLowerCase().includes(search));
    return previousResult;
  };
}
