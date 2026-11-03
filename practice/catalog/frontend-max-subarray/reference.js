const solution = (function solution(values) { if (!values.length)
        throw new Error('Empty array'); let end = values[0], best = end; for (const n of values.slice(1)) {
        end = Math.max(n, end + n);
        best = Math.max(best, end);
    } return best; });
