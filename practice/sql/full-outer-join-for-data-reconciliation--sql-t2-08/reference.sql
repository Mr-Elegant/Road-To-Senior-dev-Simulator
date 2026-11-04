SELECT o.id AS order_id, p.id AS payment_id, o.total_amount, p.amount AS payment_amount FROM orders o FULL OUTER JOIN payments p ON o.id = p.order_id ORDER BY o.id ASC, p.id ASC;
