# Reference: Frontend: Median of Two Sorted Arrays

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Binary-search a partition in the smaller array and derive the corresponding partition in the other so the left side contains half the combined elements. A valid partition has both left maxima no greater than the opposite right minima. The median is the left maximum for odd total length, or the average of the two central values for even length. Use sentinels at empty sides and reject two empty inputs.",
    "codeOrArtifact": "const solution = (function solution({ left, right }) { let a = left, b = right; if (a.length > b.length)\n        [a, b] = [b, a]; if (!a.length && !b.length)\n        throw new Error('Empty arrays'); let low = 0, high = a.length; const half = Math.floor((a.length + b.length + 1) / 2); while (low <= high) {\n        const i = Math.floor((low + high) / 2), j = half - i, al = i ? a[i - 1] : -Infinity, ar = i < a.length ? a[i] : Infinity, bl = j ? b[j - 1] : -Infinity, br = j < b.length ? b[j] : Infinity;\n        if (al <= br && bl <= ar)\n            return (a.length + b.length) % 2 ? Math.max(al, bl) : (Math.max(al, bl) + Math.min(ar, br)) / 2;\n        if (al > br)\n            high = i - 1;\n        else\n            low = i + 1;\n    } throw new Error('Invalid arrays'); });",
    "architectureNotes": "Follow-up: Return the kth element through a related partition argument and address overflow-safe averaging in fixed-width arithmetic.\nTopic reference: https://namastedev.com/practice/median-of-two-sorted-arrays\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "median-of-two-sorted-arrays-correctness",
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
    "Return the kth element through a related partition argument and address overflow-safe averaging in fixed-width arithmetic."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: One empty array; odd/even total; duplicates.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "median-of-two-sorted-arrays-variation",
      "question": "Return the kth element through a related partition argument and address overflow-safe averaging in fixed-width arithmetic.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Binary-search a partition in the smaller array and derive the corresponding partition in the other so the left side contains half the combined elements. A valid partition has both left maxima no greater than the opposite right minima. The median is the left maximum for odd total length, or the average of the two central values for even length. Use sentinels at empty sides and reject two empty inputs. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
