# Reference: Monthly User Cohort Retention & Churn Analysis

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "SELECT \n  SUBSTRING(u.signup_date, 1, 7) AS cohort_month,\n  SUBSTRING(a.activity_date, 1, 7) AS active_month,\n  COUNT(DISTINCT u.id) AS retained_users\nFROM users u\nINNER JOIN activity a ON u.id = a.user_id\nWHERE a.activity_date >= u.signup_date\nGROUP BY SUBSTRING(u.signup_date, 1, 7), SUBSTRING(a.activity_date, 1, 7)\nORDER BY cohort_month ASC, active_month ASC;",
    "explanation": "Joins users to their activity records, truncates dates to YYYY-MM, groups by both cohort and activity months, and counts distinct users per bucket.",
    "timeComplexity": "O(N log N) grouping & sort"
  }
}
```
