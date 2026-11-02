# Reference: How do you conditionally render elements in React?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Conditional rendering in React displays different UI elements based on state or props using standard JavaScript expressions. Common approaches include: 1) **Ternary operator** (`isLoggedIn ? <Dashboard /> : <Login />`) when choosing between two states, 2) **Logical AND (`&&`)** (`hasNotification && <Badge />`) when rendering an element only if a condition is true, and 3) **Early return guard clauses** at the top of a component (e.g. `if (isLoading) return <Spinner />;`).",
    "example": "function UserGreeting({ user, isLoading }) {\n  if (isLoading) {\n    return <p>Loading profile...</p>; // Guard clause\n  }\n\n  return (\n    <div>\n      {user ? (\n        <h2>Welcome back, {user.name}!</h2>\n      ) : (\n        <button>Please Sign In</button>\n      )}\n\n      {/* Logical && for optional badge */}\n      {user?.isPremium && <span className=\"gold-star\">⭐ VIP Member</span>}\n    </div>\n  );\n}",
    "followUp": {
      "question": "What gets displayed on the screen if you write {items.length && <List />} when items.length is 0?",
      "expectedAnswer": "The number 0 will be printed to the screen! In JavaScript, 0 is falsy, so 0 && ... evaluates to 0, which React treats as a valid number to render. Use items.length > 0 instead."
    }
  },
  "expectedConcepts": [
    "Ternary operator condition ? <A /> : <B />",
    "Logical AND (&&) for showing or hiding a single element",
    "Early return / guard clauses for whole component views",
    "Pitfall of 0 && <Element /> rendering 0 to the DOM"
  ]
}
```
