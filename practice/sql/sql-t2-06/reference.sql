SELECT id, billing_date, amount, LAG(amount, 1) OVER (ORDER BY billing_date ASC) AS prev_amount FROM invoices WHERE organization_id = 101 ORDER BY billing_date ASC;
