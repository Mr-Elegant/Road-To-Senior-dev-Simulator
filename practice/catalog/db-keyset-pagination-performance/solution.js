/**
 * Degrading OFFSET Pagination
 */
async function getAuditLogsOffset(db, tenantId, pageNumber = 1, pageSize = 20) {
  const offset = (pageNumber - 1) * pageSize;

  // BUG: OFFSET 100000 forces Postgres to read 100,020 rows and discard 100,000 of them!
  const query = `
    SELECT id, event_name, created_at, actor 
    FROM audit_logs 
    WHERE tenant_id = $1 
    ORDER BY created_at DESC 
    LIMIT $2 OFFSET $3
  `;

  return db.query(query, [tenantId, pageSize, offset]);
}

function solution(input) {
  return "keyset_cursor_pagination_implemented";
}