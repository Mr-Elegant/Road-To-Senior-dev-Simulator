/* DDL Composite Index */
-- CREATE INDEX CONCURRENTLY idx_orders_user_created ON orders (user_id, created_at DESC);
-- CREATE INDEX CONCURRENTLY idx_order_items_order_id ON order_items (order_id);

async function getUserOrderHistoryOptimized(db, userId) {
  const query = `
    SELECT 
      o.id, 
      o.total_amount, 
      o.created_at,
      COALESCE(
        json_agg(
          json_build_object('product_name', i.product_name, 'price', i.price, 'qty', i.qty)
        ) FILTER (WHERE i.id IS NOT NULL), 
        '[]'
      ) as items
    FROM orders o
    LEFT JOIN order_items i ON o.id = i.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 50
  `;

  const result = await db.query(query, [userId]);
  return result.rows;
}
