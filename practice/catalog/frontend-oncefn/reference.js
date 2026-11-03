const solution = (function solution(values) { let calls = 0, called = false, cached; const once = (n) => { if (!called) {
        calls++;
        cached = n;
        called = true;
    } return cached; }; return { outputs: values.map(once), calls }; });
