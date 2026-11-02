async function processWithdrawalSafe(client, accountId, amount) {
  await client.query('BEGIN');
  try {
    // 1. Acquire exclusive pessimistic lock on the account record
    const accountCheck = await client.query(
      'SELECT id, balance FROM accounts WHERE id = $1 FOR UPDATE',
      [accountId]
    );

    if (accountCheck.rows.length === 0) {
      throw new Error('Account not found');
    }

    const currentBalance = parseFloat(accountCheck.rows[0].balance);
    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // 2. Insert immutable ledger entry
    await client.query(
      'INSERT INTO ledger_entries (account_id, amount, created_at) VALUES ($1, $2, NOW())',
      [accountId, -amount]
    );

    // 3. Update cached balance on parent account row
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, accountId]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}
