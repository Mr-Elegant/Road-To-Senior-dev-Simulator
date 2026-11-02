function solution({ context, before, after }) {
  return { entry: { tenantId: after.tenantId, actorId: context ? context.actorId : "unknown", before, after } };
}