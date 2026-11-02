function sortLoans(items, sorting) {
  return items.sort((a, b) => sorting.order === 'asc'
    ? (a[sorting.field] > b[sorting.field] ? 1 : -1)
    : (a[sorting.field] < b[sorting.field] ? 1 : -1));
}