# Reference: AI Streaming Assistant Suspense & Localized Error Boundary Fallback

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "By default, if an async Server Component fails, the error bubbles up to the closest parent 'error.tsx'. If there is only one 'error.tsx' at the route root, a failure in the optional AI assistant causes the entire page (including critical ticket information) to be replaced by the error fallback.\n      \nFix:\n1. Wrap the AI component in a dedicated '<Suspense fallback={<AiSkeleton />}>'. Next.js streams the main ticket HTML immediately, and streams the AI component chunk when it becomes ready via HTTP Chunked Transfer Encoding.\n2. Wrap the AI section in a localized Client Component Error Boundary (e.g. '<ErrorBoundary fallback={<AiRetryCard />}>') so any LLM API error or timeout is contained within the sidebar.",
    "codeOrArtifact": "import { Suspense } from 'react';\nimport { TicketDetails } from './TicketDetails';\nimport { StreamingAiAssistant } from './StreamingAiAssistant';\nimport { LocalErrorBoundary } from '@/components/LocalErrorBoundary';\nimport { AiSkeleton, AiErrorFallback } from '@/components/AiStates';\n\nexport default async function TicketPage({ params }) {\n  return (\n    <div className=\"flex gap-6\">\n      {/* Critical path: renders immediately */}\n      <main className=\"flex-1\">\n        <TicketDetails ticketId={params.id} />\n      </main>\n\n      {/* Non-critical AI assistant: streamed progressively and failure-isolated */}\n      <aside className=\"w-80\">\n        <LocalErrorBoundary fallback={<AiErrorFallback />}>\n          <Suspense fallback={<AiSkeleton />}>\n            <StreamingAiAssistant ticketId={params.id} />\n          </Suspense>\n        </LocalErrorBoundary>\n      </aside>\n    </div>\n  );\n}"
  },
  "rubric": [
    {
      "id": "rb-suspense-isolation",
      "category": "reliability",
      "label": "Failure Containment & Streaming Architecture",
      "description": "Implements localized Suspense and Error Boundaries to protect page availability.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Demonstrates deep knowledge of RSC streaming, chunked HTTP, and localized boundary containment."
        },
        {
          "score": 2,
          "description": "Uses Suspense but places Error Boundary at page level, still crashing tickets."
        },
        {
          "score": 0,
          "description": "Blocks entire page synchronously."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Vercel AI SDK `useChat` / `useCompletion` with client-side streaming over WebSockets or SSE."
  ],
  "commonMistakes": [
    "Awaiting the AI call at the page root component level, blocking TTFB for the entire application.",
    "Not providing a retry handler in the Error Boundary."
  ],
  "followUps": [
    {
      "id": "next-fq-5",
      "question": "What HTTP response headers enable streaming in Next.js Server Components?",
      "expectedConcepts": [
        "Transfer-Encoding: chunked",
        "Content-Type: text/html",
        "Connection: keep-alive"
      ],
      "sampleStrongAnswer": "Next.js App Router streaming relies on `Transfer-Encoding: chunked` with `Content-Type: text/html`. This allows the server to send the initial HTML shell immediately and keep the HTTP connection open to stream subsequent HTML chunks and script tags as asynchronous Suspense promises resolve."
    }
  ]
}
```
