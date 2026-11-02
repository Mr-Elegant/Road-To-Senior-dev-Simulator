# Reference: Multi-Gigabyte Financial Audit CSV Export Out-of-Memory (OOM) Crash

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Two critical flaws caused the OOM crash:\n1. Buffering entire dataset in memory: 'db.query()' fetches all 3,000,000 rows into an array in V8 heap, exceeding the default 1.4GB heap limit.\n2. Lack of backpressure: 'res.write()' is an asynchronous write to a TCP socket. If the client downloads at 1MB/s while the loop writes at 50MB/s, the operating system kernel socket buffer fills up. When full, 'res.write()' returns 'false', and Node buffers the unwritten data in heap RAM. Continuing to write causes unbounded memory expansion until the process is OOMKilled.\n      \nFix:\nUse 'pg-query-stream' to fetch rows from PostgreSQL via a cursor in batches of 500, pass through a Transform stream to format CSV lines, and connect to 'res' using 'stream.pipeline()'. 'pipeline' automatically handles backpressure (pausing the readable stream when writable buffer reaches highWaterMark) and destroys the database cursor if the client closes the connection.",
    "codeOrArtifact": "const { pipeline, Transform } = require('stream');\nconst QueryStream = require('pg-query-stream');\n\nasync function exportAuditCsvStream(req, res, dbClient) {\n  res.setHeader('Content-Type', 'text/csv');\n  res.setHeader('Content-Disposition', 'attachment; filename=\"audit.csv\"');\n\n  // 1. Fetch via database cursor with batch size 500\n  const query = new QueryStream('SELECT id, amount, timestamp FROM transactions', [], {\n    batchSize: 500,\n  });\n  const stream = dbClient.query(query);\n\n  // 2. Transform database row objects into CSV strings\n  const csvTransform = new Transform({\n    objectMode: true,\n    transform(row, encoding, callback) {\n      const line = `${row.id},${row.amount},${row.timestamp}\\n`;\n      callback(null, line);\n    },\n  });\n\n  // 3. pipeline handles backpressure, drain events, and cleans up streams on client abort\n  pipeline(stream, csvTransform, res, (err) => {\n    if (err) {\n      console.error('Pipeline error or client aborted download', err);\n    }\n  });\n}"
  },
  "rubric": [
    {
      "id": "rb-stream-backpressure",
      "category": "reliability",
      "label": "Node.js Streams & Backpressure Management",
      "description": "Demonstrates deep mastery of stream backpressure, highWaterMark, and pipeline.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Uses database cursor streaming and pipeline with automatic backpressure and disconnect cleanup."
        },
        {
          "score": 2,
          "description": "Fixes database cursor but manually listens to drain without handling errors."
        },
        {
          "score": 0,
          "description": "Buffers rows in memory."
        }
      ]
    }
  ],
  "alternatives": [
    "Generating the file asynchronously via background worker, uploading to S3, and providing a pre-signed download URL."
  ],
  "commonMistakes": [
    "Using `stream.pipe()` instead of `stream.pipeline()`: `.pipe()` does not properly forward errors or destroy source streams when the client disconnects.",
    "Increasing Node heap memory `--max-old-space-size=8192` as a band-aid instead of fixing the streaming architecture."
  ],
  "followUps": [
    {
      "id": "node-fq-4",
      "question": "Why is `stream.pipeline` preferred over `source.pipe(destination)` in modern Node.js?",
      "expectedConcepts": [
        "Error forwarding",
        "Proper stream destruction on close/abort",
        "Prevents file descriptor leaks"
      ],
      "sampleStrongAnswer": "`source.pipe(dest)` does not forward errors between streams; if `dest` errors, `source` is not closed automatically, leading to dangling database connections and memory leaks. In contrast, `stream.pipeline` properly forwards errors, cleans up all streams in the pipeline if any of them fails, and handles premature close events cleanly."
    }
  ]
}
```
