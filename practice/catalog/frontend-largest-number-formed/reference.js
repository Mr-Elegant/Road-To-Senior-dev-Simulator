const solution = (function solution(values) { const sorted = [...values].sort((a, b) => (b + a).localeCompare(a + b)); const s = sorted.join(''); return s && /^0+$/.test(s) ? '0' : s; });
