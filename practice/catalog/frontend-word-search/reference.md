# Reference: Frontend: Word Search

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Start DFS/backtracking from each matching first character. At every step check bounds, character match, and current-path visitation; mark before exploring and unmark on return. Never reuse a cell within one candidate path, but allow it in a different starting search. For word length L, a coarse upper bound is O(rows*cols*4^L), with O(L) path depth.",
    "codeOrArtifact": "const solution = (function solution({ board, word }) { const chars = Array.from(word); if (!chars.length)\n        return true; const rows = board.length, cols = board[0]?.length || 0, used = new Set(); function dfs(r, c, i) { if (i === chars.length)\n        return true; const id = r + ',' + c; if (r < 0 || c < 0 || r >= rows || c >= cols || used.has(id) || board[r][c] !== chars[i])\n        return false; used.add(id); const ok = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1); used.delete(id); return ok; } for (let r = 0; r < rows; r++)\n        for (let c = 0; c < cols; c++)\n            if (dfs(r, c, 0))\n                return true; return false; });",
    "architectureNotes": "Follow-up: Search many words with a trie to share prefixes and prune branches more effectively.\nTopic reference: https://namastedev.com/practice/word-search\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "word-search-correctness",
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
    "Search many words with a trie to share prefixes and prune branches more effectively."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Single character; repeated-letter path; reuse forbidden.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "word-search-variation",
      "question": "Search many words with a trie to share prefixes and prune branches more effectively.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Start DFS/backtracking from each matching first character. At every step check bounds, character match, and current-path visitation; mark before exploring and unmark on return. Never reuse a cell within one candidate path, but allow it in a different starting search. For word length L, a coarse upper bound is O(rows*cols*4^L), with O(L) path depth. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
