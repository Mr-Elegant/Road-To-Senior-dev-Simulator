const solution = (function solution(n) { if (!Number.isInteger(n) || n < 0 || n > 100)
        throw new Error('Invalid n'); let a = 0n, b = 1n; const values = []; for (let i = 0; i < n; i++) {
        values.push(a.toString());
        [a, b] = [b, a + b];
    } return values; });
