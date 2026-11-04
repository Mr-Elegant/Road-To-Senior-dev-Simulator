# Reference: How do you configure the Redux store using configureStore and provide it to React?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`configureStore` wraps standard Redux `createStore` with sensible defaults: it automatically combines your slice reducers, adds Redux Thunk middleware for async actions, and turns on Redux DevTools extension support. To make this store available to your entire React component tree, you wrap your root component inside `<Provider store={store}>` imported from `react-redux`.",
    "example": "// 1. store.js\nimport { configureStore } from '@reduxjs/toolkit';\nimport authReducer from './slices/authSlice';\nimport cartReducer from './slices/cartSlice';\n\nexport const store = configureStore({\n  reducer: {\n    auth: authReducer,\n    cart: cartReducer,\n  },\n});\n\n// 2. App.jsx\nimport { Provider } from 'react-redux';\nimport { store } from './store';\n\nfunction App() {\n  return (\n    <Provider store={store}>\n      <MainApplication />\n    </Provider>\n  );\n}",
    "followUp": {
      "question": "What is the purpose of the Redux DevTools browser extension?",
      "expectedAnswer": "It allows developers to inspect the current state tree, see a timeline of every dispatched action with its payload, and perform time-travel debugging by replaying or canceling actions."
    }
  },
  "expectedConcepts": [
    "configureStore from @reduxjs/toolkit",
    "Combining slice reducers into a single root reducer object",
    "Automatic Redux DevTools and thunk middleware configuration",
    "The <Provider store={store}> wrapper from react-redux"
  ]
}
```
