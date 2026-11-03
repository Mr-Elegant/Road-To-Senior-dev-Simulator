const solution = (function solution(n) { if (!/^\d+$/.test(n))
        throw new Error('Invalid n'); const value = BigInt(n); return (value * (value + 1n) / 2n).toString(); });
