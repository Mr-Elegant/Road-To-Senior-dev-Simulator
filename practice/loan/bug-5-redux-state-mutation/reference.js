function sortLoans(items, sorting) {
  return [...items].sort((a, b) => {
    const left = a[sorting.field], right = b[sorting.field];
    const result = left === right ? 0 : left < right ? -1 : 1;
    return sorting.order === 'asc' ? result : -result;
  });
}
