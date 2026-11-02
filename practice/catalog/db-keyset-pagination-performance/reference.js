/* Composite Index */
-- CREATE INDEX idx_audit_logs_keyset ON audit_logs (tenant_id, created_at DESC, id DESC);

async function getAuditLogsKeyset(db, tenantId, cursor, limit = 20) {
  let query;
  let params;

  if (!cursor) {
    // First page
    query = `
      SELECT id, event_name, created_at, actor 
      FROM audit_logs 
      WHERE tenant_id = $1 
      ORDER BY created_at DESC, id DESC 
      LIMIT $2
    `;
    params = [tenantId, limit];
  } else {
    // Subsequent pages: seek directly using tuple comparison
    query = `
      SELECT id, event_name, created_at, actor 
      FROM audit_logs 
      WHERE tenant_id = $1 
        AND (created_at, id) < ($2, $3)
      ORDER BY created_at DESC, id DESC 
      LIMIT $4
    `;
    params = [tenantId, cursor.createdAt, cursor.id, limit];
  }

  const res = await db.query(query, params);
  const rows = res.rows;
  const nextCursor = rows.length === limit 
    ? { createdAt: rows[rows.length - 1].created_at, id: rows[rows.length - 1].id } 
    : null;

  return { rows, nextCursor };
}
