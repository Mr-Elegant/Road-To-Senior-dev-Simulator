const solution = (function solution(groups) { function sum(total = 0) { return (...args) => args.length ? sum(total + args.reduce((a, b) => a + b, 0)) : total; } let current = sum(); for (const group of groups)
        current = current(...group); return current(); });
