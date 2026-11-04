# Reference: When is Redux useful and when is it unnecessary / overkill?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Redux is valuable in medium-to-large applications where multiple unrelated components across different pages need access to the same state (like user permissions, shopping carts, or real-time event feeds) or where predictable state auditing is essential. Redux is overkill for simple apps, static blogs, or apps where data is only shared between immediate parents and children; in those cases, standard React `useState` or React Context is simpler.",
    "example": "// Overkill for a simple modal toggle:\n// Don't create an entire Redux slice just for:\nconst [isOpen, setIsOpen] = useState(false);\n\n// Great use for Redux:\n// User notifications received from WebSockets that must update:\n// 1) Bell icon in Navbar\n// 2) Toast notification floating popup\n// 3) Activity history tab in Profile page",
    "followUp": {
      "question": "How does React Context compare to Redux Toolkit?",
      "expectedAnswer": "React Context is built into React and great for low-frequency global data (like themes or auth), but lacks selector-based rendering optimizations and middleware capabilities that Redux provides for high-frequency updates."
    }
  },
  "expectedConcepts": [
    "Good use cases: Large applications with many components sharing data, frequent updates across distinct routes, collaborative tools",
    "Overkill: Simple apps, isolated forms, small projects where React Context or useState suffices",
    "Trade-offs: Added abstraction and learning curve vs centralized predictability"
  ]
}
```
