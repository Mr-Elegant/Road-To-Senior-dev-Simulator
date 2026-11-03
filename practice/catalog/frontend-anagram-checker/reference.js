const solution = (function solution([a, b]) { const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, ''); a = clean(a); b = clean(b); if (a.length !== b.length)
        return false; const counts = new Map(); for (const c of a)
        counts.set(c, (counts.get(c) || 0) + 1); for (const c of b) {
        const n = counts.get(c) || 0;
        if (!n)
            return false;
        counts.set(c, n - 1);
    } return true; });
