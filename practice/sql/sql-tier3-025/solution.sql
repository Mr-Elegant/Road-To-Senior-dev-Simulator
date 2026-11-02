-- 1. Create partial expression index
CREATE INDEX idx_orders_unresolved ON orders (lower(customer_email))
WHERE status IN ('FAILED', 'PENDING');

-- 2. Query that matches index condition and expression
SELECT id, customer_email, total_amount, status
FROM orders
WHERE lower(customer_email) = 'alice@example.com'
  AND status = 'PENDING';