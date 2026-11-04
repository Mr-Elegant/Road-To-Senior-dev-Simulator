# Reference: How do you create a responsive web design using media queries?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Responsive Web Design ensures websites render well on all screen sizes (mobile, tablet, desktop). It requires the viewport `<meta>` tag so mobile browsers render at device scale, fluid CSS widths (percentages, flexbox, grid), and `@media` queries that apply specific styles when screen width exceeds or drops below target breakpoints. Modern best practice is **mobile-first**, styling mobile defaults first and adding desktop enhancements using `min-width` queries.",
    "example": "/* Mobile default (1 column) */\n.content-wrapper {\n  display: flex;\n  flex-direction: column;\n}\n\n/* Tablet & Desktop (switches to row above 768px) */\n@media (min-width: 768px) {\n  .content-wrapper {\n    flex-direction: row;\n  }\n}",
    "followUp": {
      "question": "What happens on mobile phones if you omit the viewport meta tag from the HTML <head>?",
      "expectedAnswer": "Mobile browsers will assume a standard desktop viewport (usually around 980px) and scale the entire desktop page down, rendering text tiny and illegible."
    }
  },
  "expectedConcepts": [
    "Viewport meta tag (<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">)",
    "CSS Media Queries (@media)",
    "Mobile-first design principles (min-width)",
    "Fluid layouts and responsive images"
  ]
}
```
