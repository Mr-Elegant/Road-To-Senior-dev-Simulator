const solution = (function solution(text) { const chars = Array.from(text), last = new Map(); let left = 0, best = 0; for (let r = 0; r < chars.length; r++) {
        if (last.has(chars[r]))
            left = Math.max(left, last.get(chars[r]) + 1);
        last.set(chars[r], r);
        best = Math.max(best, r - left + 1);
    } return best; });
