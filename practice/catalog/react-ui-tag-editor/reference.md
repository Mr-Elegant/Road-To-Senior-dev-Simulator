# Reference: React UI: Team Tag Editor

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Enter normalizes only the draft boundaries, retains the authored capitalization, and compares a lowercase key for uniqueness. Duplicate checking precedes capacity so the result is deterministic at a full list. Functional updates avoid stale list writes; native buttons provide keyboard activation. Backspace removes the final tag only when the input is genuinely empty.",
    "codeOrArtifact": "import { useState } from 'react';\nexport default function App({ limit = 3 }) {\n  const [draft, setDraft] = useState('');\n  const [tags, setTags] = useState([]);\n  const [feedback, setFeedback] = useState('');\n  function remove(tag) { setTags(old => old.filter(item => item !== tag)); setFeedback(''); }\n  function onKeyDown(e) {\n    if (e.key === 'Backspace' && draft === '') { setTags(old => old.slice(0, -1)); setFeedback(''); }\n    if (e.key !== 'Enter') return;\n    e.preventDefault();\n    const tag = draft.trim();\n    if (!tag) return;\n    if (tags.some(item => item.toLowerCase() === tag.toLowerCase())) { setFeedback('Tag already exists'); return; }\n    if (tags.length >= limit) { setFeedback('Tag limit reached'); return; }\n    setTags(old => [...old, tag]); setDraft(''); setFeedback('');\n  }\n  return <section><label>New tag <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={onKeyDown} /></label>\n    <ul data-testid=\"tags\">{tags.map(tag => <li key={tag}>{tag}<button type=\"button\" aria-label={'Remove ' + tag} onClick={() => remove(tag)}>Remove</button></li>)}</ul>\n    <p data-testid=\"feedback\" role=\"status\">{feedback}</p></section>;\n}"
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
