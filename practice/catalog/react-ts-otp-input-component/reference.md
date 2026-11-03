# Reference: React + TypeScript: OTP Input Component

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Decide whether to use one semantic input with visual slots or multiple coordinated inputs. Keep one canonical code string, normalize permitted characters, and handle paste as a batch update. Define Backspace behavior and focus movement without fighting IME composition or assistive technology. Autofill support and error announcement require real browser testing. Verification and rate limiting remain server responsibilities.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nexport default function App(): React.JSX.Element { const [code, setCode] = useState(''); return <section><label>Code<input aria-label=\"Code\" inputMode=\"numeric\" autoComplete=\"one-time-code\" value={code} onChange={e => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}/></label><div aria-hidden=\"true\">{Array.from({ length: 6 }, (_, i) => <span key={i} data-slot={i}>{code[i] || '•'}</span>)}</div><output data-testid=\"complete\">{code.length === 6 ? 'yes' : 'no'}</output><button onClick={() => setCode('')}>Clear</button></section>; }\n",
    "architectureNotes": "Follow-up: Add an expiry/resend flow that does not let an old code submission overwrite a newer challenge state.\nTopic reference: https://namastedev.com/practice/otp-input-component\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-otp-input-component. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "otp-input-component-correctness",
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
    "Add an expiry/resend flow that does not let an old code submission overwrite a newer challenge state."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Full paste; partial paste; Backspace on empty slot.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "otp-input-component-variation",
      "question": "Add an expiry/resend flow that does not let an old code submission overwrite a newer challenge state.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Decide whether to use one semantic input with visual slots or multiple coordinated inputs. Keep one canonical code string, normalize permitted characters, and handle paste as a batch update. Define Backspace behavior and focus movement without fighting IME composition or assistive technology. Autofill support and error announcement require real browser testing. Verification and rate limiting remain server responsibilities. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
