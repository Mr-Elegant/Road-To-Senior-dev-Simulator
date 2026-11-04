# Reference: What is the difference between px, rem, em, and % units in CSS?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`px` is an absolute unit representing physical display pixels. `rem` (root em) is relative to the root `<html>` element’s font size (1rem = 16px by default), making typography and spacing scale gracefully when users change their browser font settings for accessibility. `em` is relative to the font-size of its immediate parent element (which can compound). `%` is relative to the parent container’s size.",
    "example": "/* If root font-size is 16px */\nh1 {\n  font-size: 2rem; /* 32px */\n  margin-bottom: 1rem; /* 16px */\n}\n\n.parent {\n  font-size: 20px;\n}\n.child {\n  font-size: 1.5em; /* 30px (1.5 * 20px) */\n}",
    "followUp": {
      "question": "Why do modern design systems recommend rem for typography instead of px?",
      "expectedAnswer": "Because if a visually impaired user increases their browser default font size from 16px to 24px, rem values automatically scale up proportionally, whereas px values remain locked and ignore user preferences."
    }
  },
  "expectedConcepts": [
    "Absolute units (px: fixed pixels on screen)",
    "rem (root em: relative to root <html> font-size, default 16px)",
    "em (relative to parent element font-size)",
    "Percentage (%: relative to parent dimension)",
    "Accessibility benefits of rem for user browser zoom/text-resizing"
  ]
}
```
