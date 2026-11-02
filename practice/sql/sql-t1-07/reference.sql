SELECT id, organization_id, amount, status FROM invoices WHERE paid_at IS NULL ORDER BY amount DESC;
