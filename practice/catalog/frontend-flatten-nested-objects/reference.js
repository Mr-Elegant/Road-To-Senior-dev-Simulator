const solution = (function solution(value) { const out = []; function visit(v, p) { if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length) {
        for (const k of Object.keys(v))
            visit(v[k], p ? p + '.' + k : k);
    }
    else
        out.push([p, v]); } visit(value, ''); return out.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0); });
