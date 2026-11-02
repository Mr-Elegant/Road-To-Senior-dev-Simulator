function formatInput(val: string | number): string {
  if (typeof val === 'number') {
    return val.toFixed(2);
  }
  return val.trim();
}
