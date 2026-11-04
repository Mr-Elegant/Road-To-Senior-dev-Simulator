# Reference: What is semantic HTML and why is it important?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Semantic HTML means using HTML markup that clearly reinforces the meaning and role of information on a webpage, rather than just defining its appearance with generic `<div>` and `<span>` tags. Examples include `<header>`, `<nav>`, `<main>`, `<article>`, and `<footer>`. Semantic tags allow screen readers to navigate content accurately for visually impaired users, improve search engine indexing, and make code cleaner to maintain.",
    "example": "<!-- Non-semantic approach -->\n<div class=\"header\">\n  <div class=\"nav-links\"><a href=\"/\">Home</a></div>\n</div>\n\n<!-- Semantic approach -->\n<header>\n  <nav aria-label=\"Main Navigation\">\n    <a href=\"/\">Home</a>\n  </nav>\n</header>",
    "followUp": {
      "question": "What is the difference between <section> and <article>?",
      "expectedAnswer": "<article> represents independent, self-contained content that makes sense on its own (like a blog post or news card), while <section> groups related thematic content, usually with a heading."
    }
  },
  "expectedConcepts": [
    "Meaning of tags (<header>, <nav>, <main>, <article>, <section>, <footer>)",
    "Accessibility and screen readers",
    "Search Engine Optimization (SEO)",
    "Readability and maintainability over generic <div>"
  ]
}
```
