-- Group loan applications by purpose
SELECT
  purpose,
  COUNT(*) AS total_applications,
  SUM(requested_amount) AS total_amount_requested
FROM loan_applications
GROUP BY purpose
ORDER BY total_amount_requested DESC;