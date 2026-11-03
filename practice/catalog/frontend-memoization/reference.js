const solution = (function solution(calls) { const cache = new Map(); let evaluations = 0; const outputs = calls.map(([a, b]) => { const key = JSON.stringify([a, b]); if (!cache.has(key)) {
        evaluations++;
        cache.set(key, a * b + a);
    } return cache.get(key); }); return { outputs, evaluations }; });
