function shouldFetch(active, next) {
  return !(active && active.status === 'loading');
}