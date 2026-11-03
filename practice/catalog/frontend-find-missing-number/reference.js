const solution = (function solution(values) { const n = values.length; return n * (n + 1) / 2 - values.reduce((a, b) => a + b, 0); });
