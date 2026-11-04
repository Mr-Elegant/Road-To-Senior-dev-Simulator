# Reference: How does CSS specificity work and what are the main selector types?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "CSS specificity determines which style rule takes precedence when multiple conflicting declarations target the same element. Specificity is calculated as a hierarchy: Inline styles have highest weight, followed by ID selectors (`#id`), then class/pseudo-class/attribute selectors (`.class`, `:hover`, `[type=\"text\"]`), and finally element selectors (`div`, `p`). If specificity is equal, the rule appearing latest in the stylesheet wins.",
    "example": "/* Specificity: 0-0-1 */\np { color: black; }\n\n/* Specificity: 0-1-0 (Wins over element) */\n.intro-text { color: blue; }\n\n/* Specificity: 1-0-0 (Wins over class) */\n#main-banner { color: red; }",
    "followUp": {
      "question": "Why is using !important generally considered a bad practice in CSS?",
      "expectedAnswer": "!important overrides the normal cascade and specificity hierarchy, making styles difficult to maintain, debug, and override cleanly later."
    }
  },
  "expectedConcepts": [
    "Type (element) selector (p, div, h1)",
    "Class selector (.button, .card)",
    "ID selector (#navbar, #hero)",
    "Inline styles and !important",
    "Specificity hierarchy: Inline > ID > Class/Attribute/Pseudo-class > Element"
  ]
}
```
