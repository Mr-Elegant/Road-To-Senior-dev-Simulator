# Reference: What are the main component lifecycle concepts in modern functional React?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A component’s lifecycle represents its journey in the application: 1) **Mounting**: The component is rendered for the first time and inserted into the real DOM (handled by `useEffect(..., [])`). 2) **Updating**: State or props change, causing React to re-render the component and update the DOM (handled by `useEffect(..., [deps])`). 3) **Unmounting**: The component is removed from the screen, where cleanup handlers (canceling timers, removing window listeners) execute.",
    "example": "function WindowTracker() {\n  const [width, setWidth] = React.useState(window.innerWidth);\n\n  React.useEffect(() => {\n    // 1. Mount: Add listener\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n\n    // 2. Unmount: Cleanup listener to prevent memory leaks\n    return () => {\n      window.removeEventListener('resize', handleResize);\n    };\n  }, []); // Empty deps = run on mount, cleanup on unmount\n\n  return <div>Window width: {width}px</div>;\n}",
    "followUp": {
      "question": "What happens if you do not clean up an event listener in the unmount phase?",
      "expectedAnswer": "The listener remains in memory referencing the unmounted component, leading to memory leaks and errors when it attempts to call setState on an unmounted component."
    }
  },
  "expectedConcepts": [
    "Mounting: Component is created and inserted into the DOM for the first time",
    "Updating: Component re-renders because state or props changed",
    "Unmounting: Component is removed from the DOM",
    "How useEffect maps to these phases (mount [], update [deps], unmount cleanup)"
  ]
}
```
