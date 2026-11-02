# Reference: E-Commerce Cart Optimistic Mutation Hook with Rollback

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "An optimistic update applies changes to the local state immediately before sending the network request.\nTo do this safely:\n1. Capture a snapshot of the known-confirmed state.\n2. Apply the optimistic change immediately so the user sees instant feedback.\n3. Call the backend API.\n4. If the call succeeds, update the confirmed snapshot.\n5. If the call fails, restore the snapshot, clear the pending state, and notify the user.\nIn React 19, the new 'useOptimistic' hook natively integrates with Server Actions to manage temporary optimistic state during async transitions.",
    "codeOrArtifact": "export function useOptimisticCart(initialCart, apiSync) {\n  const [cart, setCart] = useState(initialCart);\n  const [error, setError] = useState(null);\n  const confirmedCartRef = useRef(initialCart);\n\n  const updateQuantity = async (itemId, newQty) => {\n    // 1. Snapshot prior confirmed state\n    const previousSnapshot = confirmedCartRef.current;\n\n    // 2. Optimistic update\n    setCart((prev) => ({\n      ...prev,\n      [itemId]: newQty,\n    }));\n    setError(null);\n\n    try {\n      const serverResult = await apiSync(itemId, newQty);\n      confirmedCartRef.current = serverResult;\n      setCart(serverResult);\n    } catch (err) {\n      // 3. Rollback on failure\n      setCart(previousSnapshot);\n      setError('Failed to update cart. Changes reverted.');\n    }\n  };\n\n  return { cart, error, updateQuantity };\n}"
  },
  "rubric": [
    {
      "id": "rb-optimistic-rollback",
      "category": "reliability",
      "label": "Optimistic State Recovery & Consistency",
      "description": "Implements rollback without race condition corruption during multiple rapid clicks.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Handles rollback, snapshots confirmed server state, and queues concurrent actions."
        },
        {
          "score": 2,
          "description": "Implements basic rollback but breaks if multiple rapid clicks occur."
        },
        {
          "score": 0,
          "description": "No rollback on failure."
        }
      ]
    }
  ],
  "alternatives": [
    "Using TanStack Query with onMutate context snapshot and onError rollback.",
    "Using React 19 useOptimistic with useActionState."
  ],
  "commonMistakes": [
    "Rolling back to an intermediate optimistic state instead of the last confirmed server response.",
    "Failing to inform the user why the number suddenly dropped back."
  ],
  "followUps": [
    {
      "id": "react-fq-5",
      "question": "How does React 19 useOptimistic work in tandem with Server Actions?",
      "expectedConcepts": [
        "useOptimistic(state, updateFn)",
        "Automatic reversion when Server Action finishes or throws"
      ],
      "sampleStrongAnswer": "In React 19, `useOptimistic` takes the actual server state and an updateFn. When a Server Action is dispatched within `startTransition`, you call the optimistic dispatch. React renders the optimistic value immediately for the duration of the transition. As soon as the Server Action finishes or rejects, React automatically discards the optimistic value and reverts to the actual returned state."
    }
  ]
}
```
