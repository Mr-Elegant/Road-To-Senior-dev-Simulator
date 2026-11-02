-- Calculate monthly cohort retention
SELECT 
  -- Format cohort_month and active_month as YYYY-MM
  SUBSTRING(u.signup_date, 1, 7) AS cohort_month,
  SUBSTRING(a.activity_date, 1, 7) AS active_month,
  COUNT(DISTINCT u.id) AS retained_users
FROM users u
JOIN activity a ON u.id = a.user_id
WHERE a.activity_date >= u.signup_date
GROUP BY cohort_month, active_month
ORDER BY cohort_month ASC, active_month ASC;