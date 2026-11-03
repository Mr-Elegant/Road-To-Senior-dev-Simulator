# Reference: Frontend: Anagram Checker

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Normalize both strings consistently and compare frequency maps, decrementing counts as the second string is scanned. Reject a length mismatch after normalization. This is linear in text length, with space proportional to the alphabet encountered. Sorting is simpler in some contexts but usually costs O(n log n). Clarify code-point versus grapheme semantics.",
    "codeOrArtifact": "const solution = (function solution([a, b]) { const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, ''); a = clean(a); b = clean(b); if (a.length !== b.length)\n        return false; const counts = new Map(); for (const c of a)\n        counts.set(c, (counts.get(c) || 0) + 1); for (const c of b) {\n        const n = counts.get(c) || 0;\n        if (!n)\n            return false;\n        counts.set(c, n - 1);\n    } return true; });",
    "architectureNotes": "Follow-up: Compare normalized canonical equivalents without accidentally discarding meaningful language distinctions.\nTopic reference: https://namastedev.com/practice/anagram-checker\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "anagram-checker-correctness",
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
    "Compare normalized canonical equivalents without accidentally discarding meaningful language distinctions."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Repeated letters; unequal lengths; mixed case.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "anagram-checker-variation",
      "question": "Compare normalized canonical equivalents without accidentally discarding meaningful language distinctions.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Normalize both strings consistently and compare frequency maps, decrementing counts as the second string is scanned. Reject a length mismatch after normalization. This is linear in text length, with space proportional to the alphabet encountered. Sorting is simpler in some contexts but usually costs O(n log n). Clarify code-point versus grapheme semantics. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
