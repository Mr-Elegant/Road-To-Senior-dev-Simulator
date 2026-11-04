# Reference: What is the CSS Box Model and what does box-sizing: border-box do?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "The CSS Box Model is the container structure wrapping every HTML element, composed of: **Content** (text/image), **Padding** (transparent space inside the border), **Border** (outer boundary), and **Margin** (space outside the border). By default (`content-box`), adding padding and borders expands the rendered width beyond the declared `width`. Setting `box-sizing: border-box` ensures that padding and borders are included *inside* the declared width, making layout sizing predictable.",
    "example": "/* Universal box-sizing reset */\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n\n.box {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n  /* With border-box, total rendered width remains exactly 200px. */\n  /* With default content-box, total width would be 250px (200 + 40 + 10). */\n}",
    "followUp": {
      "question": "What is margin collapsing in CSS?",
      "expectedAnswer": "When vertical margins of two adjacent block elements touch, they combine into a single margin equal to the larger of the two, rather than adding together."
    }
  },
  "expectedConcepts": [
    "Four layers: Content, Padding, Border, Margin",
    "content-box default behavior adding padding/border to width",
    "border-box keeping total width constant"
  ]
}
```
