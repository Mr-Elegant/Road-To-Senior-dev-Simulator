# Reference: Why is state management useful in web applications and what problem does it solve?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "As an application grows, different parts of the component tree often need to read and update the same data (such as the logged-in user profile, shopping cart items, or global notification toasts). Without centralized state management, data must be passed down through many intermediate components that do not need it (**prop drilling**). Centralized state management provides a single source of truth that any authorized component can access and update directly, keeping state consistent and predictable.",
    "example": "// Without Global State: Needs prop drilling through 5 levels\n// <App> -> <Layout> -> <Header> -> <Navbar> -> <UserProfileBadge user={user} />\n\n// With Global State:\n// Any component selects only what it needs directly from the store:\nfunction UserProfileBadge() {\n  const user = useSelector((state) => state.auth.user);\n  return <div>Welcome, {user.name}!</div>;\n}",
    "followUp": {
      "question": "Does every single piece of data in an app need to go into Redux?",
      "expectedAnswer": "No. Ephemeral, localized data (like whether a dropdown is open or an input text value) should remain in local component state with useState."
    }
  },
  "expectedConcepts": [
    "Prop drilling across deeply nested components",
    "Shared state between distant sibling or cross-tree components",
    "Predictable state transitions and centralized debugging",
    "Single source of truth for application-wide data"
  ]
}
```
