const solution = (function solution(n) { if (!Number.isSafeInteger(n) || n < 1)
        throw new Error('Invalid n'); let count = 0; for (let k = 1; k * (k + 1) / 2 <= n; k++) {
        const remainder = n - k * (k - 1) / 2;
        if (remainder > 0 && remainder % k === 0)
            count++;
    } return count; });
