# Reference: How do useSelector and useDispatch connect React components to the Redux store?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`useSelector` and `useDispatch` are React-Redux hooks. `useSelector` takes a selector function `(state) => state.slice.data` to extract data from the Redux store and automatically subscribes the component to updates, triggering a re-render only when the selected value changes. `useDispatch` returns the store’s `dispatch` function, allowing components to trigger state changes by sending actions (`dispatch(increment())`).",
    "example": "import { useSelector, useDispatch } from 'react-redux';\nimport { increment, decrement } from './counterSlice';\n\nfunction Counter() {\n  // Read state from Redux\n  const count = useSelector((state) => state.counter.value);\n  // Get dispatch function\n  const dispatch = useDispatch();\n\n  return (\n    <div>\n      <span>Count: {count}</span>\n      <button onClick={() => dispatch(increment())}>+</button>\n      <button onClick={() => dispatch(decrement())}>-</button>\n    </div>\n  );\n}",
    "code": "function UserBadge() {\n  const name = useSelector((state) => state.auth.user.name);\n  const dispatch = useDispatch();\n  return <button onClick={() => dispatch(logout())}>Logout {name}</button>;\n}",
    "followUp": {
      "question": "What happens if useSelector returns a brand new object on every render like useSelector(state => ({ count: state.count }))?",
      "expectedAnswer": "Because a new object reference is created every time, useSelector will think the state changed on every store update and cause unnecessary component re-renders. Select primitive values or use shallowEqual."
    }
  },
  "expectedConcepts": [
    "useSelector reads pieces of state from RootState",
    "useSelector subscribes the component to store updates (re-renders only when selected value changes)",
    "useDispatch provides the dispatch function to send actions to the store",
    "Separation of reading data vs updating data"
  ]
}
```
