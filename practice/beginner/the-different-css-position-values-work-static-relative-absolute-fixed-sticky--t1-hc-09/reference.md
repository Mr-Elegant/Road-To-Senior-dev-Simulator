# Reference: How do the different CSS position values work (static, relative, absolute, fixed, sticky)?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`position: static` is the default where elements follow normal document flow. `relative` keeps the element in flow but allows shifting via `top/left` and acts as a coordinate anchor for `absolute` children. `absolute` pulls the element out of normal flow, positioning it relative to its closest non-static parent. `fixed` locks the element relative to the browser viewport so it stays visible while scrolling. `sticky` acts relatively until a scroll threshold is met, then locks in place like fixed.",
    "example": "/* Parent anchor */\n.card {\n  position: relative;\n  width: 300px;\n  height: 200px;\n}\n\n/* Badge pinned to top-right corner of card */\n.badge {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}\n\n/* Sticky header */\n.header {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}",
    "followUp": {
      "question": "What is required for position: sticky to work properly?",
      "expectedAnswer": "A threshold position must be specified (such as top: 0), and none of the parent elements in the hierarchy can have overflow: hidden."
    }
  },
  "expectedConcepts": [
    "static: Default normal document flow",
    "relative: Positioned relative to normal position, creates reference frame for children",
    "absolute: Removed from flow, positioned relative to nearest positioned ancestor",
    "fixed: Positioned relative to browser viewport, stays on screen during scroll",
    "sticky: Toggles between relative and fixed depending on scroll threshold"
  ]
}
```
