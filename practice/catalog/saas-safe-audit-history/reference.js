function solution({ context, before, after }) {
  const nonempty = value => typeof value === "string" && value.trim().length > 0;
  if (!context || !nonempty(context.tenantId) || !nonempty(context.actorId) || !before || !after ||
      !nonempty(before.id) || before.id !== after.id ||
      before.tenantId !== context.tenantId || after.tenantId !== context.tenantId) return { entry: null };
  const fields = ["name", "status", "plan"];
  if (fields.some(field => typeof before[field] !== "string" || typeof after[field] !== "string")) return { entry: null };
  const changes = fields.filter(field => before[field] !== after[field])
    .map(field => ({ field, before: before[field], after: after[field] }));
  if (!changes.length) return { entry: null };
  return { entry: {
    tenantId: context.tenantId, actorId: context.actorId, resourceId: before.id,
    action: "organization.updated", changes
  } };
}
