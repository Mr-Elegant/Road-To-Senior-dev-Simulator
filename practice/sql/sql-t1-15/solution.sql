-- Conditional aggregation on EMI installments
SELECT
  COUNT(*) AS total_emis,
  SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) AS paid_count,
  SUM(CASE WHEN status = 'OVERDUE' THEN 1 ELSE 0 END) AS overdue_count
FROM emi_schedule;