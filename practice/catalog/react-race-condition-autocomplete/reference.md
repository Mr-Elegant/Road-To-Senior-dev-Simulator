# Reference: Customer Support CRM Search Out-of-Order Response Overwrite

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "When 'query' changes rapidly, multiple fetch requests are spawned in parallel. If request A takes 500ms and request B takes 100ms, request B resolves first. 400ms later, request A resolves and calls 'setResults(dataA)', overwriting the newer data with stale data.\n      \nFix:\nInstantiate an 'AbortController' inside the effect and pass 'controller.signal' to 'fetch'. In the effect's cleanup function, invoke 'controller.abort()'. When the query changes or the component unmounts, the in-flight HTTP request is canceled immediately at the browser network socket level.",
    "codeOrArtifact": "export function useCustomerSearch(query) {\n  const [results, setResults] = useState([]);\n  const [isLoading, setIsLoading] = useState(false);\n\n  useEffect(() => {\n    if (!query.trim()) {\n      setResults([]);\n      setIsLoading(false);\n      return;\n    }\n\n    const controller = new AbortController();\n    setIsLoading(true);\n\n    fetch(`/api/customers?q=${encodeURIComponent(query)}`, {\n      signal: controller.signal,\n    })\n      .then((res) => {\n        if (!res.ok) throw new Error('Search failed');\n        return res.json();\n      })\n      .then((data) => {\n        setResults(data);\n        setIsLoading(false);\n      })\n      .catch((err) => {\n        if (err.name === 'AbortError') {\n          // Expected cancellation, ignore\n          return;\n        }\n        console.error('Fetch error', err);\n        setIsLoading(false);\n      });\n\n    return () => {\n      controller.abort();\n    };\n  }, [query]);\n\n  return { results, isLoading };\n}"
  },
  "rubric": [
    {
      "id": "rb-abort-controller",
      "category": "correctness",
      "label": "AbortController & Cleanup Implementation",
      "description": "Uses AbortController in useEffect cleanup and ignores AbortError.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Aborts controller signal on cleanup, checks error name, and handles component unmount."
        },
        {
          "score": 2,
          "description": "Uses boolean isMounted flag instead of AbortController (cancels state update but wastes network bandwidth)."
        },
        {
          "score": 0,
          "description": "No cancellation mechanism."
        }
      ]
    }
  ],
  "alternatives": [
    "Using TanStack Query (React Query) or SWR with automatic request deduplication and query cancellation.",
    "Using a request sequence ID ref (e.g. currentSeqRef.current === seq) to ignore outdated responses."
  ],
  "commonMistakes": [
    "Only using a boolean flag \"let active = true; ... return () => active = false\": this ignores state update but does not abort the network request, consuming client bandwidth and battery.",
    "Failing to catch AbortError, resulting in noisy unhandled promise rejection warnings in the browser console."
  ],
  "followUps": [
    {
      "id": "react-fq-3",
      "question": "How does TanStack Query handle query cancellation under the hood?",
      "expectedConcepts": [
        "Signal injection into queryFn",
        "Automatic cancellation when component unmounts or query key changes"
      ],
      "sampleStrongAnswer": "TanStack Query passes a signal object ({ signal }) into the queryFn. If the component unmounts or query keys change before the promise completes, TanStack Query calls abort() on the internal AbortController, automatically signaling the underlying fetch or axios call to abort."
    }
  ]
}
```
