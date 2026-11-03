const solution = (function solution(n) { if (!Number.isInteger(n) || n < 0 || n > 100)
        throw new Error('Invalid n'); let result = 1n; for (let i = 2; i <= n; i++)
        result *= BigInt(i); return result.toString(); });
