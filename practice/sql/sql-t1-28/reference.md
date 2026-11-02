# Reference: PostgreSQL Boolean Logic: COALESCE and NULLIF

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`COALESCE(arg1, arg2, ... argN)` evaluates its arguments in order and returns the first non-null value. If all arguments are null, it returns null.\nExample:\n```sql\nSELECT id, COALESCE(billing_contact, name, 'Valued Customer') AS contact_display\nFROM customers;\n```\nIf `billing_contact` is null, it checks `name`; if `name` is also null, it returns `'Valued Customer'`.",
    "followUp": {
      "question": "What does the NULLIF(a, b) function do and how is it used to prevent division by zero?",
      "expectedAnswer": "NULLIF(a, b) returns NULL if a = b; otherwise it returns a. To prevent division by zero: total / NULLIF(count, 0). If count is 0, NULLIF returns NULL, and any number divided by NULL safely returns NULL instead of throwing a runtime error."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains COALESCE behavior",
      "Provides clear code example"
    ]
  },
  "expectedConcepts": [
    "COALESCE returns first non-null argument",
    "Short-circuit evaluation",
    "Default fallback presentation"
  ]
}
```
