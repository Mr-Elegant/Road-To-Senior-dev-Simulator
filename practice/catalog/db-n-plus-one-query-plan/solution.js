/**
 * Buggy N+1 Query Handler
 */
async function getUserOrderHistory(db, userId) {
  // Query 1: Seq Scan on orders (filters user_id, sorts created_at DESC)
  const orders = await db.query(
    'SELECT id, total_amount, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [userId]
  );

  // BUG: N additional queries executed in loop!
  for (const order of orders.rows) {
    const items = await db.query(
      'SELECT product_name, price, qty FROM order_items WHERE order_id = $1',
      [order.id]
    );
    order.items = items.rows;
  }

  return orders.rows;
}

function solution(input) {
  return "batch_join_with_composite_index";
}