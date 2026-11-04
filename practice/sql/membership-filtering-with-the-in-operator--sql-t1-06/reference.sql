SELECT id, status, total_amount FROM orders WHERE status IN ('PAID', 'SHIPPED') ORDER BY id ASC;
