const solution = (function solution(values) { if (!values.length)
        throw new Error('Empty array'); let best = values[0]; for (const n of values)
        best = Math.min(best, n); return best; });
