const solution = (function solution(groups) { function curry(fn, args = []) { return (...next) => args.length + next.length >= 3 ? fn(...args, ...next) : curry(fn, [...args, ...next]); } let result = curry((a, b, c) => a + 2 * b + 3 * c); for (const group of groups)
        result = result(...group); return result; });
