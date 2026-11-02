# Reference: What is the useEffect hook, and how does its dependency array control execution?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`useEffect` enables performing side effects (fetching data, setting up subscriptions, or manipulating timers) in functional components after React renders. Its second argument—the dependency array—controls when it executes: omitting it runs the effect after every render; passing an empty array `[]` runs it only once when the component mounts; passing dependencies `[userId]` re-runs it only when those values change. Returning a function from `useEffect` registers a cleanup handler that runs before re-running or when the component unmounts.",
    "example": "function Timer() {\n  const [seconds, setSeconds] = React.useState(0);\n\n  React.useEffect(() => {\n    const timerId = setInterval(() => {\n      setSeconds(prev => prev + 1);\n    }, 1000);\n\n    // CLEANUP FUNCTION: Clears timer when component unmounts\n    return () => clearInterval(timerId);\n  }, []); // Runs once on mount\n\n  return <div>Elapsed: {seconds}s</div>;\n}",
    "followUp": {
      "question": "What happens if you update state inside a useEffect that has no dependency array?",
      "expectedAnswer": "It causes an infinite loop: the state change triggers a re-render, which runs the effect again, which changes state again."
    }
  },
  "expectedConcepts": [
    "Side effects in functional components (data fetching, subscriptions, timers, manual DOM changes)",
    "No dependency array: Runs after every single render",
    "Empty dependency array []: Runs only once on component mount",
    "Array with dependencies [a, b]: Runs when a or b changes",
    "Cleanup function (return () => { ... }) for unsubscribing / clearing timers on unmount"
  ]
}
```
