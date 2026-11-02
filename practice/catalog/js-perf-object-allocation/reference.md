# Reference: High-Throughput Metrics Aggregator Garbage Collection Latency Spikes

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Calling 'rawSamples.map' and 'line.split(',')' on 100,000 items/sec creates 100,000 intermediate arrays, 400,000 string instances, and 100,000 intermediate objects every single second. This rapidly floods V8's New Space (Nursery), triggering continuous Scavenge cycles and promoting surviving objects to the Old Space, which subsequently forces expensive Stop-The-World Mark-Sweep sweeps.\n      \nFix:\nParse in a single pass without allocating intermediate objects or calling .split(). Scan character by character or use indexOf(',', startIndex) to extract numbers directly into pre-allocated accumulator structures.",
    "codeOrArtifact": "function ingestMetricsOptimized(rawSamples) {\n  // Pre-allocated aggregators map\n  const aggregates = new Map();\n\n  for (let i = 0; i < rawSamples.length; i++) {\n    const line = rawSamples[i];\n    \n    // Find commas without allocating arrays\n    const firstComma = line.indexOf(',');\n    const secondComma = line.indexOf(',', firstComma + 1);\n    const thirdComma = line.indexOf(',', secondComma + 1);\n\n    const metricName = line.slice(firstComma + 1, secondComma);\n    const value = parseFloat(line.slice(secondComma + 1, thirdComma === -1 ? undefined : thirdComma));\n\n    let agg = aggregates.get(metricName);\n    if (!agg) {\n      agg = { count: 0, sum: 0, min: Infinity, max: -Infinity };\n      aggregates.set(metricName, agg);\n    }\n\n    agg.count++;\n    agg.sum += value;\n    if (value < agg.min) agg.min = value;\n    if (value > agg.max) agg.max = value;\n  }\n\n  return aggregates;\n}"
  },
  "rubric": [
    {
      "id": "rb-gc-analysis",
      "category": "root_cause",
      "label": "V8 Garbage Collection Dynamics",
      "description": "Understands nursery allocation, scavenge overhead, and stop-the-world pauses.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Details V8 generational hypothesis, scavenge promotion to old gen, and mark-sweep pauses."
        },
        {
          "score": 2,
          "description": "Mentions too many objects created but vague on V8 internals."
        },
        {
          "score": 0,
          "description": "Unaware of GC impact."
        }
      ]
    },
    {
      "id": "rb-optimization",
      "category": "code_quality",
      "label": "Allocation-Free Parsing",
      "description": "Implements single-pass streaming parsing without temporary heap objects.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Single pass parsing, zero intermediate arrays/objects, bounded memory usage."
        },
        {
          "score": 2,
          "description": "Reduces some allocations but still uses split() on every line."
        },
        {
          "score": 0,
          "description": "No meaningful allocation reduction."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Node.js C++ Addon or Rust N-API module for zero-copy memory parsing.",
    "Writing binary telemetry over Protocol Buffers / FlatBuffers instead of CSV or JSON strings."
  ],
  "commonMistakes": [
    "Switching to RegExp which can be significantly slower and allocate match arrays.",
    "Caching every single string in a global Map, trading GC pauses for permanent memory leaks."
  ],
  "followUps": [
    {
      "id": "js-fq-5",
      "question": "What flags can you pass to Node.js to trace garbage collection in production?",
      "expectedConcepts": [
        "--trace-gc",
        "--trace-gc-verbose",
        "--max-old-space-size"
      ],
      "sampleStrongAnswer": "You can pass --trace-gc and --trace-gc-nvp to log every scavenge and mark-sweep event with memory sizes before and after, along with pause durations in milliseconds. You can also inspect performance.eventLoopUtilization() and perf_hooks."
    }
  ]
}
```
