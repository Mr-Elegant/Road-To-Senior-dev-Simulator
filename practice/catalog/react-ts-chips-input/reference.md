# Reference: React + TypeScript: Chips Input

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Enter normalizes only the draft boundaries, retains the authored capitalization, and compares a lowercase key for uniqueness. Duplicate checking precedes capacity so the result is deterministic at a full list. Functional updates avoid stale list writes; native buttons provide keyboard activation. Backspace removes the final tag only when the input is genuinely empty.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    limit?: number;\n}\nimport { useState } from 'react';\nexport default function App({ limit = 3 }: AppProps = {}): React.JSX.Element {\n    const [draft, setDraft] = useState('');\n    const [tags, setTags] = useState<string[]>([]);\n    const [feedback, setFeedback] = useState('');\n    function remove(tag: string) { setTags(old => old.filter(item => item !== tag)); setFeedback(''); }\n    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {\n        if (e.key === 'Backspace' && draft === '') {\n            setTags(old => old.slice(0, -1));\n            setFeedback('');\n        }\n        if (e.key !== 'Enter')\n            return;\n        e.preventDefault();\n        const tag = draft.trim();\n        if (!tag)\n            return;\n        if (tags.some(item => item.toLowerCase() === tag.toLowerCase())) {\n            setFeedback('Tag already exists');\n            return;\n        }\n        if (tags.length >= limit) {\n            setFeedback('Tag limit reached');\n            return;\n        }\n        setTags(old => [...old, tag]);\n        setDraft('');\n        setFeedback('');\n    }\n    return <section><label>New tag <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={onKeyDown}/></label>\n    <ul data-testid=\"tags\">{tags.map(tag => <li key={tag}>{tag}<button type=\"button\" aria-label={'Remove ' + tag} onClick={() => remove(tag)}>Remove</button></li>)}</ul>\n    <p data-testid=\"feedback\" role=\"status\">{feedback}</p></section>;\n}\n",
    "architectureNotes": "\nOriginal React workspace: /challenge/react-ui-tag-editor. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "react-ui-tag-editor-behavior",
      "category": "correctness",
      "label": "Component behavior and boundaries",
      "weight": 5,
      "description": "Use test evidence to explain state transitions, accessible controls, and boundary behavior.",
      "levels": [
        {
          "score": 0,
          "description": "The component is missing or its main interaction fails."
        },
        {
          "score": 1,
          "description": "The happy path works but boundary cases fail."
        },
        {
          "score": 2,
          "description": "All authored cases pass; additional accessibility or edge-case reasoning is incomplete."
        },
        {
          "score": 3,
          "description": "All authored cases pass and the implementation and limitations are explained."
        }
      ]
    }
  ],
  "alternatives": [
    "Extract a small pure helper for derived values; keep input state in the component. Extend with a custom hook only when behavior is reused."
  ],
  "commonMistakes": [
    "Checking capacity before duplicate detection.",
    "Calling pop on an array held in React state."
  ],
  "followUps": [
    {
      "id": "tag-follow",
      "question": "How should this behave while a user is composing text with an IME?",
      "expectedConcepts": [
        "Composition events",
        "Keyboard input"
      ],
      "sampleStrongAnswer": "Treat composition as a separate input phase and ignore Enter or Backspace commands while the event is composing. Add browser tests for the supported IMEs before shipping international input handling."
    }
  ]
}
```
