function solution({ state, snapshots, now }) {
  let next = { ...state };
  const statuses = ["active", "trialing", "past_due", "canceled", "unpaid", "incomplete"];
  const outcomes = snapshots.map(snapshot => {
    if (snapshot.tenantId !== next.tenantId) return "mismatch";
    if (!Number.isSafeInteger(snapshot.version) || snapshot.version <= 0 ||
        !Number.isSafeInteger(snapshot.periodEnd) || snapshot.periodEnd < 0 ||
        typeof snapshot.cancelAtPeriodEnd !== "boolean" ||
        !["starter", "pro"].includes(snapshot.plan) || !statuses.includes(snapshot.status)) return "invalid";
    if (snapshot.version <= next.version) return "stale";
    next = { ...snapshot };
    return "applied";
  });
  const canExport = next.plan === "pro" && ["active", "trialing"].includes(next.status) && now < next.periodEnd;
  return { state: next, canExport, outcomes };
}
