const solution = (function solution(n) { if (!Number.isSafeInteger(n) || n < 1)
        return false; while (n % 3 === 0)
        n /= 3; return n === 1; });
