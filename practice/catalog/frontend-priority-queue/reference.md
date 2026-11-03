# Reference: Frontend: Priority Queue

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use array indices for parent and children. Push by appending and sifting up; pop by replacing the root with the last item and sifting down. Peek is O(1), insertion/removal O(log n), and bottom-up heap construction O(n). Define comparator direction and add an insertion sequence when equal priorities require FIFO stability.",
    "codeOrArtifact": "const solution = (function solution(commands) { const heap = []; function push(v) { heap.push(v); let i = heap.length - 1; while (i > 0) {\n        const p = Math.floor((i - 1) / 2);\n        if (heap[p] <= heap[i])\n            break;\n        [heap[p], heap[i]] = [heap[i], heap[p]];\n        i = p;\n    } } function pop() { if (!heap.length)\n        return null; const first = heap[0], last = heap.pop(); if (heap.length) {\n        heap[0] = last;\n        let i = 0;\n        while (true) {\n            let best = i, l = i * 2 + 1, r = l + 1;\n            if (l < heap.length && heap[l] < heap[best])\n                best = l;\n            if (r < heap.length && heap[r] < heap[best])\n                best = r;\n            if (best === i)\n                break;\n            [heap[i], heap[best]] = [heap[best], heap[i]];\n            i = best;\n        }\n    } return first; } return commands.map(c => { if (c.type === 'push') {\n        push(c.value);\n        return heap.length;\n    } return c.type === 'peek' ? (heap[0] ?? null) : pop(); }); });",
    "architectureNotes": "Follow-up: Support priority updates using an index map and explain why changing an item in place breaks the heap unless it is repaired.\nTopic reference: https://namastedev.com/practice/priority-queue\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "priority-queue-correctness",
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
    "Support priority updates using an index map and explain why changing an item in place breaks the heap unless it is repaired."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty pop; one item; equal priorities.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "priority-queue-variation",
      "question": "Support priority updates using an index map and explain why changing an item in place breaks the heap unless it is repaired.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use array indices for parent and children. Push by appending and sifting up; pop by replacing the root with the last item and sifting down. Peek is O(1), insertion/removal O(log n), and bottom-up heap construction O(n). Define comparator direction and add an insertion sequence when equal priorities require FIFO stability. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
