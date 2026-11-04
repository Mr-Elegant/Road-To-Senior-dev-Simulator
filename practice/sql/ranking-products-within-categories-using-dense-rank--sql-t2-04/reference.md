# Reference: Ranking Products Within Categories Using DENSE_RANK()

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC)` groups calculations by category and assigns ranks without skipping numbers when prices tie.",
    "code": "SELECT category, name, price, DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS category_price_rank FROM products ORDER BY category ASC, category_price_rank ASC;",
    "followUp": {
      "question": "What is the exact behavioral difference between ROW_NUMBER(), RANK(), and DENSE_RANK() on tied values (e.g., $100, $100, $80)?",
      "expectedAnswer": "For tied values $100, $100, $80: ROW_NUMBER assigns distinct arbitrary ranks (1, 2, 3); RANK assigns tied ranks and skips subsequent values (1, 1, 3); DENSE_RANK assigns tied ranks without gaps (1, 1, 2)."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper window specification",
      "Partitions by category",
      "Correct sort order"
    ]
  },
  "expectedConcepts": [
    "Window function OVER() clause",
    "PARTITION BY window grouping",
    "DENSE_RANK vs RANK vs ROW_NUMBER"
  ]
}
```
