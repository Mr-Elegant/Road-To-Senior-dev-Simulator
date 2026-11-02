# Reference: SSE Connection Manager Request Context Closure Leak

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "In JavaScript engines like V8, when an inner function accesses any variable in its enclosing scope, a Lexical Context object is created. In this code, 'client.send' accessed 'requestMetadata.headers'. Because 'client' was stored in 'this.clients' (a long-lived Set), 'client.send' stayed reachable. Consequently, 'requestMetadata' (and potentially 'req') was never garbage collected. Furthermore, on socket close, the client was never removed from 'this.clients', creating an unbounded leak for every visitor.\n      \nFix:\n1. Extract only the minimal data needed (e.g. clientId) before creating the client object.\n2. Ensure 'this.clients.delete(client)' is called on 'close' and 'error'.\n3. Nullify closures on teardown.",
    "codeOrArtifact": "class ConnectionHub {\n  constructor() {\n    this.clients = new Set();\n  }\n\n  registerConnection(req, res) {\n    const clientId = String(req.headers['x-client-id'] || crypto.randomUUID());\n\n    const client = {\n      id: clientId,\n      send: (data) => {\n        res.write(`data: ${JSON.stringify({ clientId, payload: data })}\\n\\n`);\n      }\n    };\n\n    this.clients.add(client);\n\n    const cleanup = () => {\n      this.clients.delete(client);\n      req.off('close', cleanup);\n      req.off('error', cleanup);\n      try { res.end(); } catch (_) {}\n    };\n\n    req.on('close', cleanup);\n    req.on('error', cleanup);\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-closure-analysis",
      "category": "root_cause",
      "label": "Lexical Environment & Heap Analysis",
      "description": "Explains how the inner function retains outer scope variables and V8 closure contexts.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Explains V8 Context objects and how shared scopes retain outer variables as long as any closure is alive."
        },
        {
          "score": 2,
          "description": "Identifies that requestMetadata is kept alive, but does not identify the Set retention."
        },
        {
          "score": 1,
          "description": "Only mentions adding client to array without understanding closure retention."
        },
        {
          "score": 0,
          "description": "Fails to diagnose closure memory leak."
        }
      ]
    },
    {
      "id": "rb-cleanup",
      "category": "reliability",
      "label": "Event Listener & Collection Cleanup",
      "description": "Implements explicit removal from Set and event listener teardown.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Removes client from Set on close and detaches event listeners cleanly."
        },
        {
          "score": 2,
          "description": "Removes from Set but misses error event handlers."
        },
        {
          "score": 1,
          "description": "Only nullifies local variables without cleaning the Set."
        },
        {
          "score": 0,
          "description": "Missing cleanup."
        }
      ]
    }
  ],
  "alternatives": [
    "Using WeakSet / WeakRef if clients are tracked via an external object lifecycle.",
    "Using an EventSource abstraction with AbortController for unified signal teardown."
  ],
  "commonMistakes": [
    "Thinking deleting the local variable inside registerConnection deletes the closure.",
    "Forgetting to handle socket error events in addition to close events."
  ],
  "followUps": [
    {
      "id": "js-fq-2",
      "question": "How do you take and analyze a Node.js heap dump in production without taking the server down?",
      "expectedConcepts": [
        "v8.writeHeapSnapshot()",
        "Chrome DevTools heap comparison",
        "Inspecting Retainers tree"
      ],
      "sampleStrongAnswer": "You can use v8.writeHeapSnapshot() triggered via a secure admin endpoint or SIGUSR2 signal. You then load two snapshots into Chrome DevTools (one at baseline, one after traffic) and use the \"Comparison\" view to filter by delta and inspect the Retainer tree to find what object keeps the target alive."
    }
  ]
}
```
