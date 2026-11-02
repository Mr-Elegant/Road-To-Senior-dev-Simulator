function shouldFetch(active, next) {
  if (!active || active.status !== 'loading') return true;
  return ['search', 'status', 'page', 'limit'].some(key => active.query[key] !== next[key]);
}
