# Reference: What are the most reliable modern ways to center an element in CSS?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "The two modern and reliable methods are: 1) **Flexbox** on the parent container (`display: flex; justify-content: center; align-items: center;`), and 2) **CSS Grid** on the parent container (`display: grid; place-items: center;`), which centers the child both horizontally and vertically in just two lines of CSS. For simple horizontal centering of a block element with a fixed width, `margin: 0 auto;` can also be used.",
    "example": "/* Modern Grid One-Liner Centering */\n.modal-overlay {\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n}\n\n/* Flexbox Centering */\n.hero-banner {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
    "code": ".center-box {\n  display: grid;\n  place-items: center;\n}",
    "followUp": {
      "question": "Can margin: auto center an item vertically inside a flex container?",
      "expectedAnswer": "Yes! Inside a flex container with height, setting margin: auto on the flex child centers it both horizontally and vertically."
    }
  },
  "expectedConcepts": [
    "Flexbox centering (justify-content: center; align-items: center;)",
    "CSS Grid centering (display: grid; place-items: center;)",
    "Margin auto centering for block elements with defined width"
  ]
}
```
