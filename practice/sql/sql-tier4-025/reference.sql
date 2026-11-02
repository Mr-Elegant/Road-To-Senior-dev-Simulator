SELECT pg_advisory_xact_lock(42);
UPDATE customers
SET balance = balance - 50.00
WHERE id = 42
RETURNING id, balance;
