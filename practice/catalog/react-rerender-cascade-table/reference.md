# Reference: 10,000-Row Logistics Inventory Table Cascading Re-Render Freeze

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "There are two compounding problems:\n1. Reconciliation & Component Re-render: Parent state update causes all 10,000 TableRow components to run. Passing inline functions '() => console.log(item.id)' creates new function references, causing React.memo to always fail its shallow comparison.\n2. DOM Node Overload: The browser cannot comfortably handle 10,000 complex DOM tree nodes with layout and hit-testing.\nFix:\n1. State Colocation / Deferred Value: Use 'useDeferredValue(query)' or 'startTransition' so the input responds immediately at 60fps while filtering runs at lower priority.\n2. Virtualization: Use windowing (rendering only the 30-50 visible rows in viewport).\n3. Stable Callbacks: Pass row ID to a stable handler or use data attributes.",
    "codeOrArtifact": "import React, { useState, useMemo, useDeferredValue } from 'react';\n\nexport function LogisticsDashboard({ items }) {\n  const [query, setQuery] = useState('');\n  const deferredQuery = useDeferredValue(query);\n\n  const filtered = useMemo(() => {\n    if (!deferredQuery) return items;\n    const lower = deferredQuery.toLowerCase();\n    return items.filter(item => item.trackingNumber.toLowerCase().includes(lower));\n  }, [items, deferredQuery]);\n\n  // Windowing: Render only visible window (e.g. 50 items) or use react-window / react-virtual\n  const VISIBLE_COUNT = 50;\n  const visibleItems = filtered.slice(0, VISIBLE_COUNT);\n\n  return (\n    <div>\n      <input \n        value={query} \n        onChange={e => setQuery(e.target.value)} \n        placeholder=\"Filter shipments...\"\n      />\n      <div>\n        {visibleItems.map(item => (\n          <MemoizedTableRow key={item.id} item={item} />\n        ))}\n      </div>\n    </div>\n  );\n}\n\nconst MemoizedTableRow = React.memo(function TableRow({ item }) {\n  return <div>{item.trackingNumber} - {item.status}</div>;\n});"
  },
  "rubric": [
    {
      "id": "rb-render-bottleneck",
      "category": "root_cause",
      "label": "Re-render vs DOM Cost Profiling",
      "description": "Distinguishes JavaScript re-render time from browser DOM layout/paint cost.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Clearly explains reconciliation vs DOM paint cost and explains why memoization alone is insufficient for 10,000 rows."
        },
        {
          "score": 2,
          "description": "Identifies inline functions and memo, but ignores 10,000 DOM element memory/paint limit."
        },
        {
          "score": 0,
          "description": "Suggests debouncing input as sole fix without addressing table performance."
        }
      ]
    }
  ],
  "alternatives": [
    "Using React 18 useTransition to mark filtering as non-urgent.",
    "Server-side filtering with pagination / cursor fetching."
  ],
  "commonMistakes": [
    "Assuming React.memo alone solves rendering 10,000 DOM nodes.",
    "Wrapping everything in useMemo without measuring overhead."
  ],
  "followUps": [
    {
      "id": "react-fq-2",
      "question": "What is the exact mechanism of useDeferredValue in React 18+?",
      "expectedConcepts": [
        "Concurrent rendering",
        "Interruptible low-priority render",
        "Keeps UI responsive on high-priority input typing"
      ],
      "sampleStrongAnswer": "useDeferredValue receives a value and returns a deferred version of it. During an urgent update (like typing), React renders the input immediately with the new value, while deferring the re-render of the component consuming the deferred value. If another keystroke arrives mid-render, React will interrupt and abandon the deferred render to process the keystroke first."
    }
  ]
}
```
