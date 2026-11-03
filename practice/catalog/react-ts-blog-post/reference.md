# Reference: React + TypeScript: Blog Post

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep article data separate from presentation. Use article, an appropriate heading level, a time element with a machine-readable datetime, and useful image alt text. Render author/content as text unless rich HTML has a separate sanitization policy. Avoid redundant state for props and supply explicit empty or missing-field behavior.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    post?: {\n        title: string;\n        author?: string;\n        body: string;\n        date?: string;\n        tags?: string[];\n    };\n}\nexport default function App({ post }: AppProps = {}): React.JSX.Element { if (!post)\n    return <p>Article unavailable</p>; return <article><h1>{post.title}</h1><p data-testid=\"author\">{post.author || 'Unknown'}</p><time dateTime={post.date}>{post.date}</time><p data-testid=\"body\">{post.body}</p></article>; }\n",
    "architectureNotes": "Follow-up: Support a sanitized rich-content format while keeping heading hierarchy and link semantics intact.\nTopic reference: https://namastedev.com/practice/blog-post\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-blog-post. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "blog-post-correctness",
      "category": "correctness",
      "label": "Observable behavior and reasoning",
      "weight": 5,
      "description": "Use the executable cases as behavioral evidence; explain invariant, validation, complexity, and limits.",
      "levels": [
        {
          "score": 0,
          "description": "The main behavior does not work."
        },
        {
          "score": 1,
          "description": "Only a happy path works."
        },
        {
          "score": 2,
          "description": "Authored cases pass but the reasoning is incomplete."
        },
        {
          "score": 3,
          "description": "Authored cases pass and the invariant, boundaries, and trade-offs are explained."
        }
      ]
    }
  ],
  "alternatives": [
    "Support a sanitized rich-content format while keeping heading hierarchy and link semantics intact."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Missing image; long title; multiline text.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "blog-post-variation",
      "question": "Support a sanitized rich-content format while keeping heading hierarchy and link semantics intact.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep article data separate from presentation. Use article, an appropriate heading level, a time element with a machine-readable datetime, and useful image alt text. Render author/content as text unless rich HTML has a separate sanitization policy. Avoid redundant state for props and supply explicit empty or missing-field behavior. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
