# Reference: Order-Book Live Ticker Stale Closure Hook Bug

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Inside React functional components, every render has its own props and state. The useEffect callback runs after the first render and closes over 'price' (value: 100). Because the dependency array is '[]', the effect never re-runs and never re-captures future render scopes. When the timer fires, 'price + delta' always reads 100 + delta, discarding any subsequent changes.\n      \nThere are two ways to fix this:\n1. Functional State Updates: 'setPrice(prev => prev + delta)'. The updater receives the current state from React's internal fiber queue without needing 'price' in the closure.\n2. Saved Callback Ref (Dan Abramov pattern): Store the tick callback in a 'useRef' that gets updated on every render. The interval calls 'savedCallback.current()', allowing the timer to remain unchanged while always invoking the freshest function.",
    "codeOrArtifact": "export function useIntervalTicker(initialPrice = 100) {\n  const [price, setPrice] = useState(initialPrice);\n\n  useEffect(() => {\n    const timer = setInterval(() => {\n      const delta = (Math.random() - 0.48) * 2;\n      // Functional state updater bypasses closure snapshot\n      setPrice((prevPrice) => Number((prevPrice + delta).toFixed(2)));\n    }, 1000);\n\n    return () => clearInterval(timer);\n  }, []);\n\n  return price;\n}"
  },
  "rubric": [
    {
      "id": "rb-stale-closure",
      "category": "root_cause",
      "label": "Stale Closure Root Cause Understanding",
      "description": "Explains JavaScript lexical closure retention inside React component lifecycle.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Accurately describes how useEffect captures the scope of the render in which it was created."
        },
        {
          "score": 2,
          "description": "Knows dependency array is missing price, but does not realize that adding it resets the timer."
        },
        {
          "score": 0,
          "description": "Fails to recognize closure capture."
        }
      ]
    },
    {
      "id": "rb-functional-updater",
      "category": "correctness",
      "label": "Functional State Update & useInterval Pattern",
      "description": "Implements functional updater or ref-based useInterval pattern cleanly.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Uses setPrice(prev => ...) or useRef for saved callback without timer churn."
        },
        {
          "score": 1,
          "description": "Adds [price] to dependencies, causing interval recreation every second."
        },
        {
          "score": 0,
          "description": "Leaves bug intact."
        }
      ]
    }
  ],
  "alternatives": [
    "useReducer: dispatch({ type: \"TICK\", delta }) inherently decouples state logic from effect closures.",
    "useRef for storing the mutable price if it only drives canvas rendering without React DOM reconciliation."
  ],
  "commonMistakes": [
    "Adding [price] to the dependency array: this tears down and recreates the interval on every second, causing timer drift and unnecessary effect thrashing.",
    "Using a global variable outside the hook, creating bugs across multiple hook instances."
  ],
  "followUps": [
    {
      "id": "react-fq-1",
      "question": "Why does useReducer often prevent stale closure bugs compared to useState?",
      "expectedConcepts": [
        "Dispatch identity stability",
        "Reducer operates outside component render scope",
        "Decouples action from current state"
      ],
      "sampleStrongAnswer": "The `dispatch` function returned by `useReducer` is identity-stable across all renders. It can be called from any callback or effect without being added to dependency arrays. The state calculation happens inside the pure reducer function, which always receives the true current state directly from the React runtime."
    }
  ]
}
```
