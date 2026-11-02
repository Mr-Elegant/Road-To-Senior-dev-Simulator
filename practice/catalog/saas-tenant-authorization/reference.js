function solution({ session, requestedTenantId, invoice, action }) {
  if (!session || typeof session.userId !== "string" || !session.userId.trim() ||
      !invoice || invoice.tenantId !== requestedTenantId) return { allowed: false };
  const membership = session.memberships.find(m => m.tenantId === requestedTenantId && m.active === true);
  if (!membership) return { allowed: false };
  const permissions = new Map([
    ["owner", ["read", "edit", "delete"]],
    ["editor", ["read", "edit"]],
    ["viewer", ["read"]]
  ]);
  return { allowed: (permissions.get(membership.role) || []).includes(action) };
}
