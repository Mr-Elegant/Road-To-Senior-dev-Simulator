async function reserveInventoryDeterministic(client, itemsToReserve) {
  // Sort items deterministically by product_id ascending
  const sortedItems = [...itemsToReserve].sort((a, b) => a.productId - b.productId);

  await client.query('BEGIN');
  try {
    for (const item of sortedItems) {
      const res = await client.query(
        'SELECT stock FROM inventory WHERE product_id = $1 FOR UPDATE',
        [item.productId]
      );

      if (!res.rows[0] || res.rows[0].stock < item.qty) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }

      await client.query(
        'UPDATE inventory SET stock = stock - $1 WHERE product_id = $2',
        [item.qty, item.productId]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}
