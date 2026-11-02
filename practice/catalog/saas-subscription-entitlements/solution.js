function solution({ state, snapshots }) {
  const next = snapshots.length ? snapshots[snapshots.length - 1] : state;
  return { state: next, canExport: next.plan === "pro", outcomes: snapshots.map(() => "applied") };
}