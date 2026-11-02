# Reference: Advanced Debounce with Leading & Trailing Options

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "function debounce(func, wait, options = {}) {\n  let timerId = null;\n  let lastArgs = null;\n  let lastThis = null;\n  const leading = Boolean(options.leading);\n  const trailing = options.trailing !== undefined ? Boolean(options.trailing) : true;\n\n  function invoke() {\n    if (trailing && lastArgs) {\n      func.apply(lastThis, lastArgs);\n    }\n    timerId = null;\n    lastArgs = null;\n    lastThis = null;\n  }\n\n  function debounced(...args) {\n    lastArgs = args;\n    lastThis = this;\n\n    const isInvokingLeading = leading && !timerId;\n\n    if (timerId) {\n      clearTimeout(timerId);\n    }\n\n    timerId = setTimeout(invoke, wait);\n\n    if (isInvokingLeading) {\n      func.apply(lastThis, lastArgs);\n      lastArgs = null;\n      lastThis = null;\n    }\n  }\n\n  debounced.cancel = () => {\n    if (timerId) clearTimeout(timerId);\n    timerId = null;\n    lastArgs = null;\n    lastThis = null;\n  };\n\n  debounced.flush = () => {\n    if (timerId && lastArgs) {\n      clearTimeout(timerId);\n      invoke();\n    }\n  };\n\n  return debounced;\n}\n\nfunction solution(mode) {\n  let callCount = 0;\n  const fn = () => ++callCount;\n  if (mode === 'leading_only') {\n    const debounced = debounce(fn, 20, { leading: true, trailing: false });\n    debounced();\n    debounced();\n    return callCount;\n  }\n  if (mode === 'cancel_pending') {\n    const debounced = debounce(fn, 50, { leading: false, trailing: true });\n    debounced();\n    debounced.cancel();\n    return callCount;\n  }\n  return 0;\n}",
    "explanation": "Carefully tracks whether the leading call has already been triggered, resetting pointers on flush and cancel to avoid multiple executions.",
    "timeComplexity": "O(1) invocation overhead",
    "spaceComplexity": "O(1) closure retention"
  }
}
```
