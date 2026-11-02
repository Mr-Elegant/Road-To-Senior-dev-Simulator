async function syncCustomerFromCrmSafe(db, crmEvent) {
  const { customerId, email, tier, eventTimestamp } = crmEvent;
  const eventDate = new Date(eventTimestamp);

  const result = await db.query(
    `UPDATE customers 
     SET email = $1, tier = $2, updated_at = $3 
     WHERE id = $4 AND updated_at < $3`,
    [email, tier, eventDate, customerId]
  );

  if (result.rowCount === 0) {
    // Either customer does not exist, or record has already been updated with newer data
    const existing = await db.query('SELECT updated_at FROM customers WHERE id = $1', [customerId]);
    if (existing.rows.length > 0) {
      console.log(`Stale event for customer ${customerId} ignored (Current: ${existing.rows[0].updated_at}, Event: ${eventDate})`);
      return { status: 'IGNORED_STALE' };
    } else {
      // First-time insert
      await db.query(
        'INSERT INTO customers (id, email, tier, updated_at) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [customerId, email, tier, eventDate]
      );
      return { status: 'INSERTED' };
    }
  }

  return { status: 'UPDATED' };
}
