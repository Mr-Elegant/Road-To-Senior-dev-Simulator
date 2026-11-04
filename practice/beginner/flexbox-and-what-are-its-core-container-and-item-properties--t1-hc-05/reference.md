# Reference: What is Flexbox and what are its core container and item properties?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Flexbox (Flexible Box Layout) is a one-dimensional CSS layout model designed for distributing space and aligning items along a single axis (either row or column). The container sets `display: flex`. Key container properties include `flex-direction` (row/column), `justify-content` (aligns along main axis), and `align-items` (aligns along perpendicular cross axis). Child items can use `flex: 1` (`flex-grow: 1`) to expand and fill available remaining space.",
    "example": ".navbar {\n  display: flex;\n  justify-content: space-between; /* Pushes brand to left, menu to right */\n  align-items: center;            /* Centers vertically */\n  padding: 1rem;\n}\n\n.nav-links {\n  display: flex;\n  gap: 1.5rem;                    /* Modern gap spacing between flex items */\n}",
    "code": ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
    "followUp": {
      "question": "If flex-direction is set to column, what does justify-content align?",
      "expectedAnswer": "When flex-direction is column, the main axis becomes vertical, so justify-content aligns items vertically (top, center, bottom)."
    }
  },
  "expectedConcepts": [
    "One-dimensional layout (row or column)",
    "display: flex and flex-direction",
    "justify-content (main axis alignment)",
    "align-items (cross axis alignment)",
    "flex-grow, flex-shrink, flex-wrap"
  ]
}
```
