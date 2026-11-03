const solution = (function solution(values) { let sum = 0; for (const n of values) {
        if (typeof n !== 'number' || !Number.isFinite(n))
            throw new Error('Invalid number');
        sum += n;
    } return sum; });
