const solution = (function solution(value) { const out = []; function visit(v, path) { if (v && typeof v === 'object' && Object.keys(v).length) {
        for (const k of Object.keys(v))
            visit(v[k], [...path, Array.isArray(v) ? Number(k) : k]);
    }
    else
        out.push({ path, value: v }); } visit(value, []); return out; });
