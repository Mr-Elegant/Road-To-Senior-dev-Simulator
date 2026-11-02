/**
 * Anomaly-Prone Balance Withdrawal
 */
async function processWithdrawal(client, accountId, amount) {
  // Default isolation level: READ COMMITTED
  await client.query('BEGIN');

  // Step 1: Calculate current balance from ledger entries
  const res = await client.query(
    'SELECT COALESCE(SUM(amount), 0) AS balance FROM ledger_entries WHERE account_id = $1',
    [accountId]
  );
  const currentBalance = parseFloat(res.rows[0].balance);

  // BUG: Under READ COMMITTED, another concurrent transaction can commit a withdrawal right now!
  if (currentBalance < amount) {
    await client.query('ROLLBACK');
    throw new Error('Insufficient funds');
  }

  // Step 2: Insert debit
  await client.query(
    'INSERT INTO ledger_entries (account_id, amount, created_at) VALUES ($1, $2, NOW())',
    [accountId, -amount]
  );

  await client.query('COMMIT');
}

function solution(input) {
  return "pessimistic_lock_or_serializable_retry";
}