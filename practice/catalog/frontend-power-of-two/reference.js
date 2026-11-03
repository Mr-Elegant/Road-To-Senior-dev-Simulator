const solution = (function solution(n) { if (!Number.isSafeInteger(n) || n < 1)
        return false; while (n % 2 === 0)
        n /= 2; return n === 1; });
