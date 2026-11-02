# Reference: What is CSS Grid and when would you choose it over Flexbox?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "CSS Grid is a two-dimensional layout system that allows placing elements into structured rows and columns simultaneously. While Flexbox is ideal for single-axis linear components (like navbars or button groups), CSS Grid is ideal for overall page page layouts, card galleries, and complex dashboards where alignment across both horizontal and vertical axes is required.",
    "example": ".card-grid {\n  display: grid;\n  /* Responsive columns that auto-fit with minimum 250px width */\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1.5rem;\n}",
    "followUp": {
      "question": "What does the fr unit mean in CSS Grid?",
      "expectedAnswer": "The fr unit represents a fraction of the available free space in the grid container after fixed tracks are allocated."
    }
  },
  "expectedConcepts": [
    "Two-dimensional layout (rows AND columns simultaneously)",
    "grid-template-columns and grid-template-rows",
    "repeat() and fractional units (fr)",
    "Choosing Flexbox (content-driven / 1D) vs Grid (layout-driven / 2D page templates)"
  ]
}
```
