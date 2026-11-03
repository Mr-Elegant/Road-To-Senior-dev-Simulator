# Reference: React + TypeScript: Dark Mode

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Local state owns the appearance, initialized once from the supplied prop. A functional boolean update makes repeated activations reliable. Text and aria-pressed expose the same mode as the visual colors. Styling the section rather than the document avoids leaking an embedded component preference into unrelated application surfaces.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    initialTheme?: string;\n}\nimport { useState } from 'react';\nexport default function App({ initialTheme = 'light' }: AppProps = {}): React.JSX.Element {\n    const [dark, setDark] = useState(() => initialTheme === 'dark');\n    return <section data-testid=\"surface\" data-theme={dark ? 'dark' : 'light'} style={{ padding: 16, background: dark ? '#18181b' : '#ffffff', color: dark ? '#fafafa' : '#18181b' }}>\n    <button type=\"button\" aria-label=\"Toggle appearance\" aria-pressed={dark} onClick={() => setDark(old => !old)}>Toggle appearance</button>\n    <p data-testid=\"current-theme\">{dark ? 'Dark appearance' : 'Light appearance'}</p></section>;\n}\n",
    "architectureNotes": "\nOriginal React workspace: /challenge/react-ui-theme-switch. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "react-ui-theme-switch-behavior",
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
    "Changing the global document class from an embedded component.",
    "Keeping the pressed state and label out of sync with the actual appearance."
  ],
  "followUps": [
    {
      "id": "theme-follow",
      "question": "How would a product-wide persisted theme differ?",
      "expectedConcepts": [
        "Provider",
        "SSR",
        "User preference"
      ],
      "sampleStrongAnswer": "Centralize the preference in a theme provider, distinguish explicit preference from system appearance, and plan the server-rendered initial value to avoid a flash or hydration mismatch. Persist only the preference, with an account/device policy defined for the product."
    }
  ]
}
```
