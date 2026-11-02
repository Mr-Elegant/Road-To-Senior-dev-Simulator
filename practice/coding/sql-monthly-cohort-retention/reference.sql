SELECT 
  SUBSTRING(u.signup_date, 1, 7) AS cohort_month,
  SUBSTRING(a.activity_date, 1, 7) AS active_month,
  COUNT(DISTINCT u.id) AS retained_users
FROM users u
INNER JOIN activity a ON u.id = a.user_id
WHERE a.activity_date >= u.signup_date
GROUP BY SUBSTRING(u.signup_date, 1, 7), SUBSTRING(a.activity_date, 1, 7)
ORDER BY cohort_month ASC, active_month ASC;
