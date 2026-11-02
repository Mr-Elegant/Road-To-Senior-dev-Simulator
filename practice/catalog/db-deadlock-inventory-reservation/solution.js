/**
 * Deadlock-Prone Multi-Item Inventory Reservation
 */
async function reserveInventoryItems(client, itemsToReserve) {
  // itemsToReserve = [{ productId: 205, qty: 1 }, { productId: 101, qty: 2 }]
  
  await client.query('BEGIN');
  
  // BUG: Locks items in arbitrary array order provided by client payload!
  // If User 1 reserves [101, 205] while User 2 reserves [205, 101],
  // PostgreSQL detects a cyclical dependency and terminates one with SQLSTATE 40P01.
  for (const item of itemsToReserve) {
    const res = await client.query(
      'SELECT stock FROM inventory WHERE product_id = $1 FOR UPDATE',
      [item.productId]
    );
    if (res.rows[0].stock < item.qty) {
      throw new Error(`Insufficient stock for product ${item.productId}`);
    }
    await client.query(
      'UPDATE inventory SET stock = stock - $1 WHERE product_id = $2',
      [item.qty, item.productId]
    );
  }

  await client.query('COMMIT');
}

function solution(input) {
  return "deterministic_lock_ordering_applied";
}