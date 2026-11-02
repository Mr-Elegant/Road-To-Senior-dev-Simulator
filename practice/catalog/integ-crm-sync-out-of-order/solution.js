/**
 * Fragile CRM Ingestion: Blind Overwrites
 */
async function syncCustomerFromCrm(db, crmEvent) {
  // crmEvent = { customerId: 'c-100', email: 'alice@acme.com', tier: 'PRO', eventTimestamp: 1672531200000 }
  
  // BUG: Blindly overwrites the database row with whatever payload arrives,
  // even if this event is 10 minutes older than the data already in the database!
  await db.query(
    'UPDATE customers SET email = $1, tier = $2 WHERE id = $3',
    [crmEvent.email, crmEvent.tier, crmEvent.customerId]
  );
}

function solution(input) {
  return "monotonic_version_guard_applied";
}